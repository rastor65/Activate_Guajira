from django.urls import path
from .views_usuarioXmedicion import *

app_name = 'mediciones'

urlpatterns = [
    path('medicion/', MedicionList.as_view(), name='medicion_list'),
    path('medicion/<int:pk>/', MedicionDetail.as_view(), name='medicion_detail'),
    path('mis-mediciones/<int:userId>/', MedicionUsuarioList.as_view(), name='mediciones-por-usuario'),
]
