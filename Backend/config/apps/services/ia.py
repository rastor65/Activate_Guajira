# apps/services/ia.py
from __future__ import annotations

import json
import logging
import re
from collections import defaultdict

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI

logger = logging.getLogger(__name__)

_client: OpenAI | None = None

def get_client() -> OpenAI:
    """
    Crea el cliente SOLO cuando se necesite (evita que migraciones fallen).
    """
    global _client
    if _client is not None:
        return _client

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not api_key:
        # No explotes en import-time; solo cuando alguien use IA.
        raise RuntimeError(
            "OPENAI_API_KEY no está configurada. Define settings.OPENAI_API_KEY "
            "o la variable de entorno OPENAI_API_KEY."
        )

    _client = OpenAI(api_key=api_key, timeout=30)
    return _client


def generar_sugerencias(tipo: str, dia: str, nivel: str = "principiante") -> list[dict]:
    prompt = f"""
    Sugiere 5 ejercicios de tipo {tipo} para hacer un día {dia}.
    El usuario es de nivel {nivel}.
    Devuelve solo una lista con el formato:
    - Nombre del ejercicio – Descripción breve
    """

    try:
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        texto = (response.choices[0].message.content or "").strip()

        ejercicios = []
        for linea in texto.split('\n'):
            if '–' in linea:
                nombre, descripcion = map(str.strip, linea.split('–', 1))
                ejercicios.append({
                    "nombre": nombre.lstrip('- 1234567890.'),
                    "descripcion": descripcion
                })
        return ejercicios

    except Exception as e:
        logger.error(f"Error al generar sugerencias: {str(e)}")
        return [{"nombre": "Error", "descripcion": str(e)}]


def generar_sugerencias_complejo(programa: dict, nivel: str = "principiante") -> dict:
    prompt = f"""
    Eres un generador de rutinas de ejercicio para un sistema automático. Devuelve únicamente un JSON. 
    Para un usuario de nivel {nivel}, genera una rutina semanal. 
    Para cada día de la semana, devuelve los tipos de ejercicio requeridos y para cada tipo, sugiere 3 ejercicios con nombre y descripción. 

    Devuelve solo el JSON, sin comentarios ni explicaciones. Ejemplo de formato:

    {{
      "LUNES": {{
        "RESISTENCIA": [
          {{"nombre": "Subidas de escalón", "descripcion": "Sube y baja escalones durante 1 minuto."}},
          {{"nombre": "Burpees", "descripcion": "Ejercicio de cuerpo completo con salto y flexión."}},
          {{"nombre": "Saltos de tijera", "descripcion": "Salta abriendo y cerrando piernas y brazos."}}
        ],
        "CARDIOVASCULAR": []
      }}
    }}

    IMPORTANTE: Devuelve solo el JSON sin explicaciones, encabezados ni texto adicional.
    """

    for dia, tipos in programa.items():
        if tipos:
            prompt += f"- {dia}: {', '.join(tipos)}\n"

    texto = ""
    try:
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000,
            temperature=0.7
        )
        texto = response.choices[0].message.content or ""
        resultado = json.loads(texto)

        if not isinstance(resultado, dict):
            raise ValueError("La IA no devolvió un diccionario")
        return resultado

    except json.JSONDecodeError as e:
        logger.error(f"JSON inválido: {str(e)}")
        logger.error(f"Contenido devuelto por OpenAI:\n{texto}")
        return {}

    except Exception as e:
        logger.error(f"Error al generar sugerencias complejas: {str(e)}")
        return {}


def parsear_respuesta(texto: str) -> dict:
    resultado = defaultdict(list)
    dia_actual = None

    for linea in texto.strip().split('\n'):
        linea = linea.strip()
        if not linea:
            continue

        if re.match(r'^[A-ZÁÉÍÓÚÑ]{4,10}:$', linea):
            dia_actual = linea.rstrip(':')
            continue

        match = re.match(r'^-\s*(.*?):\s*(.*?)\s*[–-]\s*(.+)$', linea)
        if match and dia_actual:
            tipo, nombre, descripcion = match.groups()
            resultado[dia_actual].append(
                f"{tipo.strip()}: {nombre.strip()} – {descripcion.strip()}"
            )

    return dict(resultado)


@csrf_exempt
def editar_sugerencia(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tipo = (data.get('tipo', '') or '')[:50]
            dia = (data.get('dia', '') or '')[:50]

            if not tipo or not dia:
                return JsonResponse({'error': 'tipo y dia son requeridos'}, status=400)

            sugerencias = generar_sugerencias(tipo, dia)
            return JsonResponse({'sugerencias': sugerencias})

        except Exception as e:
            logger.error(f"Error en editar_sugerencia: {str(e)}")
            return JsonResponse({'error': f'Error al generar sugerencias: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
