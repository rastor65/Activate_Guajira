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
  dialogFormularioEntrenamiento: boolean = false;
  dialogFormularioAlimentacion: boolean = false;
  public cargandoEntrenamiento: boolean = false;
  cargandoCiudades: boolean = false; 
  isGuardando: boolean = false;
  botonesDesactivados: boolean = false;
  cargandoPdialog: boolean = false;
  public selectedCiudad: number | null = null;

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
      ejercicio.sugerencias[dia] = res.sugerencias; this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Sugerencias actualizada' });
    }, (error) => {
      console.error('Error al editar sugerencia:', error);
      this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'No se pudo editar la sugerencia.'

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
    this.cargando = true;
    const categoriaCiudadId = 7;
    this.ciudad = [];
    this.userService.getTablaMaestraPorCategoria(categoriaCiudadId).subscribe({
      next: (ciudades: any[]) => {
        this.ciudad = ciudades; // Ya viene como array de ciudades
        console.log('✅ Todas las ciudades cargadas:', this.ciudad);
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar ciudades:', error);
        this.cargando = false;
      }
    });
  }

  getTrainers(): void {
    this.cargando = true;
    this.userService.getlistusers().subscribe(
      (entrenadores: any[]) => {
        this.trainers = entrenadores;
        this.filteredTrainers = entrenadores;
        this.personas = entrenadores.map((trainer: any) => ({
          ...trainer,
          seleccionado: true,
          ciudad_residencia: trainer.ciudad_residencia,
          nombres: trainer.first_name,
          apellidos: trainer.last_name,
          user: trainer.id
        }));

        this.filtrarEntrenadoresPorRol()
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
    this.dialogAlimentacion = true;
    this.selectedTrainer = trainer;
    this.entrenadorService.getAlimentacionesPorUsuario(trainer.id).subscribe(
      (data) => {
        this.alimentaciones = data;
        this.dialogAlimentacion = true;
        this.alimentaciones.forEach((alimentacion: any) => {
          if (alimentacion.entrenador) {
            this.getNombre(alimentacion.entrenador).subscribe((persona: any) => {
              if (persona.length > 0) {
                alimentacion.entrenador = `${persona[0].nombres} ${persona[0].apellidos}`;
                this.cargandoPdialog = false;
              } else {
                alimentacion.entrenador = "Desconocido"; // Si no hay datos
                this.cargandoPdialog = false;
              }
            });
          }
          if (alimentacion.usuario) {
            this.getNombre(alimentacion.usuario).subscribe((persona: any) => {
              if (persona.length > 0) {
                alimentacion.usuario = `${persona[0].nombres} ${persona[0].apellidos}`;
                this.cargandoPdialog = false;
              } else {
                alimentacion.usuario = "Desconocido"; // Si no hay datos
                this.cargandoPdialog = false;
              }
            });
          }
        });
      },
      (error) => console.error(error)
    );
  }

  getNombre(entrenadorId: number): Observable<Person[]> {
    return this.userService.getPeopleByUserId(entrenadorId);
  }

  verUnaAlimentacion(alimentacion: any) {
    this.selectedAlimentacion = alimentacion;
    this.entrenadorService.getOneAlimentacion(alimentacion.id).subscribe(
      (data) => {
        this.alimentacion = data;
        console.log(this.alimentacion)
        this.dialogVerAlimentacion = true;
      },
      (error) => console.error(error)
    );
  }

  verUnEntrenamiento(entrenamiento: any) {
    this.selectedEntrenamiento = entrenamiento;
    this.entrenadorService.getOneEntrenamiento(entrenamiento.id).subscribe(
      (data) => {
        this.entrenamiento = data;
        console.log(this.entrenamiento)
        this.dialogVerEntrenamiento = true;
      },
      (error) => console.error(error)
    );
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
            this.alimentaciones = this.alimentaciones.filter(a => a.id !== id);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alimentación eliminada' });
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
            this.entrenamientos = this.entrenamientos.filter(a => a.id !== id);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrenamiento eliminado' });
          },
          (error) => console.error(error)
        );
      }
    });
  }

  verEntrenamiento(trainer: any) {
    this.cargandoPdialog = true;
    this.selectedTrainer = trainer;
    this.entrenadorService.getEntrenamientosPorUsuario(trainer.id).subscribe(
      (data) => {
        this.entrenamientos = data;
        this.entrenamientos.forEach((entrenamiento: any) => {
          if (entrenamiento.entrenador) {
            this.getNombre(entrenamiento.entrenador).subscribe((persona: any) => {
              if (persona.length > 0) {
                entrenamiento.entrenador = `${persona[0].nombres} ${persona[0].apellidos}`;
                this.cargandoPdialog = false;
              } else {
                entrenamiento.entrenador = "Desconocido"; // Si no hay datos
                this.cargandoPdialog = false;
              }
            });
          }
          if (entrenamiento.usuario) {
            this.getNombre(entrenamiento.usuario).subscribe((persona: any) => {
              if (persona.length > 0) {
                entrenamiento.usuario = `${persona[0].nombres} ${persona[0].apellidos}`;
                this.cargandoPdialog = false;
              } else {
                entrenamiento.usuario = "Desconocido"; // Si no hay datos
                this.cargandoPdialog = false;
              }
            });
          }
        });
      },
      (error) => console.error(error)
    );
    this.dialogEntrenamiento = true;
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
    const search = this.searchValue?.toLowerCase() || '';
  
    this.filteredTrainers = this.trainers.filter(trainer => {
      const matchesText = 
        (trainer.first_name?.toLowerCase() || '').includes(search) ||
        (trainer.last_name?.toLowerCase() || '').includes(search) ||
        (trainer.email?.toLowerCase() || '').includes(search) ||
        (trainer.username?.toLowerCase() || '').includes(search);
  
      const matchesCiudad = !this.selectedCiudad || trainer.ciudad_residencia?.id === this.selectedCiudad;
  
      return matchesText && matchesCiudad;
    });
  }
  

  filterByRole(role: string): void {
    if (role === 'Todos' || !role) {
      this.filteredTrainers = this.trainers;
    } else {
      this.filteredTrainers = this.trainers.filter(trainer => trainer.rolesId.name === role);
    }
  }

  getInitials(firstName?: string, lastName?: string): string {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
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
    this.selectedTrainer = trainer;
  
    this.genero = trainer.gender_name || '';
  
    this.medicionService.obtenerMedicionesPorUsuario(trainer.id).subscribe(
      (mediciones) => {
        this.medicionesUsuario = mediciones.results;
      },
      (error) => {
        console.error('Error al obtener mediciones:', error);
      }
    );
  
    this.dialogMediciones = true;
  }
  

  cerrarMedicion() {
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


  seleccionarTodos(event: any) {
    const seleccionado = event.target.checked;
    this.personasFiltradas.forEach(persona => persona.seleccionado = seleccionado);
  }

  filtrarPorCiudad(ciudadId: number | null) {
    if (ciudadId) {
      this.personasFiltradas = this.personas.filter(persona => {
        const ciudad = persona.ciudad_residencia;
  
        if (!ciudad) return false;
  
        if (typeof ciudad === 'object') {
          return (ciudad as { id: number }).id === ciudadId;
        }
  
        return ciudad === ciudadId;
      });
    } else {
      this.personasFiltradas = [...this.personas];
    }
  }      

  verEntrenamientosMasivos() {
    this.dialogEntrenamientoRegion = true;
  }

  verAlimentacionesMasivas() {
    this.dialogAlimentacionRegion = true;
  }

  cerrarEntrenamientosMasivos() {
    this.dialogEntrenamientoRegion = false;
    this.formEntrenamiento = {
      id: null,
      usuario: null,
      nombre: '',
      duracion_semanas: 0,
      entrenador: null,
      descripcion: '',
      semanas: [] as any[]
    };
  }

  cerrarAlimentacionesMasivas() {
    this.dialogAlimentacionRegion = false;
  }

  guardarAlimentacionRegion() {
    this.isGuardando = true;
    this.botonesDesactivados = true;
    const usuariosSeleccionados = this.personasFiltradas.filter(p => p.seleccionado).map(p => p.user);
    if (usuariosSeleccionados.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Debe seleccionar al menos un usuario.' });
      this.isGuardando = false;
      this.botonesDesactivados = false;
      return;
    }

    if (!this.formAlimentacion.nombre || !this.formAlimentacion.entrenador || !this.formAlimentacion.calorias_diarias) {
      this.messageService.add({
        severity: 'warn', summary: 'Validación', detail: 'Debe completar todos los campos del formulario.'
      }); 
      this.isGuardando = false;
      this.botonesDesactivados = false;
      return;
    }

    this.cargandoEntrenamiento = true;

    const alimentacionBase = {
      nombre: this.formAlimentacion.nombre,
      descripcion: this.formAlimentacion.descripcion,
      calorias_diarias: this.formAlimentacion.calorias_diarias,
      entrenador: this.formAlimentacion.entrenador
    };

    const peticiones = usuariosSeleccionados.map(usuario_id => {
      const alimentacion = {
        ...alimentacionBase,
        usuario: usuario_id
      };
      return this.entrenadorService.createAlimentacion(alimentacion).toPromise();
    });

    Promise.all(peticiones).then(respuestas => {
      this.messageService.add({
        severity: 'success', summary: 'Éxito', detail: `Se asignó el plan a ${respuestas.length} usuarios correctamente.`
      });
      this.isGuardando = false;
      this.botonesDesactivados = false;
      this.dialogAlimentacionRegion = false;
      this.cargandoEntrenamiento = false;
      this.formAlimentacion = {
        id: 0,
        nombre: '',
        descripcion: '',
        calorias_diarias: 0,
        entrenador: '',
        usuario: ''
      };
    }).catch(error => {
      console.error('Error al asignar planes de alimentación:', error);
      this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'Ocurrió un error al asignar los planes.'
      });
      this.cargandoEntrenamiento = false;
      this.isGuardando = false;
      this.botonesDesactivados = false;
    });
  }

  guardarEntrenamientoRegion() {
    const usuariosSeleccionados = this.personasFiltradas.filter(p => p.seleccionado).map(p => p.user);

    if (usuariosSeleccionados.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Debe seleccionar al menos un usuario.' }); return;
    }

    if (!this.formEntrenamiento.nombre || !this.formEntrenamiento.entrenador || !this.formEntrenamiento.duracion_semanas) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Debe completar todos los campos del formulario.' }); return;
    }

    this.cargandoEntrenamiento = true;

    const entrenamientoBase = {
      nombre: this.formEntrenamiento.nombre,
      descripcion: this.formEntrenamiento.descripcion,
      duracion_semanas: this.formEntrenamiento.duracion_semanas,
      entrenador: this.formEntrenamiento.entrenador,
      semanas: this.formEntrenamiento.semanas
    };

    const peticiones = usuariosSeleccionados.map(usuario_id => {
      const entrenamiento = {
        ...entrenamientoBase,
        usuario: usuario_id
      }; return this.entrenadorService.createEntrenamiento(entrenamiento).toPromise();
    });

    Promise.all(peticiones).then(respuestas => {
      this.messageService.add({
        severity: 'success', summary: 'Éxito', detail: `Se asignó el plan a ${respuestas.length} usuarios correctamente.`
      });
      this.dialogEntrenamientoRegion = false;
      this.cargandoEntrenamiento = false;
      this.formEntrenamiento = {
        id: null,
        usuario: null,
        nombre: '',
        duracion_semanas: 1,
        entrenador: null,
        descripcion: '',
        semanas: []
      };
    }).catch(error => {
      console.error('Error al asignar entrenamientos:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al asignar los planes.' });
      this.cargandoEntrenamiento = false;
    });
  }

  hasEjerciciosParaDia(dia: string): boolean {
    if (!this.selectedEntrenamiento?.semanas)
      return false;
    const diaIndex = this.diasSemana.indexOf(dia);
    return this.selectedEntrenamiento.semanas.some(
      (semana: any) => semana.ejercicios.some(
        (ejercicio: any) => ejercicio.dias[diaIndex]));
  }
}

interface Ejercicio {
  tipo: string;
  dias: boolean[];
  sugerencias?: { [key: string]: string[] };
}