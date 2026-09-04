"""Carga los barrios por municipio.

    python manage.py seed_barrios

ALCANCE, con franqueza: no existe un dataset nacional de barrios. La DIVIPOLA
del DANE llega hasta municipio y centro poblado; los barrios los define cada
alcaldia en su POT y no hay fuente unificada. Los datos vienen de
OpenStreetMap (ODbL) y la cobertura es parcial, buena en Riohacha y escasa en
el resto. Por eso cada municipio recibe ademas una opcion "Otro".

El codigo queda como "<codigo del municipio>-<consecutivo>" (44001-001), de
modo que el frontend puede filtrar los barrios por la ciudad elegida sin
tocar el modelo, igual que se hace con ciudad y departamento.
"""

import re
import unicodedata

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.authenticacion.models import categoriaTipo, tablaMaestra

from ._barrios import BARRIOS

# Codigo valido: 5 digitos de municipio, guion y consecutivo
PATRON_CODIGO = re.compile(r"^\d{5}-\d{3}$")

CAT_BARRIO = "Barrio"
CAT_CIUDAD = "Ciudad"


def normalizar(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return texto.strip().lower()


class Command(BaseCommand):
    help = "Carga los barrios conocidos por municipio, con su codigo de ciudad."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limpiar-huerfanos",
            action="store_true",
            help="Desactiva los barrios previos sin municipio que nadie referencia.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Cargando barrios"))

        categoria, _ = categoriaTipo.objects.get_or_create(
            nombre=CAT_BARRIO, defaults={"status": True}
        )
        ciudades = {
            c.codigo: c.nombre
            for c in tablaMaestra.objects.filter(categoria__nombre=CAT_CIUDAD)
            if c.codigo
        }

        registros = list(tablaMaestra.objects.filter(categoria=categoria))
        por_codigo = {t.codigo: t for t in registros if t.codigo}
        sin_codigo = {}
        for t in registros:
            if not t.codigo:
                sin_codigo.setdefault(normalizar(t.nombre), t)

        nuevos = actualizados = 0

        for codigo_municipio, nombres in sorted(BARRIOS.items()):
            municipio = ciudades.get(codigo_municipio)
            if not municipio:
                self.stdout.write(
                    self.style.WARNING(
                        f"  Municipio {codigo_municipio} no esta en la tabla maestra: "
                        f"ejecuta antes seed_divipola"
                    )
                )
                continue

            # "Otro" al final, como salida para lo que no este en la lista
            entradas = list(nombres) + ["Otro"]

            for indice, nombre in enumerate(entradas, start=1):
                codigo = f"{codigo_municipio}-{indice:03d}"
                actual = por_codigo.get(codigo)

                if actual is None:
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

            self.stdout.write(f"  {municipio:<16} {len(entradas):>3} barrios")

        if options["limpiar_huerfanos"]:
            self._desactivar_huerfanos(categoria)

        total = tablaMaestra.objects.filter(categoria=categoria, status=True).count()
        self.stdout.write(
            self.style.SUCCESS(f"\n  {total} barrios activos ({nuevos} nuevos, {actualizados} actualizados)")
        )

    def _desactivar_huerfanos(self, categoria):
        """Barrios que no siguen el formato <municipio>-<consecutivo>.

        Son los de la siembra inicial, que no estaban asociados a ningun
        municipio y por tanto no se pueden filtrar por ciudad.
        """
        sobrantes = [
            t for t in tablaMaestra.objects.filter(categoria=categoria, status=True)
            if not PATRON_CODIGO.match(t.codigo or "")
        ]

        desactivados = 0
        for item in sobrantes:
            if item.barrio.exists():
                self.stdout.write(f"  '{item.nombre}' esta en uso: se conserva")
                continue
            item.status = False
            item.save(update_fields=["status"])
            desactivados += 1

        self.stdout.write(self.style.WARNING(f"  Huerfanos desactivados: {desactivados}"))
