from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from apps.authenticacion.models import Alimentacion
from apps.authenticacion.api.serializer.serializers import AlimentacionSerializer

class AlimentacionListCreateView(generics.ListCreateAPIView):
    queryset = Alimentacion.objects.filter(status=True)
    serializer_class = AlimentacionSerializer

class AlimentacionPorUsuarioListView(generics.ListAPIView):
    serializer_class = AlimentacionSerializer
    pagination_class = None

    def get_queryset(self):
        usuario_id = self.kwargs["usuario_id"]
        return Alimentacion.objects.filter(usuario_id=usuario_id, status = True)
    
class AlimentacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alimentacion.objects.filter(status=True)
    serializer_class = AlimentacionSerializer
    pagination_class = None
    lookup_field = "id"

    def perform_destroy(self, instance):
        """En lugar de eliminar, cambia el estado a False"""
        instance.status = False
        instance.save()