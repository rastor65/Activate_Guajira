from rest_framework import serializers
from apps.authenticacion.models import *
from django import forms
from datetime import date

from decimal import Decimal

from rest_framework.serializers import ModelSerializer, CharField, ValidationError, Serializer, IntegerField
from django.utils import timezone
from ...mudules import create_response, menuResources


class UserSerializersSimple(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email')
        
class UserSerialSimple(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
    
#TABLA TIPO
class categoriaTipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = categoriaTipo
        fields = '__all__'

class tablaMaestraSerializer(serializers.ModelSerializer):
    class Meta:
        model = tablaMaestra
        fields = '__all__'

#PERSON
class PersonsSerializers(serializers.ModelSerializer):
    edad = serializers.SerializerMethodField()
    nombres = serializers.CharField(source="user.first_name", read_only=True)
    apellidos = serializers.CharField(source="user.last_name", read_only=True)
    document_type = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Tipo de documento"), allow_null=True, required=False)
    nivelFormacion = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Nivel de formación"), allow_null=True, required=False)
    estado_civil = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Estado civil"), allow_null=True, required=False)
    grupoEtnico = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Grupo étnico"), allow_null=True, required=False)
    departamento = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Departamento"), allow_null=True, required=False)
    ciudad_residencia = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Ciudad"), allow_null=True, required=False)
    ciudad_nacimiento = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Ciudad"), allow_null=True, required=False)
    barrio = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Barrio"), allow_null=True, required=False)
    situacion_laboral = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Situación Laboral"), allow_null=True, required=False)
    estrato = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Estrato"), allow_null=True, required=False)
    genero = serializers.PrimaryKeyRelatedField(queryset=tablaMaestra.objects.filter(categoria__nombre="Genero"), allow_null=True, required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Person
        fields = '__all__'  # Se incluirán "nombres" y "apellidos"

    def create(self, validated_data):
        user = validated_data.pop('user')  # Extrae el usuario (ya es un objeto)
        person = Person.objects.create(user=user, **validated_data)  # Asigna el usuario correctamente
        return person


    def get_edad(self, obj):
        """Calcula la edad en base a la fecha de nacimiento"""
        if obj.fecha_nacimiento:
            today = date.today()
            edad = today.year - obj.fecha_nacimiento.year - (
                (today.month, today.day) < (obj.fecha_nacimiento.month, obj.fecha_nacimiento.day)
            )
            return edad
        return None

class PersonSimpleSerializer(serializers.ModelSerializer):
    nombres = serializers.CharField(source="user.first_name", read_only=True)
    apellidos = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = Person
        fields = ['id', 'identificacion', 'nombres', 'apellidos', 'status']

class PersonsSimpleSerializers(serializers.ModelSerializer):
    document_type = serializers.SerializerMethodField()
    edad = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('name', 'surname', 'document_type',
                  'phone', 'status', 'fecha_nacimiento', 'edad')

    def get_document_type(self, obj):
        """Devuelve la representación del tipo de documento"""
        return obj.document_type.name if obj.document_type else None

    def get_edad(self, obj):
        """Calcula la edad en base a la fecha de nacimiento"""
        if obj.fecha_nacimiento:
            today = date.today()
            edad = today.year - obj.fecha_nacimiento.year - (
                (today.month, today.day) < (obj.fecha_nacimiento.month, obj.fecha_nacimiento.day)
            )
            return edad
        return None

#RESOURCES
class ResourcesSerializers(ModelSerializer):
    class Meta:
        model = Resource
        exclude = ('roles',)     

class ResourcesRolesSerializers(serializers.ModelSerializer):
    class Meta:
        model = ResourceRol
        fields = '__all__'     

class Resources_RolesSerializers(serializers.ModelSerializer):
    class Meta:
        model = ResourceRol
        fields = '__all__'
        
    rolesId = IntegerField()
    resources = ResourcesSerializers(many=True)

    def create(self, validated_data):
        try:
            resources = []
            list_resources_roles = []

            id_last_resources = 0
            last = Resource.objects.last()
            if last:
                id_last_resources = last.id + 1

            menuResources(validated_data['resources'],
                          resources, Resource, id_last_resources)
            resources = Resource.objects.bulk_create(resources)
            roles = Rol.objects.get(pk=validated_data['rolesId'])
            list_resources_roles = [ResourceRol(
                rolesId=roles, resourcesId=r) for r in resources]
            ResourceRol.objects.bulk_create(list_resources_roles)
            return None
        except Exception as e:
            raise e

#ROLES
class RolesSerializers(ModelSerializer):
    userId = UserSerialSimple(read_only=True)
    
    class Meta:
        model = Rol
        fields = '__all__'
              
class RolesSimpleSerializers(ModelSerializer):
    resources = ResourcesSerializers(many=True)

    class Meta:
        model = UserRol
        fields = '__all__'

class RolesUserSerializers(serializers.ModelSerializer):
    userId = UserSerialSimple(read_only=True)
    rolesId = RolesSerializers(read_only=True)

    class Meta:
        model = UserRol
        fields = ['id', 'status', 'userId', 'rolesId']
        read_only_fields = ['userId', 'rolesId']

    def create(self, validated_data):
        user = validated_data['userId']
        rolesForUser = [UserRol(
            userId=user, rolesId=x) for x in validated_data['roles']]

        try:
            response = UserRol.objects.bulk_create(rolesForUser)
            return response[0]
        except Exception as e:
            response, code = create_response(
                404, '', 'Duplicate Key User - Rol')
            raise ValidationError(response, code=code)
        
class UserRolListSimpleSerializer(serializers.ModelSerializer):
    userId = serializers.StringRelatedField()  # o usa userId.username si lo prefieres
    rolesId = serializers.StringRelatedField()  # o rolesId.nombre si lo prefieres

    class Meta:
        model = UserRol
        fields = ['id', 'userId', 'rolesId', 'status']

class UserRolSerializer(serializers.ModelSerializer):
    userId = UserSerialSimple()
    rolesId = RolesSerializers()

    class Meta:
        model = UserRol
        fields = '__all__'
        
class UserRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRol
        fields = '__all__'
  
class UserSerial(ModelSerializer):
    rolesId = RolesSerializers(read_only=True, source='rolesId.roles')
    
    class Meta:
        model = CustomUser
        fields = '__all__'
        
    def __str__(self):
        return self.rolesId.name
    
#medicion

class MedicionSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = [
            'id', 'fecha', 'peso', 'talla', 'usuario'
        ]  # Incluye solo campos necesarios para el listado

class MedicionSerializer(serializers.ModelSerializer):
    talla = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True, default=None)
    peso = serializers.DecimalField(max_digits=6, decimal_places=2, allow_null=True, default=None)
    imc = serializers.SerializerMethodField()
    icc = serializers.SerializerMethodField()
    grasa_corporal = serializers.SerializerMethodField()
    fuerza_maxima = serializers.SerializerMethodField()

    def validate_talla(self, value):
        if value is None:
            return Decimal("0.00")  # O asigna otro valor por defecto
        return value

    class Meta:
        model = Medicion
        fields = '__all__'

    def get_imc(self, obj):
        """Calcula el Índice de Masa Corporal (IMC)"""
        try:
            if obj.talla and obj.peso and obj.talla > 0 and obj.peso > 0:
                return round(obj.peso / (obj.talla ** 2), 2)
        except Exception as e:
            return None  # O podrías devolver un mensaje: f"Error calculando IMC: {str(e)}"
        return None

    def get_icc(self, obj):
        """Calcula el Índice Cintura-Cadera (ICC)"""
        try:
            if obj.perimetro_cintura and obj.perimetro_cadera and obj.perimetro_cadera > 0:
                return round(obj.perimetro_cintura / obj.perimetro_cadera, 2)
        except Exception as e:
            return None
        return None
    
    def get_grasa_corporal(self, obj):
        try:
            person = getattr(obj.usuario, "person", None)
            if not person:
                return None

            if person.fecha_nacimiento:
                today = date.today()
                edad = today.year - person.fecha_nacimiento.year - ((today.month, today.day) < (person.fecha_nacimiento.month, person.fecha_nacimiento.day))
            else:
                return None

            genero = person.genero.nombre if person.genero else None 
            
            imc = self.get_imc(obj)
            if imc is None:
                return None
            
            if edad and genero:
                if genero.lower() == "masculino":
                    grasa = (1.20 * imc) + (0.23 * edad) - 16.2
                else:
                    grasa = (1.20 * imc) + (0.23 * edad) - 5.4
                    
                return round(grasa, 2)

        except Exception as e:
            return None
        return None
    
    def get_fuerza_maxima(self, obj):
        """Calcula la fuerza máxima de prensión (kg) y la categoriza"""
        try:
            # Verificar que haya datos válidos
            if obj.fuerza_manoderecha is None or obj.fuerza_manoizquierda is None:
                return None

            # Calcular fuerza máxima
            fuerza_max = (obj.fuerza_manoderecha + obj.fuerza_manoizquierda) / 2
            
            # Obtener datos del usuario
            person = Person.objects.filter(user=obj.usuario).first()
            if not person or not person.fecha_nacimiento:
                return None

            # Calcular edad
            today = date.today()
            edad = today.year - person.fecha_nacimiento.year - ((today.month, today.day) < (person.fecha_nacimiento.month, person.fecha_nacimiento.day))
            genero = person.genero.nombre.lower() if person.genero else None

            # Categorizar la fuerza máxima según tablas de referencia
            if genero == "masculino":
                if edad < 30:
                    categoria = "Alta" if fuerza_max > 50 else "Normal" if fuerza_max >= 30 else "Baja"
                elif edad < 50:
                    categoria = "Alta" if fuerza_max > 45 else "Normal" if fuerza_max >= 28 else "Baja"
                else:
                    categoria = "Alta" if fuerza_max > 40 else "Normal" if fuerza_max >= 25 else "Baja"
            elif genero == "femenino":
                if edad < 30:
                    categoria = "Alta" if fuerza_max > 35 else "Normal" if fuerza_max >= 20 else "Baja"
                elif edad < 50:
                    categoria = "Alta" if fuerza_max > 30 else "Normal" if fuerza_max >= 18 else "Baja"
                else:
                    categoria = "Alta" if fuerza_max > 25 else "Normal" if fuerza_max >= 15 else "Baja"
            else:
                categoria = "Desconocida"

            return {"valor": round(fuerza_max, 2), "categoria": categoria}

        except Exception as e:
            return None

    
class EntrenamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrenamiento
        fields = '__all__'


class AlimentacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimentacion
        fields = '__all__'
