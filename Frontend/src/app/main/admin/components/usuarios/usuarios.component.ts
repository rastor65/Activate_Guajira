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
  standalone: false,
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
  CargandoUsuario: boolean = false;
  verPassword: boolean = false;

  // --- Detalle del usuario -------------------------------------------------
  // La pantalla de Personas mostraba estos mismos datos por separado. Se
  // unifican aqui: al pulsar un usuario se ve su ficha completa, tanto la
  // parte de cuenta como la de persona.
  dialogDetalle: boolean = false;
  cargandoDetalle: boolean = false;
  usuarioDetalle: any = null;
  personaDetalle: any = null;
  errorDetalle: string | null = null;

  /** id de tablaMaestra -> nombre, para resolver los campos parametricos. */
  private catalogo = new Map<number, string>();

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
    // Los campos de persona se guardan como ids de tabla maestra: hace falta
    // el catalogo para mostrar nombres en la ficha.
    this.cargarCatalogo();

    this.formUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      roles: [[]],
      consentimiento: [false],
      password: [''],
      last_login: [''],
      date_joined: ['']
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
      this.usuarios = Array.isArray(usuarios) ? usuarios as Usuario[] : [];

      this.roles = roles as Rol[];
      this.AllRoles = Array.isArray(allRoles) ? allRoles : [];

      console.log(roles)

      this.procesarRoles();
      this.cargando = false;
    });

  }

  /** Carga la tabla maestra una vez, para poder mostrar nombres y no ids. */
  private cargarCatalogo(): void {
    this.userService.obtenerTipo().subscribe({
      next: (tipos: any[]) => {
        this.catalogo.clear();
        for (const t of tipos ?? []) {
          this.catalogo.set(t.id, t.nombre);
        }
        this.cdRef.detectChanges();
      },
      error: (e) => console.error('No se pudo cargar la tabla maestra:', e),
    });
  }

  /** Nombre de un valor parametrico, o un guion si no hay dato. */
  nombreDe(id: any): string {
    if (id === null || id === undefined || id === '') {
      return '—';
    }
    return this.catalogo.get(Number(id)) ?? String(id);
  }

  /** Muestra un valor simple, con guion cuando falta. */
  valor(v: any): string {
    return v === null || v === undefined || v === '' ? '—' : String(v);
  }

  /** Nombres de los roles de un usuario. */
  rolesDe(usuario: any): string[] {
    const ids: any[] = usuario?.roles ?? [];
    return ids
      .map(r => (typeof r === 'object' ? r?.name : this.roles.find(x => x.id === r)?.name ?? r))
      .filter(Boolean);
  }

  /** Abre la ficha completa: datos de cuenta y de persona. */
  verDetalle(usuario: any): void {
    this.usuarioDetalle = usuario;
    this.personaDetalle = null;
    this.errorDetalle = null;
    this.dialogDetalle = true;
    this.cargandoDetalle = true;

    this.userService.getPeopleByUserId(usuario.id).subscribe({
      next: (personas) => {
        // Sin persona asociada no es un error: el registro puede ser antiguo
        this.personaDetalle = personas?.length ? personas[0] : null;
        this.cargandoDetalle = false;
        this.cdRef.detectChanges();
      },
      error: (e) => {
        console.error('Error cargando la persona del usuario:', e);
        this.errorDetalle = 'No se pudieron cargar los datos personales.';
        this.cargandoDetalle = false;
        this.cdRef.detectChanges();
      },
    });
  }

  cerrarDetalle(): void {
    this.dialogDetalle = false;
    this.usuarioDetalle = null;
    this.personaDetalle = null;
  }

  /** Desde la ficha se pasa a editar sin tener que cerrarla y buscar de nuevo. */
  editarDesdeDetalle(): void {
    const usuario = this.usuarioDetalle;
    this.cerrarDetalle();
    if (usuario) {
      this.vereditarUsuario(usuario);
    }
  }

  vereditarUsuario(usuario: any) {
    this.dialogUsuario = true;
    this.CargandoUsuario = true;
    this.usuarioSeleccionado = usuario;
    this.usuariosService.getUsuarioCompleto(usuario.id).subscribe({
      next: (datos) => {
        console.log(datos)
        const formatFechaHora = (isoDate: string | null): string => {
          if (!isoDate) return '';
          const date = new Date(isoDate);
          return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        };
        this.formUsuario.patchValue({
          email: datos.email || '',
          username: datos.username || '',
          first_name: datos.first_name || '',
          last_name: datos.last_name || '',
          roles: datos.roles || [],
          consentimiento: datos.consentimiento || false,
          last_login: formatFechaHora(datos.last_login) || '',
          date_joined: formatFechaHora(datos.date_joined) || ''
        });
        
        this.CargandoUsuario = false;
      },
      error: (error) => {
        console.error('Error al obtener datos completos del usuario:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del usuario.' });
        this.CargandoUsuario = false;
      }
    });
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
        role.userId === usuario.email
      );
  
      usuario.roles = [...new Set(
        rolesUsuario.map(role => role.rolesId).filter(r => !!r)
      )];
    });
  
    this.filtrarUsuarios();
    this.cargando = false;
  }  

  filtrarUsuarios() {
    this.cargando = true;
    const filtro = this.searchValue?.toLowerCase() || '';
  
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const username = usuario.username?.toLowerCase() || '';
      const firstName = usuario.first_name?.toLowerCase() || '';
      const lastName = usuario.last_name?.toLowerCase() || '';
  
      return username.includes(filtro) || firstName.includes(filtro) || lastName.includes(filtro);
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