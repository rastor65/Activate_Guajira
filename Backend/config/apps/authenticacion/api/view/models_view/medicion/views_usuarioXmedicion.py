from django.http import FileResponse, Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views import View

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from apps.authenticacion.models import Medicion
from apps.authenticacion.api.serializer.serializers import MedicionSerializer, MedicionSimpleSerializer

User = get_user_model()

class MedicionList(generics.ListCreateAPIView):
    serializer_class = MedicionSimpleSerializer  # Usamos el optimizado

    def get_queryset(self):
        return Medicion.objects.filter(status=True).select_related(
            'usuario',            # relación directa
            'usuario__person',    # one-to-one con persona
            'usuario__person__genero'  # foreign key de persona
        )
    
    def get_serializer_class(self):
        if self.request.method == "GET":
            return MedicionSimpleSerializer
        return MedicionSerializer
    
class MedicionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicionSerializer

    def get_queryset(self):
        return Medicion.objects.select_related('usuario').filter(status=True)

    def perform_destroy(self, instance):
        instance.status = False
        instance.save(update_fields=["status"])  # Optimiza la escritura en DB

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.status:
            return Response({'detail': 'La medición ya está oculta'}, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_destroy(instance)
        return Response({'detail': 'Medición ocultada exitosamente'}, status=status.HTTP_204_NO_CONTENT)


def descargar_archivo(request, archivo):
    try:
        if archivo and hasattr(archivo, 'path'):
            return FileResponse(archivo)
        return HttpResponse("Archivo no encontrado", status=404)
    except Exception as e:
        return HttpResponse(f"Error al descargar el archivo: {str(e)}", status=500)


def descargar_cert_grado(request, pk):
    contenido = get_object_or_404(Medicion, pk=pk, status=True)
    
    if not contenido.cert_grado:
        return HttpResponse("No hay certificado de grado disponible.", status=404)

    return descargar_archivo(request, contenido.cert_grado)


class MedicionUsuarioList(ListAPIView):
    serializer_class = MedicionSimpleSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('userId')
        return Medicion.objects.filter(usuario_id=user_id, status=True).select_related(
            'usuario', 'usuario__person', 'usuario__person__genero'
        )
