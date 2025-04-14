from django.apps import AppConfig


class AuthenticacionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authenticacion'

    def ready(self):
        import apps.authenticacion.api.view.models_view.entrenamiento.tasks