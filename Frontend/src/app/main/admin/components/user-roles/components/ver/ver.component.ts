import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Rol, Usuario } from 'src/app/models/user/person';
import { HttpCacheService } from 'src/app/core/cache/http-cache.service';

/**
 * Matriz de usuarios y roles.
 *
 * Antes era un autocompletado de usuario mas unas casillas que no guardaban
 * nada: enviaba el nombre de usuario y el nombre del rol donde la API espera
 * ids, y para saber que rol tenia cada quien comparaba cadenas de texto.
 *
 * Ahora es una matriz como la de permisos: cada casilla asigna o retira el rol
 * al instante, trabajando con los ids que el endpoint ya expone.
 */
@Component({
  standalone: false,
  selector: 'app-user-roles-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  cargando = false;
  busqueda = '';

  /** usuario -> rol -> id del registro UserRol, para poder retirarlo. */
  private asignaciones = new Map<number, Map<number, number>>();

  /** Casillas en curso, para bloquearlas mientras viaja la peticion. */
  private enCurso = new Set<string>();

  constructor(
    private usuariosService: UsuariosService,
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
    this.cache.invalidar('usuarios', 'roles', 'usuarios-roles');
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargando = true;

    this.usuariosService.getUsers().subscribe({
      next: (data: any) => { this.usuarios = Array.isArray(data) ? data : []; },
      error: (e) => this.avisarError('No se pudieron cargar los usuarios', e),
    });

    this.usuariosService.getRoles().subscribe({
      next: (data: any) => { this.roles = (data ?? []) as Rol[]; },
      error: (e) => this.avisarError('No se pudieron cargar los roles', e),
    });

    this.cargarAsignaciones();
  }

  private cargarAsignaciones(): void {
    this.usuariosService.getAllRoles().subscribe({
      next: (data: any) => {
        const lista = Array.isArray(data) ? data : (data?.results ?? []);
        this.asignaciones.clear();
        for (const a of lista) {
          // usuario_id y rol_id los expone el serializer junto al texto
          const usuario = a.usuario_id;
          const rol = a.rol_id;
          if (usuario == null || rol == null) {
            continue;
          }
          if (!this.asignaciones.has(usuario)) {
            this.asignaciones.set(usuario, new Map<number, number>());
          }
          this.asignaciones.get(usuario)!.set(rol, a.id);
        }
        this.cargando = false;
      },
      error: (e) => {
        this.cargando = false;
        this.avisarError('No se pudieron cargar las asignaciones', e);
      },
    });
  }

  // --- Listado -------------------------------------------------------------

  get usuariosFiltrados(): Usuario[] {
    const filtro = this.busqueda.trim().toLowerCase();
    if (!filtro) {
      return this.usuarios;
    }
    return this.usuarios.filter(u =>
      [u.username, u.email, u.first_name, u.last_name]
        .some(c => (c ?? '').toLowerCase().includes(filtro))
    );
  }

  nombreCompleto(usuario: any): string {
    const completo = [usuario?.first_name, usuario?.last_name]
      .filter(Boolean).join(' ').trim();
    return completo || usuario?.username || '—';
  }

  inicialesDe(usuario: any): string {
    const nombre = (usuario?.first_name || '').trim();
    const apellido = (usuario?.last_name || '').trim();
    if (nombre || apellido) {
      return ((nombre[0] ?? '') + (apellido[0] ?? '')).toUpperCase();
    }
    return (usuario?.username ?? '?').charAt(0).toUpperCase();
  }

  // --- Estado de una casilla -----------------------------------------------

  private clave(usuario: number, rol: number): string {
    return `${usuario}:${rol}`;
  }

  tieneRol(usuario: number, rol: number): boolean {
    return this.asignaciones.get(usuario)?.has(rol) ?? false;
  }

  ocupada(usuario: number, rol: number): boolean {
    return this.enCurso.has(this.clave(usuario, rol));
  }

  /** Cuantos usuarios tienen un rol, para la cabecera. */
  totalDeRol(rol: number): number {
    let total = 0;
    for (const porUsuario of this.asignaciones.values()) {
      if (porUsuario.has(rol)) {
        total++;
      }
    }
    return total;
  }

  /** Cuantos roles tiene un usuario, para avisar de los que no tienen ninguno. */
  totalDeUsuario(usuario: number): number {
    return this.asignaciones.get(usuario)?.size ?? 0;
  }

  // --- Asignar y retirar ---------------------------------------------------

  alternar(usuario: any, rol: any): void {
    const clave = this.clave(usuario.id, rol.id);
    if (this.enCurso.has(clave)) {
      return;
    }
    this.enCurso.add(clave);

    const idAsignacion = this.asignaciones.get(usuario.id)?.get(rol.id);

    if (idAsignacion !== undefined) {
      this.retirar(usuario, rol, idAsignacion, clave);
    } else {
      this.asignar(usuario, rol, clave);
    }
  }

  private asignar(usuario: any, rol: any, clave: string): void {
    // La API espera ids, no nombres: era el motivo de que no guardara nada
    const cuerpo = JSON.stringify({ status: true, userId: usuario.id, rolesId: rol.id });
    const opciones = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    this.usuariosService.asignarRoles(cuerpo, opciones).subscribe({
      next: (creado: any) => {
        if (!this.asignaciones.has(usuario.id)) {
          this.asignaciones.set(usuario.id, new Map<number, number>());
        }
        this.asignaciones.get(usuario.id)!.set(rol.id, creado?.id);
        this.enCurso.delete(clave);
        this.messageService.add({
          severity: 'success',
          summary: 'Rol asignado',
          detail: `${usuario.username} ahora es ${rol.name}.`,
        });
      },
      error: (e) => {
        this.enCurso.delete(clave);
        this.avisarError(`No se pudo asignar ${rol.name}`, e);
      },
    });
  }

  private retirar(usuario: any, rol: any, idAsignacion: number, clave: string): void {
    if (idAsignacion === undefined || idAsignacion === null) {
      this.enCurso.delete(clave);
      this.cargarAsignaciones();
      return;
    }

    this.usuariosService.deleteUserRole(idAsignacion).subscribe({
      next: () => {
        this.asignaciones.get(usuario.id)?.delete(rol.id);
        this.enCurso.delete(clave);
        this.messageService.add({
          severity: 'info',
          summary: 'Rol retirado',
          detail: `${usuario.username} ya no es ${rol.name}.`,
        });
      },
      error: (e) => {
        this.enCurso.delete(clave);
        this.avisarError(`No se pudo retirar ${rol.name}`, e);
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
}
