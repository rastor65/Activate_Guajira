import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RecursosService } from 'src/app/core/services/admin/recursos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { GRUPOS_ICONOS, GrupoIconos } from 'src/app/shared/prime-icons';

@Component({
  standalone: false,
  selector: 'app-recursos-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  resources: any[] = [];
  selectedResource: any = {};

  dialogVisible = false;
  dialogType = 'create';
  dialogHeader: string = '';

  // --- Recurso padre -------------------------------------------------------
  // Antes se escribia el id a mano: habia que conocerlo de memoria y nada
  // impedia apuntar a un recurso inexistente o al propio recurso.

  /** Opciones de padre: primer nivel mas el resto de recursos. */
  get opcionesPadre(): { label: string; value: number }[] {
    const propio = this.selectedResource?.id;
    return [
      { label: 'Ninguno (primer nivel)', value: 0 },
      ...this.resources
        .filter(r => r.id !== propio)
        .map(r => ({ label: `${r.titulo}  ·  #${r.id}`, value: r.id })),
    ];
  }

  /** Titulo del padre, para mostrarlo en la tabla en vez del id suelto. */
  nombrePadre(idPadre: any): string {
    if (!idPadre) {
      return 'Primer nivel';
    }
    return this.resources.find(r => r.id === idPadre)?.titulo ?? `#${idPadre}`;
  }

  // --- Selector de icono ---------------------------------------------------
  dialogIconos = false;
  filtroIcono = '';
  readonly gruposIconos = GRUPOS_ICONOS;

  /** Grupos con sus iconos filtrados; los que quedan vacios se descartan. */
  get gruposFiltrados(): GrupoIconos[] {
    const filtro = this.filtroIcono.trim().toLowerCase();
    if (!filtro) {
      return this.gruposIconos;
    }
    return this.gruposIconos
      .map(g => ({ titulo: g.titulo, iconos: g.iconos.filter(i => i.includes(filtro)) }))
      .filter(g => g.iconos.length > 0);
  }

  get hayResultadosIcono(): boolean {
    return this.gruposFiltrados.length > 0;
  }

  /** El modelo guarda la clase completa ('pi pi-user'). */
  get iconoActual(): string {
    return this.selectedResource?.icono || '';
  }

  abrirIconos(): void {
    this.filtroIcono = '';
    this.dialogIconos = true;
  }

  esIconoElegido(icono: string): boolean {
    return this.iconoActual.split(' ').includes(icono);
  }

  elegirIcono(icono: string): void {
    this.selectedResource.icono = `pi ${icono}`;
    this.dialogIconos = false;
  }

  quitarIcono(): void {
    this.selectedResource.icono = '';
  }

  constructor(private RecursosService: RecursosService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.RecursosService.getResources().subscribe(data => {
      this.resources = data;
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    // id_padre 0 significa primer nivel: es el valor razonable por defecto
    this.selectedResource = { id_padre: 0, method: 'GET' };
    this.dialogVisible = true;
  }

  showEditDialog(resource: any): void {
    this.dialogType = 'edit';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }
  
  showDeleteDialog(resource: any): void {
    this.dialogType = 'delete';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }

  saveResource(): void {
    if (this.dialogType === 'create') {
      this.RecursosService.createResource(this.selectedResource).subscribe(() => {
        this.dialogVisible = false;
        this.loadResources();
      });
    } else if (this.dialogType === 'edit') {
      this.RecursosService.updateResource(this.selectedResource.id, this.selectedResource).subscribe(() => {
        this.dialogVisible = false;
        this.loadResources();
      });
    }
  }

  cancelEdit(): void {
    this.dialogVisible = false;
  }

  deleteResource(id: number): void {
    this.RecursosService.deleteResource(id).subscribe(() => {
      this.dialogVisible = false;
      this.loadResources();
    });
  }

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.resources.filter((resource) => resource[column].includes(filterValue));
  }

}