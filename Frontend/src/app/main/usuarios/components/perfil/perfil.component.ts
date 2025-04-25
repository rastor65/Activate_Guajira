import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User, Person } from 'src/app/models/user/person';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { MedicionService } from 'src/app/core/services/usuarios/medicion.service';
import { MessageService } from 'primeng/api';
import { ChartData } from 'chart.js';
import { tablaMaestra, categoriaTablaMaestra } from 'src/app/models/user/person';
import { TablaMaestraService } from 'src/app/core/services/admin/tabla-maestra.service';
import { ChangeDetectorRef } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  formData: any = {};
  estado: string = '';
  mediciones: any[] = [];
  public profileImage = '';
  esEdicion: boolean = false;
  usuarioId: number | undefined;
  dialogMedicion: boolean = false;
  public person: Person | null = null;
  dialogEstadisticas: boolean = false;
  chartLabels: string[] = [];
  generoPerson: any;
  cargando: boolean = false;

  genero: any;

  pesoChart: any;
  imcChart: any;

  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tablaService: TablaMaestraService,
    private medicionService: MedicionService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.cargando = true;
    this.usuarioId = this.authService.getUserId();
    console.log("ID USER", this.usuarioId);
  
    if (this.usuarioId !== undefined) {
      this.loadUserProfile();  // <-- SOLO ESTO
      this.cargarMediciones();
    }
  
    this.chartLabels = [];
  }

  loadUserProfile() {
    if (this.usuarioId !== undefined) {
      this.userService.getUserProfile(this.usuarioId).subscribe(
        (userProfile) => {
          console.log("User Profile cargado", userProfile);
          this.user.username = userProfile.username;
          this.user.email = userProfile.email;
          this.profileImage = userProfile.avatar_url;
          this.genero = userProfile.gender_name;
          this.person = {
            nombres: userProfile.first_name,
            apellidos: userProfile.last_name
          } as Person; // <-- simulamos el objeto Person para tu HTML
  
          this.cd.detectChanges();
        },
        (error) => {
          console.error('Error cargando perfil:', error);
        }
      );
    }
  }  

  cargarMediciones(): void {
    if (this.usuarioId !== undefined) {
      this.medicionService.obtenerMedicionesPorUsuario(this.usuarioId).subscribe({
        next: (data) => {
          this.mediciones = data.results || [];
          this.chartLabels = this.mediciones.map(m => m.fecha ?? 'Sin fecha');
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar mediciones:', err);
        }
      });
    }
  }


  abrirMedicion() {
    this.esEdicion = true;
    this.formData = {};
    this.dialogMedicion = true;
  }

  abrirEstadisticas() {
    if (this.mediciones.length === 0 || this.chartLabels.length === 0) {
      console.warn('No hay datos para mostrar en los gráficos');
      return;
    }
    this.dialogEstadisticas = true;
    setTimeout(() => this.dibujarGraficos(), 100);
  }


  cerrarEstadisticas() {
    this.dialogEstadisticas = false;
  }

  dibujarGraficos() {
    if (!this.chartLabels || this.chartLabels.length === 0) {
      console.warn('chartLabels no tiene datos válidos.');
      return;
    }

    if (this.pesoChart) this.pesoChart.destroy();
    if (this.imcChart) this.imcChart.destroy();

    const pesoCanvas = document.getElementById('pesoChart') as HTMLCanvasElement;
    const imcCanvas = document.getElementById('imcChart') as HTMLCanvasElement;
    const fuerzaCanvas = document.getElementById('fuerzaChart') as HTMLCanvasElement;

    if (!pesoCanvas || !imcCanvas) {
      console.warn('No se encontraron los elementos canvas.');
      return;
    }

    this.pesoChart = new Chart(pesoCanvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.mediciones.map(m => m.peso),
          label: 'Peso (Kg)',
          borderColor: '#42A5F5',
          fill: false
        }]
      }
    });

    this.imcChart = new Chart(imcCanvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.mediciones.map(m => m.imc),
          label: 'IMC',
          borderColor: '#FFA726',
          fill: false
        }]
      }
    });
  }

  verMedicion(medicion: any) {
    this.esEdicion = false;
    this.formData = { ...medicion };
    this.dialogMedicion = true;
  }

  editarMedicion(medicion: any) {
    this.esEdicion = true;
    this.formData = { ...medicion };
    this.dialogMedicion = true;
  }

  cerrarMedicion() { this.dialogMedicion = false; }

  guardarMedicion() {
    if (this.formData) {
      if (this.formData.id) {
        this.medicionService.actualizarMedicion(this.formData.id, this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición actualizada' });
          this.cargarMediciones();
          this.dialogMedicion = false;
        });
      } else {
        this.formData.usuario = this.usuarioId;
        this.medicionService.crearMedicion(this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición creada' });
          this.cargarMediciones();
          this.dialogMedicion = false;
        });
      }
    } else {
      console.log("ERRRROR EN EL FORM")
    }
  }

  eliminarMedicion(medicion: any) {
    if (confirm('¿Está seguro de eliminar esta medición?')) {
      this.medicionService.eliminarMedicion(medicion.id).subscribe(() => {
        this.messageService.add({ severity: 'warn', summary: 'Eliminado', detail: 'Medición eliminada' });
        this.cargarMediciones();
      });
    }
  }

  getIMCClass(imc: number): string {
    if (imc < 18.5) {
      return 'bajo-peso';
    } else if (imc >= 18.5 && imc <= 24.9) {
      return 'normal';
    } else if (imc >= 25 && imc <= 29.9) {
      return 'sobrepeso';
    } else {
      return 'obesidad';
    }
  }

  mostrarEstadoIMC(imc: number): void {
    if (imc < 18.5) {
      this.estado = 'Bajo Peso';
    } else if (imc >= 18.5 && imc <= 24.9) {
      this.estado = 'Normal';
    } else if (imc >= 25 && imc <= 29.9) {
      this.estado = 'Sobrepeso';
    } else {
      this.estado = 'Obesidad';
    }

    setTimeout(() => {
      this.estado = '';
    }, 3000);

  }

  getICCClass(icc: number): string {
    if (this.genero === 'Masculino') {
      if (icc < 0.90) return 'icc-bajo';
      else if (icc >= 0.90 && icc < 1.0) return 'icc-moderado';
      else return 'icc-alto';
    } else {
      if (icc < 0.85) return 'icc-bajo';
      else if (icc >= 0.85 && icc < 0.95) return 'icc-moderado';
      else return 'icc-alto';
    }
  }

  getGrasaClass(grasa: number): string {
    if (this.genero === 'Masculino') {
      if (grasa < 10) return 'grasa-bajo';
      else if (grasa >= 10 && grasa <= 20) return 'grasa-normal';
      else return 'grasa-alta';
    } else {
      if (grasa < 18) return 'grasa-bajo';
      else if (grasa >= 18 && grasa <= 28) return 'grasa-normal';
      else return 'grasa-alta';
    }
  }

  mostrarEstadoICC(icc: number): void {
    if (this.genero === 'Masculino') {
      if (icc < 0.90) this.estado = 'ICC bajo: dentro del rango saludable.';
      else if (icc >= 0.90 && icc < 1.0) this.estado = 'ICC moderado: precaución.';
      else this.estado = 'ICC alto: riesgo cardiovascular aumentado.';
    } else {
      if (icc < 0.85) this.estado = 'ICC bajo: dentro del rango saludable.';
      else if (icc >= 0.85 && icc < 0.95) this.estado = 'ICC moderado: precaución.';
      else this.estado = 'ICC alto: riesgo cardiovascular aumentado.';
    }

    setTimeout(() => {
      this.estado = '';
    }, 3000);
  }

  mostrarEstadoGrasa(grasa: number): void {
    if (this.genero === 'Masculino') {
      if (grasa < 10) this.estado = 'Grasa corporal baja: posible déficit.';
      else if (grasa >= 10 && grasa <= 20) this.estado = 'Grasa corporal normal.';
      else this.estado = 'Grasa corporal alta.';
    } else {
      if (grasa < 18) this.estado = 'Grasa corporal baja: posible déficit.';
      else if (grasa >= 18 && grasa <= 28) this.estado = 'Grasa corporal normal.';
      else this.estado = 'Grasa corporal alta.';
    }

    setTimeout(() => {
      this.estado = '';
    }, 3000);
  }

}