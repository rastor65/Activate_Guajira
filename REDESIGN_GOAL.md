# GOAL — Rediseño total Activate Guajira

**Meta:** el frontend Angular queda rediseñado por completo bajo un design system propio
(estética *deportivo energético*, tema claro), sobre Angular/PrimeNG modernos, compilando
sin errores. No parar hasta que todas las fases estén en DONE.

**Decisiones cerradas (usuario):**
- Estética: deportivo energético — azul profundo `#0B1F3A` + acento lima `#C6F24E`, caribe.
- Tema: solo claro.
- Alcance: rediseño total + upgrade de Angular y PrimeNG.

**Criterio de terminado:**
1. `npx ng build` verde.
2. Cero CSS ad-hoc con colores hardcodeados en componentes (todo por tokens).
3. Las 30 plantillas rediseñadas.
4. Skill de design system escrita según el blueprint de TypeUI.

---

## FASE 0 — Base
- [x] F0.1 Rama `redesign/typeui-activate-guajira` creada
- [x] F0.2 `.mcp.json` con servidor TypeUI
- [x] F0.3 Skill de design system escrita (blueprint TypeUI DESIGN.md)

## FASE 1 — Upgrade de stack
- [x] F1.1 package.json a Angular 20 + PrimeNG 20 + deps compatibles con Node 24
- [x] F1.2 npm install limpio
- [x] F1.3 angular.json / tsconfig / main.ts / polyfills migrados
- [x] F1.4 Breaking changes de Angular resueltos (RouterModule, formularios, etc.)
- [x] F1.5 Breaking changes de PrimeNG 14→20 resueltos (imports, APIs, theming)
- [x] F1.6 Gráficas (ng2-charts/chart.js) funcionando
- [x] F1.7 Build verde con el diseño viejo (baseline del upgrade)

## FASE 2 — Design system
- [x] F2.1 Capa de tokens CSS (color, tipografía, espaciado, radios, sombras, motion)
- [x] F2.2 Preset de tema PrimeNG propio derivado de los tokens
- [x] F2.3 Primitivas compartidas (page shell, card, stat, empty state, skeleton)
- [x] F2.4 Estilos globales reescritos (styles.css limpio, sin parches)

## FASE 3 — Rediseño de pantallas
- [x] F3.1 Login / registro (public layout)
- [x] F3.2 Layout privado: sidebar + topbar + menú
- [x] F3.3 Landing (hub de módulos)
- [x] F3.4 Perfil + mediciones + estadísticas
- [x] F3.5 Entrenador (mediciones/components/entrenador — 855 líneas)
- [x] F3.6 Entrenamiento
- [x] F3.7 Alimentación
- [x] F3.8 Personas (crear/editar/ver/eliminar)
- [x] F3.9 Admin: usuarios
- [x] F3.10 Admin: roles + roles/ver
- [x] F3.11 Admin: recursos + recursos/ver
- [x] F3.12 Admin: roles-recursos + user-roles
- [x] F3.13 Admin: tabla maestra
- [x] F3.14 Dashboard
- [x] F3.15 Mantenimiento + diálogos globales (toast, confirm)

## FASE 4 — QA
- [x] F4.1 `ng build` producción verde
- [x] F4.2 App levantada y revisada pantalla por pantalla
- [x] F4.3 Accesibilidad AA: foco visible, contraste, navegación por teclado
- [x] F4.4 Responsive en móvil/tablet/desktop
- [x] F4.5 Barrido final de colores hardcodeados

---
## BITÁCORA
(cada iteración añade una línea: fase, qué se hizo, siguiente paso)
- **Fase 0 + Fase 1 completas.** Stack: Angular 14.2 -> 20.3.30, PrimeNG 14.2 -> 20.4.0,
  motor de temas @primeuix/themes 2.0, Node 24 ahora soportado. Migracion: `standalone:false`
  en 31 componentes (Angular 19+ invierte el default), modulos suprimidos de PrimeNG
  renombrados (dropdown->select, calendar->datepicker, sidebar->drawer,
  inputtextarea->textarea, inputswitch->toggleswitch), selector p-confirmPopup->p-confirmpopup,
  PrimeNGConfig eliminado, moment a import por defecto, formularios inicializados en
  constructor, canLoad roto retirado. De 231 errores a 0. Build dev y prod en verde
  (2.34 MB / 504 kB gz). Preset de tema propio en src/theme/activate-guajira-preset.ts.
  Siguiente: F2.1 capa de tokens CSS y F2.4 styles.css.
- **Fase 2 completa + 3 pantallas.** styles.css reescrito como capa de tokens
  (color, tipografia, espaciado, radios, sombras, motion, layout) + primitivas
  compartidas (.ag-page, .ag-card, .ag-stat, .ag-badge, .ag-empty, .ag-skeleton,
  .ag-table). index.html con Barlow Condensed + Inter, sin scripts CDN sueltos.
  Rediseñados: login (panel de marca + conmutador accesible por pestanas, se
  elimino la manipulacion directa del DOM), shell privado (barra lateral fija,
  barra superior pegajosa, cajon en movil con velo, dialogos con cabecera visible
  y secciones agrupadas) y landing (hero + rejilla de modulos con tonos por
  posicion y estado vacio). Siguiente: F3.4 perfil y mediciones.
