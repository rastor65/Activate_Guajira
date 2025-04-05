import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrenadorComponent } from './components/entrenador/entrenador.component';

const routes: Routes = [
  {
    path: 'entrenador',
    component: EntrenadorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicionesRoutingModule { }
