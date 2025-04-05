import { Component, OnInit } from '@angular/core';
import { TablaMaestraService } from 'src/app/core/services/admin/tabla-maestra.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-tabla-maestra',
  templateUrl: './tabla-maestra.component.html',
  styleUrls: ['./tabla-maestra.component.css'],
  providers: [MessageService]
})
export class TablaMaestraComponent implements OnInit {

  dialogCategoria: boolean = false;
  dialogMaestra: boolean = false;
  dialogEditCategoria: boolean = false;

  categoriasMap: Map<number, string> = new Map();
  isEditMode: boolean = false;
  categorias: any[] = [];
  tablaMaestra: any[] = [];
  selectedRegistro: any = null;
  loading: boolean = false;
  selectedCategoria: any = { id: null, nombre: '' };
  datos: any[] = [];
  searchTabla: string = '';
  tablasFiltradas: any[] = [];

  constructor(
    private tablaMaestraService: TablaMaestraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarTablaMaestra();
    this.tablasFiltradas = [...this.tablaMaestra];
  }

  filtrarTablas() {
    if (!this.searchTabla.trim()) {
      this.tablasFiltradas = [...this.tablaMaestra]; // Mostrar todo si no hay búsqueda
    } else {
      const searchLower = this.searchTabla.toLowerCase();
      this.tablasFiltradas = this.tablaMaestra.filter(tabla =>
        tabla.nombre.toLowerCase().includes(searchLower) ||
        this.getCategoriaNombre(tabla.categoria).toLowerCase().includes(searchLower)
      );
    }
  }
  
  // Cargar Categorías
  cargarCategorias() {
    this.tablaMaestraService.getAllCategoria().subscribe({
      next: (data) => {
        this.categorias = data;
        this.categoriasMap = new Map(data.map(c => [c.id, c.nombre]));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías' });
        this.loading = false;
      }
    });
  }

  // Cargar Tabla Maestra
  cargarTablaMaestra() {
    this.loading = true;
    this.tablaMaestraService.getAllMaestra().subscribe({
      next: (data) => {
        this.tablaMaestra = data.filter(item => item != null); // Filtrar valores nulos
        this.tablasFiltradas = [...this.tablaMaestra];
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la tabla maestra' });
        this.loading = false;
      }
    });
  }

  getCategoriaNombre(id: number): string {
    return this.categoriasMap.get(id) || 'Desconocido';
  }

  // Abrir modal de categorías
  abrirCategorias() {
    this.dialogCategoria = true;
  }

  cerrarCategorias() {
    this.dialogCategoria = false;
  }

  editarCategoria(categoria: any) {
    this.isEditMode = true; // Modo edición
    this.selectedCategoria = { ...categoria }; // Clonar para evitar modificar la original antes de guardar
    this.dialogEditCategoria = true;
  }

  nuevaCategoria() {
    this.isEditMode = false; // Modo agregar
    this.selectedCategoria = { id: null, nombre: '' }; // Limpiar valores
    this.dialogEditCategoria = true;
  }

  cerrarDialogEditCategoria() {
    this.dialogEditCategoria = false;
    this.selectedCategoria = { id: null, nombre: '' };
  }

  guardarCategoria() {
    if (this.isEditMode) {
      // Actualizar categoría
      this.tablaMaestraService.updateCategoria(this.selectedCategoria.id, this.selectedCategoria).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada correctamente' });
          this.cargarCategorias();
          this.cerrarDialogEditCategoria();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la categoría' });
        }
      });
    } else {
      // Crear nueva categoría
      this.tablaMaestraService.addCategoria(this.selectedCategoria).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría agregada correctamente' });
          this.cargarCategorias();
          this.cerrarDialogEditCategoria();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar la categoría' });
        }
      });
    }
  }

  confirmarEliminar(categoria: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`,
      accept: () => {
        this.eliminarCategoria(categoria);
      }
    });
  }

  eliminarCategoria(categoria: any) {
    this.tablaMaestraService.deleteCategoria(categoria.id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== categoria.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: `Categoría "${categoria.nombre}" eliminada`
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar la categoría: ${err.message}`
        });
      }
    });
  }


  // Abrir modal de Tabla Maestra (para agregar o editar)
  abrirDialogMaestra(registro: any = null) {
    this.selectedRegistro = registro ? { ...registro } : { id: null, categoria: null, nombre: '', codigo: null };
    this.dialogMaestra = true;
  }

  cerrarDialogMaestra() {
    this.dialogMaestra = false;
    this.selectedRegistro = null;
  }

  // Guardar o actualizar un registro en la Tabla Maestra
  guardarMaestra() {
    if (this.selectedRegistro.id) {
      // Actualizar
      this.tablaMaestraService.updateMaestra(this.selectedRegistro.id, this.selectedRegistro).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado correctamente' });
          this.cargarTablaMaestra();
          this.cerrarDialogMaestra();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el registro' });
        }
      });
    } else {
      // Crear nuevo
      this.tablaMaestraService.addMaestra(this.selectedRegistro).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro agregado correctamente' });
          this.cargarTablaMaestra();
          this.cerrarDialogMaestra();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar el registro' });
        }
      });
    }
  }

  // Eliminar un registro
  eliminarMaestra(id: number) {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.tablaMaestraService.deleteMaestra(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente' });
          this.cargarTablaMaestra();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el registro' });
        }
      });
    }
  }

}
