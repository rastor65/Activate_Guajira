# Backend Django de Activate Guajira.
#
# El contexto de construccion es la carpeta Backend/, asi que todas las rutas
# de COPY salen de ahi. En Railway se corresponde con "Root Directory: Backend".
#
# Dos etapas: la primera compila las ruedas de los paquetes que necesitan
# compilador (cryptography, bcrypt, Pillow), la segunda solo las instala. La
# imagen final no arrastra gcc ni las cabeceras de desarrollo, que son cientos
# de megas que nunca llegan a ejecutarse.

# ---------------------------------------------------------------------------
# Etapa 1: construir las ruedas
# ---------------------------------------------------------------------------
FROM python:3.11-slim-bookworm AS ruedas

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libssl-dev \
        libffi-dev \
        libjpeg-dev \
        zlib1g-dev \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /ruedas
# Solo el archivo de dependencias: mientras no cambie, esta capa se reutiliza
# y el despliegue no vuelve a compilar nada.
COPY config/requirements.txt .
RUN pip wheel --wheel-dir /ruedas/dist -r requirements.txt

# ---------------------------------------------------------------------------
# Etapa 2: imagen final
# ---------------------------------------------------------------------------
FROM python:3.11-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Solo las bibliotecas de ejecucion, sin compilador. curl es para la
# comprobacion de salud de docker compose.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libjpeg62-turbo \
        zlib1g \
        curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ruedas /ruedas/dist /ruedas/dist
COPY config/requirements.txt /tmp/requirements.txt
RUN pip install --no-index --find-links=/ruedas/dist -r /tmp/requirements.txt \
    && rm -rf /ruedas /tmp/requirements.txt

WORKDIR /app
COPY config/ /app/
COPY entrypoint.sh /app/entrypoint.sh

# Usuario sin privilegios: si alguien escapa del proceso, no es root
RUN useradd --create-home --shell /bin/bash aguajira \
    && mkdir -p /app/static /app/config/archivos \
    && chmod +x /app/entrypoint.sh \
    && chown -R aguajira:aguajira /app
USER aguajira

# Los estaticos se recogen al construir, no al arrancar: hacerlo en cada
# arranque retrasa el despliegue y falla si la base de datos aun no responde.
# Las variables de aqui son de mentira a proposito; collectstatic no consulta
# la base de datos.
RUN SECRET_KEY=solo-para-collectstatic \
    DEBUG=False \
    ALLOWED_HOSTS=localhost \
    python manage.py collectstatic --noinput --clear

EXPOSE 8000

# El arranque vive en entrypoint.sh: ahi se expande PORT (que Railway inyecta
# en cada despliegue) y se lanzan las migraciones cuando se piden.
ENTRYPOINT ["/app/entrypoint.sh"]
