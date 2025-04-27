from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.authenticacion.models import tablaMaestra
from ....serializer.serializers import tablaMaestraSerializer
from rest_framework import generics

class tablaMaestraView(viewsets.ModelViewSet):
    serializer_class = tablaMaestraSerializer

    def get_queryset(self):
        return tablaMaestra.objects.filter(status=True)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = False
        instance.save()
        return Response({"message": "Registro desactivado correctamente"}, status=status.HTTP_200_OK)
    
class TablaMaestraPorCategoriaView(generics.ListAPIView):
    serializer_class = tablaMaestraSerializer

    def get_queryset(self):
        categoria_id = self.kwargs.get('categoria_id')
        return tablaMaestra.objects.filter(categoria_id=categoria_id, status=True)
