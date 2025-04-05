from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .categoria_tipo import categoriaTipoView

router = DefaultRouter()
router.register(r'categoria-tipo', categoriaTipoView, basename='categoria-tipo')
urlpatterns = [
    path('', include(router.urls)),
]