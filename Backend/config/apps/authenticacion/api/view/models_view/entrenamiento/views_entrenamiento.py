from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from apps.authenticacion.models import Entrenamiento
from apps.authenticacion.api.serializer.serializers import EntrenamientoSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.authenticacion.models import Entrenamiento
from apps.authenticacion.api.serializer.serializers import EntrenamientoSerializer
from apps.services.ia import generar_sugerencias_complejo
from django.contrib.auth import get_user_model


Usuario = get_user_model()

dias_semana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

class EntrenamientoListCreateView(generics.ListCreateAPIView):
    queryset = Entrenamiento.objects.filter(status=True)
    serializer_class = EntrenamientoSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data
        semanas = data.get('semanas', [])
        
        for semana in semanas:
            dias_agrupados = {dia: [] for dia in dias_semana}
            
            for ejercicio in semana.get('ejercicios', []):
                tipo = ejercicio.get('tipo', 'GENERAL')
                dias = ejercicio.get('dias', [])
                for i, marcado in enumerate(dias):
                    if marcado:
                        dia = dias_semana[i]
                        dias_agrupados[dia].append(tipo)
            
            sugerencias_totales = generar_sugerencias_complejo(dias_agrupados)

            # Reasignar las sugerencias a cada ejercicio
            for ejercicio in semana.get('ejercicios', []):
                dias = ejercicio.get('dias', [])
                tipo = ejercicio.get('tipo', 'GENERAL')
                sugerencias_por_dia = {}
                for i, marcado in enumerate(dias):
                    if marcado:
                        dia = dias_semana[i]
                        sugerencias_por_dia[dia] = [
                            s for s in sugerencias_totales.get(dia, []) if tipo.lower() in s.lower()
                        ][:2]  # limitar a 2 por tipo y día
                ejercicio['sugerencias'] = sugerencias_por_dia

        serializer.save()


class EntrenamientoPorUsuarioListView(generics.ListAPIView):
    serializer_class = EntrenamientoSerializer
    pagination_class = None

    def get_queryset(self):
        usuario_id = self.kwargs["usuario_id"]
        return Entrenamiento.objects.filter(usuario_id=usuario_id, status= True)
    
class EntrenamientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrenamiento.objects.filter(status=True)
    serializer_class = EntrenamientoSerializer
    lookup_field = "id"

    def perform_destroy(self, instance):
        """En lugar de eliminar, cambia el estado a False"""
        instance.status = False
        instance.save()

