import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicionesRoutingModule } from './mediciones-routing.module';
import { EntrenadorComponent } from './components/entrenador/entrenador.component';
import { MedicionesComponent } from './mediciones.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    EntrenadorComponent,
  ],
  exports:[
    EntrenadorComponent,
  ],
  imports: [
    CommonModule,
    MedicionesRoutingModule,
    DropdownModule, 
    TableModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    CardModule,
    AvatarModule,
    ProgressSpinnerModule,
  ]
})

export class MedicionesModule { }
