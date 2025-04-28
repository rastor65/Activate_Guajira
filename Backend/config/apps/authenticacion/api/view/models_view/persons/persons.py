from ....serializer.serializers import PersonsSerializers, PersonSimpleSerializer
from apps.authenticacion.models import Person
from .....mudules import status, Response, create_response
from rest_framework import generics

class BasePersonView:
    def get_queryset(self):
        return Person.objects.select_related(
            'user',
            'document_type',
            'nivelFormacion',
            'estado_civil',
            'grupoEtnico',
            'departamento',
            'ciudad_residencia',
            'ciudad_nacimiento',
            'barrio',
            'situacion_laboral',
            'estrato',
            'genero'
        ).filter(status=True).order_by('id')

class PersonList(BasePersonView, generics.ListCreateAPIView):
    serializer_class = PersonsSerializers

class PersonDetail(BasePersonView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonsSerializers

    def perform_destroy(self, instance):
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            response, code = create_response(
                status.HTTP_404_NOT_FOUND, 'Error', 'Person not found')
            return Response(response, status=code)

        if instance.status:
            self.perform_destroy(instance)
            response, code = create_response(
                status.HTTP_204_NO_CONTENT, 'Success', 'Person hidden successfully')
        else:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', 'Person is already hidden')

        return Response(response, status=code)
