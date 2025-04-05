import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { environment } from 'src/environments/environment';
import { listaMenuI } from 'src/app/models/menu';
import { createMenu } from 'src/app/consts/menu';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [ConfirmationService, MessageService]
})

export class LandingComponent implements OnInit {
  public nombre: string = '';
  public bandera: boolean = false;
  public menu1: listaMenuI[] = [];
  public image3: string = 'assets/user.png';
  public privateMenu: listaMenuI[] = [];


  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    var token: string | null = localStorage.getItem('token');
    if (token != null) {
      this.bandera = true

    } else {
      this.router.navigateByUrl('/login');

      this.bandera = false
    }

    this.verificar();
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
    } else {
      this.menu1 = [];
      this.router.navigateByUrl('/login');
    }
  }

  getBgColor(index: number): string {
    const shades = ['bg-blue-500', 'bg-purple-500'];
    return shades[index % shades.length];
  }
  
  getIconBgColor(index: number): string {
    const shades = ['bg-blue-600', 'bg-purple-600'];
    return shades[index % shades.length];
  }  


  navigateWithDelay(link: string, event: Event) {
    event.stopPropagation(); // Evita eventos inesperados

    const target = event.currentTarget as HTMLElement;
    target.classList.add('clicked'); // Agrega clase para animación

    setTimeout(() => {
      this.router.navigate([link]); // Navega después del delay
    }, 250); // 200ms de delay para que se vea la animación
  }

}
