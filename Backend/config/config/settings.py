from pathlib import Path
from datetime import timedelta
import environ
from django.core.mail import send_mail
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
#BASE_DIR = Path(__file__).resolve().parent.parent


env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# La clave sale del entorno. El valor de reserva solo sirve para desarrollo
# local: en Railway hay que definir SECRET_KEY o las sesiones y los tokens de
# todos los despliegues compartirian firma.
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-solo-para-desarrollo-local-no-usar-en-produccion',
)

# Apagado salvo que se pida explicitamente: en produccion DEBUG=True filtra
# rutas, consultas y variables de entorno en cada pagina de error.
DEBUG = os.environ.get('DEBUG', 'False').strip().lower() in ('1', 'true', 'yes', 'on')

# Detras de un proxy que termina TLS (Railway) la peticion llega por http.
# Con esto request.is_secure() y build_absolute_uri devuelven https cuando
# corresponde, sin tener que parchear las URLs a mano en los serializers.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True

# IA (Google Gemini API)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
import os

def _lista(nombre, por_defecto=''):
    """Lee una variable separada por comas y devuelve una lista limpia."""
    crudo = os.environ.get(nombre, por_defecto)
    return [x.strip() for x in crudo.split(',') if x.strip()]


ALLOWED_HOSTS = _lista('ALLOWED_HOSTS', 'localhost,127.0.0.1')

# Railway publica el dominio del servicio aqui; se anade solo para no tener que
# copiarlo a mano en cada entorno.
_dominio_railway = os.environ.get('RAILWAY_PUBLIC_DOMAIN')
if _dominio_railway and _dominio_railway not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_dominio_railway)

if DEBUG and not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ['*']

# Django 4 exige el esquema en los origenes de confianza para CSRF
CSRF_TRUSTED_ORIGINS = _lista('CSRF_TRUSTED_ORIGINS')
if _dominio_railway:
    CSRF_TRUSTED_ORIGINS.append('https://' + _dominio_railway)


CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')

#### ORIGIN

# Estas claves estaban escritas en el codigo y por tanto en el historial de
# git. Conviene generar unas nuevas y dejar estas solo como reserva local.
VAPID_PUBLIC_KEY = os.environ.get(
    'VAPID_PUBLIC_KEY',
    "BBhWfccyHHvU-DrbPbbMMOeaQ3_xMZGQhPR1FfwIfeShYsGnUO6J-iP6C-fkfbtIC1DCqOm6KBru77UkBjkmyvA=",
)
VAPID_PRIVATE_KEY = os.environ.get(
    'VAPID_PRIVATE_KEY',
    "7_3QKyXomqhksKU8YWOaYa1GtHuY_UFwh2UFGHM7rwk=",
)
VAPID_CLAIMS = {
    "sub": "mailto:" + os.environ.get('VAPID_EMAIL', 'rdamianquintero@uniguajira.edu.co')
}

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# El frontend vive en otro servicio y su dominio cambia con el entorno.
CORS_ALLOWED_ORIGINS = _lista('CORS_ALLOWED_ORIGINS', 'http://localhost:4200')

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "origin",
    "x-csrftoken",
    "x-requested-with",
]

CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken', 'Authorization']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_celery_beat',

    
    'drf_yasg',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'django_rest_passwordreset',
    "whitenoise.runserver_nostatic",
    
    #'django.contrib.sites',
    #'allauth',
    #'allauth.account',
    
    'apps.authenticacion.apps.AuthenticacionConfig',
    'apps.pqrs.apps.PqrsConfig', 
]

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'config.urls'

# Custom user model
AUTH_USER_MODEL = 'authenticacion.CustomUser'

AUTHENTICATION_BACKENDS = [
    'apps.middlewares.EmailBackend.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
    #'allauth.account.auth_backends.AuthenticationBackend',
]

ACCOUNT_SESSION_REMEMBER = True

CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True

# Con TLS terminado en el proxy de Railway las cookies deben ir marcadas como
# seguras; en local (DEBUG) no, porque no hay https.
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_DOMAIN = None
SESSION_EXPIRE_AT_BROWSER_CLOSE = True


##  ENVIAR EMAILS ##
EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend'
)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
# ATENCION: aqui habia una contrasena de aplicacion de Gmail escrita en el
# codigo, y sigue en el historial de git. Revocala en la cuenta de Google y
# define EMAIL_HOST_PASSWORD como variable del servicio.
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Usar bcrypt para el hashing de contraseñas
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

# # Railway expone la base de datos como MYSQL_URL (o DATABASE_URL). Si esta,
# manda; si no, se cae a variables sueltas para desarrollo local.
_url_bd = os.environ.get('MYSQL_URL') or os.environ.get('DATABASE_URL')

if _url_bd:
    _cfg = env.db_url_config(_url_bd)
else:
    _cfg = {
        'ENGINE': 'django.db.backends.mysql',
        # Railway llama a esta variable MYSQLDATABASE, sin guion bajo. No se
        # lee MYSQL_DATABASE porque el .env local ya la usa para otra cosa.
        'NAME': os.environ.get('MYSQLDATABASE', 'peakfit'),
        'USER': os.environ.get('MYSQLUSER', 'root'),
        'PASSWORD': os.environ.get('MYSQLPASSWORD', ''),
        'HOST': os.environ.get('MYSQLHOST', '127.0.0.1'),
        'PORT': os.environ.get('MYSQLPORT', '3306'),
    }

_cfg.setdefault('ENGINE', 'django.db.backends.mysql')
_cfg['OPTIONS'] = {'sql_mode': 'STRICT_ALL_TABLES', 'charset': 'utf8mb4'}
# Reutiliza la conexion entre peticiones en vez de abrir una nueva cada vez
_cfg['CONN_MAX_AGE'] = int(os.environ.get('CONN_MAX_AGE', '60'))

DATABASES = {'default': _cfg}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

#### REST_FRAMEWORK

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        #'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

###   SIMPLE JWT
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
       
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=180),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=60),
    
    'ROTATE_REFRESH_TOKENS' : True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,
    
    'JTI_CLAIM': 'jti',
    
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
}

### CACHES

# Sin memcached a la vista se usa la memoria del proceso. Antes apuntaba a
# 127.0.0.1:11211 fijo, que dentro de un contenedor no existe y hace fallar
# cualquier vista que toque la cache.
_memcached = os.environ.get('MEMCACHED_LOCATION')
if _memcached:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
            'LOCATION': _memcached,
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'activate-guajira',
        }
    }

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/


LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True
DEFAULT_CHARSET = 'utf-8'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = 'static/'


# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"


MEDIA_URL = '/media/'
# En Railway el disco del contenedor se borra en cada despliegue: para que las
# imagenes subidas sobrevivan hay que montar un volumen y apuntar MEDIA_ROOT
# ahi con la variable MEDIA_ROOT.
MEDIA_ROOT = os.environ.get('MEDIA_ROOT', os.path.join(BASE_DIR, 'config', 'archivos'))