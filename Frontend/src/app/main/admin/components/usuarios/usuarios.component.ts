import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserLoginI } from 'src/app/models/authorization/usr_User';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { RoleI } from 'src/app/models/authorization/usr_roles';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';
import { Person } from 'src/app/models/user/person';
import { first, last, switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Usuario, Rol } from 'src/app/models/user/person';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  data: any[] = [];
  headers: string[] = [];
  errorMessage: string = '';
  showProgressBar: boolean = false;
  errorCrearMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  failedUsers: any[] = [];
  usuarioRolesMap: Map<string, string[]> = new Map<string, string[]>();
  usuariosFiltrados: Usuario[] = [];
  searchValue: string = '';
  AllRoles: any[] = [];
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  dialogUsuario: boolean = false;
  cargando: boolean = true;
  formUsuario: FormGroup = new FormGroup({});
  usuarioSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private userService: UserService,
    private usuariosService: UsuariosService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.formUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      roles: [[]]
    });

    this.cargarDatos();

  }

  cargarDatos() {
    this.cargando = true;
    forkJoin({
      usuarios: this.usuariosService.getUsers(),
      roles: this.usuariosService.getRoles(),
      allRoles: this.usuariosService.getAllRoles()
    }).subscribe(({ usuarios, roles, allRoles }) => {
      // ✅ Extraemos el array real de resultados paginados
      this.usuarios = Array.isArray(usuarios.results) ? usuarios.results as Usuario[] : [];

      this.roles = roles as Rol[];
      this.AllRoles = Array.isArray(allRoles.results) ? allRoles.results : [];

      this.procesarRoles();
      this.cargando = false;
    });

  }



  vereditarUsuario(usuario: any) {
    this.usuarioSeleccionado = usuario;

    this.formUsuario.setValue({
      email: usuario.email || '',
      username: usuario.username || '',
      first_name: usuario.first_name || '',
      last_name: usuario.last_name || '',
      roles: usuario.roles || []
    });

    this.dialogUsuario = true;
  }

  cerrareditarUsuario() {
    this.dialogUsuario = false
  }

  eliminarUsuario(usuario: any) {

  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.errorMessage = 'No se ha seleccionado ningún archivo';
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);  // 📌 Leer como ArrayBuffer

    reader.onload = () => {
      let uint8Array = new Uint8Array(reader.result as ArrayBuffer);
      let textDecoder = new TextDecoder('utf-8', { fatal: false });
      let csvData = textDecoder.decode(uint8Array);

      if (csvData.includes('�')) {
        console.warn('Archivo no está en UTF-8. Convirtiendo desde ISO-8859-1...');
        textDecoder = new TextDecoder('iso-8859-1');
        csvData = textDecoder.decode(uint8Array);
      }

      // 🔹 Normalizar tildes y ñ
      csvData = csvData.normalize("NFC");

      this.processCSV(csvData);
    };

    reader.onerror = () => {
      this.errorMessage = 'Error al leer el archivo. Verifica la codificación.';
    };
  }

  procesarRoles() {
    this.cargando = true;

    if (!Array.isArray(this.AllRoles)) {
      console.error('AllRoles no es un array:', this.AllRoles);
      this.cargando = false;
      return;
    }

    this.usuarios.forEach(usuario => {
      const rolesUsuario = this.AllRoles.filter(role =>
        role.userId && role.userId.username === usuario.username
      );

      if (rolesUsuario.length > 0) {
        usuario.first_name = rolesUsuario[0].userId?.first_name || usuario.first_name;
        usuario.last_name = rolesUsuario[0].userId?.last_name || usuario.last_name;
      }

      usuario.roles = [...new Set(
        rolesUsuario
          .map(role => role.rolesId?.name)
          .filter(roleName => !!roleName)
      )];
    });

    this.filtrarUsuarios();
    this.cargando = false;
  }


  filtrarUsuarios() {
    this.cargando = true;
    const filtro = this.searchValue.toLowerCase() || '';

    this.usuariosFiltrados = this.usuarios.filter(usuario => {

      const matchesText =
        (usuario.username.toLowerCase() || '').includes(filtro) ||
        (usuario.first_name.toLowerCase() || '').includes(filtro) ||
        (usuario.last_name.toLowerCase() || '').includes(filtro);

      return matchesText;
    });
    this.cargando = false;
  }


  processCSV(csvData: string) {
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) {
      this.errorMessage = 'El archivo CSV está vacío o mal formateado.';
      return;
    }

    this.headers = lines[0].split(';').map(header => header.trim());
    this.data = lines.slice(1).map(line => {
      const values = line.split(';').map(value => value.trim());
      return this.headers.reduce((acc, header, index) => {
        acc[header] = values[index] || '';
        return acc;
      }, {} as Record<string, string>);
    });

    this.errorMessage = '';
  }

  crearUsuarios() {
    if (this.data.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'No hay usuarios para registrar.' });
      return;
    }

    this.onSubmitRegisterMassive(this.data);
  }

  onSubmitRegisterMassive(users: any[]) {
    this.isLoading = true;

    if (!users || users.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'No hay usuarios para registrar.' });
      this.isLoading = false;
      return;
    }

    let requests: Observable<any>[] = this.createUserRequests(users);
    let failedUsers: any[] = [];

    const batchSize = 10;
    let batchRequests = [];

    for (let i = 0; i < requests.length; i += batchSize) {
      batchRequests.push(forkJoin(requests.slice(i, i + batchSize)));
    }

    forkJoin(batchRequests).subscribe(
      () => {
        if (failedUsers.length > 0) {
          this.retryFailedUsers(failedUsers);
        } else {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuarios registrados exitosamente' });
        }
      },
      (error) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo errores en la carga de algunos usuarios.' });
      }
    );
  }

  guardarUsuario() {
    if (this.formUsuario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, complete todos los campos correctamente.' });
      return;
    }

    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha seleccionado un usuario válido.' });
      return;
    }

    const datosActualizados = {
      first_name: this.formUsuario.value.first_name?.trim(),
      last_name: this.formUsuario.value.last_name?.trim(),
      username: this.formUsuario.value.username?.trim() || this.usuarioSeleccionado.username, // Evita null
      email: this.formUsuario.value.email?.trim(),
      roles: Array.isArray(this.formUsuario.value.roles) ? this.formUsuario.value.roles : []
    };

    this.usuariosService.editarUsuario(this.usuarioSeleccionado.id, datosActualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente.' });
        this.dialogUsuario = false;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario. Inténtelo de nuevo.' });
      }
    });
  }


  /**
   * Función para crear las solicitudes de usuario
   */

  createUserRequests(users: any[]): Observable<any>[] {
    let failedUsers = [];

    return users.map((userData) => {
      if (!userData || !userData.email || !userData.email.includes('@')) {
        this.failedUsers.push({ ...userData, error: 'Email inválido o ausente' });
        return of([]); // Retornamos un Observable vacío en lugar de null
      }

      let formValue = {
        username: userData.email.split('@')[0],
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
      };

      return this.userService.createUser(formValue).pipe(
        switchMap((user) => this.userService.getUserDetailsByEmail(formValue.email)),
        switchMap((userData) => {
          if (!userData) {
            this.failedUsers.push({ ...userData, error: 'No se pudo obtener detalles del usuario' });
            return of([]); // Retorna un Observable vacío en caso de fallo
          }

          const userId = userData.id;
          const personData: Person = {
            id: null,
            nombres: formValue.first_name,
            apellidos: formValue.last_name,
            user: userId,
            edad: 0,
            document_type: null,
            nivelFormacion: null,
            estado_civil: null,
            grupoEtnico: null,
            departamento: null,
            ciudad_residencia: null,
            ciudad_nacimiento: null,
            barrio: null,
            situacion_laboral: null,
            estrato: null,
            genero: null,
          };

          return forkJoin([
            this.userService.crearPerson(personData),
            this.usuariosService.asignarRoles(
              JSON.stringify({ status: true, userId, rolesId: 2 }),
              { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
            ),
          ]);
        }),
        catchError((error: any) => {
          this.failedUsers.push({ ...userData, error: error || 'Error desconocido' });
          return of(null); // Retornar un valor neutral para que forkJoin continúe
        })
      );
    });
  }

  retryFailedUsers(failedUsers: any[]) {
    let finalFailedUsers: any[] = [];

    const retryRequests = failedUsers.map((userData) => {
      if (!userData || !userData.email || !userData.email.includes('@')) {
        finalFailedUsers.push(userData);
        return of([]); // Si el usuario no tiene email válido, lo marcamos como fallido
      }

      let formValue = {
        username: userData.email.split('@')[0],
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
      };

      return this.userService.createUser(formValue).pipe(
        switchMap((user) => this.userService.getUserDetailsByEmail(formValue.email)),
        switchMap((userData) => {
          if (!userData) {
            finalFailedUsers.push(userData);
            return of([]); // Si no se obtiene el usuario después de la creación, lo marcamos como fallido
          }

          const userId = userData.id;
          const personData: Person = {
            id: null,
            nombres: formValue.first_name,
            apellidos: formValue.last_name,
            user: userId,
            edad: 0,
            document_type: null,
            nivelFormacion: null,
            estado_civil: null,
            grupoEtnico: null,
            departamento: null,
            ciudad_residencia: null,
            ciudad_nacimiento: null,
            barrio: null,
            situacion_laboral: null,
            estrato: null,
            genero: null,
          };

          return forkJoin([
            this.userService.crearPerson(personData),
            this.usuariosService.asignarRoles(
              JSON.stringify({ status: true, userId, rolesId: 2 }),
              { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
            ),
          ]);
        }),
        catchError((error: any) => {
          console.error(`Error al reintentar registro de usuario: ${userData.email}`, error);
          finalFailedUsers.push(userData);
          return of([]); // Si hay error, lo marcamos como fallido y continuamos
        })
      );
    });

    forkJoin(retryRequests).subscribe(() => {
      this.isLoading = false;
      if (finalFailedUsers.length > 0) {
        this.failedUsers = [...finalFailedUsers];
        setTimeout(() => this.failedUsers = [...finalFailedUsers]); // Forzar actualización de Angular
        this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Algunos usuarios no se registraron correctamente en el reintento.' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los usuarios pendientes fueron registrados exitosamente.' });
      }
    });

  }

}