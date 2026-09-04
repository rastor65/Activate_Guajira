# apps/services/ia.py
from __future__ import annotations

import json
import logging
import os
import re
from collections import defaultdict

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

logger = logging.getLogger(__name__)

_gemini_client: genai.Client | None = None

# Banco curado de ejercicios de alta calidad como fallback garantizado
BANCO_EJERCICIOS = {
    "RESISTENCIA": [
        {"nombre": "Burpees Completos", "descripcion": "3 series de 10 a 12 repeticiones combinando sentadilla, plancha con flexión y salto vertical explosivo."},
        {"nombre": "Mountain Climbers (Escaladores)", "descripcion": "En posición de plancha alta, lleva las rodillas alternadamente hacia el pecho a ritmo ágil durante 45 segundos."},
        {"nombre": "Skipping Alto en el Puesto", "descripcion": "Elevación continua y enérgica de rodillas hacia el pecho con braceo coordinado durante 60 segundos."},
        {"nombre": "Jumping Jacks (Saltos en Tijera)", "descripcion": "Saltos coordinados abriendo y cerrando piernas y brazos simultáneamente por 3 series de 40 segundos."},
        {"nombre": "Sentadillas con Salto Pliométrico", "descripcion": "Desciende en sentadilla manteniendo la espalda erguida y despega con un salto vertical controlado. 3 series de 12 repeticiones."}
    ],
    "CARDIOVASCULAR": [
        {"nombre": "Trote en el Puesto con Cambios de Ritmo", "descripcion": "Alterna 30 segundos de trote suave de recuperación con 20 segundos de velocidad máxima durante 5 minutos."},
        {"nombre": "Sombra de Boxeo con Desplazamientos", "descripcion": "Combinación fluida de golpes directos (jabs), ganchos y esquivas con pies activos durante 3 asaltos de 2 minutos."},
        {"nombre": "Saltos de Cuerda Continuos", "descripcion": "Salto constante a dos pies o alternando ritmo suave y moderado por 3 bloques de 2 minutos con 30s de descanso."},
        {"nombre": "Desplazamientos Laterales con Toque de Suelo", "descripcion": "Desplázate con paso lateral 3 metros hacia la derecha, toca el suelo y repite hacia la izquierda por 45 segundos."},
        {"nombre": "Step-ups en Escalón o Banco", "descripcion": "Subidas y bajadas rítmicas a un escalón firme alternando la pierna de inicio cada 30 segundos por 3 minutos."}
    ],
    "EJERCICIOS FORTALECIMIENTO": [
        {"nombre": "Flexiones de Pecho (Push-ups)", "descripcion": "Cuerpo completamente alineado en plancha; desciende el pecho hasta rozar el suelo y empuja con potencia. 3 series de 10-15 reps."},
        {"nombre": "Sentadillas Clásicas Profundas", "descripcion": "Pies al ancho de hombros, desciende la cadera como si fueras a sentarte con el pecho levantado. 4 series de 15 reps."},
        {"nombre": "Zancadas Alternadas (Lunges)", "descripcion": "Paso amplio al frente bajando la rodilla trasera a 90 grados sin tocar el piso. 3 series de 12 repeticiones por pierna."},
        {"nombre": "Plancha Abdominal Frontal Isométrica", "descripcion": "Apoyo en antebrazos y puntas de pies, manteniendo glúteos y abdomen contraídos sin arquear la espalda. 4 series de 35-45 segundos."},
        {"nombre": "Fondos de Tríceps en Silla o Banco", "descripcion": "Manos apoyadas al borde de una silla, flexiona los codos a 90 grados y eleva el torso. 3 series de 12 reps."}
    ],
    "FORTALECIMIENTO": [
        {"nombre": "Flexiones de Pecho (Push-ups)", "descripcion": "Cuerpo completamente alineado en plancha; desciende el pecho hasta rozar el suelo y empuja con potencia. 3 series de 10-15 reps."},
        {"nombre": "Sentadillas Clásicas Profundas", "descripcion": "Pies al ancho de hombros, desciende la cadera como si fueras a sentarte con el pecho levantado. 4 series de 15 reps."},
        {"nombre": "Zancadas Alternadas (Lunges)", "descripcion": "Paso amplio al frente bajando la rodilla trasera a 90 grados sin tocar el piso. 3 series de 12 repeticiones por pierna."},
        {"nombre": "Plancha Abdominal Frontal Isométrica", "descripcion": "Apoyo en antebrazos y puntas de pies, manteniendo glúteos y abdomen contraídos sin arquear la espalda. 4 series de 35-45 segundos."}
    ],
    "EJERCICIOS DE EQUILIBRIO": [
        {"nombre": "Postura del Árbol (Tree Pose)", "descripcion": "De pie sobre una pierna, apoya la planta del pie contrario en la cara interna del muslo, manos al pecho o arriba por 40 segundos por lado."},
        {"nombre": "Peso Muerto Rumano a Una Pierna", "descripcion": "Flexiona la cadera inclinando el torso al frente mientras elevas la pierna trasera recta para activar glúteos e isquiotibiales. 3 series de 8 reps por pierna."},
        {"nombre": "Superman Alternado en Cuatro Apoyos", "descripcion": "En posición de cuadrupedia, extiende simultáneamente el brazo derecho y la pierna izquierda de forma horizontal y controlada. 3 series de 12 reps."},
        {"nombre": "Puente de Glúteo a Una Sola Pierna", "descripcion": "Tumbado boca arriba con rodillas dobladas, eleva la pelvis apoyándote únicamente en un pie. 3 series de 10 reps por lado."},
        {"nombre": "Caminata en Línea Talón-Punta", "descripcion": "Avanza en línea recta pisando con el talón pegado a los dedos del pie anterior manteniendo la vista al frente por 20 pasos."}
    ],
    "EQUILIBRIO": [
        {"nombre": "Postura del Árbol (Tree Pose)", "descripcion": "De pie sobre una pierna, apoya la planta del pie contrario en la cara interna del muslo, manos al pecho o arriba por 40 segundos por lado."},
        {"nombre": "Peso Muerto Rumano a Una Pierna", "descripcion": "Flexiona la cadera inclinando el torso al frente mientras elevas la pierna trasera recta. 3 series de 8 reps por pierna."},
        {"nombre": "Superman Alternado en Cuatro Apoyos", "descripcion": "En posición de cuadrupedia, extiende simultáneamente brazo y pierna opuestos. 3 series de 12 reps."}
    ],
    "FLEXIBILIDAD": [
        {"nombre": "Estiramiento de Isquiotibiales de Pie", "descripcion": "Pierna adelantada con talón en el piso, flexiona la cadera inclinándote hacia adelante con espalda recta. Sostén 35 segundos por pierna."},
        {"nombre": "Postura de la Cobra para Abdomen", "descripcion": "Tumbado boca abajo, apoya las palmas en el suelo a la altura de los hombros y extiende suavemente los brazos abriendo el pecho por 30 segundos."},
        {"nombre": "Estiramiento de Hombros y Deltoides", "descripcion": "Cruza un brazo horizontalmente sobre el pecho y sujétalo con el antebrazo contrario ejerciendo suave presión por 30 segundos por lado."},
        {"nombre": "Mariposa en el Suelo para Caderas", "descripcion": "Sentado con las plantas de los pies juntas, sujeta los tobillos y empuja suavemente las rodillas hacia el suelo con respiración profunda por 1 minuto."},
        {"nombre": "Estiramiento de Gemelos y Tendón de Aquiles", "descripcion": "Apoya las manos en la pared, da un paso largo hacia atrás con talón completamente apoyado y rodilla trasera estirada por 30 segundos por pierna."}
    ]
}


