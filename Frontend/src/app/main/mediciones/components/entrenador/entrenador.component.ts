import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { environment } from 'src/environments/environment';
import { MedicionService } from 'src/app/core/services/usuarios/medicion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Medicion } from 'src/app/models/medicion';
import { MessageService } from 'primeng/api';
import { EntrenadorService } from 'src/app/core/services/usuarios/entrenador.service';
import { ConfirmationService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Observable } from 'rxjs';
import { Person } from 'src/app/models/user/person';
import { tablaMaestra } from 'src/app/models/user/person';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-entrenador',
  templateUrl: './entrenador.component.html',
  styleUrls: ['./entrenador.component.css']
})

export class EntrenadorComponent implements OnInit {

  API_URI = environment.API_URI;
  base_user = `${this.API_URI}/api/user/`;

  personas: Person[] = [];
  genero: string = '';
  personasFiltradas: Person[] = [];
  formData: any = {};
  estado: string = '';
  alimentacion: any[] = [];
  cargando: boolean = true;
  entrenamiento: any[] = [];
  alimentaciones: any[] = [];
  entrenamientos: any[] = [];
  esEdicion: boolean = false;
  selectedTrainer: any = null;
  public trainers: any[] = [];
  public mediciones: any[] = [];
  usuarioId: number | undefined;
  dialogMedicion: boolean = false;
  public searchValue: string = '';
  public filterOptions: any[] = [];
  selectedAlimentacion: any = null;
  ciudad: tablaMaestra[] = [];
  selectedEntrenamiento: any = null;
  medicionesUsuario: any[] = [];
  dialogAlimentacion: boolean = false;
  public filteredTrainers: any[] = [];
  public filteredTrainers2: any[] = [];
  dialogEntrenamiento: boolean = false;
  dialogVerAlimentacion: boolean = false;
  esEdicionAlimentacion: boolean = false;
  esEdicionEntrenamiento: boolean = false;
  dialogVerEntrenamiento: boolean = false;
  public dialogMediciones: boolean = false;
  dialogAlimentacionRegion: boolean = false;
  dialogEntrenamientoRegion: boolean = false;
  regionSelectedCiudad: any = null;
  busquedaAtletaRegion: string = '';
  selectedSemanaRegionIndex: number = 0;
  guardandoMasivo: boolean = false;
  progresoGuardado: number = 0;
  textoProgresoGuardado: string = '';
  dialogFormularioEntrenamiento: boolean = false;
  dialogFormularioAlimentacion: boolean = false;
  public cargandoEntrenamiento: boolean = false;
  cargandoCiudades: boolean = false; 
  isGuardando: boolean = false;
  botonesDesactivados: boolean = false;
  cargandoPdialog: boolean = false;
  public selectedCiudad: any = null;
  public selectedGenero: string | null = null;
  public selectedRangoEdad: string | null = null;
  public selectedOrden: string = 'nombre_asc';
  selectedSemanaIndex: number = 0;
  selectedDiaDetalle: string = 'TODOS';

  public generosOpciones: any[] = [
    { label: 'Todos los géneros', value: null },
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' }
  ];

  public edadesOpciones: any[] = [
    { label: 'Todas las edades', value: null },
    { label: 'Menores de 18 años', value: '<18' },
    { label: '18 a 29 años', value: '18-29' },
    { label: '30 a 49 años', value: '30-49' },
    { label: '50 años o más', value: '>=50' },
    { label: 'Sin edad registrada', value: 'sin_dato' }
  ];

  public ordenOpciones: any[] = [
    { label: 'Nombre: A → Z', value: 'nombre_asc' },
    { label: 'Nombre: Z → A', value: 'nombre_desc' },
    { label: 'Edad: Menor a Mayor', value: 'edad_asc' },
    { label: 'Edad: Mayor a Menor', value: 'edad_desc' },
    { label: 'Más recientes primero', value: 'recientes' }
  ];

  formAlimentacion = {
    id: 0,
    nombre: '',
    descripcion: '',
    calorias_diarias: 0,
    entrenador: '',
    usuario: ''
  };

  tiposEjercicio = [
    'RESISTENCIA',
    'CARDIOVASCULAR',
    'EJERCICIOS FORTALECIMIENTO',
    'EJERCICIOS DE EQUILIBRIO',
    'FLEXIBILIDAD'
  ];

  diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

  formEntrenamiento = {
    id: null,
    usuario: null,
    nombre: '',
    duracion_semanas: 0,
    entrenador: null,
    descripcion: '',
    semanas: [] as any[]
  };

  constructor(
    private usuariosService: UsuariosService,
    private medicionService: MedicionService,
    private messageService: MessageService,
    private entrenadorService: EntrenadorService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getTrainers();
    this.obtenerTipos();
    this.getFilterOptions();
  }

  generarSemanas() {
    this.formEntrenamiento.semanas = [];
    for (let i = 0; i < this.formEntrenamiento.duracion_semanas; i++) {
      const semana = {
        numero: i + 1,
        ejercicios: this.tiposEjercicio.map(tipo => ({
          tipo,
          dias: this.diasSemana.map(() => false) // Array de booleanos para los días
        }))
      };
      this.formEntrenamiento.semanas.push(semana);
    }
  }

