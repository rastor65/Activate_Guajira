from celery import shared_task
from django.contrib.auth import get_user_model
from apps.authenticacion.models import Entrenamiento
from apps.telegram_utils import enviar_mensaje_telegram
from datetime import date

from celery import shared_task
from django.contrib.auth import get_user_model
from apps.authenticacion.models import Entrenamiento
from apps.telegram_utils import enviar_mensaje_telegram
from datetime import date

from apps.authenticacion.utils import enviar_notificacion_push_a_usuario 

@shared_task(name="apps.authenticacion.tasks.enviar_recordatorios_diarios")
def enviar_recordatorios_diarios():
    Usuario = get_user_model()
    usuarios = Usuario.objects.filter(is_active=True)
    hoy = date.today()
    dias_semana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']
    dia_actual = dias_semana[hoy.weekday()]

    for usuario in usuarios:
        if not usuario.chat_id_telegram and not usuario.push_subscriptions.exists():
            continue

        entrenamientos = Entrenamiento.objects.filter(usuario=usuario, status=True)
        mensaje = f"👋 Hola {usuario.first_name}, estos son tus entrenamientos sugeridos para hoy ({dia_actual}):\n"
        hay_entrenamientos = False

        for ent in entrenamientos:
            for semana in ent.semanas:
                for ejercicio in semana.get("ejercicios", []):
                    sugerencias_dia = ejercicio.get("sugerencias", {}).get(dia_actual)
                    if sugerencias_dia:
                        hay_entrenamientos = True
                        mensaje += f"\n🏋️ {ent.nombre} - {ejercicio['tipo']}:\n"
                        for sugerencia in sugerencias_dia:
                            mensaje += f"• {sugerencia}\n"

        if not hay_entrenamientos:
            mensaje = f"👋 Hola {usuario.first_name}, hoy ({dia_actual}) no tienes entrenamientos asignados. ¡Disfruta tu descanso! 🧘‍♂️"

        # Telegram
        if usuario.chat_id_telegram:
            enviar_mensaje_telegram(usuario.chat_id_telegram, mensaje)
        
        # Web push
        if usuario.push_subscriptions.exists():
            enviar_notificacion_push_a_usuario(usuario, "Entrenamiento del día", mensaje)


@shared_task(name="apps.authenticacion.tasks.enviar_recordatorios_diarios")
def enviar_recordatorios_diarios():
    Usuario = get_user_model()
    usuarios = Usuario.objects.filter(is_active=True)
    hoy = date.today()
    dias_semana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']
    dia_actual = dias_semana[hoy.weekday()]  # Devuelve LUNES, MARTES, etc.

    for usuario in usuarios:
        if not usuario.chat_id_telegram:
            continue

        entrenamientos = Entrenamiento.objects.filter(usuario=usuario, status=True)
        mensaje = f"👋 Hola {usuario.first_name}, estos son tus entrenamientos sugeridos para hoy ({dia_actual}):\n"
        hay_entrenamientos = False

        for ent in entrenamientos:
            for semana in ent.semanas:
                for ejercicio in semana.get("ejercicios", []):
                    sugerencias_dia = ejercicio.get("sugerencias", {}).get(dia_actual)
                    if sugerencias_dia:
                        hay_entrenamientos = True
                        mensaje += f"\n🏋️ {ent.nombre} - {ejercicio['tipo']}:\n"
                        for sugerencia in sugerencias_dia:
                            mensaje += f"• {sugerencia}\n"

        if not hay_entrenamientos:
            mensaje = f"👋 Hola {usuario.first_name}, hoy ({dia_actual}) no tienes entrenamientos asignados. ¡Disfruta tu descanso! 🧘‍♂️"

        enviar_mensaje_telegram(usuario.chat_id_telegram, mensaje)