def get_gemini_client() -> genai.Client | None:
    """
    Obtiene o inicializa el cliente oficial de Google Gemini usando la clave configurada.
    """
    global _gemini_client
    if _gemini_client is not None:
        return _gemini_client

    api_key = (
        getattr(settings, "GEMINI_API_KEY", None)
        or os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )

    if not api_key:
        logger.warning(
            "GEMINI_API_KEY no está configurada. Se utilizará el banco inteligente de ejercicios como fallback."
        )
        return None

    if not GENAI_AVAILABLE:
        logger.warning(
            "google-genai no está instalado en el entorno. Se utilizará el banco de ejercicios como fallback."
        )
        return None

    try:
        _gemini_client = genai.Client(api_key=api_key)
        return _gemini_client
    except Exception as e:
        logger.error(f"Error al inicializar cliente de Google Gemini: {e}")
        return None


def _normalizar_tipo(tipo: str) -> str:
    """Normaliza el nombre del tipo de ejercicio para indexar el banco."""
    tipo_norm = (tipo or "").strip().upper()
    if "FORTALECIMIENTO" in tipo_norm:
        return "EJERCICIOS FORTALECIMIENTO"
    if "EQUILIBRIO" in tipo_norm:
        return "EJERCICIOS DE EQUILIBRIO"
    if "RESISTENCIA" in tipo_norm:
        return "RESISTENCIA"
    if "CARDIO" in tipo_norm:
        return "CARDIOVASCULAR"
    if "FLEXIBILIDAD" in tipo_norm:
        return "FLEXIBILIDAD"
    return tipo_norm or "GENERAL"