  editarSugerenciaDesdeFrontend(ejercicio: any, dia: string) {
    this.entrenadorService.editarSugerencia(ejercicio.tipo, dia).subscribe((res) => {
      if (!ejercicio.sugerencias) {
        ejercicio.sugerencias = {};
      }
  
      const sugerenciasDelDia = (res.sugerencias as { [key: string]: any })[dia] || {};
      const sugerenciasPorTipo = (sugerenciasDelDia as { [key: string]: any })[ejercicio.tipo] || [];
  
      ejercicio.sugerencias[dia] = sugerenciasPorTipo.map((s: any) =>
        typeof s === 'string' ? s : `${s.nombre} – ${s.descripcion}`
      );
  
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Sugerencias actualizadas'
      });
    }, (error) => {
      console.error('Error al editar sugerencia:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo editar la sugerencia.'
      });
    });
  }
  
  onCheckboxChange(ejercicio: any, dia: string, activo: boolean) {
    if (activo) {
      if (this.esEdicionEntrenamiento) {
        this.editarSugerenciaDesdeFrontend(ejercicio, dia);
      } else { // Si estás en modo creación, simplemente inicializa las sugerencias localmente 
        if (!ejercicio.sugerencias) {
          ejercicio.sugerencias = {};
        }
        ejercicio.sugerencias[dia] = []; // vacío o deja para que el backend las genere al guardar
      }
    } else if (ejercicio.sugerencias) {
      delete ejercicio.sugerencias[dia];
    }
  }

  public obtenerTipos(): void {
    this.cargandoCiudades = true;
    this.ciudad = [];

    this.userService.obtenerTipoCategoria().subscribe({
      next: (categorias: any[]) => {
        const categoriaMap = (categorias || []).reduce((acc: any, c: any) => {
          acc[c.id] = (c.nombre || '').trim();
          return acc;
        }, {});

        this.userService.obtenerTipo().subscribe({
          next: (tipos: any[]) => {
            const ciudadesTabla = (tipos || []).filter(t => {
              const catNombre = (categoriaMap[t.categoria] || '').toLowerCase();
              return catNombre.includes('ciudad') || catNombre.includes('municipio');
            });

            this.armarListaCiudades(ciudadesTabla);
            this.cargandoCiudades = false;
          },
          error: (error: any) => {
            console.error('❌ Error al cargar tipos de tabla maestra:', error);
            this.armarListaCiudades([]);
            this.cargandoCiudades = false;
          }
        });
      },
      error: (error: any) => {
        console.error('❌ Error al cargar categorias de tabla maestra:', error);
        this.armarListaCiudades([]);
        this.cargandoCiudades = false;
      }
    });
  }

  armarListaCiudades(ciudadesBase: any[] = []): void {
    const mapaCiudades = new Map<string, any>();

    // 1. Agregar ciudades de la tabla maestra
    (ciudadesBase || []).forEach(c => {
      if (c && c.nombre && typeof c.nombre === 'string') {
        const key = c.nombre.trim().toLowerCase();
        if (key && !mapaCiudades.has(key)) {
          mapaCiudades.set(key, {
            id: c.id,
            nombre: c.nombre.trim()
          });
        }
      }
    });

    // 2. Extraer y fusionar cualquier ciudad presente en los deportistas cargados
    (this.trainers || []).forEach(t => {
      const cRes = t?.ciudad_residencia;
      if (cRes) {
        if (typeof cRes === 'object' && cRes.nombre && typeof cRes.nombre === 'string') {
          const key = cRes.nombre.trim().toLowerCase();
          if (key && !mapaCiudades.has(key)) {
            mapaCiudades.set(key, {
              id: cRes.id || key,
              nombre: cRes.nombre.trim()
            });
          }
        } else if (typeof cRes === 'string' && cRes.trim()) {
          const key = cRes.trim().toLowerCase();
          if (key && !mapaCiudades.has(key)) {
            mapaCiudades.set(key, {
              id: key,
              nombre: cRes.trim()
            });
          }
        }
      }
    });

    this.ciudad = Array.from(mapaCiudades.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    console.log('✅ Ciudades cargadas y sincronizadas:', this.ciudad);
  }

  extraerGenerosDeTrainers(): void {
    const generosSet = new Set<string>();
    (this.trainers || []).forEach(t => {
      if (t.gender_name && typeof t.gender_name === 'string' && t.gender_name.trim()) {
        generosSet.add(t.gender_name.trim());
      }
    });

    if (generosSet.size > 0) {
      const dinamicos = Array.from(generosSet).sort().map(g => ({
        label: g,
        value: g
      }));
      this.generosOpciones = [
        { label: 'Todos los géneros', value: null },
        ...dinamicos
      ];
    }
  }

  getTrainers(): void {
    this.cargando = true;
    this.userService.getlistusers().subscribe(
      (entrenadores: any[]) => {
        this.trainers = entrenadores;
        console.log('✅ Entrenadores recibidos:', this.trainers);
        this.personas = entrenadores.map((trainer: any) => ({
          ...trainer,
          seleccionado: true,
          ciudad_residencia: trainer.ciudad_residencia,
          nombres: trainer.first_name,
          apellidos: trainer.last_name,
          user: trainer.id
        }));

        this.filtrarEntrenadoresPorRol();
        this.armarListaCiudades(this.ciudad);
        this.extraerGenerosDeTrainers();
        this.filterCards();
        this.cargando = false;
      },
      (error) => {
        console.error('❌ Error al cargar entrenadores:', error);
        this.cargando = false;
      }
    );
  }
  
  filtrarEntrenadoresPorRol(): void {
    this.userService.getUsuariosPorRol(3).subscribe(
      (response: any) => {
        const userIdsEntrenadores = response.users;
        this.filteredTrainers2 = this.trainers
          .filter(trainer => userIdsEntrenadores.includes(trainer.id))
          .map(trainer => ({
            ...trainer,
            fullName: `${trainer.first_name} ${trainer.last_name}`.trim()
          }));
        console.log('✅ Entrenadores filtrados:', this.filteredTrainers2);
      },
      (error) => {
        console.error('❌ Error al filtrar entrenadores:', error);
      }
    );
  }  
  
  getFilterOptions(): void {
    this.usuariosService.getRoles().subscribe(
      (response: any) => {
        const roles = response.results || response;
        this.filterOptions = [{ name: 'Todos' }, ...roles];
      },
      (error: any) => console.error('Error al cargar roles:', error)
    );
  }

  verAlimentacion(trainer: any) {
    this.cargandoPdialog = true;
    this.selectedTrainer = trainer;
    this.alimentaciones = [];
    this.dialogAlimentacion = true;

    this.entrenadorService.getAlimentacionesPorUsuario(trainer.id).subscribe({
      next: (data) => {
        this.alimentaciones = (Array.isArray(data) ? data : []).map((alimentacion: any) => ({
          ...alimentacion,
          entrenador_nombre: typeof alimentacion.entrenador === 'string' && isNaN(Number(alimentacion.entrenador))
            ? alimentacion.entrenador
            : this.nombreUsuarioPorId(alimentacion.entrenador),
          usuario_nombre: typeof alimentacion.usuario === 'string' && isNaN(Number(alimentacion.usuario))
            ? alimentacion.usuario
            : this.nombreUsuarioPorId(alimentacion.usuario)
        }));
        this.cargandoPdialog = false;
      },
      error: (error) => {
        console.error('Error al cargar alimentaciones:', error);
        this.cargandoPdialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los planes de alimentación.'
        });
      }
    });
  }

  getNombre(entrenadorId: number): Observable<Person[]> {
    return this.userService.getPeopleByUserId(entrenadorId);
  }

  verUnaAlimentacion(alimentacion: any) {
    this.selectedAlimentacion = {
      ...alimentacion,
      entrenador: alimentacion.entrenador_nombre || this.nombreUsuarioPorId(alimentacion.entrenador),
      usuario: alimentacion.usuario_nombre || this.nombreUsuarioPorId(alimentacion.usuario)
    };
    this.dialogVerAlimentacion = true;
    this.entrenadorService.getOneAlimentacion(alimentacion.id).subscribe({
      next: (data) => {
        this.alimentacion = {
          ...data,
          entrenador: this.nombreUsuarioPorId(data.entrenador) || data.entrenador,
          usuario: this.nombreUsuarioPorId(data.usuario) || data.usuario
        };
        this.selectedAlimentacion = this.alimentacion;
      },
      error: (error) => console.error('Error al consultar detalle de alimentación:', error)
    });
  }

  get planEntrenamientoActivo(): any {
    return this.entrenamientos?.find(e => e.activo) || null;
  }

  get planAlimentacionActivo(): any {
    return this.alimentaciones?.find(a => a.activo) || null;
  }

  activarPlanEntrenamiento(plan: any): void {
    if (plan.activo) return;
    this.entrenadorService.activarEntrenamiento(plan.id).subscribe({
      next: () => {
        this.entrenamientos.forEach(e => e.activo = (e.id === plan.id));
        this.entrenamientos.sort((a, b) => (b.activo ? 1 : 0) - (a.activo ? 1 : 0));
        this.messageService.add({
          severity: 'success',
          summary: 'Plan Activado',
          detail: `El plan "${plan.nombre}" ahora es el único activo para este deportista.`
        });
      },
      error: (err) => {
        console.error('Error al activar plan de entrenamiento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo activar el plan de entrenamiento.'
        });
      }
    });
  }

  activarPlanAlimentacion(plan: any): void {
    if (plan.activo) return;
    this.entrenadorService.activarAlimentacion(plan.id).subscribe({
      next: () => {
        this.alimentaciones.forEach(a => a.activo = (a.id === plan.id));
        this.alimentaciones.sort((a, b) => (b.activo ? 1 : 0) - (a.activo ? 1 : 0));
        this.messageService.add({
          severity: 'success',
          summary: 'Plan Activado',
          detail: `El plan "${plan.nombre}" ahora es el único activo para este deportista.`
        });
      },
      error: (err) => {
        console.error('Error al activar plan de alimentación:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo activar el plan de alimentación.'
        });
      }
    });
  }

  // --- MÉTODOS DE SOPORTE PARA DETALLE DE ENTRENAMIENTO ---
  seleccionarSemana(index: number): void {
    this.selectedSemanaIndex = index;
  }

  seleccionarDia(dia: string): void {
    this.selectedDiaDetalle = dia;
  }

  getSemanasDetalle(): any[] {
    return this.selectedEntrenamiento?.semanas || [];
  }

  getSemanaActual(): any {
    const semanas = this.getSemanasDetalle();
    if (!semanas.length) return null;
    return semanas[this.selectedSemanaIndex] || semanas[0] || null;
  }

  getEjerciciosParaDia(dia: string, semana?: any): any[] {
    const sem = semana || this.getSemanaActual();
    if (!sem || !sem.ejercicios) return [];
    const diaIndex = this.diasSemana.indexOf(dia);
    if (diaIndex === -1) return [];

    return sem.ejercicios.filter((ej: any) => ej.dias && ej.dias[diaIndex]);
  }

  hasEjerciciosParaDia(dia: string, semana?: any): boolean {
    return this.getEjerciciosParaDia(dia, semana).length > 0;
  }

  getTotalEjerciciosDia(dia: string, semana?: any): number {
    return this.getEjerciciosParaDia(dia, semana).length;
  }

  getDiasEntrenamientoSemana(semana?: any): string[] {
    return this.diasSemana.filter(dia => this.hasEjerciciosParaDia(dia, semana));
  }

  getSugerenciasList(ejercicio: any, dia: string): Array<{ nombre: string; descripcion: string }> {
    const raw = ejercicio?.sugerencias?.[dia];
    if (!raw) return [];
    if (!Array.isArray(raw)) {
      if (typeof raw === 'string') return [{ nombre: ejercicio.tipo, descripcion: raw }];
      return [];
    }

    return raw.map((item: any) => {
      if (typeof item === 'string') {
        const colonIdx = item.indexOf(':');
        if (colonIdx > 0 && colonIdx < 50) {
          return {
            nombre: item.substring(0, colonIdx).trim(),
            descripcion: item.substring(colonIdx + 1).trim()
          };
        }
        return {
          nombre: '',
          descripcion: item
        };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          nombre: item.nombre || '',
          descripcion: item.descripcion || ''
        };
      }
      return { nombre: '', descripcion: String(item) };
    });
  }

  getTipoEjercicioBadgeClass(tipo: string): string {
    const t = (tipo || '').toUpperCase();
    if (t.includes('CARDIO')) return 'exercise-badge--cardio';
    if (t.includes('RESISTENCIA')) return 'exercise-badge--endurance';
    if (t.includes('FUERZA') || t.includes('FORTALEC')) return 'exercise-badge--strength';
    if (t.includes('EQUILIBRIO')) return 'exercise-badge--balance';
    if (t.includes('FLEXIBILIDAD')) return 'exercise-badge--flexibility';
    return 'exercise-badge--general';
  }

  getTipoEjercicioIcon(tipo: string): string {
    const t = (tipo || '').toUpperCase();
    if (t.includes('CARDIO')) return 'pi pi-bolt';
    if (t.includes('RESISTENCIA')) return 'pi pi-heart';
    if (t.includes('FUERZA') || t.includes('FORTALEC')) return 'pi pi-shield';
    if (t.includes('EQUILIBRIO')) return 'pi pi-compass';
    if (t.includes('FLEXIBILIDAD')) return 'pi pi-sync';
    return 'pi pi-check';
  }

  verUnEntrenamiento(entrenamiento: any) {
    this.selectedSemanaIndex = 0;
    this.selectedDiaDetalle = 'TODOS';
    this.selectedEntrenamiento = {
      ...entrenamiento,
      entrenador: entrenamiento.entrenador_nombre || this.nombreUsuarioPorId(entrenamiento.entrenador),
      usuario: entrenamiento.usuario_nombre || this.nombreUsuarioPorId(entrenamiento.usuario)
    };
    this.dialogVerEntrenamiento = true;
    this.entrenadorService.getOneEntrenamiento(entrenamiento.id).subscribe({
      next: (data) => {
        this.entrenamiento = {
          ...data,
          entrenador: this.nombreUsuarioPorId(data.entrenador) || data.entrenador,
          usuario: this.nombreUsuarioPorId(data.usuario) || data.usuario
        };
        this.selectedEntrenamiento = this.entrenamiento;
        if (!this.selectedEntrenamiento.semanas?.length && entrenamiento.semanas?.length) {
          this.selectedEntrenamiento.semanas = entrenamiento.semanas;
        }
      },
      error: (error) => console.error('Error al consultar detalle de entrenamiento:', error)
    });
  }

  agregarAlimentacion() {
    this.isGuardando = true;
    this.botonesDesactivados = true;
    if (this.selectedTrainer) {
      this.formData.usuario = this.selectedTrainer.id;
      this.entrenadorService.createAlimentacion(this.formData).subscribe(
        (data) => {
          this.alimentaciones.push(data);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alimentación añadida' });
          this.formData = {};
          this.isGuardando = false;
          this.botonesDesactivados = false;
        },
        (error) => console.error(error)
      );
    }
  }

  abrirFormularioAlimentacion(alimentacion?: any) {
    if (alimentacion) {
      this.formAlimentacion = { ...alimentacion };
      this.esEdicionAlimentacion = true;
    } else {
      this.formAlimentacion = {
        id: 0,
        nombre: '',
        descripcion: '',
        calorias_diarias: 0,
        entrenador: '',
        usuario: ''
      };
      this.esEdicionAlimentacion = false;
    }
    this.dialogFormularioAlimentacion = true;
  }

  abrirFormularioEntrenamiento(entrenamiento?: any) {
    if (entrenamiento) {
      this.formEntrenamiento = {
        ...entrenamiento,
        entrenador: typeof entrenamiento.entrenador === 'object' ? entrenamiento.entrenador.id : entrenamiento.entrenador,
        usuario: typeof entrenamiento.usuario === 'object' ? entrenamiento.usuario.id : entrenamiento.usuario
      };

      // Reprocesar sugerencias basadas en los días activos
      this.formEntrenamiento.semanas.forEach((semana: any) => {
        semana.ejercicios.forEach((ejercicio: any) => {
          const nuevasSugerencias: { [key: string]: string[] } = {};
          ejercicio.dias.forEach((activo: boolean, index: number) => {
            const dia = this.diasSemana[index];
            if (activo) {
              if (ejercicio.sugerencias && ejercicio.sugerencias[dia]) {
                // Mantener sugerencia existente si ya estaba
                nuevasSugerencias[dia] = ejercicio.sugerencias[dia];
              } else {
                // Generar nueva sugerencia
                nuevasSugerencias[dia] = this.generarSugerencia(ejercicio.tipo, dia);
              }
            }
          });
          ejercicio.sugerencias = nuevasSugerencias;
        });
      });

      this.esEdicionEntrenamiento = true;
    } else {
      this.formEntrenamiento = {
        id: null,
        nombre: '',
        descripcion: '',
        duracion_semanas: 0,
        entrenador: null,
        usuario: null,
        semanas: [],
      };
      this.esEdicionEntrenamiento = false;
    }

    this.dialogFormularioEntrenamiento = true;
  }

  actualizarSugerencias(ejercicio: any, diaIndex: number) {
    const dia = this.diasSemana[diaIndex];
    if (ejercicio.dias[diaIndex]) {
      if (!ejercicio.sugerencias) ejercicio.sugerencias = {};
      if (!ejercicio.sugerencias[dia]) {
        ejercicio.sugerencias[dia] = ["(pendiente sugerencia IA)"];
      }
    } else {
      if (ejercicio.sugerencias && ejercicio.sugerencias[dia]) {
        delete ejercicio.sugerencias[dia];
      }
    }
  }

  generarSugerencia(tipo: string, dia: string): string[] {
    // Simula generación de sugerencias, reemplaza con llamada real si lo deseas
    return [`Sugerencia para ${tipo} el ${dia}`];
  }

  guardarAlimentacion() {
    this.isGuardando = true;
    this.botonesDesactivados = true;
    if (this.esEdicionAlimentacion) {
      this.formAlimentacion.usuario = this.selectedTrainer?.id;
      this.entrenadorService.updateAlimentacion(this.formAlimentacion.id, this.formAlimentacion).subscribe(
        (data) => {
          const index = this.alimentaciones.findIndex(a => a.id === this.formAlimentacion.id);
          if (index !== -1) {
            this.alimentaciones[index] = data;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alimentación actualizada' });
          this.dialogFormularioAlimentacion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
        },
        (error) => console.error(error)
      );
    } else {
      this.formAlimentacion.usuario = this.selectedTrainer?.id;
      this.entrenadorService.createAlimentacion(this.formAlimentacion).subscribe(
        (data) => {
          this.alimentaciones.push(data);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alimentación añadida' });
          this.dialogFormularioAlimentacion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
        },
        (error) => console.error(error)
      );
    }
    this.verAlimentacion(this.selectedTrainer)
  }

  guardarEntrenamiento(): void {
    this.formEntrenamiento.usuario = this.selectedTrainer?.id;

    if (!this.formEntrenamiento.usuario || !this.formEntrenamiento.nombre) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe completar todos los campos obligatorios.'
      });
      return;
    }

    this.cargandoEntrenamiento = true;

    const finalizar = () => {
      this.cargandoEntrenamiento = false;
      this.dialogFormularioEntrenamiento = false;
      this.verEntrenamiento(this.selectedTrainer);
    };

    if (this.esEdicionEntrenamiento && this.formEntrenamiento.id !== null) {
      this.entrenadorService.updateEntrenamiento(this.formEntrenamiento.id, this.formEntrenamiento).subscribe(
        (data) => {
          const index = this.entrenamientos.findIndex(e => e.id === data.id);
          if (index !== -1) {
            this.entrenamientos[index] = data;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entrenamiento actualizado'
          });
          finalizar();
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el entrenamiento'
          });
          this.cargandoEntrenamiento = false;
        }
      );
    } else {
      this.entrenadorService.createEntrenamiento(this.formEntrenamiento).subscribe(
        (data) => {
          this.entrenamientos.push(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entrenamiento creado'
          });

          this.formEntrenamiento = {
            id: null,
            usuario: null,
            nombre: '',
            duracion_semanas: 1,
            entrenador: null,
            descripcion: '',
            semanas: []
          };

          finalizar();
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el entrenamiento'
          });
          this.cargandoEntrenamiento = false;
        }
      );
    }
  }


  eliminarAlimentacion(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta alimentación?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.entrenadorService.deleteAlimentacion(id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alimentación eliminada' });
            if (this.selectedTrainer) {
              this.verAlimentacion(this.selectedTrainer);
            } else {
              this.alimentaciones = this.alimentaciones.filter(a => a.id !== id);
            }
          },
          (error) => console.error(error)
        );
      }
    });
  }

  eliminarEntrenamiento(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este entrenamiento?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.entrenadorService.deleteEntrenamiento(id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrenamiento eliminado' });
            if (this.selectedTrainer) {
              this.verEntrenamiento(this.selectedTrainer);
            } else {
              this.entrenamientos = this.entrenamientos.filter(a => a.id !== id);
            }
          },
          (error) => console.error(error)
        );
      }
    });
  }

  verEntrenamiento(trainer: any) {
    this.cargandoPdialog = true;
    this.selectedTrainer = trainer;
    this.entrenamientos = [];
    this.dialogEntrenamiento = true;

    this.entrenadorService.getEntrenamientosPorUsuario(trainer.id).subscribe({
      next: (data) => {
        this.entrenamientos = (Array.isArray(data) ? data : []).map((entrenamiento: any) => ({
          ...entrenamiento,
          entrenador_nombre: typeof entrenamiento.entrenador === 'string' && isNaN(Number(entrenamiento.entrenador))
            ? entrenamiento.entrenador
            : this.nombreUsuarioPorId(entrenamiento.entrenador),
          usuario_nombre: typeof entrenamiento.usuario === 'string' && isNaN(Number(entrenamiento.usuario))
            ? entrenamiento.usuario
            : this.nombreUsuarioPorId(entrenamiento.usuario)
        }));
        this.cargandoPdialog = false;
      },
      error: (error) => {
        console.error('Error al cargar entrenamientos:', error);
        this.cargandoPdialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los planes de entrenamiento.'
        });
      }
    });
  }

  agregarEntrenamiento() {
    if (this.selectedTrainer) {
      this.formData.usuario = this.selectedTrainer.id;
      this.entrenadorService.createEntrenamiento(this.formData).subscribe(
        (data) => {
          this.entrenamientos.push(data);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrenamiento añadido' });
        },
        (error) => console.error(error)
      );
    }
  }

  filterCards(): void {
    const search = (this.searchValue || '').trim().toLowerCase();

    // Nombre de la ciudad seleccionada si aplica
    const ciudadSelObj = this.ciudad.find(c => c.id === this.selectedCiudad);
    const nombreCiudadSeleccionada = (ciudadSelObj?.nombre || '').trim().toLowerCase();

    let resultado = this.trainers.filter(trainer => {
      // 1. Texto de búsqueda: nombre, apellido, usuario, correo, ciudad
      if (search) {
        const nombreCompleto = `${trainer.first_name || ''} ${trainer.last_name || ''}`.toLowerCase();
        const usr = (trainer.username || '').toLowerCase();
        const mail = (trainer.email || '').toLowerCase();
        const cNorm = this.ciudadVisible(trainer).toLowerCase();

        const matchText = nombreCompleto.includes(search) ||
          usr.includes(search) ||
          mail.includes(search) ||
          cNorm.includes(search);

        if (!matchText) return false;
      }

      // 2. Filtro de Ciudad
      if (this.selectedCiudad !== null && this.selectedCiudad !== undefined) {
        const cRes = trainer?.ciudad_residencia;
        let matchCiudad = false;

        if (cRes) {
          if (typeof cRes === 'object') {
            if (cRes.id === this.selectedCiudad) matchCiudad = true;
            if (nombreCiudadSeleccionada && (cRes.nombre || '').trim().toLowerCase() === nombreCiudadSeleccionada) {
              matchCiudad = true;
            }
          } else if (typeof cRes === 'number') {
            if (cRes === this.selectedCiudad) matchCiudad = true;
          } else if (typeof cRes === 'string') {
            const cStr = cRes.trim().toLowerCase();
            if (nombreCiudadSeleccionada && cStr === nombreCiudadSeleccionada) matchCiudad = true;
            if (cStr === String(this.selectedCiudad).trim().toLowerCase()) matchCiudad = true;
          }
        }

        if (!matchCiudad) return false;
      }

      // 3. Filtro de Género
      if (this.selectedGenero) {
        const gName = (trainer.gender_name || '').trim().toLowerCase();
        const selG = this.selectedGenero.trim().toLowerCase();
        if (gName !== selG) return false;
      }

      // 4. Filtro de Rango de Edad
      if (this.selectedRangoEdad) {
        const edadNum = (trainer.edad !== null && trainer.edad !== undefined && !isNaN(Number(trainer.edad)))
          ? Number(trainer.edad)
          : null;

        switch (this.selectedRangoEdad) {
          case '<18':
            if (edadNum === null || edadNum >= 18) return false;
            break;
          case '18-29':
            if (edadNum === null || edadNum < 18 || edadNum > 29) return false;
            break;
          case '30-49':
            if (edadNum === null || edadNum < 30 || edadNum > 49) return false;
            break;
          case '>=50':
            if (edadNum === null || edadNum < 50) return false;
            break;
          case 'sin_dato':
            if (edadNum !== null && edadNum > 0) return false;
            break;
        }
      }

      return true;
    });

    // 5. Ordenamiento dinámico
    if (this.selectedOrden) {
      resultado = [...resultado].sort((a, b) => {
        const nombreA = this.nombreVisible(a).toLowerCase();
        const nombreB = this.nombreVisible(b).toLowerCase();
        const edadA = (a.edad && !isNaN(Number(a.edad))) ? Number(a.edad) : 0;
        const edadB = (b.edad && !isNaN(Number(b.edad))) ? Number(b.edad) : 0;

        switch (this.selectedOrden) {
          case 'nombre_asc':
            return nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });
          case 'nombre_desc':
            return nombreB.localeCompare(nombreA, 'es', { sensitivity: 'base' });
          case 'edad_asc':
            return edadA - edadB;
          case 'edad_desc':
            return edadB - edadA;
          case 'recientes':
            return (b.id || 0) - (a.id || 0);
          default:
            return 0;
        }
      });
    }

    this.filteredTrainers = resultado;
  }

  limpiarFiltros(): void {
    this.searchValue = '';
    this.selectedCiudad = null;
    this.selectedGenero = null;
    this.selectedRangoEdad = null;
    this.selectedOrden = 'nombre_asc';
    this.filterCards();
  }

  get hayFiltrosActivos(): boolean {
    return Boolean(
      (this.searchValue && this.searchValue.trim().length > 0) ||
      this.selectedCiudad !== null ||
      this.selectedGenero !== null ||
      this.selectedRangoEdad !== null ||
      this.selectedOrden !== 'nombre_asc'
    );
  }

  get selectedCiudadNombre(): string | null {
    if (!this.selectedCiudad) return null;
    const c = this.ciudad.find(item => item.id === this.selectedCiudad);
    return c ? c.nombre : null;
  }

  getLabelRangoEdad(val: string): string {
    const op = this.edadesOpciones.find(o => o.value === val);
    return op ? op.label : val;
  }
  

  filterByRole(role: string): void {
    if (role === 'Todos' || !role) {
      this.filteredTrainers = this.trainers;
    } else {
      this.filteredTrainers = this.trainers.filter(trainer => trainer.rolesId.name === role);
    }
  }

  nombreVisible(trainer: any): string {
    const nombre = [trainer?.first_name, trainer?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();

    return nombre || trainer?.username || 'Usuario';
  }

  ciudadVisible(trainer: any): string {
    if (!trainer) return '';
    if (typeof trainer.ciudad_residencia === 'string' && trainer.ciudad_residencia.trim()) {
      return trainer.ciudad_residencia.trim();
    }
    if (trainer.ciudad_residencia?.nombre) {
      return trainer.ciudad_residencia.nombre;
    }
    return '';
  }

  edadVisible(trainer: any): string {
    return trainer?.edad ? `${trainer.edad} años` : '';
  }

  nombreUsuarioPorId(usuarioId: number | string | null | undefined): string {
    if (!usuarioId) {
      return 'Desconocido';
    }

    const usuario = this.trainers.find((trainer) => Number(trainer.id) === Number(usuarioId));
    return usuario ? this.nombreVisible(usuario) : 'Desconocido';
  }

  getInitials(firstName?: string, lastName?: string, username?: string): string {
    const firstInitial = firstName?.trim().charAt(0) || '';
    const lastInitial = lastName?.trim().charAt(0) || '';
    const initials = `${firstInitial}${lastInitial}`.trim();

    return (initials || username?.trim().slice(0, 2) || 'US').toUpperCase();
  }

  abrirMedicion() {
    this.esEdicion = true;
    this.formData = {};
    this.dialogMedicion = true;
  }

  cerrarAliemtancion() {
    this.dialogAlimentacion = false;
    this.botonesDesactivados = true;

    // lógica real aquí
    setTimeout(() => {
      this.botonesDesactivados = false;
    }, 1000);
  }

  cerrarVerAliemtancion() {
    this.dialogVerAlimentacion = false
  }

  cerrarVerEntrenamiento() {
    this.dialogVerEntrenamiento = false
  }

  cerrarEntrenamiento() {
    this.dialogEntrenamiento = false
  }

  verPerfil(trainer: any) {
    this.cargandoPdialog = true;
    this.selectedTrainer = trainer;
  
    this.genero = trainer.gender_name || '';
  
    this.medicionService.obtenerMedicionesPorUsuario(trainer.id).subscribe(
      (mediciones) => {
        this.medicionesUsuario = mediciones.results;
        this.cargandoPdialog = false;
      },
      (error) => {
        console.error('Error al obtener mediciones:', error);
        this.cargandoPdialog = false;
      }
    );
  
    this.dialogMediciones = true;
  }
  

  cerrarMedicion(): void {
    this.botonesDesactivados = true;
    setTimeout(() => {
      this.botonesDesactivados = false;
    }, 400);
    this.dialogMedicion = false;
  }

  cerrarDialogo() {
    this.dialogMediciones = false;
    this.dialogAlimentacion = false;
    this.dialogFormularioAlimentacion = false;
  }

  cerrarDialogoAlimentacion() {
    this.dialogFormularioAlimentacion = false;
  }

  cerrarDialogoEntrenamiento() {
    this.dialogFormularioEntrenamiento = false;
  }

  guardarPerfil() {
    this.selectedTrainer = null;
  }

  guardarMedicion() {
    this.isGuardando = true;
    this.botonesDesactivados = true;
    if (this.formData) {
      if (this.formData.id) {
        this.medicionService.actualizarMedicion(this.formData.id, this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición actualizada' });
          if (this.selectedTrainer) {
            this.verPerfil(this.selectedTrainer);
          }
          this.dialogMedicion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
        });
      } else {
        this.formData.usuario = this.selectedTrainer?.id;
        this.medicionService.crearMedicion(this.formData).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medición creada' });
          if (this.selectedTrainer) {
            this.verPerfil(this.selectedTrainer);
          }
          this.dialogMedicion = false;
          this.isGuardando = false;
          this.botonesDesactivados = false;
        });
      }
    } else {
      console.log("ERRRROR EN EL FORM")
    }
  }

  getProfileImage(user: any): string {
    if (user?.avatar) {
      return `${this.base_user}${user.id}/descargar/`;
    }
    return 'assets/avatars/user.png';
  }  

  getMediciones() {
    this.medicionService.obtenerMediciones().subscribe(
      (response: any) => {
        this.mediciones = response;
      }
    )
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


  abrirNuevaMedicion(): void {
    this.esEdicion = true;
    this.formData = {};
    this.dialogMedicion = true;
  }

  getICCClass(icc: number): string {
    const gen = this.generoDeportista || this.genero;
    if (gen === 'Masculino') {
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
    const gen = this.generoDeportista || this.genero;
    if (gen === 'Masculino') {
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

  /**
   * Etiquetas de clasificación clínica con texto + color para accesibilidad.
   */
  getIMCLabel(imc: number): string {
    if (imc == null || isNaN(imc)) return '—';
    if (imc < 18.5) return 'Bajo peso';
    if (imc <= 24.9) return 'Normal';
    if (imc <= 29.9) return 'Sobrepeso';
    return 'Obesidad';
  }

  getICCLabel(icc: number): string {
    if (icc == null || isNaN(icc)) return '—';
    const clase = this.getICCClass(icc);
    if (clase === 'icc-bajo') return 'Bajo';
    if (clase === 'icc-moderado') return 'Moderado';
    return 'Alto';
  }

  getGrasaLabel(grasa: number): string {
    if (grasa == null || isNaN(grasa)) return '—';
    const clase = this.getGrasaClass(grasa);
    if (clase === 'grasa-bajo') return 'Baja';
    if (clase === 'grasa-normal') return 'Normal';
    return 'Alta';
  }

  hasGrasa(grasa: any): boolean {
    return grasa !== null && grasa !== undefined && grasa !== '' && !isNaN(Number(grasa)) && Number(grasa) > 0;
  }

  get ultimaMedicion(): any {
    return this.medicionesUsuario && this.medicionesUsuario.length ? this.medicionesUsuario[0] : null;
  }

  get ultimaAlimentacion(): any {
    return this.alimentaciones && this.alimentaciones.length ? this.alimentaciones[0] : null;
  }

  get promedioCalorias(): number {
    if (!this.alimentaciones || !this.alimentaciones.length) return 0;
    const total = this.alimentaciones.reduce((acc, item) => acc + (Number(item.calorias_diarias) || 0), 0);
    return Math.round(total / this.alimentaciones.length);
  }

  get ultimoEntrenamiento(): any {
    return this.entrenamientos && this.entrenamientos.length ? this.entrenamientos[0] : null;
  }

  get totalSemanasEntrenamiento(): number {
    if (!this.entrenamientos || !this.entrenamientos.length) return 0;
    return this.entrenamientos.reduce((acc, item) => acc + (Number(item.duracion_semanas) || 0), 0);
  }

  get edadDeportista(): number | null {
    const edad = Number(this.selectedTrainer?.edad);
    return Number.isFinite(edad) && edad > 0 ? edad : null;
  }

  get generoDeportista(): string {
    const g = (this.selectedTrainer?.gender_name || this.genero || '').toLowerCase();
    if (g.includes('masc') || g === 'hombre' || g === 'm') return 'Masculino';
    if (g.includes('fem') || g === 'mujer' || g === 'f') return 'Femenino';
    return '';
  }

  get generoConocido(): boolean {
    return this.generoDeportista === 'Masculino' || this.generoDeportista === 'Femenino';
  }

  get soloLectura(): boolean {
    return !this.esEdicion;
  }

  get esNuevaMedicion(): boolean {
    return !this.formData?.id;
  }

  get tituloModalMedicion(): string {
    if (this.soloLectura) return 'Detalles de la medición';
    return this.esNuevaMedicion ? 'Registrar nueva medición' : 'Editar medición';
  }

  private num(valor: any): number | null {
    const n = Number(valor);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  get imcPrevisto(): number | null {
    const talla = this.num(this.formData?.talla);
    const peso = this.num(this.formData?.peso);
    if (!talla || !peso) return null;
    return Math.round((peso / (talla * talla)) * 100) / 100;
  }

  get iccPrevisto(): number | null {
    const cintura = this.num(this.formData?.perimetro_cintura);
    const cadera = this.num(this.formData?.perimetro_cadera);
    if (!cintura || !cadera) return null;
    return Math.round((cintura / cadera) * 100) / 100;
  }

  get grasaPrevista(): number | null {
    const imc = this.imcPrevisto;
    const edad = this.edadDeportista;
    if (imc === null || edad === null || !this.generoConocido) return null;
    const ajuste = this.generoDeportista === 'Masculino' ? 16.2 : 5.4;
    return Math.round(((1.20 * imc) + (0.23 * edad) - ajuste) * 100) / 100;
  }

  get faltaParaGrasa(): string | null {
    const faltantes: string[] = [];
    if (!this.generoConocido) faltantes.push('género');
    if (this.edadDeportista === null) faltantes.push('edad');
    return faltantes.length ? faltantes.join(' y ') : null;
  }

  get pesoSaludable(): string | null {
    const talla = this.num(this.formData?.talla);
    if (!talla) return null;
    const minimo = Math.round(18.5 * talla * talla * 10) / 10;
    const maximo = Math.round(24.9 * talla * talla * 10) / 10;
    return `${minimo} - ${maximo}`;
  }

  get indiceCinturaAltura(): number | null {
    const cintura = this.num(this.formData?.perimetro_cintura);
    const talla = this.num(this.formData?.talla);
    if (!cintura || !talla) return null;
    return Math.round((cintura / (talla * 100)) * 100) / 100;
  }

  get icaEnRiesgo(): boolean {
    const ica = this.indiceCinturaAltura;
    return ica !== null && ica >= 0.5;
  }

  get fuerzaMaximaPrevista(): number | null {
    const derecha = this.num(this.formData?.fuerza_manoderecha);
    const izquierda = this.num(this.formData?.fuerza_manoizquierda);
    if (!derecha || !izquierda) return null;
    return Math.round(((derecha + izquierda) / 2) * 10) / 10;
  }

  get asimetriaFuerza(): number | null {
    const derecha = this.num(this.formData?.fuerza_manoderecha);
    const izquierda = this.num(this.formData?.fuerza_manoizquierda);
    if (!derecha || !izquierda) return null;
    const mayor = Math.max(derecha, izquierda);
    return Math.round((Math.abs(derecha - izquierda) / mayor) * 1000) / 10;
  }

  get asimetriaRelevante(): boolean {
    const a = this.asimetriaFuerza;
    return a !== null && a > 10;
  }

  get fuerzaRelativa(): number | null {
    const fuerza = this.fuerzaMaximaPrevista;
    const peso = this.num(this.formData?.peso);
    if (fuerza === null || !peso) return null;
    return Math.round((fuerza / peso) * 100) / 100;
  }

  get progresoExplosivo(): number | null {
    const inicial = this.num(this.formData?.fuerza_explosiva_i);
    const final = this.num(this.formData?.fuerza_explosiva_f);
    if (!inicial || !final) return null;
    return Math.round((final - inicial) * 10) / 10;
  }

  seleccionarTodos(event: any) {
    const seleccionado = event.target?.checked ?? !this.todosAtletasRegionSeleccionados;
    this.personasRegionFiltradas.forEach(persona => persona.seleccionado = seleccionado);
  }

  get ciudadesRegionOpciones(): Array<{ id: any; nombre: string }> {
    const total = this.personas.length;
    const lista: Array<{ id: any; nombre: string }> = [
      { id: null, nombre: `Todas las regiones / ciudades (${total} deportistas)` }
    ];

    (this.ciudad || []).forEach(c => {
      const count = this.personas.filter(p => this.personaCoincideConCiudad(p, c.id)).length;
      lista.push({
        id: c.id,
        nombre: `${c.nombre} (${count} deportistas)`
      });
    });

    return lista;
  }

  personaCoincideConCiudad(persona: any, ciudadFiltro: any): boolean {
    if (ciudadFiltro === null || ciudadFiltro === undefined || ciudadFiltro === 'TODAS' || ciudadFiltro === '') {
      return true;
    }

    const cRes = persona?.ciudad_residencia;
    if (!cRes) return false;

    const ciudadObj = this.ciudad.find(c => c.id === ciudadFiltro);
    const nombreFiltro = (ciudadObj?.nombre || String(ciudadFiltro)).trim().toLowerCase();

    if (typeof cRes === 'object' && cRes !== null) {
      if (cRes.id === ciudadFiltro || String(cRes.id) === String(ciudadFiltro)) return true;
      const cNombre = (cRes.nombre || '').trim().toLowerCase();
      if (nombreFiltro && (cNombre === nombreFiltro || cNombre.includes(nombreFiltro) || nombreFiltro.includes(cNombre))) return true;
    } else if (typeof cRes === 'number') {
      if (cRes === ciudadFiltro || String(cRes) === String(ciudadFiltro)) return true;
    } else if (typeof cRes === 'string') {
      const cStr = cRes.trim().toLowerCase();
      if (nombreFiltro && (cStr === nombreFiltro || cStr.includes(nombreFiltro) || nombreFiltro.includes(cStr))) return true;
      if (String(ciudadFiltro).trim().toLowerCase() === cStr) return true;
    }

    return false;
  }

  get personasRegionFiltradas(): Person[] {
    const search = (this.busquedaAtletaRegion || '').trim().toLowerCase();

    return this.personas.filter(persona => {
      // 1. Filtro de ciudad
      if (!this.personaCoincideConCiudad(persona, this.regionSelectedCiudad)) {
        return false;
      }

      // 2. Filtro de texto de búsqueda
      if (search) {
        const nombreCompleto = `${persona.nombres || ''} ${persona.apellidos || ''}`.trim().toLowerCase();
        const usr = (persona.username || '').toLowerCase();
        const email = (persona.email || '').toLowerCase();
        const cNom = this.ciudadNombrePersona(persona).toLowerCase();

        const match = nombreCompleto.includes(search) || usr.includes(search) || email.includes(search) || cNom.includes(search);
        if (!match) return false;
      }

      return true;
    });
  }

  get totalAtletasRegion(): number {
    return this.personasRegionFiltradas.length;
  }

  get atletasSeleccionadosCount(): number {
    return this.personasRegionFiltradas.filter(p => p.seleccionado).length;
  }

  get todosAtletasRegionSeleccionados(): boolean {
    const visibles = this.personasRegionFiltradas;
    return visibles.length > 0 && visibles.every(p => p.seleccionado);
  }

  seleccionarTodosRegion(event: any): void {
    const estado = typeof event === 'boolean' ? event : event?.target?.checked ?? !this.todosAtletasRegionSeleccionados;
    this.personasRegionFiltradas.forEach(p => p.seleccionado = estado);
  }

  toggleSeleccionarTodosRegion(estado: boolean): void {
    this.personasRegionFiltradas.forEach(p => p.seleccionado = estado);
  }

  toggleAtletaSeleccion(persona: Person): void {
    persona.seleccionado = !persona.seleccionado;
  }

  ciudadNombrePersona(persona: any): string {
    if (!persona) return 'No especificada';
    const cRes = persona.ciudad_residencia;
    if (typeof cRes === 'object' && cRes?.nombre) return cRes.nombre;
    if (typeof cRes === 'string' && cRes.trim()) return cRes.trim();
    if (persona.ciudad_residencia_nombre) return persona.ciudad_residencia_nombre;
    return 'Sin ciudad';
  }

  onDuracionSemanasChange(): void {
    if (!this.formEntrenamiento.duracion_semanas || this.formEntrenamiento.duracion_semanas < 1) {
      this.formEntrenamiento.duracion_semanas = 1;
    }
    this.generarSemanas();
    if (this.selectedSemanaRegionIndex >= this.formEntrenamiento.semanas.length) {
      this.selectedSemanaRegionIndex = 0;
    }
  }

  setDuracionSemanasPreset(semanas: number): void {
    this.formEntrenamiento.duracion_semanas = semanas;
    this.generarSemanas();
    if (this.selectedSemanaRegionIndex >= this.formEntrenamiento.semanas.length) {
      this.selectedSemanaRegionIndex = 0;
    }
  }

  setCaloriasPreset(calorias: number): void {
    this.formAlimentacion.calorias_diarias = calorias;
  }

  seleccionarSemanaRegion(index: number): void {
    this.selectedSemanaRegionIndex = index;
  }

  copiarSemanaATodas(semanaIndex: number): void {
    const semanaFuente = this.formEntrenamiento.semanas[semanaIndex];
    if (!semanaFuente) return;

    this.formEntrenamiento.semanas.forEach((sem, idx) => {
      if (idx !== semanaIndex) {
        sem.ejercicios = semanaFuente.ejercicios.map((ej: any) => ({
          tipo: ej.tipo,
          dias: [...ej.dias],
          sugerencias: ej.sugerencias ? { ...ej.sugerencias } : {}
        }));
      }
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Semanas Sincronizadas',
      detail: `Se copió la configuración de la Semana ${semanaIndex + 1} a todas las demás semanas.`
    });
  }

  filtrarPorCiudad(ciudadId: number | null) {
    this.regionSelectedCiudad = ciudadId;
    this.personasFiltradas = this.personas.filter(persona => this.personaCoincideConCiudad(persona, ciudadId));
  }      

  verEntrenamientosMasivos() {
    this.busquedaAtletaRegion = '';
    this.selectedSemanaRegionIndex = 0;
    this.guardandoMasivo = false;
    this.progresoGuardado = 0;
    this.textoProgresoGuardado = '';
    this.regionSelectedCiudad = this.selectedCiudad || null;

    // Asegurar que las personas estén marcadas como seleccionadas por defecto
    this.personas.forEach(p => p.seleccionado = true);
    this.personasFiltradas = [...this.personas];

    const entrenadorDefault = this.filteredTrainers2.length > 0 ? this.filteredTrainers2[0].id : null;

    this.formEntrenamiento = {
      id: null,
      usuario: null,
      nombre: '',
      duracion_semanas: 1,
      entrenador: entrenadorDefault,
      descripcion: '',
      semanas: [] as any[]
    };

    this.generarSemanas();
    this.dialogEntrenamientoRegion = true;
  }

  verAlimentacionesMasivas() {
    this.busquedaAtletaRegion = '';
    this.guardandoMasivo = false;
    this.progresoGuardado = 0;
    this.textoProgresoGuardado = '';
    this.regionSelectedCiudad = this.selectedCiudad || null;

    this.personas.forEach(p => p.seleccionado = true);
    this.personasFiltradas = [...this.personas];

    const entrenadorDefault = this.filteredTrainers2.length > 0 ? this.filteredTrainers2[0].id : null;

    this.formAlimentacion = {
      id: 0,
      nombre: '',
      descripcion: '',
      calorias_diarias: 2000,
      entrenador: entrenadorDefault,
      usuario: ''
    };

    this.dialogAlimentacionRegion = true;
  }

  cerrarEntrenamientosMasivos() {
    if (this.guardandoMasivo) return;
    this.dialogEntrenamientoRegion = false;
    this.formEntrenamiento = {
      id: null,
      usuario: null,
      nombre: '',
      duracion_semanas: 1,
      entrenador: null,
      descripcion: '',
      semanas: [] as any[]
    };
  }

  cerrarAlimentacionesMasivas() {
    if (this.guardandoMasivo) return;
    this.dialogAlimentacionRegion = false;
  }

  async guardarAlimentacionRegion() {
    const usuariosSeleccionados = this.personasRegionFiltradas
      .filter(p => p.seleccionado)
      .map(p => p.user);

    if (usuariosSeleccionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe seleccionar al menos un deportista de la lista.'
      });
      return;
    }

    if (!this.formAlimentacion.nombre?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor ingrese el nombre del plan de alimentación.'
      });
      return;
    }

    if (!this.formAlimentacion.calorias_diarias || this.formAlimentacion.calorias_diarias <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor ingrese las calorías diarias recomendadas.'
      });
      return;
    }

    if (!this.formAlimentacion.entrenador) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor seleccione un entrenador responsable.'
      });
      return;
    }

    this.cargandoEntrenamiento = true;
    this.guardandoMasivo = true;
    this.botonesDesactivados = true;
    this.progresoGuardado = 0;

    const total = usuariosSeleccionados.length;
    let exitos = 0;
    const fallos: string[] = [];

    const alimentacionBase = {
      nombre: this.formAlimentacion.nombre.trim(),
      descripcion: this.formAlimentacion.descripcion?.trim() || '',
      calorias_diarias: this.formAlimentacion.calorias_diarias,
      entrenador: this.formAlimentacion.entrenador
    };

    for (let i = 0; i < total; i++) {
      const usuario_id = usuariosSeleccionados[i];
      const persona = this.personas.find(p => p.user === usuario_id);
      const nombreAtleta = persona ? `${persona.nombres || ''} ${persona.apellidos || ''}`.trim() : `Atleta #${usuario_id}`;

      this.textoProgresoGuardado = `Asignando nutrición a ${nombreAtleta} (${i + 1} de ${total})...`;
      this.progresoGuardado = Math.round(((i + 1) / total) * 100);

      const payload = { ...alimentacionBase, usuario: usuario_id };

      try {
        await this.entrenadorService.createAlimentacion(payload).toPromise();
        exitos++;
      } catch (error: any) {
        console.error(`❌ Error al asignar alimentación a ${usuario_id}:`, error);
        fallos.push(nombreAtleta);
      }
    }

    this.cargandoEntrenamiento = false;
    this.guardandoMasivo = false;
    this.botonesDesactivados = false;
    this.dialogAlimentacionRegion = false;

    if (exitos > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Plan Nutricional Creado',
        detail: `Se asignó con éxito el plan "${alimentacionBase.nombre}" a ${exitos} deportista(s).`
      });
      this.formAlimentacion = {
        id: 0,
        nombre: '',
        descripcion: '',
        calorias_diarias: 2000,
        entrenador: '',
        usuario: ''
      };
    }

    if (fallos.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Asignaciones Fallidas',
        detail: `No se pudo asignar a: ${fallos.slice(0, 3).join(', ')}${fallos.length > 3 ? ` y ${fallos.length - 3} más` : ''}.`
      });
    }
  }

  async guardarEntrenamientoRegion() {
    const usuariosSeleccionados = this.personasRegionFiltradas
      .filter(p => p.seleccionado)
      .map(p => p.user);

    if (usuariosSeleccionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe seleccionar al menos un deportista de la lista.'
      });
      return;
    }

    if (!this.formEntrenamiento.nombre?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor ingrese el nombre del plan de entrenamiento.'
      });
      return;
    }

    if (!this.formEntrenamiento.entrenador) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor seleccione un entrenador responsable.'
      });
      return;
    }

    if (!this.formEntrenamiento.duracion_semanas || this.formEntrenamiento.duracion_semanas < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La duración debe ser de al menos 1 semana.'
      });
      return;
    }

    this.cargandoEntrenamiento = true;
    this.guardandoMasivo = true;
    this.botonesDesactivados = true;
    this.progresoGuardado = 0;

    const total = usuariosSeleccionados.length;
    let exitos = 0;
    const fallos: string[] = [];

    const entrenamientoBase = {
      nombre: this.formEntrenamiento.nombre.trim(),
      descripcion: this.formEntrenamiento.descripcion?.trim() || '',
      duracion_semanas: this.formEntrenamiento.duracion_semanas,
      entrenador: this.formEntrenamiento.entrenador,
      semanas: this.formEntrenamiento.semanas
    };

    for (let i = 0; i < total; i++) {
      const usuario_id = usuariosSeleccionados[i];
      const persona = this.personas.find(p => p.user === usuario_id);
      const nombreAtleta = persona ? `${persona.nombres || ''} ${persona.apellidos || ''}`.trim() : `Atleta #${usuario_id}`;

      this.textoProgresoGuardado = `Asignando rutina a ${nombreAtleta} (${i + 1} de ${total})...`;
      this.progresoGuardado = Math.round(((i + 1) / total) * 100);

      const payload = { ...entrenamientoBase, usuario: usuario_id };

      try {
        await this.entrenadorService.createEntrenamiento(payload).toPromise();
        exitos++;
      } catch (error: any) {
        console.error(`❌ Error al asignar entrenamiento a ${usuario_id}:`, error);
        fallos.push(nombreAtleta);
      }
    }

    this.cargandoEntrenamiento = false;
    this.guardandoMasivo = false;
    this.botonesDesactivados = false;
    this.dialogEntrenamientoRegion = false;

    if (exitos > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Plan Regional Creado',
        detail: `Se asignó con éxito el plan "${entrenamientoBase.nombre}" a ${exitos} deportista(s).`
      });
    }

    if (fallos.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Asignaciones Fallidas',
        detail: `No se pudo asignar a: ${fallos.slice(0, 3).join(', ')}${fallos.length > 3 ? ` y ${fallos.length - 3} más` : ''}.`
      });
    }

    // Limpiar formulario
    this.formEntrenamiento = {
      id: null,
      usuario: null,
      nombre: '',
      duracion_semanas: 1,
      entrenador: null,
      descripcion: '',
      semanas: []
    };
  }
}

interface Ejercicio {
  tipo: string;
  dias: boolean[];
  sugerencias?: { [key: string]: string[] };
}