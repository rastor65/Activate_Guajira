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

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-a#xmneb=v#5y@$2c*sxhl3s2q58i1x8r*7(l8#!(4-4wp37^g&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

#IA
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
import os
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")

CELERY_BROKER_URL = 'redis://localhost:6379/0'

#### ORIGIN

CORS_ORIGIN_WHITELIST = (
    "http://localhost:4200",
)

VAPID_PUBLIC_KEY = "BBhWfccyHHvU-DrbPbbMMOeaQ3_xMZGQhPR1FfwIfeShYsGnUO6J-iP6C-fkfbtIC1DCqOm6KBru77UkBjkmyvA="
VAPID_PRIVATE_KEY = "7_3QKyXomqhksKU8YWOaYa1GtHuY_UFwh2UFGHM7rwk="
VAPID_CLAIMS = {
    "sub": "mailto:rdamianquintero@uniguajira.edu.co"
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # ajusta si usas otro puerto
]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

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

    # MIDDLEWARE
    # 'apps.middlewares.middleware.AddJWTTokenMiddleware',
    # 'apps.middlewares.middleware.ServiceMiddleware',
    
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

SESSION_COOKIE_SECURE = False
SESSION_COOKIE_DOMAIN = None
SESSION_EXPIRE_AT_BROWSER_CLOSE = True


##  ENVIAR EMAILS ##
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587  
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'rdamianquintero@uniguajira.edu.co'
EMAIL_HOST_PASSWORD = 'squk idys ttag dbck'

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

 DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.mysql',
         'NAME': 'railway',
         'USER': 'root',
         'PASSWORD': 'TWjPbGXgOxKhvVKlPwMgMhhoOLBMuqAH',
         'HOST': 'switchback.proxy.rlwy.net',
         'PORT': '51406', 
         'OPTIONS': {'sql_mode': 'STRICT_ALL_TABLES', 'charset': 'utf8mb4',},
     }
 }

DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'peakfit',
#         'USER': 'root',
#         'PASSWORD': '',
#         'HOST': '127.0.0.1',
#         'PORT': '3306', 
#         'OPTIONS': {'sql_mode': 'STRICT_ALL_TABLES'},
#     }
# }


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

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
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

