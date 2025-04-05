import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AlimentacionComponent } from './components/alimentacion/alimentacion.component';
import { EntrenamientoComponent } from './components/entrenamiento/entrenamiento.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    PerfilComponent,
    AlimentacionComponent,
    EntrenamientoComponent,
    
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    DialogModule,
    ButtonModule,
    FormsModule,
  ]
})
export class UsuariosModule { }