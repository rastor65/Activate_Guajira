/**
 * Configuracion del cache-aside de la aplicacion.
 *
 * Cada peticion GET a la API se clasifica en una "familia" segun su ruta. La
 * familia decide cuanto tiempo vale la respuesta guardada y que otras familias
 * quedan obsoletas cuando se escribe sobre ella.
 *
 * La lista esta ordenada: gana la primera que coincide. Por eso las rutas mas
 * especificas van antes que las generales (`/roles/user_rol/` antes que
 * `/roles/`, `/api/user/menu/` antes que `/api/user/`).
 */

const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;

export interface FamiliaCache {
  /** Identificador para invalidar a mano desde un componente. */
  clave: string;
  /** Rutas (sin el origen) que pertenecen a la familia. */
  patron: RegExp;
  /** Cuanto vale la respuesta guardada, en milisegundos. */
  ttl: number;
  /**
   * Guardar tambien en sessionStorage para sobrevivir a un F5.
   * Solo para datos impersonales: nada que dependa de quien inicio sesion.
   */
  persistir?: boolean;
  /**
   * Familias que quedan obsoletas al escribir en esta. Se incluye a si misma
   * salvo que se diga lo contrario.
   */
  invalida?: string[];
}

/**
 * Rutas que nunca se guardan: autenticacion, subidas, descargas de archivos y
 * los sondeos de mantenimiento, donde una respuesta vieja es peor que ninguna.
 */
export const RUTAS_SIN_CACHE: RegExp[] = [
  /^\/api\/auth\//,
  /^\/user\/?$/,
  /^\/api\/Avatar\//,
  /\/descargar\/?$/,
  /^\/api\/subirImagen/,
  /^\/api\/registro/,
  /^\/api\/Maintenance/,
  /^\/api\/main(SesionAdmin|Sesion|Default)/,
  /^\/api\/(save|delete)-subscription/,
];

export const FAMILIAS: FamiliaCache[] = [
  // --- Parametricas: practicamente inmutables (DIVIPOLA, barrios, niveles) ---
  {
    clave: 'parametricas',
    patron: /^\/tabla_maestra\//,
    ttl: 12 * HORA,
    persistir: true,
  },
  {
    clave: 'categorias',
    patron: /^\/categoria_tipo\//,
    ttl: 12 * HORA,
    persistir: true,
    invalida: ['categorias', 'parametricas'],
  },
  {
    clave: 'generos',
    patron: /^\/genders\//,
    ttl: 12 * HORA,
    persistir: true,
  },
  {
    clave: 'documentos',
    patron: /^\/documents\//,
    ttl: 30 * MINUTO,
    persistir: true,
  },

  // --- Control de acceso: cambia poco, pero al cambiar afecta al menu ---
  {
    clave: 'menu',
    patron: /^\/api\/user\/menu/,
    ttl: 10 * MINUTO,
  },
  {
    clave: 'permisos',
    patron: /^\/resourcesr\//,
    ttl: 5 * MINUTO,
    invalida: ['permisos', 'menu'],
  },
  {
    clave: 'usuarios-roles',
    patron: /^\/roles\/user_rol/,
    ttl: 5 * MINUTO,
    invalida: ['usuarios-roles', 'usuarios', 'menu'],
  },
  {
    clave: 'recursos',
    patron: /^\/(resources|api\/resource)/,
    ttl: 30 * MINUTO,
    invalida: ['recursos', 'permisos', 'menu'],
  },
  {
    clave: 'roles',
    patron: /^\/(roles|api\/role)/,
    ttl: 30 * MINUTO,
    invalida: ['roles', 'usuarios-roles', 'permisos', 'menu'],
  },

  // --- Personas: se editan a menudo, ventana corta ---
  {
    clave: 'usuarios',
    patron: /^\/(api\/user|listusers)/,
    ttl: 2 * MINUTO,
    invalida: ['usuarios', 'personas', 'usuarios-roles'],
  },
  {
    clave: 'personas',
    patron: /^\/persons/,
    ttl: 2 * MINUTO,
    invalida: ['personas', 'usuarios'],
  },

  // --- Contenido del dia a dia ---
  {
    clave: 'mediciones',
    patron: /^\/medicion\//,
    ttl: MINUTO,
  },
  {
    clave: 'entrenamientos',
    patron: /^\/entrenamiento\//,
    ttl: 2 * MINUTO,
  },
  {
    clave: 'alimentaciones',
    patron: /^\/alimentacion\//,
    ttl: 2 * MINUTO,
  },
];

/** Familia a la que pertenece una ruta, o null si no se debe cachear. */
export function familiaDe(ruta: string): FamiliaCache | null {
  if (RUTAS_SIN_CACHE.some(p => p.test(ruta))) {
    return null;
  }
  return FAMILIAS.find(f => f.patron.test(ruta)) ?? null;
}

/** Familias que quedan obsoletas al escribir sobre una ruta. */
export function invalidadasPor(ruta: string): string[] | null {
  const familia = FAMILIAS.find(f => f.patron.test(ruta));
  if (!familia) {
    // Ruta desconocida: no se puede saber a que afecta, asi que se vacia todo.
    // Preferimos una recarga de mas antes que ensenar un dato viejo.
    return null;
  }
  return familia.invalida ?? [familia.clave];
}
