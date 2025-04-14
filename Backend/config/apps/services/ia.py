from openai import OpenAI
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)

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
        return [f"Error al generar sugerencias: {str(e)}"]

@csrf_exempt
def editar_sugerencia(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tipo = data.get('tipo')
            dia = data.get('dia')

            if not tipo or not dia:
                return JsonResponse({'error': 'tipo y dia son requeridos'}, status=400)

            sugerencias = generar_sugerencias(tipo, dia)
            return JsonResponse({'sugerencias': sugerencias})
        except Exception as e:
            return JsonResponse({'error': f'Error al generar sugerencias: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
