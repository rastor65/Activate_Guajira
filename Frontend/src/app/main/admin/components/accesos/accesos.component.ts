import { Component } from '@angular/core';

interface SeccionAcceso {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

/**
 * Vista unica de control de acceso.
 *
 * Roles, recursos, permisos y asignacion de roles vivian en cuatro pantallas
 * separadas, aunque en la practica se usan juntas: se crea un rol, se le dan
 * recursos y se asigna a alguien. Aqui se reunen en pestanas, reutilizando
 * los componentes que ya existian en lugar de reescribir su logica.
 */
@Component({
  standalone: false,
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css']
})
export class AccesosComponent {

  seccion: string = 'roles';

  readonly secciones: SeccionAcceso[] = [
    {
      id: 'roles',
      titulo: 'Roles',
      descripcion: 'Crea y edita los roles que agrupan permisos.',
      icono: 'pi pi-shield',
    },
    {
      id: 'recursos',
      titulo: 'Recursos',
      descripcion: 'Rutas y opciones de menu sobre las que se dan permisos.',
      icono: 'pi pi-sitemap',
    },
    {
      id: 'permisos',
      titulo: 'Permisos',
      descripcion: 'Que recursos ve cada rol.',
      icono: 'pi pi-link',
    },
    {
      id: 'usuarios',
      titulo: 'Usuarios y roles',
      descripcion: 'Que rol tiene cada usuario.',
      icono: 'pi pi-user-edit',
    },
  ];

  get seccionActual(): SeccionAcceso {
    return this.secciones.find(s => s.id === this.seccion) ?? this.secciones[0];
  }

  irA(id: string) {
    this.seccion = id;
  }
}
