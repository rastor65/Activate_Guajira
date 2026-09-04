# Despliegue de Activate Guajira

Guía para levantar el sistema en contenedores, en local y en Railway (proyecto
**fantastic-smile**).

## Cómo queda repartido

Son **dos servicios** y una base de datos, no uno solo:

| Servicio | Qué es | Imagen final |
|---|---|---|
| `backend` | Django + gunicorn | `python:3.11-slim` |
| `frontend` | Angular compilado, servido por nginx | `nginx:1.27-alpine` |
| `MySQL` | Base de datos | plugin de Railway |

El frontend no necesita Node en producción: Angular compila a ficheros
estáticos y nginx los sirve. Node solo aparece en la primera etapa de la
construcción y se descarta.

---

## En local

```bash
cp .env.example .env      # ajusta lo que necesites
docker compose up --build
```

- Frontend → http://localhost:4200
- Backend → http://localhost:8000
- MySQL → `localhost:3307` (3307 para no chocar con un MySQL del equipo)

El backend aplica las migraciones al arrancar (`RUN_MIGRATIONS=true` en el
compose). Para sembrar roles, recursos y paramétricas la primera vez:

```bash
docker compose run --rm -e RUN_SEED=true backend
# o, con la pila ya en marcha:
docker compose exec backend python manage.py seed_datos_iniciales
```

---

## En Railway, proyecto fantastic-smile

### 1. La base de datos

En el proyecto → **New** → **Database** → **Add MySQL**. Railway crea el
servicio y publica `MYSQL_URL`, que es lo único que hace falta referenciar.

### 2. El backend

**New** → **GitHub Repo** → este repositorio. Luego en **Settings**:

- **Root Directory**: `Backend`
- **Builder**: se detecta solo por el `Dockerfile` y el `railway.json`

En **Settings → Networking** pulsa **Generate Domain**. Anota el dominio, hace
falta en el paso siguiente.

En **Variables**:

```
MYSQL_URL           = ${{MySQL.MYSQL_URL}}
SECRET_KEY          = (genera una nueva, ver abajo)
DEBUG               = False
CORS_ALLOWED_ORIGINS= https://<dominio-del-frontend>
RUN_MIGRATIONS      = true
MEDIA_ROOT          = /datos/media
GEMINI_API_KEY      = (tu clave)
EMAIL_HOST_USER     = (tu correo)
EMAIL_HOST_PASSWORD = (contraseña de aplicación NUEVA, ver seguridad)
```

`ALLOWED_HOSTS` y `CSRF_TRUSTED_ORIGINS` no hace falta ponerlas: el backend lee
`RAILWAY_PUBLIC_DOMAIN` y se añade solo.

Para la clave secreta:

```bash
python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"
```

### 3. El volumen de los archivos subidos

**Esto no es opcional si quieres conservar las fotos de perfil.** El disco de un
contenedor se borra entero en cada despliegue.

En el servicio backend → **Variables** → pestaña **Volumes** → **New Volume**,
punto de montaje `/datos/media`. Coincide con la variable `MEDIA_ROOT` de
arriba.

### 4. El frontend

Otro **New** → **GitHub Repo** → el mismo repositorio. En **Settings**:

- **Root Directory**: `Frontend`

Genera también su dominio, y en **Variables**:

```
API_URI = https://<dominio-del-backend>
```

`API_URI` se usa **al construir**, no al arrancar: Angular resuelve
`environment.prod.ts` durante la compilación. Si la cambias, hay que volver a
desplegar para que surta efecto — no basta con reiniciar.

### 5. Cerrar el círculo

Los dos dominios se necesitan mutuamente, así que hay un orden:

1. genera los dos dominios primero;
2. pon `API_URI` en el frontend con el dominio del backend;
3. pon `CORS_ALLOWED_ORIGINS` en el backend con el dominio del frontend;
4. vuelve a desplegar los dos.

### 6. Sembrar la base la primera vez

