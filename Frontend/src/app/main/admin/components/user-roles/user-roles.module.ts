import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerComponent } from './components/ver/ver.component';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {KeyFilterModule} from 'primeng/keyfilter';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ToastModule} from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';



@NgModule({
  declarations: [
    VerComponent,
  ],
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    
    CheckboxModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    PanelModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    KeyFilterModule,
    AutoCompleteModule,
    ToastModule,
    MultiSelectModule,
    SelectModule,
  ]
})
export class UserRolesModule { }
