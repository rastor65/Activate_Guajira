from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import *

from django.contrib.auth.models import Group  
from django_celery_beat.models import PeriodicTask, IntervalSchedule

admin.site.register(Rol)
admin.site.register(Person)
admin.site.register(UserRol)
admin.site.register(Medicion)
admin.site.register(Resource)
admin.site.register(ResourceRol)
admin.site.register(Alimentacion)
admin.site.register(tablaMaestra)
admin.site.register(Entrenamiento)
admin.site.register(categoriaTipo)
# admin.site.register(PeriodicTask)
# admin.site.register(IntervalSchedule)

@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')

admin.site.unregister(Group)  