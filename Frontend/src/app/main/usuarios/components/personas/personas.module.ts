import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { VerComponent } from './components/ver/ver.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { PersonasComponent } from './personas.component';
import { PersonasRoutingModule } from './personas-routing.module';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    PersonasComponent,
    CrearComponent,
    EditarComponent,
    VerComponent,
    EliminarComponent
  ],
  imports: [
    TooltipModule,
    RippleModule,
    CommonModule,
    PersonasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    SelectModule,
  ]
})
export class PersonasModule { }
