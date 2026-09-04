"""Siembra los datos minimos para que Activate Guajira funcione.

La base de datos local tiene el esquema pero llega vacia, asi que el registro
falla (el frontend asigna el rol con id 2) y el menu queda sin opciones.

El comando es idempotente: se puede ejecutar cuantas veces haga falta.

    python manage.py seed_datos_iniciales

Con --reasignar vuelve a aplicar los roles y recursos por defecto a los
usuarios que se hayan quedado sin ninguno.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.authenticacion.models import (
    CustomUser,
    Person,
    Resource,
    ResourceRol,
    Rol,
    UserRol,
    categoriaTipo,
    tablaMaestra,
)

# ---------------------------------------------------------------------------
# Roles. El frontend registra al estudiante con rolesId=2 fijo
# (form-login.component.ts), asi que ese id debe existir con ese significado.
# ---------------------------------------------------------------------------
ROLES = [
    (1, "Administrador"),
    (2, "Estudiante"),
    (3, "Entrenador"),
]

ROL_ADMIN, ROL_ESTUDIANTE, ROL_ENTRENADOR = 1, 2, 3

# ---------------------------------------------------------------------------
# Recursos = opciones de menu. id_padre 0 marca los de primer nivel.
# Los links coinciden con las rutas reales del enrutador de Angular.
# ---------------------------------------------------------------------------
RECURSOS = [
    # (id, id_padre, titulo, link, icono, path, method)
    (1, 0, "Mi perfil", "/usuarios/perfil", "pi pi-user", "/usuarios/perfil", "GET"),
    (2, 0, "Entrenamiento", "/usuarios/entrenamiento", "pi pi-bolt", "/usuarios/entrenamiento", "GET"),
    (3, 0, "Alimentacion", "/usuarios/alimentacion", "pi pi-heart", "/usuarios/alimentacion", "GET"),
    (4, 0, "Mediciones", "/mediciones/entrenador", "pi pi-chart-line", "/mediciones/entrenador", "GET"),

    (5, 0, "Administracion", "/administrador/usuarios", "pi pi-cog", "/administrador", "GET"),
    # Usuarios incluye la ficha de persona: no hay entrada aparte para ello
    (6, 5, "Usuarios", "/administrador/usuarios", "pi pi-users", "/administrador/usuarios", "GET"),
    # Roles, recursos, permisos y asignaciones viven ahora en una sola vista
    (8, 5, "Control de acceso", "/administrador/accesos", "pi pi-shield", "/administrador/accesos", "GET"),
    (12, 5, "Tabla maestra", "/administrador/tabla_maestra", "pi pi-database", "/administrador/tabla_maestra", "GET"),
]

# Que recursos ve cada rol
PERMISOS = {
    ROL_ESTUDIANTE: [1, 2, 3],
    ROL_ENTRENADOR: [1, 2, 3, 4],
    ROL_ADMIN: [1, 2, 3, 4, 5, 6, 8, 12],
}

# ---------------------------------------------------------------------------
# Tabla maestra: los desplegables del formulario de perfil.
# OJO: los nombres de categoria deben coincidir EXACTAMENTE con los que
# filtra el frontend (private-layout.component.ts), tildes incluidas, o el
# desplegable correspondiente se queda vacio sin dar ningun error.
# ---------------------------------------------------------------------------
PARAMETRICAS = {
    "Tipo de documento": [
        "Cedula de ciudadania",
        "Tarjeta de identidad",
        "Cedula de extranjeria",
        "Pasaporte",
        "Permiso por proteccion temporal",
        "Registro civil",
    ],
    "Nivel de formación": [
        "Primaria",
        "Bachillerato",
        "Tecnico",
        "Tecnologo",
        "Pregrado",
        "Especializacion",
        "Maestria",
        "Doctorado",
    ],
    "Estado civil": [
        "Soltero(a)",
        "Casado(a)",
        "Union libre",
        "Separado(a)",
        "Divorciado(a)",
        "Viudo(a)",
    ],
    "Grupo étnico": [
        "Ninguno",
        "Indigena Wayuu",
        "Indigena Wiwa",
        "Indigena Kogui",
        "Indigena Arhuaco",
        "Afrodescendiente",
        "Raizal",
        "Palenquero",
        "Rrom (gitano)",
    ],
    "Genero": [
        "Masculino",
        "Femenino",
        "Otro",
        "Prefiere no decirlo",
    ],
    "Estrato": ["1", "2", "3", "4", "5", "6"],
    "Situación Laboral": [
        "Estudiante",
        "Empleado",
        "Independiente",
        "Desempleado",
        "Pensionado",
        "Hogar",
    ],
    "Departamento": [
        "La Guajira",
        "Magdalena",
        "Cesar",
        "Atlantico",
        "Bolivar",
        "Sucre",
        "Cordoba",
        "Otro",
    ],
    # Municipios de La Guajira, que es donde opera la plataforma
    "Ciudad": [
        "Riohacha",
        "Maicao",
        "Uribia",
        "Manaure",
        "San Juan del Cesar",
        "Villanueva",
        "Fonseca",
        "Barrancas",
        "Distraccion",
        "Hatonuevo",
        "Albania",
        "El Molino",
        "Urumita",
        "La Jagua del Pilar",
        "Dibulla",
        "Otra",
    ],
    "Barrio": [
        "Centro",
        "Aeropuerto",
        "Boca Grande",
        "Cooperativo",
        "El Carmen",
        "Jose Antonio Galan",
        "La Florida",
        "Los Deseos",
        "Majayura",
        "Nuestra Senora de los Remedios",
        "Villa Fatima",
        "15 de Mayo",
        "Otro",
    ],
}


class Command(BaseCommand):
    help = "Crea roles, recursos, permisos y valores parametricos minimos."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reasignar",
            action="store_true",
            help="Asigna el rol Estudiante a los usuarios que no tengan ninguno.",
        )
        parser.add_argument(
            "--admin-pruebas",
            action="store_true",
            help=(
                "Crea un administrador de pruebas con contrasena conocida. "
                "Solo para desarrollo local: NUNCA usar en produccion."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Sembrando datos iniciales"))

        self._roles()
        self._recursos()
        self._permisos()
        self._parametricas()
        self._personas_faltantes()

        if options["reasignar"]:
            self._reasignar_roles()

        if options["admin_pruebas"]:
            self._admin_pruebas()

        self.stdout.write(self.style.SUCCESS("\nListo. La base ya tiene lo minimo para operar."))

    # -- Roles --------------------------------------------------------------
    def _roles(self):
        creados = 0
        for pk, nombre in ROLES:
            _, nuevo = Rol.objects.update_or_create(
                pk=pk, defaults={"name": nombre, "status": True}
            )
            creados += int(nuevo)
        self.stdout.write(f"  Roles:        {Rol.objects.count()} en total ({creados} nuevos)")

    # -- Recursos -----------------------------------------------------------
    def _recursos(self):
        creados = 0
        for pk, padre, titulo, link, icono, path, method in RECURSOS:
            _, nuevo = Resource.objects.update_or_create(
                pk=pk,
                defaults={
                    "id_padre": padre,
                    "titulo": titulo,
                    "link": link,
                    "icono": icono,
                    "path": path,
                    "method": method,
                    "status": True,
                },
            )
            creados += int(nuevo)
        self.stdout.write(f"  Recursos:     {Resource.objects.count()} en total ({creados} nuevos)")

    # -- Permisos -----------------------------------------------------------
    def _permisos(self):
        creados = 0
        for rol_id, recursos in PERMISOS.items():
            rol = Rol.objects.get(pk=rol_id)
            for recurso_id in recursos:
                _, nuevo = ResourceRol.objects.get_or_create(
                    role=rol,
                    resource=Resource.objects.get(pk=recurso_id),
                    defaults={"status": True},
                )
                creados += int(nuevo)
        self.stdout.write(f"  Permisos:     {ResourceRol.objects.count()} en total ({creados} nuevos)")

    # -- Parametricas -------------------------------------------------------
    def _parametricas(self):
        creados = 0
        for orden_cat, (categoria, valores) in enumerate(PARAMETRICAS.items(), start=1):
            cat, _ = categoriaTipo.objects.get_or_create(
                nombre=categoria, defaults={"status": True}
            )
            for orden, valor in enumerate(valores, start=1):
                # El codigo es unico en toda la tabla, no solo por categoria
                codigo = "C%02dV%03d" % (orden_cat, orden)
                _, nuevo = tablaMaestra.objects.get_or_create(
                    categoria=cat,
                    nombre=valor,
                    defaults={"codigo": codigo, "status": True},
                )
                creados += int(nuevo)
        self.stdout.write(
            "  Parametricas: %d categorias, %d valores (%d nuevos)"
            % (categoriaTipo.objects.count(), tablaMaestra.objects.count(), creados)
        )

    # -- Personas -----------------------------------------------------------
    def _personas_faltantes(self):
        """Cada usuario necesita su Person: el perfil y las mediciones cuelgan de ahi."""
        creadas = 0
        for user in CustomUser.objects.filter(person__isnull=True):
            Person.objects.create(user=user, identificacion=user.username, status=True)
            creadas += 1
        if creadas:
            self.stdout.write(f"  Personas:     {creadas} creadas para usuarios que no tenian")

    # -- Admin de pruebas ---------------------------------------------------
    def _admin_pruebas(self):
        """Crea un administrador con credenciales conocidas para desarrollo local.

        Se activa solo con --admin-pruebas. La contrasena queda en el codigo a
        proposito: es una cuenta de desarrollo, no debe existir en produccion.
        """
        from django.conf import settings

        if not settings.DEBUG:
            self.stdout.write(
                self.style.ERROR(
                    "  Omitido: DEBUG=False. No se crean credenciales conocidas fuera de desarrollo."
                )
            )
            return

        from apps.authenticacion.usernames import generar_username

        email = "admin.test@uniguajira.edu.co"
        cedula = "1000000001"
        password = "Admin2026*"
        # El usuario se deriva del correo, igual que en el registro
        username = generar_username(email)

        user, creado = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": "Admin",
                "last_name": "Pruebas",
                "consentimiento": True,
            },
        )
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        Person.objects.get_or_create(
            user=user, defaults={"identificacion": cedula, "status": True}
        )

        for rol in Rol.objects.filter(pk__in=[ROL_ADMIN, ROL_ESTUDIANTE, ROL_ENTRENADOR]):
            UserRol.objects.get_or_create(userId=user, rolesId=rol, defaults={"status": True})

        self.stdout.write(
            self.style.WARNING(
                "  Admin pruebas: usuario=%s  clave=%s  (%s)"
                % (user.username, password, "creado" if creado else "contrasena restablecida")
            )
        )

    # -- Reasignacion -------------------------------------------------------
    def _reasignar_roles(self):
        estudiante = Rol.objects.get(pk=ROL_ESTUDIANTE)
        asignados = 0
        for user in CustomUser.objects.filter(user_roles__isnull=True):
            UserRol.objects.create(userId=user, rolesId=estudiante, status=True)
            asignados += 1
        self.stdout.write(
            self.style.WARNING(f"  Reasignados:  {asignados} usuarios recibieron el rol Estudiante")
        )
