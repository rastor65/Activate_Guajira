import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appPreventMultipleClicks]'
})
export class PreventMultipleClicksDirective {
  @Input() disableTime = 3000;
  private isDisabled = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const nativeElement = this.el.nativeElement as HTMLElement;

    // 🔵 Buscar el verdadero botón (PrimeNG genera un span + button dentro)
    const realButton = nativeElement.tagName.toLowerCase() === 'button'
      ? nativeElement
      : nativeElement.querySelector('button');

    // 🔵 Asegurar que el botón existe
    if (realButton) {
      // Deshabilita atributos reales
      this.renderer.setAttribute(realButton, 'disabled', 'true');

      // También aplicar manualmente la clase PrimeNG
      this.renderer.addClass(nativeElement, 'p-disabled');

      this.isDisabled = true;

      // Reactivar después de tiempo
      setTimeout(() => {
        this.renderer.removeAttribute(realButton, 'disabled');
        this.renderer.removeClass(nativeElement, 'p-disabled');
        this.isDisabled = false;
      }, this.disableTime);
    }
  }
}
