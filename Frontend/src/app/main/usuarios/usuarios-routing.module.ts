import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonasComponent } from './components/personas/personas.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AlimentacionComponent } from './components/alimentacion/alimentacion.component';
import { EntrenamientoComponent } from './components/entrenamiento/entrenamiento.component';


const routes: Routes = [
  {
    path: 'personas',
    component: PersonasComponent,
    loadChildren: () => import('./components/personas/personas.module').then(m => m.PersonasModule)
  },
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  {
    path: 'alimentacion',
    component: AlimentacionComponent,
  },
  {
    path: 'entrenamiento',
    component: EntrenamientoComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

