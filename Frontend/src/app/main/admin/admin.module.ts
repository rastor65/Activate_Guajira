import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AccesosComponent } from './components/accesos/accesos.component';
import { RolesModule } from './components/roles/roles.module';
import { RecursosModule } from './components/recursos/recursos.module';
import { RolesRecursosModule } from './components/roles-recursos/roles-recursos.module';
import { UserRolesModule } from './components/user-roles/user-roles.module';
import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TablaMaestraComponent } from './components/tabla-maestra/tabla-maestra.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    AccesosComponent,
    RolesRecursosComponent,
    UserRolesComponent,
    AdminComponent,
    TablaMaestraComponent,
    UsuariosComponent,
  ],
  exports:[
    RolesRecursosComponent,
  ]
  ,
  imports: [
    InputTextModule,
    RippleModule,
    DatePickerModule,
    RolesModule,
    RecursosModule,
    RolesRecursosModule,
    UserRolesModule,
    TooltipModule,
    CommonModule,
    SelectModule,
    AdminRoutingModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    MultiSelectModule,
    ReactiveFormsModule,
    ProgressBarModule,
    ToggleSwitchModule
  ],
  providers: [ConfirmationService, ], 
})
export class AdminModule { }
