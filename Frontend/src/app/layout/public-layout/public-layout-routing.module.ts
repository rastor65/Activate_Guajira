import { NgModule } from '@angular/core';
import { ValidateGuard } from 'src/app/core/guards/validate.guard';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    component:FormLoginComponent,
    canLoad:[!ValidateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicLayoutRoutingModule { }
