from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.db import transaction
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

from apps.authenticacion.models import Entrenamiento
from apps.authenticacion.api.serializer.serializers import EntrenamientoSerializer
from apps.services.ia import generar_sugerencias_complejo

Usuario = get_user_model()

dias_semana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

class EntrenamientoListCreateView(generics.ListCreateAPIView):
    queryset = Entrenamiento.objects.filter(status=True).order_by('-activo', '-id')
    serializer_class = EntrenamientoSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        usuario = data.get('usuario')
        semanas = data.get('semanas', [])

        for semana in semanas:
            dias_agrupados = {dia: [] for dia in dias_semana}
            for ejercicio in semana.get('ejercicios', []):
                tipo = ejercicio.get('tipo', 'GENERAL').upper()
                for i, marcado in enumerate(ejercicio.get('dias', [])):
                    if marcado:
                        dias_agrupados[dias_semana[i]].append(tipo)

            sugerencias_totales = generar_sugerencias_complejo(dias_agrupados)

            # Reasignar por día y tipo
            for ejercicio in semana.get('ejercicios', []):
                tipo = ejercicio.get('tipo', 'GENERAL').upper()
                dias = ejercicio.get('dias', [])
                sugerencias_por_dia = {}

                for i, marcado in enumerate(dias):
                    if marcado:
                        dia = dias_semana[i]
                        sugerencias_dia = sugerencias_totales.get(dia, {})
                        sugerencias_tipo = sugerencias_dia.get(tipo, [])
                        sugerencias_por_dia[dia] = sugerencias_tipo[:2]  # máximo 2

                ejercicio['sugerencias'] = sugerencias_por_dia

        with transaction.atomic():
            # Desactivar planes anteriores de este deportista
            if usuario:
                Entrenamiento.objects.filter(usuario=usuario, status=True).update(activo=False)
            # Guardar nuevo plan como activo
            serializer.save(activo=True)


class EntrenamientoPorUsuarioListView(generics.ListAPIView):
    serializer_class = EntrenamientoSerializer
    pagination_class = None

    def get_queryset(self):
        usuario_id = self.kwargs["usuario_id"]
        return Entrenamiento.objects.filter(usuario_id=usuario_id, status=True).order_by('-activo', '-id')
    
class EntrenamientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrenamiento.objects.filter(status=True)
    serializer_class = EntrenamientoSerializer
    lookup_field = "id"

    def perform_destroy(self, instance):
        """En lugar de eliminar físicamente, marca status=False y activo=False"""
        with transaction.atomic():
            usuario_id = instance.usuario_id
            estaba_activo = instance.activo
            instance.status = False
            instance.activo = False
            instance.save()

            # Si el plan eliminado estaba activo, reactivar el más reciente disponible
            if estaba_activo:
                ultimo_restante = Entrenamiento.objects.filter(
                    usuario_id=usuario_id, status=True
                ).order_by('-id').first()
                if ultimo_restante:
                    ultimo_restante.activo = True
                    ultimo_restante.save(update_fields=['activo'])


class ActivarEntrenamientoView(APIView):
    """
    Activa un plan de entrenamiento específico y desactiva todos los demás
    planes activos del mismo usuario.
    """
    def post(self, request, id):
        plan = get_object_or_404(Entrenamiento, id=id, status=True)
        with transaction.atomic():
            Entrenamiento.objects.filter(
                usuario_id=plan.usuario_id, status=True
            ).exclude(id=plan.id).update(activo=False)
            plan.activo = True
            plan.save(update_fields=['activo'])

        return Response(EntrenamientoSerializer(plan).data, status=status.HTTP_200_OK)


