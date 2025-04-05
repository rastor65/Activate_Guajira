from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .tablaMaestra import tablaMaestraView

router = DefaultRouter()
router.register(r'tabla-maestra', tablaMaestraView, basename='tabla-maestra')
urlpatterns = [
    path('', include(router.urls)),
]