from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .....models import WebPushSubscription
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_subscription(request):
    try:
        print("📦 Payload recibido:", request.data)
        print("👤 Usuario:", request.user)

        data = request.data
        user = request.user

        print("🔑 endpoint length:", len(data['endpoint']))
        print("🔑 p256dh length:", len(data['keys']['p256dh']))
        print("🔑 auth length:", len(data['keys']['auth']))

        subscription, created = WebPushSubscription.objects.get_or_create(
            user=user,
            endpoint=data['endpoint'],
            defaults={
                'p256dh': data['keys']['p256dh'],
                'auth': data['keys']['auth']
            }
        )

        if not created:
            subscription.p256dh = data['keys']['p256dh']
            subscription.auth = data['keys']['auth']
            subscription.save()

        return Response({'status': 'ok'}, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_subscription(request):
    try:
        data = request.data
        endpoint = data.get('endpoint')

        if not endpoint:
            return Response({'error': 'Endpoint requerido'}, status=400)

        deleted, _ = WebPushSubscription.objects.filter(
            user=request.user,
            endpoint=endpoint
        ).delete()

        if deleted:
            return Response({'status': 'Eliminada'}, status=200)
        else:
            return Response({'status': 'No encontrada'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)