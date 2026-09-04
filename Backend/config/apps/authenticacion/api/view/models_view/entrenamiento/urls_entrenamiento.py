from django.urls import path
from .views_entrenamiento import *

urlpatterns = [
    path('entrenamientos/', EntrenamientoListCreateView.as_view(), name='entrenamiento-list-create'),
    path('entrenamientos/<int:id>/', EntrenamientoDetailView.as_view(), name='entrenamiento-detail'),
    path('entrenamientos/<int:id>/activar/', ActivarEntrenamientoView.as_view(), name='entrenamiento-activar'),
    path('entrenamientos/usuario/<int:usuario_id>/', EntrenamientoPorUsuarioListView.as_view(), name='entrenamientos-por-usuario'),
]