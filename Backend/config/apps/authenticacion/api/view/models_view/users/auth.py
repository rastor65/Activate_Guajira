from django.http import HttpResponse
from django.http import JsonResponse
from django.dispatch import receiver
from django.shortcuts import render
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django_rest_passwordreset.signals import reset_password_token_created

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .....models import CustomUser
from .....mudules import create_response
from helps.flatList import flatList
from ....serializer.authserializer import UserSerializer, CreateUserSerializers, UserChangePassword, CustomUserSerializer
from apps.authenticacion.api.serializer.auth_serializer import LoginSerializers,RegistroSerializzer, RegisterSerializers, RegisterUserSerializer
from apps.authenticacion.api.serializer.serializers import ResourcesSerializers, ResourcesRolesSerializers

import bcrypt, logging
from django.shortcuts import get_object_or_404
from django.http import FileResponse
import json
from django.http import JsonResponse
from ......telegram_utils import enviar_mensaje_telegram

from .....models import WebPushSubscription
from django.views.decorators.csrf import csrf_exempt

##  USER ##
class CustomUserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.filter(is_active=True)
    pagination_class = None
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Hashear la contraseña antes de guardar el usuario
            password = make_password(request.data['password'])
            serializer.save(password=password)
            response_data = {
                "ok": True,
                "message": "User Create",
                "data": serializer.data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {
            "ok": False,
            "message": "Error",
            "errors": serializer.errors,
        }
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

def descargar_archivo(request, pk):
    contenido = get_object_or_404(CustomUser, pk=pk, is_active=True)
    archivo = contenido.avatar
    response = FileResponse(archivo)
    return response

class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = get_object_or_404(CustomUser, pk=kwargs.get("pk"))

        if not instance.is_active:
            return Response(
                {
                    "ok": False,
                    "message": "Usuario no encontrado",
                    "errors": {"error": ["Usuario no encontrado"]},
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
class UserPublic(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        users = self.get_queryset()
        serializers = UserSerializer(users, many=True)
        response_data = {
            "ok": True,
            "message": "Users Public",
            "data": serializers.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class UserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CreateUserSerializers

    def create(self, request, *args, **kwargs):
        userSerializers = self.get_serializer(data=request.data)
        if userSerializers.is_valid():
            # Hashear la contraseña antes de guardar el usuario
            password = make_password(request.data['password'])
            userSerializers.save(password=password)
            response_data = {
                "ok": True,
                "message": "User Create",
                "data": userSerializers.data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {
            "ok": False,
            "message": "Error",
            "errors": userSerializers.errors,
        }
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
    
class UserUpdate(generics.RetrieveUpdateAPIView):  # Permite GET y PUT/PATCH
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return get_object_or_404(CustomUser, pk=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        # Permitir actualizaciones parciales (sin requerir todos los campos)
        user_serializer = UserSerializer(user, data=request.data, partial=True) 

        if user_serializer.is_valid():
            user_serializer.save()
            return Response({
                "ok": True,
                "message": "Usuario actualizado exitosamente"
            })
        else:
            return Response({
                "ok": False,
                "message": "Error de validación",
                "errors": user_serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UserChangePasswordView(UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        try:
            request_user = self.kwargs['pk']
            user = CustomUser.objects.get(pk=request_user)
            return user
        except (CustomUser.DoesNotExist, TypeError):
            return None
        except (BaseException, TypeError) as e:
            return None

    def perform_update(self, serializer):
        if 'original-password' in self.request.data:
            password = self.request.data['password'].encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            serializer.save(password=hashed_password.decode('utf-8'))
        else:
            serializer.save()

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        user = self.get_object()

        if user is None:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Not Found', e.args)
            return Response(response, status=code)

        if 'original-password' not in self.request.data:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Password Error', 'Password not found')
            return Response(response, status=code)

        if not user.check_password(request.data['original-password']):
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Password Error', 'Password is not correct.')
            return Response(response, status=code)

        userSerializers = UserChangePassword(
            user, data=request.data, partial=partial, context={'context': request})

        try:
            if userSerializers.is_valid():
                self.perform_update(userSerializers)
                response, code = create_response(
                    status.HTTP_200_OK, 'Password', 'Password Change')
                return Response(response, status=code)
            return Response(userSerializers.errors, status=status.HTTP_400_BAD_REQUEST)
        except (AttributeError, Exception) as e:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Not Found', e.args)
            return Response(response, status=code)

class AuthLogin(APIView):
    
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def post(self, request, *args, **kwargs):
        data = {}
        if 'email' in request.data:
            data['username'] = request.data['email']
            data['password'] = request.data['password']
        else:
            data = request.data

        serializers = LoginSerializers(
            data=data, context={'request': self.request})
        if not serializers.is_valid():
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', serializers.errors)
            return Response(response, status=code)

        login(request, serializers.validated_data)
        token = self.get_tokens_for_user(serializers.validated_data)

        """
            Obtiene y aplana la lista de recursos relacionados con los roles del usuario autenticado.

            Esta línea de código recupera los recursos relacionados con los roles del usuario autenticado,
            los cuales están almacenados en la propiedad 'resources' de los objetos 'Role'. Luego, utiliza
            el método 'prefetch_related' para optimizar las consultas y obtener los recursos de manera eficiente.

            Args:
                serializers.validated_data.roles.all(): Los roles asociados al usuario autenticado.

            Returns:
                list: Una lista plana de recursos relacionados con los roles del usuario.
        """
        resources = flatList([e.resources.prefetch_related(
            'resources') for e in serializers.validated_data.roles.all()])
   
        menu = ResourcesSerializers(set(resources), many=True)

        request.session['refresh-token'] = token['refresh']
        response, code = create_response(
            status.HTTP_200_OK, 'Login Success', {'token': token, 'user': {'name': serializers.validated_data.username,
                                                                           'id': serializers.validated_data.id},
                                                  'menu': menu.data})
        return Response(response, status=code)
    
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    http_method_names = ['get', 'patch']

    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user


class RegistroView(APIView):
    def post(self, request):
        try:
            serializer = RegistroSerializzer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Registro exitoso"}, status=status.HTTP_201_CREATED)

            # Retornar los errores con codificación correcta
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
class LogoutView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            jwt_token = request.session.get('refresh-token', None)
            resp = HttpResponse('content')
            resp.cookies.clear()
            resp.flush()
            token = RefreshToken(jwt_token)
            token.blacklist()
            logout(request)
            request.session.clear()
            resp.flush()
            request.session.flush()
            response, code = create_response(
                status.HTTP_200_OK, 'Logout Success', 'Ok')
            return Response(response, code)
        except TokenError as TkError:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', f'{TkError}')
            return Response(response, code)
        except Exception as e:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', e)
            return Response(e.args, code)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    print(f"\nRecupera la contraseña del correo '{reset_password_token.user.email}' usando el token '{reset_password_token.key}' desde la API http://localhost:8000/api/auth/reset/confirm/.")


def prueba_mensaje_telegram(request):
    chat_id = 'TU_CHAT_ID'  # reemplaza con el tuyo (puede ser int o str)
    mensaje = 'Hola desde Django 👋'

    resultado = enviar_mensaje_telegram(chat_id, mensaje)
    return JsonResponse(resultado)



@csrf_exempt
def save_subscription(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = request.user  # Asegúrate que esté autenticado si usas sesión

        sub, created = WebPushSubscription.objects.update_or_create(
            user=user,
            defaults={
                'endpoint': data['endpoint'],
                'keys': data['keys']
            }
        )
        return JsonResponse({'status': 'ok'})