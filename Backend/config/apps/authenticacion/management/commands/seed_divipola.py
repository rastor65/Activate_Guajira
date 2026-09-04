"""Carga la division politico-administrativa de Colombia (DIVIPOLA, DANE).

Sustituye la lista corta de departamentos y municipios de la siembra inicial
por los 33 departamentos y 1.121 municipios oficiales.

    python manage.py seed_divipola

Los codigos DANE se guardan en tablaMaestra.codigo. Como el codigo de
municipio son 5 digitos cuyos 2 primeros son los del departamento, el
frontend puede filtrar las ciudades por departamento sin cambiar el modelo.

Dos detalles que importan:

- 67 nombres de municipio se repiten en departamentos distintos (Villanueva
  existe en cuatro). A esos se les anade el departamento entre parentesis,
  porque en un desplegable serian indistinguibles.
- La identidad es el codigo, no el nombre. Emparejar por nombre fusionaria
  los homonimos.

No borra filas: las que ya existian se reutilizan para no romper las
referencias de las personas ya registradas.
"""

import collections
import unicodedata

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.authenticacion.models import categoriaTipo, tablaMaestra

from ._divipola import DEPARTAMENTOS, MUNICIPIOS

CAT_DEPARTAMENTO = "Departamento"
CAT_CIUDAD = "Ciudad"


def normalizar(texto):
    """Compara nombres sin depender de tildes ni mayusculas."""
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return texto.strip().lower()


def construir_municipios():
    """Devuelve (codigo, etiqueta) desambiguando los nombres repetidos."""
    deptos = dict(DEPARTAMENTOS)
    repetidos = {
        nombre
        for nombre, veces in collections.Counter(
            normalizar(n) for _, n in MUNICIPIOS
        ).items()
        if veces > 1
    }

    salida = []
    for codigo, nombre in MUNICIPIOS:
        if normalizar(nombre) in repetidos:
            depto = deptos.get(codigo[:2], "")
            etiqueta = f"{nombre} ({depto})" if depto else nombre
        else:
            etiqueta = nombre
        salida.append((codigo, etiqueta))
    return salida


class Command(BaseCommand):
    help = "Carga los departamentos y municipios de Colombia con sus codigos DANE."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limpiar-huerfanos",
            action="store_true",
            help=(
                "Desactiva las ciudades o departamentos previos que no estan en "
                "DIVIPOLA y que nadie referencia."
            ),
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Cargando DIVIPOLA (DANE)"))

        deptos = self._cargar(CAT_DEPARTAMENTO, DEPARTAMENTOS)
        ciudades = self._cargar(CAT_CIUDAD, construir_municipios())

        for etiqueta, r in (("Departamentos", deptos), ("Municipios   ", ciudades)):
            self.stdout.write(
                f"  {etiqueta}: {r['total']:>5} en total  "
                f"({r['nuevos']} nuevos, {r['actualizados']} actualizados)"
            )

        if options["limpiar_huerfanos"]:
            self._desactivar_huerfanos()

        self.stdout.write(self.style.SUCCESS("\nListo."))

    def _cargar(self, nombre_categoria, filas):
        categoria, _ = categoriaTipo.objects.get_or_create(
            nombre=nombre_categoria, defaults={"status": True}
        )

        registros = list(tablaMaestra.objects.filter(categoria=categoria))
        # La identidad es el codigo. El nombre solo sirve para adoptar las
        # filas de la siembra inicial, que aun no tenian codigo.
        por_codigo = {t.codigo: t for t in registros if t.codigo}
        sin_codigo = {}
        for t in registros:
            if not t.codigo:
                sin_codigo.setdefault(normalizar(t.nombre), t)

        nuevos = actualizados = 0
        for codigo, nombre in filas:
            actual = por_codigo.get(codigo)

            if actual is None:
                # Solo la primera vez: adopta una fila antigua del mismo nombre
                actual = sin_codigo.pop(normalizar(nombre), None)

            if actual is None:
                tablaMaestra.objects.create(
                    categoria=categoria, nombre=nombre, codigo=codigo, status=True
                )
                nuevos += 1
                continue

            cambios = []
            if actual.codigo != codigo:
                actual.codigo = codigo
                cambios.append("codigo")
            if actual.nombre != nombre:
                actual.nombre = nombre
                cambios.append("nombre")
            if not actual.status:
                actual.status = True
                cambios.append("status")
            if cambios:
                actual.save(update_fields=cambios)
                actualizados += 1

        return {
            "total": tablaMaestra.objects.filter(categoria=categoria).count(),
            "nuevos": nuevos,
            "actualizados": actualizados,
        }

    def _desactivar_huerfanos(self):
        """Entradas previas fuera de DIVIPOLA (p. ej. 'Otra', 'Otro')."""
        codigos = {c for c, _ in DEPARTAMENTOS} | {c for c, _ in MUNICIPIOS}
        sobrantes = tablaMaestra.objects.filter(
            categoria__nombre__in=[CAT_DEPARTAMENTO, CAT_CIUDAD], status=True
        ).exclude(codigo__in=codigos)

        desactivados = 0
        for item in sobrantes:
            en_uso = any([
                item.departamento.exists(),
                item.ciudad_residencia.exists(),
                item.ciudad_nacimiento.exists(),
            ])
            if en_uso:
                self.stdout.write(f"  '{item.nombre}' esta en uso: se conserva")
                continue
            item.status = False
            item.save(update_fields=["status"])
            desactivados += 1

        self.stdout.write(self.style.WARNING(f"  Huerfanos desactivados: {desactivados}"))
