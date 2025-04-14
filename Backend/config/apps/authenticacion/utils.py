import json
from pywebpush import webpush, WebPushException
from .models import WebPushSubscription
from django.conf import settings


def enviar_notificaciones_push(titulo, cuerpo):
    subs = WebPushSubscription.objects.all()
    for sub in subs:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh,
                        "auth": sub.auth
                    }
                },
                data=json.dumps({"title": titulo, "body": cuerpo}),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS
            )
        except WebPushException as e:
            print(f"❌ Error enviando a {sub.user.email}: {e}")


def enviar_notificacion_push_a_usuario(usuario, titulo, cuerpo):
    subscripciones = WebPushSubscription.objects.filter(user=usuario)
    for sub in subscripciones:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh,
                        "auth": sub.auth
                    }
                },
                data=json.dumps({"title": titulo, "body": cuerpo}),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS

            )
        except WebPushException as e:
            print(f"❌ Error enviando a {usuario.email}: {e}")
