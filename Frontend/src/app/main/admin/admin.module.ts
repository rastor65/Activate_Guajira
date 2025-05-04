import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { DropdownModule } from 'primeng/dropdown';
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
import { InputSwitch, InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [
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
    CommonModule,
    DropdownModule,
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
    InputSwitchModule
  ],
  providers: [ConfirmationService, ], 
})
export class AdminModule { }
