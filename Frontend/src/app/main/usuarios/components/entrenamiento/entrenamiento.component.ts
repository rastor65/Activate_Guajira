import { Component, OnInit } from '@angular/core';
import { EntrenadorService } from 'src/app/core/services/usuarios/entrenador.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user/person';
import { Person } from 'src/app/models/user/person';

@Component({
  standalone: false,
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.component.html',
  styleUrls: ['./entrenamiento.component.css']
})
export class EntrenamientoComponent implements OnInit {
  entrenamientos: any[] = [];
  usuarioId: number | undefined;
  public person: Person | null = null;
  public profileImage = '';
  diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  expandedEntrenamientoId: number | null = null;
  selectedEntrenamiento: any = null;
  selectedSemanaIndex: number = 0;
  selectedDiaDetalle: string = 'TODOS';
  isLoading: boolean = true;

  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
    consentimiento: false,
  }

  constructor(
    private entrenadorService: EntrenadorService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.usuarioId = this.authService.getUserId();
    this.loadUser();
    this.getEntrenamientos();
  }

  seleccionarPlan(plan: any): void {
    this.selectedEntrenamiento = plan;
    this.selectedSemanaIndex = 0;
    this.selectedDiaDetalle = 'TODOS';
    this.expandedEntrenamientoId = plan?.id || null;
  }

  seleccionarSemana(index: number): void {
    this.selectedSemanaIndex = index;
  }

  seleccionarDia(dia: string): void {
    this.selectedDiaDetalle = dia;
  }

  getSemanasDetalle(): any[] {
    return this.selectedEntrenamiento?.semanas || [];
  }

  hasEjerciciosParaDia(dia: string, semana?: any): boolean {
    const sem = semana || this.selectedEntrenamiento?.semanas?.[this.selectedSemanaIndex];
    if (!sem?.ejercicios?.length) return false;
    const diaIdx = this.diasSemana.indexOf(dia);
    if (diaIdx === -1) return false;
    return sem.ejercicios.some((e: any) => e.dias?.[diaIdx]);
  }

  getEjerciciosParaDia(dia: string, semana?: any): any[] {
    const sem = semana || this.selectedEntrenamiento?.semanas?.[this.selectedSemanaIndex];
    if (!sem?.ejercicios?.length) return [];
    const diaIdx = this.diasSemana.indexOf(dia);
    if (diaIdx === -1) return [];
    return sem.ejercicios.filter((e: any) => e.dias?.[diaIdx]);
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

  getEntrenamientos() {
    if (this.usuarioId != undefined) {
      this.entrenadorService.getEntrenamientosPorUsuario(this.usuarioId).subscribe((data) => {
        this.entrenamientos = (Array.isArray(data) ? data : []).sort((a: any, b: any) => {
          if (a.activo && !b.activo) return -1;
          if (!a.activo && b.activo) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        console.log("Entrenamientos: ", this.entrenamientos);
  
        this.entrenamientos.forEach((entrenamiento: any) => {
          if (entrenamiento.entrenador) {
            this.getEntrenadorNombre(entrenamiento.entrenador).subscribe((persona) => {
              if (persona.length > 0) {
                entrenamiento.entrenador = `${persona[0].nombres} ${persona[0].apellidos}`;
              } else {
                entrenamiento.entrenador = "Desconocido";
              }
            });
          }
        });
  
        // Seleccionar por defecto el plan activo o el primer disponible
        const planActivo = this.entrenamientos.find((e: any) => e.activo);
        if (planActivo) {
          this.seleccionarPlan(planActivo);
        } else if (this.entrenamientos.length > 0) {
          this.seleccionarPlan(this.entrenamientos[0]);
        }
      });
    }
  }  

  getEntrenadorNombre(entrenadorId: number): Observable<Person[]> {
    return this.userService.getPeopleByUserId(entrenadorId);
  }

  loadUser() {
    if (this.usuarioId !== undefined) {
      forkJoin({
        user: this.userService.loadUser(this.usuarioId),
        person: this.userService.getPeopleByUserId(this.usuarioId)
      }).subscribe(
        ({ user, person }) => {
          this.user = user.user;
          this.profileImage = user.profileImage;
          this.person = person.length > 0 ? person[0] : null;
          this.isLoading = false;
        },
        error => {
          console.error('Error al cargar los datos:', error);
          this.isLoading = false;
        }
      );
    }
  }
}