def _obtener_ejercicios_fallback(tipo: str, cantidad: int = 3) -> list[dict]:
    """Extrae ejercicios del banco curado para un tipo determinado."""
    tipo_norm = _normalizar_tipo(tipo)
    ejercicios = BANCO_EJERCICIOS.get(tipo_norm)
    if not ejercicios:
        ejercicios = [
            {"nombre": f"Circuito de {tipo_norm.title()}", "descripcion": "3 series de 12 repeticiones controladas con descansos de 45 segundos."},
            {"nombre": f"Intervalos activos de {tipo_norm.title()}", "descripcion": "4 bloques de 40 segundos de trabajo activo por 20 segundos de descanso."},
            {"nombre": f"Rutina postural de {tipo_norm.title()}", "descripcion": "Ejercicios de activación y movilidad con técnica estricta durante 3 series."}
        ]
    return ejercicios[:cantidad]


def generar_sugerencias(tipo: str, dia: str, nivel: str = "principiante") -> list[dict]:
    """
    Genera una lista de sugerencias de ejercicio para un tipo y día específicos.
    Utiliza Google Gemini con fallback al banco inteligente.
    """
    client = get_gemini_client()

    if client:
        prompt = f"""
        Eres un entrenador físico experto en preparación atlética para la plataforma Activate Guajira.
        Sugiere 4 ejercicios del tipo '{tipo}' para realizar el día '{dia}'.
        El deportista tiene un nivel '{nivel}'.

        Responde ÚNICAMENTE con un arreglo JSON de objetos donde cada uno contenga:
        - "nombre": Nombre específico del ejercicio
        - "descripcion": Instrucción técnica breve indicando series, repeticiones o duración recomendada.

        Ejemplo de formato:
        [
          {{"nombre": "Flexiones de pecho", "descripcion": "3 series de 10 a 12 repeticiones cuidando la alineación de la espalda."}},
          {{"nombre": "Sentadillas profundas", "descripcion": "4 series de 15 repeticiones con descenso controlado a 90 grados."}}
        ]
        """
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )
            raw_text = (response.text or "").strip()
            ejercicios = json.loads(raw_text)

            if isinstance(ejercicios, list) and len(ejercicios) > 0:
                resultado = []
                for item in ejercicios:
                    if isinstance(item, dict) and "nombre" in item and "descripcion" in item:
                        resultado.append({
                            "nombre": str(item["nombre"]).strip(),
                            "descripcion": str(item["descripcion"]).strip()
                        })
                if resultado:
                    return resultado

        except Exception as e:
            logger.warning(f"Fallo al invocar Google Gemini en generar_sugerencias: {e}. Usando fallback inteligente.")

    # Fallback garantizado
    return _obtener_ejercicios_fallback(tipo, cantidad=4)


