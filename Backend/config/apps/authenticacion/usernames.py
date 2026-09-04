"""Derivacion del nombre de usuario a partir del correo.

El acceso se hace con nombre de usuario, y este se deriva de la parte local
del correo: admin@gmail.com -> admin.

Se usa tanto en el registro como en el comando que migra los usuarios
antiguos, para que ambos apliquen exactamente el mismo criterio.
"""

import re
import unicodedata

# El campo username admite 45 caracteres; se deja margen para el sufijo
LARGO_MAXIMO = 45
LARGO_BASE = 40


def normalizar(texto):
    """Reduce el texto a minusculas ASCII con solo letras, digitos, punto, guion y guion bajo."""
    # Descompone tildes y descarta los diacriticos: 'José' -> 'jose'
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.lower()
    texto = re.sub(r"[^a-z0-9._-]+", "", texto)
    # Sin puntos ni guiones sueltos en los extremos
    return texto.strip("._-")


def generar_username(email, excluir_pk=None):
    """Devuelve un username unico derivado de la parte local del correo.

    Ante una colision agrega un sufijo numerico: juan, juan2, juan3...

    `excluir_pk` deja fuera de la comprobacion al propio usuario, para poder
    reasignarle el mismo nombre que ya tiene sin chocar consigo mismo.
    """
    from .models import CustomUser

    base = normalizar((email or "").split("@")[0])[:LARGO_BASE]
    if not base:
        base = "usuario"

    consulta = CustomUser.objects.all()
    if excluir_pk is not None:
        consulta = consulta.exclude(pk=excluir_pk)

    candidato = base
    contador = 1
    while consulta.filter(username__iexact=candidato).exists():
        contador += 1
        sufijo = str(contador)
        candidato = base[: LARGO_MAXIMO - len(sufijo)] + sufijo

    return candidato
