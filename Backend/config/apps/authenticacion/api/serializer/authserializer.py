from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from rest_framework import  serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import CharField, ModelSerializer, SlugField

from ...models import CustomUser
from .serializers import RolesSerializers
from .customValidators import UserValidatorBefore
User = get_user_model()
    
class CustomUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        # first_name, last_name, roles y is_active se exponen para que el
        # listado de administracion pueda mostrarlos: antes la columna de
        # roles salia siempre vacia porque el serializer no los incluia.
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'avatar_url', 'consentimiento', 'is_active', 'roles',
        )

    def get_roles(self, user):
        """Nombres de los roles del usuario."""
        try:
            return [r.name for r in user.roles.all()]
        except Exception:
            return []
        
    def get_avatar_url(self, user):
        """URL de descarga del avatar.

        No se usa user.avatar.url porque MEDIA_URL solo esta montado bajo
        /api/, asi que /media/... devuelve 404 y la imagen sale rota. El
        endpoint de descarga si esta publicado.
        """
        try:
            if not user.avatar:
                return None
            request = self.context.get('request')
            if request is None:
                return None
            return request.build_absolute_uri(f'/api/user/{user.id}/descargar/')
        except Exception:
            return None
    
# class CustomLogEntrySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomLogEntry
#         fields = '__all__'

class UserChangePassword(ModelSerializer):
    password = CharField()

    class Meta:
        model = CustomUser
        fields = ('password', 'id')
        validators = [UserValidatorBefore()]

class CreateUserSerializers(ModelSerializer):

    username = SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'avatar')
        validators = [UserValidatorBefore()]

class UserSerializersSimpleRegister(ModelSerializer):
    username = SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        validators = [UserValidatorBefore()]

class UserSerializer(serializers.ModelSerializer):
    roles = RolesSerializers(many=True, read_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8)
    avatar = serializers.ImageField(required=False, allow_null=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('roles'):
            representation['roles'] = [role['id'] for role in representation['roles']]
        return representation

    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'roles', 'password', 'avatar', 'first_name', 'last_name', 'last_login', 'date_joined', 'consentimiento')
        
def validate_password(self, value):
    return make_password(value)

def validate_username(self, value):
    value = value.replace(" ", "") 
    try:
        user = get_user_model().objects.get(username=value)
        # Si es el mismo usuario mandando su mismo username le dejamos
        if user == self.instance:
            return value
    except get_user_model().DoesNotExist:
        return value
    raise serializers.ValidationError("Nombre de usuario en uso") 

def validate_email(self, value):
    # Hay un usuario con este email ya registrado?
    try:
        user = get_user_model().objects.get(email=value)
    except get_user_model().DoesNotExist:
        return value
    # En cualquier otro caso la validación fallará
    raise serializers.ValidationError("Email en uso")