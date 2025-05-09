from ....serializer.serializers import PersonsSerializers, PersonSimpleSerializer
from apps.authenticacion.models import Person
from .....mudules import status, Response, create_response
from rest_framework import generics
from rest_framework.generics import RetrieveAPIView

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

class PersonByUserIdView(RetrieveAPIView):
    serializer_class = PersonsSerializers

    def get(self, request, user_id, *args, **kwargs):
        try:
            person = Person.objects.get(user_id=user_id, status=True)
            serializer = self.get_serializer(person)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"detail": "No se encontró una persona asociada al usuario."}, status=status.HTTP_404_NOT_FOUND)
        except Person.MultipleObjectsReturned:
            return Response({"detail": "Error: múltiples personas asociadas al mismo usuario."}, status=status.HTTP_400_BAD_REQUEST)