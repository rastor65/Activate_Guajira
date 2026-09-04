import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnChanges {

  @Input() menu: any[] = [];

  /**
   * Con la barra expandida los submenus se despliegan en acordeon dentro de
   * la propia lista. Contraida, la barra es un riel de iconos y el submenu
   * aparece flotando al pasar el cursor.
   */
  @Input() expandido = false;

  @Output() funcion = new EventEmitter<boolean>();
  @Output() optionSelected = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menu'] && changes['menu'].currentValue) {
      this.setCollapse(changes['menu'].currentValue);
    }
    // Al contraer la barra se cierran los acordeones abiertos, para que no
    // queden desplegados de forma invisible bajo el riel de iconos.
    if (changes['expandido'] && !changes['expandido'].currentValue) {
      this.setCollapse(this.menu);
    }
  }

  public clickHandler(event: Event, item: any): void {
    event.stopPropagation();
    if (item.menu) {
      // Un item con hijos solo abre o cierra su grupo, no navega
      event.preventDefault();
      this.toggleItem(item);
    } else {
      this.selectOption();
    }
  }

  /** Solo aplica en modo contraido: el submenu flota junto al icono. */
  public openSubmenu(item: any): void {
    if (!this.expandido) {
      item.collapsed = false;
    }
  }

  public closeSubmenu(item: any): void {
    if (!this.expandido) {
      item.collapsed = true;
    }
  }

  public trackPorId(_indice: number, item: any): any {
    return item?.id ?? item?.titulo;
  }

  private setCollapse(menu: any[]) {
    if (!menu) {
      return;
    }
    for (const item of menu) {
      item.collapsed = true;
      if (item.menu) {
        this.setCollapse(item.menu);
      }
    }
  }

  private selectOption(): void {
    this.optionSelected.emit();
    this.funcion.emit(false);
  }

  private toggleItem(item: any): void {
    item.collapsed = !item.collapsed;
  }
}
