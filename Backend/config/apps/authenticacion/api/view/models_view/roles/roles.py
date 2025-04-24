from apps.authenticacion.models import Rol, UserRol
from rest_framework import generics
from rest_framework.views import APIView
from ....serializer.serializers import RolesSerializers, UserRolesSerializer, RolesUserSerializers, UserRolSerializer, UserRolListSimpleSerializer
from .....mudules import (Response, create_response, status)

from rest_framework.generics import ListCreateAPIView
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20  # Ajusta según necesidad
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserRolList(ListCreateAPIView):
    queryset = UserRol.objects.filter(status=True).select_related('userId', 'rolesId')
    serializer_class = UserRolListSimpleSerializer
    pagination_class = StandardResultsSetPagination

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userId')
        role_id = request.data.get('rolesId')

        existing_user_rol = UserRol.objects.filter(userId=user_id, rolesId=role_id, status=True).first()

        if existing_user_rol:
            return Response({"message": "La relación ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_rol = UserRol.objects.create(userId_id=user_id, rolesId_id=role_id, status=True)
        serializer = UserRolSerializer(user_rol)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class RolList(generics.ListCreateAPIView):
    queryset = Rol.objects.filter(status=True)
    serializer_class = RolesSerializers

class RolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolesSerializers

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response = {'response': 'Rol Not Found'}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        # Check if status is True before changing it or deleting
        if instance.status:
            self.perform_destroy(instance)
            response = {'response': 'Rol hidden successfully'}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'response': 'Rol is already hidden'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
class UserRolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRol.objects.all()
    serializer_class = RolesUserSerializers

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            response = {'response': 'User Role updated successfully', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'response': 'Error', 'errors': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        """Elimina completamente el objeto en lugar de solo ocultarlo"""
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({'response': 'User Role Not Found'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_destroy(instance)
        return Response({'response': 'User Role deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
