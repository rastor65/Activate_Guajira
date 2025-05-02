from openai import OpenAI
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import logging
import re
from collections import defaultdict

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY, timeout=30)

def generar_sugerencias(tipo: str, dia: str, nivel: str = "principiante") -> list[str]:
    prompt = f"""
    Sugiere 5 ejercicios de tipo {tipo} para hacer un día {dia}.
    El usuario es de nivel {nivel}.
    Muestra solo una lista con los nombres de los ejercicios y una breve descripción.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        texto = response.choices[0].message.content
        return texto.strip().split('\n')
    except Exception as e:
        logger.error(f"Error al generar sugerencias: {str(e)}")
        return [f"Error al generar sugerencias: {str(e)}"]
    

def generar_sugerencias_complejo(programa: dict, nivel: str = "principiante") -> dict:
    prompt = f"""
Para un usuario de nivel {nivel}, genera una rutina semanal de ejercicios. 
Para cada día, se indican los tipos de ejercicio requeridos. Para cada tipo, sugiere 2 ejercicios con nombre y breve descripción. 
Devuelve la respuesta en el siguiente formato JSON:

{{
  "LUNES": {{
    "RESISTENCIA": [
      {{"nombre": "Subidas de escalón", "descripcion": "Sube y baja escalones rápidamente durante 1 minuto."}},
      ...
    ],
    "CARDIOVASCULAR": [...],
    ...
  }},
  "MARTES": {{ ... }},
  ...
}}

Tipos posibles: RESISTENCIA, CARDIOVASCULAR, FORTALECIMIENTO, EQUILIBRIO, FLEXIBILIDAD

Programa semanal:
"""
    for dia, tipos in programa.items():
        if tipos:
            prompt += f"- {dia}: {', '.join(tipos)}\n"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7
        )
        texto = response.choices[0].message.content
        return json.loads(texto)
    except Exception as e:
        logger.error(f"Error al generar sugerencias: {str(e)}")
        return {}


def parsear_respuesta(texto: str) -> dict:
    resultado = defaultdict(list)
    dia_actual = None

    for linea in texto.strip().split('\n'):
        linea = linea.strip()
        if not linea:
            continue

        # Detectar día de la semana (ej. "LUNES:")
        if re.match(r'^[A-ZÁÉÍÓÚÑ]{4,10}:$', linea):
            dia_actual = linea.rstrip(':')
            continue

        # Detectar línea de ejercicio (ej. "- Cardio: Sentadillas – descripción")
        match = re.match(r'^-\s*(.*?):\s*(.*?)\s*[–-]\s*(.+)$', linea)
        if match and dia_actual:
            tipo, nombre, descripcion = match.groups()
            resultado[dia_actual].append(f"{tipo.strip()}: {nombre.strip()} – {descripcion.strip()}")

    return dict(resultado)

@csrf_exempt
def editar_sugerencia(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tipo = data.get('tipo', '')[:50]
            dia = data.get('dia', '')[:50]

            if not tipo or not dia:
                return JsonResponse({'error': 'tipo y dia son requeridos'}, status=400)

            sugerencias = generar_sugerencias(tipo, dia)
            return JsonResponse({'sugerencias': sugerencias})
        except Exception as e:
            logger.error(f"Error en editar_sugerencia: {str(e)}")
            return JsonResponse({'error': f'Error al generar sugerencias: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
