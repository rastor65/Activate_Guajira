from django.urls import path, include

from  .view.models_view.users.auth import save_subscription
from .view.models_view.notificaciones.view import delete_subscription, save_subscription

urlpatterns = [
    path('roles/', include('apps.authenticacion.api.view.models_view.roles.urls')),
    path('persons/', include('apps.authenticacion.api.view.models_view.persons.urls')),
    path('security/',include('apps.authenticacion.api.view.models_view.security.urls')), 
    path('resources/', include('apps.authenticacion.api.view.models_view.resources.urls')),
    path('resourcesr/', include('apps.authenticacion.api.view.models_view.resources.urlss')),
    path('entrenamiento/', include('apps.authenticacion.api.view.models_view.entrenamiento.urls_entrenamiento')),
    path('alimentacion/', include('apps.authenticacion.api.view.models_view.alimentacion.urls_alimentacion')),
    path('medicion/', include('apps.authenticacion.api.view.models_view.medicion.urls_usuarioXmedicion')),
    path('tabla_maestra/', include('apps.authenticacion.api.view.models_view.tablaMaestra.urls_tablaMaestra')),
    path('categoria_tipo/', include('apps.authenticacion.api.view.models_view.categoriaTipo.urls_categoria_tipo')),
    path('listusers/', include('apps.authenticacion.api.view.models_view.listuser.urls')),

    path('api/save-subscription/', save_subscription, name='save_subscription'),
    path('api/delete-subscription/', delete_subscription),

]