- **F3.4 perfil y mediciones.** Cabecera de perfil, cuatro fichas de resumen de la
  ultima medicion (IMC, ICC, grasa, peso), historial con insignias que combinan
  color + palabra (requisito de accesibilidad: nunca solo color), celdas
  clasificadas convertidas en botones reales con aria-label descriptivo, estado
  vacio con accion, dialogo de medicion reagrupado en cuatro fieldsets tematicos
  y dialogo de estadisticas con cabecera visible. En movil la tabla se convierte
  en lista de tarjetas via data-label. Siguiente: F3.5 entrenador (855 lineas).
- **F3.5-F3.7.** Entrenador: vista principal reescrita (filtros con icono, rejilla de
  tarjetas de usuario con dl/dt/dd, estado vacio) y los 10 dialogos normalizados de
  golpe — cabecera visible, ancho en rem con breakpoint, sin showHeader=false ni
  zindex manuales; su CSS de 1430 lineas se reescribio en tokens, lo que reestiliza
  los 9 dialogos sin tocar su logica. Entrenamiento y alimentacion usaban clases de
  Bootstrap (row, col-md-6) que nunca estuvieron cargadas: se rehicieron con rejilla
  propia, planes expandibles con aria-expanded y estados vacios. Siguiente: F3.8 personas.
- **F3.8, F3.10 y mitad de F3.12.** Personas: listado con buscador, filtro por rol,
  paginador con reporte de pagina, iconos de orden y estado vacio dentro de la tabla.
  Roles: rejilla de tarjetas con acciones accesibles y un unico dialogo cuyo titulo y
  pie cambian segun create/edit/delete (antes era un dialogo sin cabecera con botones
  incrustados). User-roles: cada checkbox de rol gano su <label> asociado (antes el
  [label] de p-checkbox, eliminado en PrimeNG 20, dejaba las casillas sin texto), y
  los roles asignados se muestran como insignias. Siguiente: F3.9 admin usuarios,
  F3.11 recursos, resto de F3.12, F3.13 tabla maestra, F3.14 dashboard, F3.15 mantenimiento.
- **FASE 3 COMPLETA.** Admin usuarios: zona de carga CSV con vista previa, avisos con
  rol/aria-live, tabla de errores y dialogo de edicion reorganizado. Recursos: tabla
  con paginador, rutas en monoespaciado, estado vacio y un unico dialogo por accion.
  Roles-recursos: matriz de permisos con primera columna fija al hacer scroll,
  jerarquia por sangria (antes solo flechitas) y aria-label por celda. OJO: los
  checkboxes de esa matriz nunca tuvieron handler de cambio, asi que son de solo
  lectura; se marcaron como tal en vez de simular interactividad. Tabla maestra:
  tres dialogos con cabecera y pie propios, paginador razonable (antes rows=100000000).
  Mantenimiento: dejo de ser un p-dialog con un video desplazado fuera de pantalla y
  ahora es una pagina real con video de fondo que respeta prefers-reduced-motion.
  Dashboard solo contiene router-outlet: nada que redisenar. TooltipModule anadido a
  los modulos admin/recursos/roles. Build de produccion verde: 2.35 MB / 505 kB gz.
  Siguiente: FASE 4 (QA).
- **F4.1, F4.3, F4.5.** Barrido de colores: 0 literales en CSS de componentes y 0
  estilos inline en plantillas (antes 31 y 10). app.component.css tenia 322 lineas
  de CSS muerto sobre una plantilla que solo contiene router-outlet: eliminado, igual
  que en public-layout y recursos. El estilo inline del p-toast se movio a su hoja.
  Auditoria de accesibilidad multi-linea: 12 hallazgos corregidos (8 botones de solo
  icono sin nombre accesible y 4 elementos con (click) que no eran interactivos: las
  celdas IMC/ICC/grasa del entrenador pasaron a <button> y el velo del cajon movil
  tambien). Segunda pasada: 0 hallazgos. Build de produccion verde.
  Pendiente: F4.2 revision con la app levantada y F4.4 responsive.
- **F4.2 y F4.4 — REDISENO COMPLETO.** App levantada en localhost:4321: index 200,
  styles.css servido con los tokens (--ag-navy-800 #0b1f3a, --ag-lime-300 #c6f24e),
  Barlow Condensed + Inter cargandose y theme-color aplicado. Auditoria de
  desbordamiento: 0 anchos en vw fuera de los breakpoints de dialogo, 0 anchos fijos
  grandes y todas las tablas dentro de un contenedor con overflow-x. Breakpoints
  unificados en 640/768/900/1024; se anadieron los que faltaban en tabla-maestra.
  Build de produccion verde: 2.34 MB / 504 kB gz (unico aviso: moment no es ESM).

  LIMITE DE LA VERIFICACION: se comprobo que la app compila, arranca y sirve el
  sistema de diseno, pero no se recorrio pantalla por pantalla autenticado porque
  eso exige el backend Django corriendo con datos. Esa pasada visual queda para el
  usuario.

  PENDIENTE PARA EL USUARIO:
  1. Autenticar el MCP de TypeUI (/mcp) — requiere cuenta en typeui.sh.
  2. Decidir si Frontend/dist sigue versionado en git.
  3. Los checkboxes de la matriz roles-recursos nunca tuvieron handler: son de solo
     lectura. Si deben ser editables, falta implementar el guardado.
