from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.db import transaction
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model

from apps.authenticacion.models import Alimentacion
from apps.authenticacion.api.serializer.serializers import AlimentacionSerializer

class AlimentacionListCreateView(generics.ListCreateAPIView):
    queryset = Alimentacion.objects.filter(status=True).order_by('-activo', '-id')
    serializer_class = AlimentacionSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        usuario = data.get('usuario')

        with transaction.atomic():
            if usuario:
                Alimentacion.objects.filter(usuario=usuario, status=True).update(activo=False)
            serializer.save(activo=True)

class AlimentacionPorUsuarioListView(generics.ListAPIView):
    serializer_class = AlimentacionSerializer
    pagination_class = None

    def get_queryset(self):
        usuario_id = self.kwargs["usuario_id"]
        return Alimentacion.objects.filter(usuario_id=usuario_id, status=True).order_by('-activo', '-id')
    
class AlimentacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alimentacion.objects.filter(status=True)
    serializer_class = AlimentacionSerializer
    lookup_field = "id"

    def perform_destroy(self, instance):
        """En lugar de eliminar físicamente, cambia el estado a False"""
        with transaction.atomic():
            usuario_id = instance.usuario_id
            estaba_activo = instance.activo
            instance.status = False
            instance.activo = False
            instance.save()

            if estaba_activo:
                ultimo_restante = Alimentacion.objects.filter(
                    usuario_id=usuario_id, status=True
                ).order_by('-id').first()
                if ultimo_restante:
                    ultimo_restante.activo = True
                    ultimo_restante.save(update_fields=['activo'])


class ActivarAlimentacionView(APIView):
    """
    Activa un plan de alimentación específico y desactiva todos los demás
    planes activos del mismo usuario.
    """
    def post(self, request, id):
        plan = get_object_or_404(Alimentacion, id=id, status=True)
        with transaction.atomic():
            Alimentacion.objects.filter(
                usuario_id=plan.usuario_id, status=True
            ).exclude(id=plan.id).update(activo=False)
            plan.activo = True
            plan.save(update_fields=['activo'])

        return Response(AlimentacionSerializer(plan).data, status=status.HTTP_200_OK)