Con `RUN_MIGRATIONS=true` las tablas se crean solas. Para los datos iniciales,
una única vez:

```bash
railway link          # elige el proyecto fantastic-smile y el servicio backend
railway run python manage.py seed_datos_iniciales
```

Después puedes dejar `RUN_MIGRATIONS=true`: si no hay migraciones pendientes no
hace nada y el arranque no se alarga.

---

## Antes del primer despliegue: una migración sin añadir a git

Esta migración está sin versionar:

```
Backend/config/apps/authenticacion/migrations/0003_alimentacion_activo_entrenamiento_activo.py
```

Railway construye desde el repositorio. Si no se sube, `migrate` no creará esas
columnas y las vistas de alimentación y entrenamiento fallarán en producción
aunque funcionen en local.

```bash
git add Backend/config/apps/authenticacion/migrations/0003_*.py
```

---

## Seguridad: hay que hacer esto

El repositorio tiene credenciales reales escritas en el código, y siguen en el
historial de git aunque ahora se lean del entorno. **Rotarlas es obligatorio
antes de exponer el sistema:**

1. **Contraseña de aplicación de Gmail** (`squk idys ttag dbck`, estaba en
   `settings.py`): revócala en la cuenta de Google, crea otra y ponla en
   `EMAIL_HOST_PASSWORD`.
2. **Clave secreta de Django**: genera una nueva y ponla en `SECRET_KEY`. La que
   estaba fija firmaba todos los tokens JWT.
3. **Claves VAPID** de las notificaciones push: regénéralas con
   `Backend/config/config/generar_vapid.py` y ponlas en `VAPID_PUBLIC_KEY` y
   `VAPID_PRIVATE_KEY`.
4. **Contraseña de la base de Railway anterior**, que quedó en un bloque
   comentado de `settings.py`: si ese servicio existe todavía, cámbiala.

Cambiar el código no basta: quien tenga una copia del repositorio tiene el
historial y con él las claves viejas.

---

## Peso del repositorio

Hay dos carpetas versionadas que se suben en cada despliegue sin aportar nada:

- `Backend/backend/` — un entorno virtual de otra máquina (8.387 ficheros,
  ~100 MB) con rutas a `C:\Users\Mendoza\...`;
- `Frontend/dist/` — el resultado de una compilación, que la imagen regenera;
- `Backend/config/static/` — 379 ficheros que `collectstatic` regenera durante
  la construcción.

El `.gitignore` nuevo evita que crezcan, pero no saca lo ya versionado:

```bash
git rm -r --cached Backend/backend Frontend/dist Backend/config/static
git commit -m "Deja de versionar el entorno virtual y los artefactos"
```

Los ficheros siguen en tu disco. Los `.dockerignore` ya los excluyen de las
imágenes, así que esto es solo para aligerar el repositorio.

---

## Comprobar que quedó bien

```bash
# el backend está vivo
curl https://<dominio-del-backend>/healthz          # {"estado": "ok"}

# nginx está vivo
curl https://<dominio-del-frontend>/healthz         # ok

# el frontend habla con el backend (mira la pestaña Red del navegador:
# las llamadas deben ir al dominio del backend, no a localhost)
```

Si el login falla con un error de CORS, es que `CORS_ALLOWED_ORIGINS` del
backend no coincide exactamente con el dominio del frontend (incluido el
`https://` y sin barra final).

---

## Variables, de un vistazo

Todas están documentadas en [.env.example](.env.example). Las imprescindibles
en Railway:

| Variable | Servicio | Para qué |
|---|---|---|
| `MYSQL_URL` | backend | conexión a la base |
| `SECRET_KEY` | backend | firma de sesiones y tokens |
| `DEBUG` | backend | **False** en producción |
| `CORS_ALLOWED_ORIGINS` | backend | dominio del frontend |
| `MEDIA_ROOT` | backend | ruta del volumen |
| `RUN_MIGRATIONS` | backend | migrar al arrancar |
| `API_URI` | frontend | dominio del backend (al construir) |
