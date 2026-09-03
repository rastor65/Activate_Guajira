import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';

@Component({
  standalone: false,
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

  // El submenu se posiciona por CSS respecto al item, no por calculo manual.
  public openSubmenu(event: MouseEvent, item: any): void {
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
