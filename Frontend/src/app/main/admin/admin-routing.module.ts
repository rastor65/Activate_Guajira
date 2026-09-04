import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { RolesComponent } from './components/roles/roles.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { TablaMaestraComponent } from './components/tabla-maestra/tabla-maestra.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AccesosComponent } from './components/accesos/accesos.component';

const routes: Routes = [
  // Roles, recursos, permisos y asignaciones se gestionan en una sola vista.
  // Las rutas antiguas redirigen ahi para no romper enlaces guardados.
  {
    path: 'accesos',
    component: AccesosComponent
  },
  { path: 'roles', redirectTo: 'accesos', pathMatch: 'prefix' },
  { path: 'recursos', redirectTo: 'accesos', pathMatch: 'prefix' },
  { path: 'recursos_roles', redirectTo: 'accesos', pathMatch: 'prefix' },
  { path: 'user_roles', redirectTo: 'accesos', pathMatch: 'prefix' },
  {
    path: 'tabla_maestra',
    component: TablaMaestraComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


