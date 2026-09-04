import { Injectable } from '@angular/core';
import { HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FAMILIAS, FamiliaCache, familiaDe, invalidadasPor } from './cache-config';

/**
 * Marca una peticion para que ignore el cache y vaya siempre al servidor.
 * Se usa en los botones de "Recargar": el usuario pide datos frescos.
 */
export const SIN_CACHE = new HttpContextToken<boolean>(() => false);

/** Atajo para pasarlo a HttpClient: `this.http.get(url, sinCache())`. */
export function sinCache(): { context: HttpContext } {
  return { context: new HttpContext().set(SIN_CACHE, true) };
}

interface Entrada {
  familia: string;
  cuerpo: unknown;
  expira: number;
}

const CLAVE_ALMACEN = 'ag:cache:v1';

/**
 * Almacen del patron cache-aside.
 *
 * Antes cada vista pedia sus listas al entrar, aunque acabara de salir de ella:
 * el mismo listado de municipios viajaba una y otra vez. Ahora la vista pregunta
 * primero aqui y solo baja del servidor lo que falta o lo que caduco.
 *
 * Dos piezas hacen que no se sirvan datos viejos:
 *  - cada familia tiene su propio tiempo de vida (ver cache-config.ts);
 *  - cualquier escritura invalida las familias afectadas al instante, de modo
 *    que lo que el propio usuario acaba de cambiar se vuelve a pedir.
 */
@Injectable({ providedIn: 'root' })
export class HttpCacheService {

  private entradas = new Map<string, Entrada>();

  /**
   * Peticiones en vuelo. Dos vistas que arrancan a la vez y piden la misma
   * lista comparten una sola llamada en lugar de duplicarla.
   */
  private enVuelo = new Map<string, Observable<unknown>>();

  private aciertos = 0;
  private fallos = 0;

  constructor() {
    this.rehidratar();
  }

  // --- Lectura -------------------------------------------------------------

  /** Cuerpo guardado y todavia vigente, o undefined si hay que pedirlo. */
  leer(clave: string): unknown | undefined {
    const entrada = this.entradas.get(clave);
    if (!entrada) {
      this.fallos++;
      return undefined;
    }
    if (entrada.expira <= Date.now()) {
      this.entradas.delete(clave);
      this.fallos++;
      return undefined;
    }
    this.aciertos++;
    // Se devuelve una copia: si la vista ordena o modifica la lista que recibe,
    // no debe corromper lo que queda guardado para las demas.
    return this.copiar(entrada.cuerpo);
  }

  // --- Escritura -----------------------------------------------------------

  guardar(clave: string, ruta: string, cuerpo: unknown): void {
    const familia = familiaDe(ruta);
    if (!familia) {
      return;
    }
    this.entradas.set(clave, {
      familia: familia.clave,
      cuerpo: this.copiar(cuerpo),
      expira: Date.now() + familia.ttl,
    });
    if (familia.persistir) {
      this.persistir();
    }
  }

  // --- Peticiones en vuelo -------------------------------------------------

  enCurso(clave: string): Observable<unknown> | undefined {
    return this.enVuelo.get(clave);
  }

  registrarEnCurso(clave: string, peticion: Observable<unknown>): void {
    this.enVuelo.set(clave, peticion);
  }

  terminarEnCurso(clave: string): void {
    this.enVuelo.delete(clave);
  }

  // --- Invalidacion --------------------------------------------------------

  /**
   * Descarta las familias indicadas. Sin argumentos no hace nada: para vaciarlo
   * todo esta `limpiar()`, que es una decision distinta y conviene que se lea.
   */
  invalidar(...familias: string[]): void {
    if (!familias.length) {
      return;
    }
    const afectadas = new Set(familias);
    for (const [clave, entrada] of this.entradas) {
      if (afectadas.has(entrada.familia)) {
        this.entradas.delete(clave);
      }
    }
    this.persistir();
  }

  /** Invalida lo que queda obsoleto tras escribir en una ruta. */
  invalidarPorEscritura(ruta: string): void {
    const familias = invalidadasPor(ruta);
    if (familias === null) {
      this.limpiar();
      return;
    }
    this.invalidar(...familias);
  }

  /** Vacia el cache entero. Se llama al entrar y al salir de la sesion. */
  limpiar(): void {
    this.entradas.clear();
    this.enVuelo.clear();
    this.aciertos = 0;
    this.fallos = 0;
    try {
      sessionStorage.removeItem(CLAVE_ALMACEN);
    } catch {
      // Navegacion privada o almacenamiento bloqueado: el cache en memoria basta.
    }
  }

  /** Cifras de uso, utiles al depurar. */
  estadisticas(): { aciertos: number; fallos: number; entradas: number } {
    return { aciertos: this.aciertos, fallos: this.fallos, entradas: this.entradas.size };
  }

  // --- Persistencia --------------------------------------------------------

  private familia(clave: string): FamiliaCache | undefined {
    return FAMILIAS.find(f => f.clave === clave);
  }

  /**
   * Solo se persisten las familias marcadas: parametricas y catalogos, que son
   * grandes, estables e iguales para todo el mundo. Nada de datos personales.
   */
  private persistir(): void {
    const guardables: Record<string, Entrada> = {};
    for (const [clave, entrada] of this.entradas) {
      if (this.familia(entrada.familia)?.persistir) {
        guardables[clave] = entrada;
      }
    }
    try {
      sessionStorage.setItem(CLAVE_ALMACEN, JSON.stringify(guardables));
    } catch {
      // Sin cuota o sin permiso: se sigue funcionando solo con memoria.
    }
  }

  private rehidratar(): void {
    try {
      const crudo = sessionStorage.getItem(CLAVE_ALMACEN);
      if (!crudo) {
        return;
      }
      const guardadas = JSON.parse(crudo) as Record<string, Entrada>;
      const ahora = Date.now();
      for (const [clave, entrada] of Object.entries(guardadas)) {
        if (entrada?.expira > ahora) {
          this.entradas.set(clave, entrada);
        }
      }
    } catch {
      // Formato viejo o corrupto: se empieza de cero, no es un error grave.
      try { sessionStorage.removeItem(CLAVE_ALMACEN); } catch { /* ignorar */ }
    }
  }

  private copiar(valor: unknown): unknown {
    if (valor === null || typeof valor !== 'object') {
      return valor;
    }
    try {
      return structuredClone(valor);
    } catch {
      return JSON.parse(JSON.stringify(valor));
    }
  }
}
