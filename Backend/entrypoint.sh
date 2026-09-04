#!/bin/sh
# Arranque del backend.
#
# Railway no tiene una fase de "release" separada como Heroku, asi que las
# migraciones se lanzan aqui, antes de servir, y solo si se piden. Se deja
# desactivado por defecto: con varias replicas, todas intentarian migrar a la
# vez. Con una sola instancia, poner RUN_MIGRATIONS=true es lo comodo.
set -e

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "==> Aplicando migraciones"
    python manage.py migrate --noinput
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
    echo "==> Sembrando datos iniciales"
    python manage.py seed_datos_iniciales
fi

echo "==> Sirviendo en el puerto ${PORT:-8000}"
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers "${WEB_CONCURRENCY:-3}" \
    --timeout "${WEB_TIMEOUT:-120}" \
    --access-logfile - \
    --error-logfile -
