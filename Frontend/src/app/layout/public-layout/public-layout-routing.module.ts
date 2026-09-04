import { NgModule } from '@angular/core';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    component:FormLoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicLayoutRoutingModule { }
