from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .tablaMaestra import tablaMaestraView
from .tablaMaestra import TablaMaestraPorCategoriaView  # <-- IMPORTAMOS la nueva vista

router = DefaultRouter()
router.register(r'tabla-maestra', tablaMaestraView, basename='tabla-maestra')

urlpatterns = [
    path('', include(router.urls)),
    path('tabla-maestra/categoria/<int:categoria_id>/', TablaMaestraPorCategoriaView.as_view(), name='tabla-maestra-por-categoria'),
]
