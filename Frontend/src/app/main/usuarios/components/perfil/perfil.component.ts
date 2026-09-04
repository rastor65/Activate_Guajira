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
  standalone: false,
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  formData: any = {};
  estado: string = '';
  mediciones: any[] = [];
  /** Avatar de respaldo: el usuario puede no tener imagen cargada. */
  public readonly avatarPorDefecto = 'assets/avatars/user.png';
  public profileImage = this.avatarPorDefecto;
  esEdicion: boolean = false;
  usuarioId: number | undefined;
  dialogMedicion: boolean = false;
  public person: Person | null = null;
  dialogEstadisticas: boolean = false;
  chartLabels: string[] = [];
  generoPerson: any;
  cargando: boolean = false;
  genero: any;
  /** Edad en anos, del perfil. La grasa corporal depende de ella. */
  edad: number | null = null;
  pesoChart: any;
  imcChart: any;
  isGuardando: boolean = false;
  botonesDesactivados: boolean = false;

  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
    consentimiento: false,
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
      this.loadUserProfile();
      this.cargarMediciones();
    }

    this.chartLabels = [];
  }

  /**
   * `esEdicion` significa "los campos son editables", no "se edita una
   * existente": al crear una medicion nueva tambien vale true. El titulo se
   * decide por si el registro ya tiene id.
   */
  get esNueva(): boolean {
    return !this.formData?.id;
  }

  get soloLectura(): boolean {
    return !this.esEdicion;
  }

  get tituloMedicion(): string {
    if (this.soloLectura) {
      return 'Detalles de la medicion';
    }
    return this.esNueva ? 'Nueva medicion' : 'Editar medicion';
  }

  // ==========================================================================
  // Calculos en vivo
  //
  // Replican las formulas del backend (ver ListMedicionSerializer) para que la
  // vista previa coincida con lo que se guarda. Los marcados como "informativo"
  // no los calcula el backend: se muestran solo como apoyo al registrar.
  // ==========================================================================

  private num(valor: any): number | null {
    const n = Number(valor);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  /** IMC = peso / talla^2 */
  get imcPrevisto(): number | null {
    const talla = this.num(this.formData?.talla);
    const peso = this.num(this.formData?.peso);
    if (!talla || !peso) {
      return null;
    }
    return Math.round((peso / (talla * talla)) * 100) / 100;
  }

  /** ICC = cintura / cadera */
  get iccPrevisto(): number | null {
    const cintura = this.num(this.formData?.perimetro_cintura);
    const cadera = this.num(this.formData?.perimetro_cadera);
    if (!cintura || !cadera) {
      return null;
    }
    return Math.round((cintura / cadera) * 100) / 100;
  }

  /**
   * Grasa corporal por la formula de Deurenberg, la misma del backend:
   * depende de IMC, edad y genero, no de los pliegues.
   */
  get grasaPrevista(): number | null {
    const imc = this.imcPrevisto;
    if (imc === null || this.edad === null || !this.generoConocido) {
      return null;
    }
    const ajuste = this.genero === 'Masculino' ? 16.2 : 5.4;
    return Math.round(((1.20 * imc) + (0.23 * this.edad) - ajuste) * 100) / 100;
  }

  /** Fuerza maxima de prension = media de ambas manos */
  get fuerzaMaximaPrevista(): number | null {
    const derecha = this.num(this.formData?.fuerza_manoderecha);
    const izquierda = this.num(this.formData?.fuerza_manoizquierda);
    if (!derecha || !izquierda) {
      return null;
    }
    return Math.round(((derecha + izquierda) / 2) * 10) / 10;
  }

  /** Informativo: rango de peso para un IMC entre 18.5 y 24.9 */
  get pesoSaludable(): string | null {
    const talla = this.num(this.formData?.talla);
    if (!talla) {
      return null;
    }
    const minimo = Math.round(18.5 * talla * talla * 10) / 10;
    const maximo = Math.round(24.9 * talla * talla * 10) / 10;
    return `${minimo} - ${maximo}`;
  }

  /** Informativo: indice cintura-altura, buen predictor de riesgo abdominal */
  get indiceCinturaAltura(): number | null {
    const cintura = this.num(this.formData?.perimetro_cintura);
    const talla = this.num(this.formData?.talla);
    if (!cintura || !talla) {
      return null;
    }
    // La cintura va en cm y la talla en m
    return Math.round((cintura / (talla * 100)) * 100) / 100;
  }

  /** Informativo: por encima de 0.5 se asocia a mayor riesgo cardiometabolico */
  get icaEnRiesgo(): boolean {
    const ica = this.indiceCinturaAltura;
    return ica !== null && ica >= 0.5;
  }

  /** Informativo: asimetria entre manos, en por ciento */
  get asimetriaFuerza(): number | null {
    const derecha = this.num(this.formData?.fuerza_manoderecha);
    const izquierda = this.num(this.formData?.fuerza_manoizquierda);
    if (!derecha || !izquierda) {
      return null;
    }
    const mayor = Math.max(derecha, izquierda);
    return Math.round((Math.abs(derecha - izquierda) / mayor) * 1000) / 10;
  }

  /** Una asimetria superior al 10% se considera relevante en valoracion funcional */
  get asimetriaRelevante(): boolean {
    const a = this.asimetriaFuerza;
    return a !== null && a > 10;
  }

  /** Informativo: fuerza de prension relativa al peso corporal */
  get fuerzaRelativa(): number | null {
    const fuerza = this.fuerzaMaximaPrevista;
    const peso = this.num(this.formData?.peso);
    if (fuerza === null || !peso) {
      return null;
    }
    return Math.round((fuerza / peso) * 100) / 100;
  }

  /** Informativo: ganancia entre la medida explosiva inicial y la final */
  get progresoExplosivo(): number | null {
    const inicial = this.num(this.formData?.fuerza_explosiva_i);
    const final = this.num(this.formData?.fuerza_explosiva_f);
    if (!inicial || !final) {
      return null;
    }
    return Math.round((final - inicial) * 10) / 10;
  }

  /** El genero se necesita para la grasa corporal y los pliegues especificos. */
  get generoConocido(): boolean {
    return this.genero === 'Masculino' || this.genero === 'Femenino';
  }

  /** Que le falta al perfil para poder calcular la grasa corporal. */
  get faltaParaGrasa(): string | null {
    const faltantes: string[] = [];
    if (!this.generoConocido) {
      faltantes.push('genero');
    }
    if (this.edad === null) {
      faltantes.push('fecha de nacimiento');
    }
    return faltantes.length ? faltantes.join(' y ') : null;
  }

  /** Clasificacion del indice cintura-cadera para la vista previa. */
  getICCLabelPrevio(icc: number): string {
    return this.getICCLabel(icc);
  }

  /** Respaldo en caliente si la imagen remota no llega a cargar. */
  onAvatarError() {
    if (this.profileImage !== this.avatarPorDefecto) {
      this.profileImage = this.avatarPorDefecto;
    }
  }

  loadUserProfile() {
    this.cargando = true;
    if (this.usuarioId !== undefined) {
      this.userService.getUserProfile(this.usuarioId).subscribe(
        (userProfile) => {
          this.user.username = userProfile.username;
          this.user.email = userProfile.email;
          this.profileImage = userProfile.avatar_url || this.avatarPorDefecto;
          this.genero = userProfile.gender_name;
          this.edad = userProfile.edad ?? null;
          this.person = {
            nombres: userProfile.first_name,
            apellidos: userProfile.last_name
          } as Person;
          this.cargando = false;
          this.cd.detectChanges();
        },
        (error) => {
          console.error('Error cargando perfil:', error);
          this.cargando = false;
        }
      );
    }
  }

  cargarMediciones(): void {
    this.cargando = true;
    if (this.usuarioId !== undefined) {
      this.medicionService.obtenerMedicionesPorUsuario(this.usuarioId).subscribe({
        next: (data) => {
          this.mediciones = data.results || [];
          this.chartLabels = this.mediciones.map(m => m.fecha ?? 'Sin fecha');
          this.cargando = false;
          console.log(this.mediciones)
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar mediciones:', err);
          this.cargando = false;
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

  cerrarMedicion() {
    this.botonesDesactivados = true;
    setTimeout(() => {
      this.botonesDesactivados = false;
    }, 1000);
    this.dialogMedicion = false;

  }

  guardarMedicion() {
    this.isGuardando = true;
    this.botonesDesactivados = true;

    if (this.formData) {
      if (this.formData.id) {
        this.medicionService.actualizarMedicion(this.formData.id, this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición actualizada' });
          this.cargarMediciones();
          this.dialogMedicion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
        });
      } else {
        this.formData.usuario = this.usuarioId;
        this.medicionService.crearMedicion(this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición creada' });
          this.cargarMediciones();
          this.dialogMedicion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
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

  /**
   * Etiquetas de clasificacion. El design system prohibe comunicar un estado
   * solo con color: cada valor va acompanado de su palabra.
   */
  getIMCLabel(imc: number): string {
    if (imc < 18.5) return 'Bajo peso';
    if (imc <= 24.9) return 'Normal';
    if (imc <= 29.9) return 'Sobrepeso';
    return 'Obesidad';
  }

  getICCLabel(icc: number): string {
    const clase = this.getICCClass(icc);
    if (clase === 'icc-bajo') return 'Bajo';
    if (clase === 'icc-moderado') return 'Moderado';
    return 'Alto';
  }

  getGrasaLabel(grasa: number): string {
    const clase = this.getGrasaClass(grasa);
    if (clase === 'grasa-bajo') return 'Baja';
    if (clase === 'grasa-normal') return 'Normal';
    return 'Alta';
  }

  /** Ultima medicion registrada, para las fichas de resumen. */
  get ultimaMedicion(): any {
    return this.mediciones && this.mediciones.length ? this.mediciones[0] : null;
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