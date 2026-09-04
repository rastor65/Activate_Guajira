# Frontend Angular de Activate Guajira.
#
# El contexto de construccion es la carpeta Frontend/. En Railway se
# corresponde con "Root Directory: Frontend".
#
# Angular compila a ficheros estaticos: node solo hace falta para construir, no
# para servir. La imagen final es un nginx con el resultado dentro.

# ---------------------------------------------------------------------------
# Etapa 1: compilar
# ---------------------------------------------------------------------------
FROM node:22-alpine AS compilacion

WORKDIR /origen

# Primero el manifiesto: mientras las dependencias no cambien, esta capa se
# reutiliza y el despliegue se salta la instalacion entera.
COPY package.json package-lock.json ./
# npm ci instala exactamente lo del lockfile, sin resolver versiones nuevas:
# el despliegue compila con las mismas dependencias que se probaron.
RUN npm ci

COPY . .

# La direccion de la API se hornea en el paquete: Angular resuelve
# environment.prod.ts al compilar, no al arrancar. Railway pasa las variables
# del servicio como argumentos de construccion, asi que basta con definir
# API_URI en el servicio del frontend. Al cambiarla hay que reconstruir.
ARG API_URI=http://localhost:8000
RUN set -eu; \
    ruta=src/environments/environment.prod.ts; \
    url="${API_URI%/}"; \
    sed -i "s|API_URI: *'[^']*'|API_URI: '${url}'|" "$ruta"; \
    grep -q "API_URI: '${url}'" "$ruta" \
      || { echo "ERROR: no se pudo fijar API_URI en $ruta"; cat "$ruta"; exit 1; }; \
    echo "API_URI compilada = ${url}"

RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2: servir
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine

# La configuracion es una plantilla porque el puerto solo se conoce al
# arrancar: Railway lo inyecta en PORT y puede cambiar entre despliegues.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
# Las cabeceras de seguridad van aparte porque hay que repetirlas en cada
# location: nginx descarta las heredadas en cuanto un location pone su propio
# add_header, y casi todos ponen Cache-Control.
COPY seguridad.conf /etc/nginx/seguridad.conf
ENV PORT=8080
# Sin este filtro envsubst sustituiria tambien las variables propias de nginx
# ($uri, $host) por cadenas vacias y la configuracion dejaria de funcionar.
ENV NGINX_ENVSUBST_FILTER=^PORT$

# El builder de Angular deja el sitio en dist/<proyecto>/browser
COPY --from=compilacion /origen/dist/app-turistica/browser /usr/share/nginx/html

EXPOSE 8080

# La imagen oficial de nginx procesa /etc/nginx/templates/*.template con
# envsubst antes de arrancar, de ahi que no haga falta un entrypoint propio.
CMD ["nginx", "-g", "daemon off;"]
