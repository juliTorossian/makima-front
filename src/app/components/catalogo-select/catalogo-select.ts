import { Component, Input, Output, EventEmitter, OnInit, inject, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Catalogo } from '@core/interfaces/catalogo';
import { CatalogoService } from '@core/services/catalogo';
import { getDescripcionByTipoCatalogo } from '@/app/constants/catalogo-config';
import { finalize } from 'rxjs';

/**
 * Componente reutilizable para selects de catálogos con capacidad de crear nuevos elementos
 * 
 * Uso:
 * <app-catalogo-select
 *   tipoCatalogo="KB_PLATAFORMA"
 *   formControlName="plataforma"
 *   placeholder="Seleccione plataforma"
 *   [required]="true"
 * ></app-catalogo-select>
 */
@Component({
  selector: 'app-catalogo-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    TooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CatalogoSelect),
      multi: true
    },
    MessageService
  ],
  templateUrl: './catalogo-select.html',
  styleUrls: ['./catalogo-select.scss']
})
export class CatalogoSelect implements OnInit, ControlValueAccessor {
  private catalogoService = inject(CatalogoService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  @Input() tipoCatalogo!: string; // Tipo de catálogo a cargar (ej: "KB_PLATAFORMA")
  @Input() placeholder: string = '-- Seleccionar --';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showClear: boolean = true;
  @Input() filter: boolean = true;
  
  @Output() onChange = new EventEmitter<string | null>();

  catalogos: Catalogo[] = [];
  loading: boolean = false;
  descripcion?: string; // Se carga automáticamente desde la configuración
  
  // Para el modal de creación
  modalVisible: boolean = false;
  nuevoCodigo: string = '';
  nuevaDescripcion: string = '';
  creando: boolean = false;

  // Para ControlValueAccessor
  value: string | null = null;
  onTouched: () => void = () => {};
  onChangeFn: (value: string | null) => void = () => {};

  ngOnInit(): void {
    if (!this.tipoCatalogo) {
      console.error('CatalogoSelect: tipoCatalogo es requerido');
      return;
    }
    
    // Cargar descripción automáticamente desde la configuración
    this.descripcion = getDescripcionByTipoCatalogo(this.tipoCatalogo);
    
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.loading = true;
    this.catalogoService.findByTipo(this.tipoCatalogo, true)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (catalogos) => {
          this.catalogos = catalogos;
        },
        error: (error) => {
          console.error('Error al cargar catálogos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las opciones del catálogo'
          });
        }
      });
  }

  // Métodos de ControlValueAccessor
  writeValue(value: string | null): void {
    this.value = value;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  // Manejo de cambios
  onValueChange(value: string | null): void {
    this.value = value;
    this.onChangeFn(value);
    this.onChange.emit(value);
  }

  // Abrir modal de creación
  abrirModal(): void {
    this.modalVisible = true;
    this.nuevoCodigo = '';
    this.nuevaDescripcion = '';
  }

  // Cerrar modal
  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoCodigo = '';
    this.nuevaDescripcion = '';
  }

  // Guardar nuevo catálogo
  guardarNuevo(): void {
    if (!this.nuevoCodigo.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El código es obligatorio'
      });
      return;
    }

    this.creando = true;
    const nuevoCatalogo: Partial<Catalogo> = {
      tipo: this.tipoCatalogo,
      codigo: this.nuevoCodigo.trim().toUpperCase(),
      descripcion: this.nuevaDescripcion.trim() || undefined,
      activo: true
    };

    this.catalogoService.create(nuevoCatalogo)
      .pipe(finalize(() => {
        this.creando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (catalogo) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Catálogo creado exitosamente'
          });
          
          // Recargar catálogos
          this.cargarCatalogos();
          
          // Seleccionar automáticamente el nuevo valor
          setTimeout(() => {
            this.onValueChange(catalogo.codigo);
            this.cerrarModal();
          }, 300);
        },
        error: (error) => {
          console.error('Error al crear catálogo:', error);
          const mensaje = error.error?.message || 'No se pudo crear el catálogo';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje
          });
        }
      });
  }

  // Helper para obtener el label del catálogo
  getCatalogoLabel(catalogo: Catalogo): string {
    // return catalogo.descripcion 
    //   ? `${catalogo.codigo} - ${catalogo.descripcion}` 
    //   : catalogo.codigo;
    return catalogo.codigo;
  }
}
