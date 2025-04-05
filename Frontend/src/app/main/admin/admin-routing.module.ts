import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { RolesComponent } from './components/roles/roles.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { TablaMaestraComponent } from './components/tabla-maestra/tabla-maestra.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: 'roles',
    component: RolesComponent,
    loadChildren: () => import('./components/roles/roles.module').then(m => m.RolesModule)
  },
  {
    path: 'recursos',
    component: RecursosComponent,
    loadChildren: () => import('./components/recursos/recursos.module').then(m => m.RecursosModule)
  },
  {
    path: 'recursos_roles',
    component: RolesRecursosComponent,
    loadChildren: () => import('./components/roles-recursos/roles-recursos.module').then(m => m.RolesRecursosModule)
  },
  {
    path: 'user_roles',
    component: UserRolesComponent,
    loadChildren: () => import('./components/user-roles/user-roles.module').then(m => m.UserRolesModule)
  },
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