def generar_sugerencias_complejo(programa: dict, nivel: str = "principiante") -> dict:
    """
    Genera un diccionario completo semanal con ejercicios para cada día y tipo requerido.
    Estructura de retorno:
    {
      "LUNES": {
        "RESISTENCIA": [
          {"nombre": "...", "descripcion": "..."},
          {"nombre": "...", "descripcion": "..."}
        ]
      },
      ...
    }
    """
    dias_validos = {dia: tipos for dia, tipos in programa.items() if tipos}

    # Si no hay días seleccionados, devolver vacío
    if not dias_validos:
        return {}

    client = get_gemini_client()

    if client:
        prompt = f"""
        Eres un entrenador deportivo profesional de Activate Guajira. Genera sugerencias de ejercicios semanales para un deportista de nivel '{nivel}'.
        
        A continuación se indican los días y los tipos de ejercicio asignados:
        """
        for dia, tipos in dias_validos.items():
            prompt += f"- {dia}: {', '.join(tipos)}\n"

        prompt += """
        IMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON donde las claves principales sean los días en MAYÚSCULAS (ej. "LUNES"), 
        las subclaves sean los tipos de ejercicio exactamente como fueron solicitados (ej. "RESISTENCIA", "CARDIOVASCULAR"),
        y cada valor sea una lista de 2 a 3 objetos con "nombre" y "descripcion" técnica (con series/repeticiones).

        Ejemplo de formato:
        {
          "LUNES": {
            "RESISTENCIA": [
              {"nombre": "Burpees", "descripcion": "3 series de 10 reps con ritmo constante."},
              {"nombre": "Skipping alto", "descripcion": "3 bloques de 45 segundos."}
            ]
          }
        }
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )

            raw_text = (response.text or "").strip()
            resultado = json.loads(raw_text)

            if isinstance(resultado, dict) and bool(resultado):
                # Normalizar estructura
                resultado_normalizado = {}
                for dia, tipos_dict in resultado.items():
                    dia_upper = str(dia).strip().upper()
                    resultado_normalizado[dia_upper] = {}
                    if isinstance(tipos_dict, dict):
                        for tipo, lista_ej in tipos_dict.items():
                            tipo_upper = str(tipo).strip().upper()
                            if isinstance(lista_ej, list):
                                resultado_normalizado[dia_upper][tipo_upper] = [
                                    {
                                        "nombre": str(ej.get("nombre", "")).strip(),
                                        "descripcion": str(ej.get("descripcion", "")).strip()
                                    }
                                    for ej in lista_ej if isinstance(ej, dict) and ej.get("nombre")
                                ]

                tiene_contenido = any(
                    bool(resultado_normalizado.get(dia)) for dia in dias_validos
                )
                if tiene_contenido:
                    logger.info("✅ Sugerencias de ejercicio generadas exitosamente con Google Gemini.")
                    # Complementar con fallback si algún tipo faltó
                    for dia, tipos in dias_validos.items():
                        dia_upper = dia.upper()
                        if dia_upper not in resultado_normalizado:
                            resultado_normalizado[dia_upper] = {}
                        for tipo in tipos:
                            tipo_upper = tipo.upper()
                            if not resultado_normalizado[dia_upper].get(tipo_upper):
                                resultado_normalizado[dia_upper][tipo_upper] = _obtener_ejercicios_fallback(tipo, 3)

                    return resultado_normalizado

        except Exception as e:
            logger.warning(f"Fallo al invocar Google Gemini en generar_sugerencias_complejo: {e}. Activando generador inteligente de respaldo.")

    # Generación con el banco inteligente de Activate Guajira
    logger.info("ℹ️ Generando sugerencias mediante el banco atlético inteligente.")
    resultado_fallback = {}
    for dia, tipos in programa.items():
        dia_upper = dia.strip().upper()
        resultado_fallback[dia_upper] = {}
        for tipo in tipos:
            tipo_upper = tipo.strip().upper()
            resultado_fallback[dia_upper][tipo_upper] = _obtener_ejercicios_fallback(tipo, 3)

    return resultado_fallback


def parsear_respuesta(texto: str) -> dict:
    """Parsea respuestas de texto plano en caso de uso legado."""
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
    """
    Endpoint para generar o regenerar sugerencias individuales para un tipo y día.
    Compatible tanto con estructuras anidadas como con listas directas.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tipo = (data.get('tipo', '') or '')[:50]
            dia = (data.get('dia', '') or '')[:50]

            if not tipo or not dia:
                return JsonResponse({'error': 'tipo y dia son requeridos'}, status=400)

            sugerencias = generar_sugerencias(tipo, dia)

            # Estructura híbrida para máxima compatibilidad con frontend
            return JsonResponse({
                'sugerencias': {
                    dia: {
                        tipo: sugerencias
                    }
                },
                'lista': sugerencias,
                'status': 'success'
            })

        except Exception as e:
            logger.error(f"Error en editar_sugerencia: {str(e)}")
            return JsonResponse({'error': f'Error al generar sugerencias: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
