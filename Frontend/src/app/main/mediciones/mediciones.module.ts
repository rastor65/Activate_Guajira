import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicionesRoutingModule } from './mediciones-routing.module';
import { EntrenadorComponent } from './components/entrenador/entrenador.component';
import { MedicionesComponent } from './mediciones.component';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
  declarations: [
    EntrenadorComponent,
  ],
  exports:[
    EntrenadorComponent,
  ],
  imports: [
    TooltipModule,
    CommonModule,
    MedicionesRoutingModule,
    SelectModule, 
    TableModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    CardModule,
    AvatarModule,
    ProgressSpinnerModule,
    ProgressBarModule,
  ]
})

export class MedicionesModule { }
