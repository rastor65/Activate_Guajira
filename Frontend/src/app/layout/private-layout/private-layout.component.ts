
import { Router } from '@angular/router';
import { listaMenuI } from 'src/app/models/menu';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { createMenu } from 'src/app/consts/menu';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Person, categoriaTablaMaestra, tablaMaestra, User } from 'src/app/models/user/person';

interface menu {
  data?: string,
  label: string,
  children?: any[],
  expandedIcon: string,
  collapsedIcon: string,
}

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.css'],
  providers: [DialogService]
})

export class PrivateLayoutComponent implements OnInit {
  display = false;
  public ref1: any;
  public subcribe: any;
  public profileImage = '';
  public isLoggedIn = false;
  public files1: menu[] = [];
  public nombre: string = '';
  public image3: string = '';
  public algo: listaMenuI[] = [];
  public Dialog: boolean = false;
  public mostrar: boolean = false;
  public menu1: listaMenuI[] = [];
  public Dialog2: boolean = false;
  public mensaje: boolean = false;
  public token: string | null = null;
  public usuarioId: number | undefined;
  public publicMenu: listaMenuI[] = [];
  public privateMenu: listaMenuI[] = [];
  public usuarioCopy: Person | null = null;
  public displayMaximizable: boolean = true;
  public newProfileImage: File | null = null;
  public username: string | undefined = undefined;
  public password: string | undefined = undefined;

  items: MenuItem[] = [];
  items2: MenuItem[] = [];
  barrio: tablaMaestra[] = [];
  ciudad: tablaMaestra[] = [];
  genero: tablaMaestra[] = [];
  enFormacion: boolean = false;
  estrato: tablaMaestra[] = [];
  DialogContra: boolean = false;
  fileGrado: File | null = null;
  formCambioContrasena: FormGroup;
  userDataLoaded: boolean = false;
  estadoCivil: tablaMaestra[] = [];
  genderTypes: tablaMaestra[] = [];
  grupoEtnico: tablaMaestra[] = [];
  tablaMaestra: tablaMaestra[] = [];
  departamento: tablaMaestra[] = [];
  documentTypes: tablaMaestra[] = [];
  archivoCargado: string | null = null;
  situacionLaboral: tablaMaestra[] = [];
  niveles_formacion: tablaMaestra[] = [];
  categoriaTablaMaestra: categoriaTablaMaestra[] = [];
  cargandopersona: boolean = false;

  public user: User = {
    id: 0,
    username: '',
    email: '',
    password: '',
    avatar: '',
  }

  public usuario: Person = {
    id: 0,
    user: null,
    createdAt: '',
    updateAt: '',
    nombres: '',
    apellidos: '',
    identificacion: '',
    departamento: 0,
    fecha_nacimiento: '',
    ciudad_residencia: 0,
    ciudad_nacimiento: 0,
    barrio: 0,
    situacion_laboral: 0,
    estrato: 0,
    telefono: 0,
    status: true,
    document_type: null,
    nivelFormacion: null,
    estado_civil: null,
    grupoEtnico: null,
    edad: 0,
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) {
    this.formCambioContrasena = this.formBuilder.group({
      contrasenaActual: ['', Validators.required],
      nuevaContrasena: ['', Validators.required],
      confirmarContrasena: ['', Validators.required],
    });
  }

  displayDialog: boolean = false;
  imageSource: string = 'assets/PQR.png';
  displayDialog2: boolean = false;

  ngOnInit() {
    this.usuarioId = this.authService.getUserId();

    if (this.usuarioId !== undefined) {
      this.loadUser();
    } else {
      console.warn('usuarioId es undefined, no se puede cargar el usuario.');
    }

    this.obtenerTipos();
    this.loadUser();
    this.verificar();
    this.primengConfig.ripple = true;
    this.items = [
      { label: 'Imagen', icon: 'pi pi-user', command: () => { this.abrirEditarImagen(); } },
      { separator: true },
      { label: 'Editar perfil', icon: 'pi pi-cog', command: () => { this.abrirEditarPerfil(); } },
      { separator: true },
      { label: 'Cambiar contraseña', icon: 'pi pi-key', command: () => { this.abrirEditarContra(); } },
      { separator: true },
    ];
  }

