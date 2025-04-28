from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.authenticacion.models import categoriaTipo
from ....serializer.serializers import categoriaTipoSerializer

class categoriaTipoView(viewsets.ModelViewSet):
    queryset = categoriaTipo.objects.filter(status=True)
    serializer_class = categoriaTipoSerializer
    pagination_class = None

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = False
        instance.save()
        return Response({"message": "Categoría desactivada correctamente"}, status=status.HTTP_200_OK)
