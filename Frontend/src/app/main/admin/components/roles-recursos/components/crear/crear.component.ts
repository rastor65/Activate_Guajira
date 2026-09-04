import { Component, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/core/services/admin/recursos.service';
import { RolesService } from 'src/app/core/services/admin/roles.service';
import { RecursosRolesService } from 'src/app/core/services/admin/recursos-roles.service';
import { MessageService } from 'primeng/api';
import { HttpCacheService } from 'src/app/core/cache/http-cache.service';

/**
 * Matriz de permisos: que recursos ve cada rol.
 *
 * Antes esto era un formulario de "elige rol, elige recurso, asignar" mas una
 * matriz de solo lectura debajo. Habia que mirar la matriz para saber que
 * faltaba y volver arriba a rellenar el formulario, y no habia forma de
 * retirar un permiso. Ahora la matriz es la interfaz: cada casilla concede o
 * retira el acceso.
 */
@Component({
  standalone: false,
  selector: 'app-roles-recursos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  roles: any[] = [];
  resources: any[] = [];
  cargando = false;

  /** recurso -> rol -> id del registro ResourceRol, para poder retirarlo. */
  private permisos = new Map<number, Map<number, number>>();

  /** Casillas en curso, para bloquearlas mientras viaja la peticion. */
  private enCurso = new Set<string>();

  constructor(
    private recursosService: RecursosService,
    private rolesService: RolesService,
    private recursosRolesService: RecursosRolesService,
    private messageService: MessageService,
    private cache: HttpCacheService,
  ) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

  /**
   * Recarga a peticion del usuario: descarta lo guardado para que la
   * siguiente lectura vaya al servidor. Es la unica via para saltarse el
   * cache; entrar a la vista se sirve de memoria.
   */
  recargar(): void {
    this.cache.invalidar('recursos', 'roles', 'permisos');
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargando = true;

    this.rolesService.getRoles().subscribe({
      next: (data) => { this.roles = data ?? []; },
      error: (e) => this.avisarError('No se pudieron cargar los roles', e),
    });

    this.recursosService.getResources().subscribe({
      next: (data) => {
        this.resources = this.buildResourceHierarchy(data ?? []);
        this.cargarPermisos();
      },
      error: (e) => {
        this.cargando = false;
        this.avisarError('No se pudieron cargar los recursos', e);
      },
    });
  }

  private cargarPermisos(): void {
    this.recursosRolesService.getAssignedRolesToResources().subscribe({
      next: (data) => {
        this.permisos.clear();
        for (const p of data ?? []) {
          if (!this.permisos.has(p.resource)) {
            this.permisos.set(p.resource, new Map<number, number>());
          }
          this.permisos.get(p.resource)!.set(p.role, p.id);
        }
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        this.avisarError('No se pudieron cargar los permisos', e);
      },
    });
  }

  // --- Estado de una casilla -----------------------------------------------

  private clave(rol: number, recurso: number): string {
    return `${rol}:${recurso}`;
  }

  hasAccess(rol: number, recurso: number): boolean {
    return this.permisos.get(recurso)?.has(rol) ?? false;
  }

  ocupada(rol: number, recurso: number): boolean {
    return this.enCurso.has(this.clave(rol, recurso));
  }

  /** Cuantos recursos tiene concedidos un rol, para la cabecera. */
  totalDeRol(rol: number): number {
    let total = 0;
    for (const porRol of this.permisos.values()) {
      if (porRol.has(rol)) {
        total++;
      }
    }
    return total;
  }

  // --- Conceder y retirar --------------------------------------------------

  alternar(rol: any, recurso: any): void {
    const clave = this.clave(rol.id, recurso.id);
    if (this.enCurso.has(clave)) {
      return;
    }
    this.enCurso.add(clave);

    const idPermiso = this.permisos.get(recurso.id)?.get(rol.id);

    if (idPermiso !== undefined) {
      this.retirar(rol, recurso, idPermiso, clave);
    } else {
      this.conceder(rol, recurso, clave);
    }
  }

  private conceder(rol: any, recurso: any, clave: string): void {
    this.recursosRolesService.assignResourceToRole(recurso.id, rol.id).subscribe({
      next: (creado) => {
        if (!this.permisos.has(recurso.id)) {
          this.permisos.set(recurso.id, new Map<number, number>());
        }
        // Se guarda el id devuelto: hace falta para poder retirarlo despues
        this.permisos.get(recurso.id)!.set(rol.id, creado?.id ?? creado?.data?.id);
        this.enCurso.delete(clave);
        this.messageService.add({
          severity: 'success',
          summary: 'Acceso concedido',
          detail: `${rol.name} ya puede ver ${recurso.titulo}.`,
        });
      },
      error: (e) => {
        this.enCurso.delete(clave);
        this.avisarError(`No se pudo dar acceso a ${recurso.titulo}`, e);
      },
    });
  }

  private retirar(rol: any, recurso: any, idPermiso: number, clave: string): void {
    if (idPermiso === undefined || idPermiso === null) {
      // Sin id no hay forma de identificar el registro: se recarga
      this.enCurso.delete(clave);
      this.cargarPermisos();
      return;
    }

    this.recursosRolesService.deleteResourceFromRole(idPermiso).subscribe({
      next: () => {
        this.permisos.get(recurso.id)?.delete(rol.id);
        this.enCurso.delete(clave);
        this.messageService.add({
          severity: 'info',
          summary: 'Acceso retirado',
          detail: `${rol.name} ya no ve ${recurso.titulo}.`,
        });
      },
      error: (e) => {
        this.enCurso.delete(clave);
        this.avisarError(`No se pudo retirar el acceso a ${recurso.titulo}`, e);
      },
    });
  }

  private avisarError(resumen: string, error: any): void {
    console.error(resumen, error);
    this.messageService.add({
      severity: 'error',
      summary: resumen,
      detail: `Error ${error?.status ?? 'desconocido'} al contactar el servidor.`,
    });
  }

  // --- Jerarquia de recursos -----------------------------------------------

  buildResourceHierarchy(resources: any[]): any[] {
    const porId: { [id: number]: any } = {};
    const raiz: any[] = [];

    resources.forEach(r => {
      porId[r.id] = r;
      r.children = [];
    });

    resources.forEach(r => {
      if (!r.id_padre) {
        raiz.push(r);
      } else {
        // Si el padre no existe, se sube a primer nivel para no perder la fila
        const padre = porId[r.id_padre];
        padre ? padre.children.push(r) : raiz.push(r);
      }
    });

    return raiz;
  }

  /** Lista plana con el nivel de cada recurso, para sangrar la primera columna. */
  get filas(): { recurso: any; nivel: number }[] {
    const salida: { recurso: any; nivel: number }[] = [];

    const recorrer = (lista: any[], nivel: number) => {
      for (const r of lista) {
        salida.push({ recurso: r, nivel });
        if (r.children?.length) {
          recorrer(r.children, nivel + 1);
        }
      }
    };

    recorrer(this.resources, 0);
    return salida;
  }
}
