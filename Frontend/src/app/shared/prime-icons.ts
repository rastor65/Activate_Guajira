/**
 * Iconos disponibles para las opciones de menu.
 *
 * Es una seleccion, no el catalogo completo de PrimeIcons: 314 iconos en
 * una rejilla no hay quien los recorra, y la mayoria no tiene sentido como
 * rotulo de una opcion de menu. Todos estan verificados contra el CSS de
 * primeicons instalado.
 */
export interface GrupoIconos {
  titulo: string;
  iconos: string[];
}

export const GRUPOS_ICONOS: GrupoIconos[] = [
  {
    titulo: 'Navegacion',
    iconos: ['pi-home', 'pi-th-large', 'pi-compass', 'pi-map', 'pi-map-marker', 'pi-directions', 'pi-sitemap', 'pi-bars', 'pi-list'],
  },
  {
    titulo: 'Personas',
    iconos: ['pi-user', 'pi-users', 'pi-user-plus', 'pi-user-edit', 'pi-id-card', 'pi-address-book'],
  },
  {
    titulo: 'Salud y deporte',
    iconos: ['pi-heart', 'pi-heart-fill', 'pi-bolt', 'pi-stopwatch', 'pi-clock', 'pi-calendar', 'pi-chart-line', 'pi-chart-bar', 'pi-percentage'],
  },
  {
    titulo: 'Contenido',
    iconos: ['pi-file', 'pi-file-edit', 'pi-folder', 'pi-folder-open', 'pi-book', 'pi-table', 'pi-database', 'pi-images', 'pi-video', 'pi-paperclip'],
  },
  {
    titulo: 'Acciones',
    iconos: ['pi-plus', 'pi-pencil', 'pi-trash', 'pi-search', 'pi-filter', 'pi-download', 'pi-upload', 'pi-check', 'pi-times', 'pi-sync', 'pi-print', 'pi-share-alt'],
  },
  {
    titulo: 'Sistema',
    iconos: ['pi-cog', 'pi-shield', 'pi-lock', 'pi-key', 'pi-link', 'pi-bell', 'pi-envelope', 'pi-info-circle', 'pi-exclamation-triangle', 'pi-question-circle', 'pi-star', 'pi-flag', 'pi-globe', 'pi-building', 'pi-briefcase', 'pi-wallet', 'pi-megaphone'],
  },
];

/** Lista plana, para buscar. */
export const PRIME_ICONS: string[] = GRUPOS_ICONOS.flatMap(g => g.iconos);
