from django.urls import path
from .views_alimentacion import *

urlpatterns = [
    path('alimentaciones/', AlimentacionListCreateView.as_view(), name='alimentacion-list-create'),
    path('alimentaciones/<int:id>/', AlimentacionDetailView.as_view(), name='alimentacion-detail'),
    path('alimentaciones/usuario/<int:usuario_id>/', AlimentacionPorUsuarioListView.as_view(), name='alimentaciones-por-usuario'),
]