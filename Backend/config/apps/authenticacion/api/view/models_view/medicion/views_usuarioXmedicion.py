from django.http import Http404, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.views import View

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model

from apps.authenticacion.models import Medicion
from apps.authenticacion.api.serializer.serializers import MedicionSerializer

User = get_user_model()

class MedicionList(generics.ListCreateAPIView):
    queryset = Medicion.objects.filter(status=True)
    serializer_class = MedicionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicion.objects.filter(status=True)
    serializer_class = MedicionSerializer

    def perform_destroy(self, instance):
        """En lugar de eliminar, cambia el estado a False"""
        instance.status = False
        instance.save()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response({'detail': 'Medición no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        if instance.status:
            self.perform_destroy(instance)
            return Response({'detail': 'Medición ocultada exitosamente'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'La medición ya está oculta'}, status=status.HTTP_400_BAD_REQUEST)


def descargar_archivo(request, archivo):
    """Descargar un archivo si existe"""
    try:
        if archivo and hasattr(archivo, 'path'):
            return FileResponse(archivo)
        else:
            return HttpResponse("Archivo no encontrado", status=404)
    except Exception as e:
        return HttpResponse(f"Error al descargar el archivo: {str(e)}", status=500)


def descargar_cert_grado(request, pk):
    """Descargar el certificado de grado de una medición"""
    contenido = get_object_or_404(Medicion, pk=pk, status=True)
    
    if not contenido.cert_grado:
        return HttpResponse("No hay certificado de grado disponible.", status=404)

    return descargar_archivo(request, contenido.cert_grado)

class MedicionUsuarioList(ListAPIView):
    serializer_class = MedicionSerializer

    def get_queryset(self):
        """
        Filtra las mediciones solo por el ID del usuario proporcionado en la URL.
        """
        user_id = self.kwargs.get('userId')
        usuario = get_object_or_404(User, id=user_id)
        return Medicion.objects.filter(usuario=usuario, status=True)