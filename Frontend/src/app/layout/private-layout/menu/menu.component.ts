import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnChanges {

  @Input() menu: any[] = [];
  @Output() funcion = new EventEmitter<boolean>();
  @Output() optionSelected = new EventEmitter<any>();

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setCollapse(changes['menu'].currentValue);
  }

  public clickHandler(event: Event, item: any): void {
    event.stopPropagation();
    if (item.menu) {
      this.toggleItem(item);
    } else {
      this.selectOption();
    }
  }

  public openSubmenu(event: MouseEvent, item: any): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    item.submenuPosition = {
      top: rect.top + window.scrollY - 160, // Asegura que el top sea absoluto en la página
      left: rect.right + window.scrollX - 30 // Desplaza hacia afuera del menú
    };
    item.collapsed = false;
  }


  public closeSubmenu(item: any): void {
    item.collapsed = true;
  }

  private setCollapse(menu: any[]) {
    for (let i = 0; i < menu.length; i++) {
      menu[i].collapsed = true;
      if (menu[i].menu) {
        this.setCollapse(menu[i].menu);
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
