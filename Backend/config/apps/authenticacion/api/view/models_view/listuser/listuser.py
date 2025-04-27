from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.authenticacion.models import CustomUser, Person
from apps.authenticacion.models import UserRol
from rest_framework import status
from apps.authenticacion.api.serializer.serializers import ListUserSerializer
from rest_framework.generics import RetrieveAPIView


class UsersView(APIView):
    def get(self, request):
        entrenadores_ids = UserRol.objects.filter(rolesId__name="Usuario").values_list('userId', flat=True)

        users = (CustomUser.objects
                 .filter(id__in=entrenadores_ids, is_active=True)
                 .select_related('person', 'person__genero')
                )

        serializer = ListUserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)
    
class UserDetailView(RetrieveAPIView):
    serializer_class = ListUserSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return (CustomUser.objects
                .filter(is_active=True)
                .select_related('person', 'person__genero'))
