import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Usuario, Rol, UserRole } from 'src/app/models/user/person';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})

export class VerComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuarioSeleccionado: Usuario = {} as Usuario;
  AllRoles: any[] = [];
  usuarioRolesMap: Map<string, string[]> = new Map<string, string[]>();
  filteredUsuarios: Usuario[] = [];
  rolesSeleccionados: number[] = [];
  nuevosRolesSeleccionados: number[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.usuariosService.getUsers().subscribe(data => {
      this.usuarios = data as any;
      console.log("Usuarios: ", this.usuarios);
    });
  
    this.usuariosService.getRoles().subscribe(data => {
      this.roles = data as Rol[];
      console.log("Roles: ", this.roles);
    });
  
    this.getRol(); // SOLO llama getRol aquí
  }
  

  searchUsuarios(event: { query: string }): void {
    const filtered: Usuario[] = this.usuarios.filter(usuario =>
      usuario.username.toLowerCase().includes(event.query.toLowerCase())
    );
    this.filteredUsuarios = filtered;
  }

  getRol() {
    this.usuariosService.getAllRoles().subscribe(response => {
      this.AllRoles = response as any;
      this.procesarRoles();
    });
  }  

  procesarRoles() {
    console.log('Iniciando procesarRoles con el nuevo formato...');
    this.usuarioRolesMap.clear();
    console.log('usuarioRolesMap limpiado.');

    this.AllRoles.forEach((userRole: any, index: number) => {
      console.log(`Procesando asignación ${index}:`, userRole);

      const usuarioEmail = userRole.userId;   // ahora es el email
      const rolName = userRole.rolesId;        // ahora es el nombre del rol directamente

      if (this.usuarioRolesMap.has(usuarioEmail)) {
        const rolesExistente = this.usuarioRolesMap.get(usuarioEmail) || [];
        rolesExistente.push(rolName);
        this.usuarioRolesMap.set(usuarioEmail, Array.from(new Set(rolesExistente)));
      } else {
        this.usuarioRolesMap.set(usuarioEmail, [rolName]);
      }
    });

    console.log('Mapa usuarioRolesMap final:', this.usuarioRolesMap);

    // Actualizar rolesSeleccionados con los roles del usuario seleccionado
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.username) {
      const rolesDelUsuarioSeleccionado = this.usuarioRolesMap.get(this.usuarioSeleccionado.username) || [];
      console.log(`Roles actuales del usuario seleccionado (${this.usuarioSeleccionado.username}):`, rolesDelUsuarioSeleccionado);

      this.rolesSeleccionados = rolesDelUsuarioSeleccionado.map((rolNombre: string) => {
        const rolEncontrado = this.roles.find((rol) => rol.name === rolNombre);
        return rolEncontrado ? rolEncontrado.id : null;
      }).filter(id => id !== null) as number[];

      console.log('IDs de roles seleccionados:', this.rolesSeleccionados);
    }
  }

  onUsuarioSelect(event: any) {
    this.usuarioSeleccionado = event;

    // Primero asegurarse de que AllRoles ya está cargado
    if (this.AllRoles.length > 0) {
      const rolesDelUsuario = this.usuarioRolesMap.get(this.usuarioSeleccionado.username) || [];

      this.rolesSeleccionados = rolesDelUsuario.map((rolNombre: string) => {
        const rolEncontrado = this.roles.find((rol) => rol.name === rolNombre);
        return rolEncontrado ? rolEncontrado.id : null;
      }).filter(id => id !== null) as number[];

      console.log('Roles seleccionados al elegir usuario:', this.rolesSeleccionados);
    }
  }

  getAllRolesForUsuario(usuarioEmail: string): number[] {
    const rolesSeleccionados: number[] = [];

    this.AllRoles.forEach((userRole: any) => {
      if (userRole.userId === usuarioEmail) {
        const rolEncontrado = this.roles.find((rol) => rol.name === userRole.rolesId);
        if (rolEncontrado) {
          rolesSeleccionados.push(rolEncontrado.id);
        }
      }
    });

    return rolesSeleccionados;
  }

  isRolSelected(rol: any): boolean {
    return this.rolesSeleccionados.some((selectedRoleId) => selectedRoleId === rol.id);
  }

  onRolChange(rol: any, isChecked: boolean) {
    const rolId = Number(rol.id);
    const rolName = rol.name; // importante: ahora necesitamos el nombre
    const usuarioEmail = this.usuarioSeleccionado.username;

    if (isChecked) {
      // Si el rol no estaba seleccionado previamente, agregarlo
      if (!this.rolesSeleccionados.includes(rolId)) {
        this.rolesSeleccionados.push(rolId);

        const existingUserRole = this.buscarUserRole(usuarioEmail, rolName);

        if (!existingUserRole) {
          const body = {
            status: true,
            userId: usuarioEmail,
            rolesId: rolName
          };

          const bodyString = JSON.stringify(body);
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };

          this.usuariosService.asignarRoles(bodyString, httpOptions).subscribe(
            response => {
              this.messageService.add({ severity: 'success', summary: `Rol asignado satisfactoriamente` });
              this.getRol(); // Recargar los roles después de asignar
            },
            error => {
              console.error("Error al asignar el rol", error);
              this.messageService.add({ severity: 'error', summary: 'Error al asignar el rol' });
            }
          );
        }
      }
    } else {
      // Si se desmarca un rol
      const index = this.rolesSeleccionados.indexOf(rolId);
      if (index !== -1) {
        this.rolesSeleccionados.splice(index, 1);

        const userRoleAEliminar = this.buscarUserRole(usuarioEmail, rolName);
        if (!userRoleAEliminar) {
          console.error('No se encontró ningún registro de user_roles coincidente');
          return;
        }

        const userRoleId = userRoleAEliminar.id;

        this.usuariosService.deleteUserRole(userRoleId).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: `Rol eliminado satisfactoriamente` });
            this.getRol(); // Recargar los roles después de eliminar
          },
          (error: HttpErrorResponse) => {
            console.error('Error al eliminar el user_roles', error);
            this.messageService.add({ severity: 'error', summary: 'Error al eliminar el rol' });
          }
        );
      }
    }
  }

  asignarRol() {
    if (this.rolesSeleccionados.length === 0) {
      return;
    }

    const rolId = this.rolesSeleccionados[this.rolesSeleccionados.length - 1]; // Obtener el último rol seleccionado

    const rol = this.roles.find(r => r.id === rolId);
    if (!rol) {
      console.error("No se encontró el rol con ID:", rolId);
      return;
    }

    const existingUserRole = this.buscarUserRole(this.usuarioSeleccionado.username, rol.name);

    if (existingUserRole) {
      if (!existingUserRole.status) {
        existingUserRole.status = true;
        const userRoleId = existingUserRole.id;
        this.actualizarUserRole(userRoleId, existingUserRole);
      }
    } else {
      // Si el rol no existe, agregarlo como un nuevo registro
      const body = {
        status: true,
        userId: this.usuarioSeleccionado.username, // correo aquí, no id
        rolesId: rol.name // nombre del rol, no id
      };

      const bodyString = JSON.stringify(body);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.usuariosService.asignarRoles(bodyString, httpOptions).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: `Rol asignado satisfactoriamente` });
          this.getRol(); // Recargar roles después de agregar
        },
        error => {
          console.error("Error al asignar el rol", error);
          this.messageService.add({ severity: 'error', summary: 'Error al asignar el rol' });
        }
      );
    }
  }
  actualizarUserRole(userRoleId: number, updatedUserRole: UserRole) {
    const body = {
      status: updatedUserRole.status,
      userId: updatedUserRole.userId,     // correo directamente
      rolesId: updatedUserRole.rolesId    // nombre del rol directamente
    };

    const bodyString = JSON.stringify(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.usuariosService.actualizarUserRole(userRoleId, bodyString, httpOptions).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: `Rol actualizado satisfactoriamente` });

        // Recargar los roles del usuario después de actualizar el estado del rol
        this.getRol();
      },
      error => {
        console.error("Error al actualizar el rol", error);
        this.messageService.add({ severity: 'error', summary: 'Error al actualizar el rol' });
      }
    );
  }

  buscarUserRole(usuarioEmail: string, rolName: string): any | undefined {
    return this.AllRoles.find((userRole: any) =>
      userRole.userId === usuarioEmail && userRole.rolesId === rolName
    );
  }

  deleteUserRole(rol: any) {
    const usuarioEmailSeleccionado = this.usuarioSeleccionado.username; // ahora sí el correo
    const rolNameSeleccionado = rol.name; // el nombre del rol

    const userRoleAEliminar = this.buscarUserRole(usuarioEmailSeleccionado, rolNameSeleccionado);

    if (!userRoleAEliminar) {
      console.error('No se encontró ningún registro de user_roles coincidente');
      return;
    }

    const userRoleId = userRoleAEliminar.id;

    this.usuariosService.deleteUserRole(userRoleId).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: `Rol eliminado satisfactoriamente` });
        this.getRol(); // Recargar roles
      },
      (error: HttpErrorResponse) => {
        console.error('Error al eliminar el user_roles', error);
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar el rol' });
      }
    );
  }

}