  public obtenerTipos(): void {
    this.userService.obtenerTipoCategoria().subscribe(
      (categorias: any[]) => {
        const categoriaMap = categorias.reduce((acc, categoria) => {
          acc[categoria.id] = categoria.nombre;
          return acc;
        }, {} as Record<number, string>);

        this.userService.obtenerTipo().subscribe(
          (tipos: any[]) => {
            this.barrio = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Barrio");
            this.ciudad = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Ciudad");
            this.estrato = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Estrato");
            this.genderTypes = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Género");
            this.estadoCivil = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Estado civil");
            this.grupoEtnico = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Grupo étnico");
            this.departamento = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Departamento");
            this.documentTypes = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Tipo de documento");
            this.niveles_formacion = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Nivel de formación");
            this.situacionLaboral = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Situación Laboral");
            this.genero = tipos.filter(tipo => categoriaMap[tipo.categoria] === "Genero");
          },
          (error: any) => {
            console.error(error);
          }
        );
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  save(id: string) { }
  ocultarMenu(boolean: boolean) { }
  showConfirm() { this.Dialog = true; }
  hideDialog() { this.Dialog = false; }
  openDialog() { this.displayDialog = true; }
  closeDialog() { this.displayDialog = false; }
  confirm() { this.displayMaximizable = false }
  cerrarEditarPerfil() { this.Dialog2 = false; }
  abrirEditarContra() { this.DialogContra = true; }
  cerrarEditarContra() { this.DialogContra = false; }
  abrirEditarImagen() { this.displayDialog2 = true; }
  cerrarEditarImagen() { this.displayDialog2 = false; }
  openDialogResgister(event: Event) { event.preventDefault(); }
  setLogin(value: boolean): void { this.authService.setLogin(value); }

  openDialogLogin(event: Event) {
    event.preventDefault();
    this.displayMaximizable = true
  }

  cerrarSesion() {
    this.setLogin(false)
    this.authService.logout()
    this.ngOnInit()
    this.router.navigateByUrl('/login')
  }

  abrirEditarPerfil() {
    this.loadUserData();
    this.Dialog2 = true;
    this.usuarioCopy = { ...this.usuario };
  }

  public verificar() {
    var user: string | null = localStorage.getItem('user');
    var menu: string | null = localStorage.getItem('menu');
    var token: string | null = localStorage.getItem('token');
    if (token != null && menu != null && user != null) {
      let userObjeto: any = JSON.parse(user);
      let menuObjeto: any = JSON.parse(menu);
      this.privateMenu = createMenu(menuObjeto) as any;
      this.menu1 = this.privateMenu;
      this.nombre = userObjeto.name;
      this.isLoggedIn = true
      this.setLogin(true)
    } else {
      this.isLoggedIn = false
      this.setLogin(false)
      this.menu1 = [];
      this.router.navigateByUrl('/login');
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDITAR DATOS DE USUARIO

  loadUserData(): void {
    this.cargandopersona = true;
    if (this.usuarioId !== undefined) {
      this.userService.getPeopleByUserId(this.usuarioId).subscribe(
        people => {
          if (people && people.length > 0) {
            const firstUser = people[0];
            if (firstUser.user === this.usuarioId) {
              this.usuario = firstUser;
              this.cargandopersona = false;
            } else {
              console.error('El ID del usuario logueado no coincide con el campo "user" en el registro de Persona.');
              this.cargandopersona = false;
            }
          } else {
            console.error('No se encontraron datos de usuario para el ID proporcionado.');
            this.cargandopersona = false;
          }
          this.userDataLoaded = true; // Marcar que los datos del usuario han sido cargados
          this.cargandopersona = false;

        },
        error => {
          console.error('Error loading user data:', error);
        }
      );
    }
  }

  guardarDatos() {
    const usuarioActualizado: Person = {
      id: this.usuario.id,
      user: this.usuarioId,
      edad: this.usuario.edad,
      genero: this.usuario.genero,
      barrio: this.usuario.barrio,
      estrato: this.usuario.estrato,
      nombres: this.usuario.nombres,
      telefono: this.usuario.telefono,
      updateAt: this.usuario.updateAt,
      createdAt: this.usuario.createdAt,
      apellidos: this.usuario.apellidos,
      grupoEtnico: this.usuario.grupoEtnico,
      departamento: this.usuario.departamento,
      estado_civil: this.usuario.estado_civil,
      document_type: this.usuario.document_type,
      identificacion: this.usuario.identificacion,
      nivelFormacion: this.usuario.nivelFormacion,
      fecha_nacimiento: this.usuario.fecha_nacimiento,
      ciudad_residencia: this.usuario.ciudad_residencia,
      ciudad_nacimiento: this.usuario.ciudad_nacimiento,
      situacion_laboral: this.usuario.situacion_laboral,
      status: this.usuario.status !== undefined ? this.usuario.status : false
    };

    console.log("datos: ", usuarioActualizado)
    this.userService.editarUsuario(usuarioActualizado).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Datos basicos guardados' });
        this.Dialog2 = false;
      },
      (error) => {
        console.error('Error al guardar los datos del usuario', error);
        this.messageService.add({ severity: 'error', summary: 'Error al actualizar los datos basicos', detail: 'Todos los campos son requeridos' });
      }
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDITAR DATOS DE FORMACION

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.fileGrado = files[0];
      this.archivoCargado = this.fileGrado.name;
    } else {
      this.fileGrado = null;
      this.archivoCargado = null;
    }
  }


  //////////////////////////////IMAGEN DE PERFIL/////////////////////////////////////////

  loadUser() {
    if (this.usuarioId !== undefined) {
      this.userService.loadUser(this.usuarioId).subscribe(
        data => {
          this.user = data.user;
          this.profileImage = data.profileImage;
          console.log(this.user)
        },
        error => {
          console.error('Error al cargar el usuario:', error);
        }
      );
    } else {
      console.warn('usuarioId es undefined, no se puede cargar el usuario.');
    }
  }

  guardarImagenPerfil() {
    if (this.usuarioId && this.newProfileImage) {
      this.userService.updateUserProfile(this.usuarioId, this.user, this.newProfileImage).subscribe(
        (data) => {
          this.messageService.add({ severity: 'success', summary: 'Imagen de perfil actualizada', detail: 'La imagen de perfil se ha actualizado correctamente' });

          this.handleNewImage;
          this.cerrarEditarImagen();
        },
        (error) => {
          console.error('Error al actualizar la imagen de perfil:', error);
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar la imagen de perfil', detail: 'Ocurrió un error al actualizar la imagen de perfil' });
        }
      );
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const selectedFile: File = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
        this.newProfileImage = selectedFile;
      }
    }
  }

  handleNewImage(url: string) {
    this.profileImage = url;
    this.cdr.detectChanges();
  }

  cambiarContrasena() {
    if (this.formCambioContrasena != null) {
      const currentPassword = this.formCambioContrasena.get('contrasenaActual')?.value;
      const newPassword = this.formCambioContrasena.get('nuevaContrasena')?.value;
      const confirmPassword = this.formCambioContrasena.get('confirmarContrasena')?.value;

      if (newPassword === confirmPassword) {
        this.userService.getUserPassword(this.usuarioId).subscribe(
          (password) => {
            if (currentPassword === password) {
              this.userService.updatePassword(this.usuarioId, newPassword).subscribe(
                () => {
                  this.DialogContra = false;
                },
                (error) => {
                  console.error('Error al cambiar la contraseña:', error);
                }
              );
            } else {
              console.error('Contraseña actual incorrecta');
            }
          },
          (error) => {
            console.error('Error al obtener la contraseña actual:', error);
          }
        );
      } else {
        console.error('Las contraseñas nuevas no coinciden');
      }
    } else {
      console.error('El formulario no es válido');
    }
  }

  formatFechaNacimiento() {
    if (this.usuario.fecha_nacimiento) {
      const fecha = new Date(this.usuario.fecha_nacimiento);
      const año = fecha.getFullYear();
      const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
      const dia = ('0' + fecha.getDate()).slice(-2);

      this.usuario.fecha_nacimiento = `${año}-${mes}-${dia}`;
    }
  }

}