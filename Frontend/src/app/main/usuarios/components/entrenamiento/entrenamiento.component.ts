import { Component, OnInit } from '@angular/core';
import { EntrenadorService } from 'src/app/core/services/usuarios/entrenador.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user/person';
import { Person } from 'src/app/models/user/person';

@Component({
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
  isLoading: boolean = true;

  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
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

  hasEjerciciosParaDia(entrenamiento: any, dia: string): boolean {
    const diaIndex = this.diasSemana.indexOf(dia);
    return entrenamiento?.semanas?.some(
      (semana: any) => semana.ejercicios.some(
        (ejercicio: any) => ejercicio.dias[diaIndex])
    );
  }

  getEntrenamientos() {
    if (this.usuarioId != undefined) {
      this.entrenadorService.getEntrenamientosPorUsuario(this.usuarioId).subscribe((data) => {
        this.entrenamientos = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
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
  
        // Expandir solo el primero (que ahora es el más reciente)
        if (this.entrenamientos.length > 0) {
          this.expandedEntrenamientoId = this.entrenamientos[0].id;
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

