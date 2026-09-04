"""Migra los nombres de usuario antiguos al criterio derivado del correo.

Historicamente el registro guardaba la cedula en el campo username
(admin@gmail.com quedaba con username 12345678). Ahora el acceso es por
nombre de usuario derivado del correo, asi que hay que unificar.

Por defecto solo muestra lo que haria. Para aplicarlo:

    python manage.py migrar_usernames --aplicar

La cedula que estuviera en username se conserva en Person.identificacion
si esa persona no tenia una.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.authenticacion.models import CustomUser, Person
from apps.authenticacion.usernames import generar_username


class Command(BaseCommand):
    help = "Reasigna los username al criterio derivado del correo (admin@gmail.com -> admin)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--aplicar",
            action="store_true",
            help="Escribe los cambios. Sin esta bandera solo muestra la vista previa.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        aplicar = options["aplicar"]

        self.stdout.write(
            self.style.MIGRATE_HEADING(
                "Migracion de nombres de usuario" + ("" if aplicar else "  (VISTA PREVIA)")
            )
        )

        cambios = []
        # Orden por id: los usuarios mas antiguos conservan el nombre sin sufijo
        for user in CustomUser.objects.all().order_by("id"):
            nuevo = generar_username(user.email, excluir_pk=user.pk)
            if nuevo != user.username:
                cambios.append((user, user.username, nuevo))

        if not cambios:
            self.stdout.write(self.style.SUCCESS("  Nada que migrar: todos ya siguen el criterio."))
            return

        ancho = max(len(u.email) for u, _, _ in cambios)
        for user, viejo, nuevo in cambios:
            self.stdout.write(f"  {user.email:<{ancho}}   {viejo}  ->  {nuevo}")

        if not aplicar:
            self.stdout.write(
                self.style.WARNING(
                    f"\n  {len(cambios)} usuarios cambiarian. Vuelve a ejecutar con --aplicar."
                )
            )
            # Deshace cualquier efecto: esto es solo una vista previa
            transaction.set_rollback(True)
            return

        rescatadas = 0
        for user, viejo, nuevo in cambios:
            # Si el username viejo era una cedula, no se pierde: pasa a Person
            person = Person.objects.filter(user=user).first()
            if person and not person.identificacion and viejo and viejo.isdigit():
                person.identificacion = viejo
                person.save(update_fields=["identificacion"])
                rescatadas += 1

            user.username = nuevo
            user.save(update_fields=["username"])

        self.stdout.write(self.style.SUCCESS(f"\n  {len(cambios)} usuarios migrados."))
        if rescatadas:
            self.stdout.write(f"  {rescatadas} cedulas conservadas en Person.identificacion.")
