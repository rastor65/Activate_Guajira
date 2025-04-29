import { Component, OnInit } from '@angular/core';
import { EntrenadorService } from 'src/app/core/services/usuarios/entrenador.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user/person';
import { Person } from 'src/app/models/user/person';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-alimentacion',
  templateUrl: './alimentacion.component.html',
  styleUrls: ['./alimentacion.component.css']
})
export class AlimentacionComponent implements OnInit {
  alimentos: any[] = [];
  usuarioId: number | undefined;
  public person: Person | null = null;
  public profileImage = '';
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
    this.getAlimentacion();
  }

  getAlimentacion() {
    if (this.usuarioId !== undefined) {
      this.entrenadorService.getAlimentacionesPorUsuario(this.usuarioId).subscribe((data) => {
        // Guardamos los datos de alimentación
        this.alimentos = data;
  
        // Recorremos cada alimentación para obtener el nombre del entrenador
        this.alimentos.forEach((alimento: any) => {
          if (alimento.entrenador) {
            this.getEntrenadorNombre(alimento.entrenador).subscribe((persona) => {
              if (persona.length > 0) {
                alimento.entrenador = `${persona[0].nombres} ${persona[0].apellidos}`;
              } else {
                alimento.entrenador = "Desconocido"; // Si no hay datos
              }
            });
          }
        });
      });
    }
  }
  
  // Método para obtener el nombre del entrenador
  getEntrenadorNombre(entrenadorId: number): Observable<Person[]> {
    return this.userService.getPeopleByUserId(entrenadorId);
  }  

  loadUser() {
    if (this.usuarioId !== undefined) {
      this.isLoading = true;
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
