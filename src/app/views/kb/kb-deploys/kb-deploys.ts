import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { NgIcon } from '@ng-icons/core';
import { deploy } from '@core/interfaces/kb';
import { KbService } from '@core/services/kb';
import { CatalogoSelect } from '@app/components/catalogo-select/catalogo-select';
import { TipoCatalogo } from '@/app/constants/catalogo-config';
import { CatalogoService } from '@core/services/catalogo';
import { Catalogo } from '@core/interfaces/catalogo';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-kb-deploys',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    PanelModule,
    NgIcon,
    CatalogoSelect
  ],
  providers: [MessageService],
  templateUrl: './kb-deploys.html',
  styleUrls: ['./kb-deploys.scss']
})
export class KbDeploys implements OnInit {
  private kbService = inject(KbService);
  private catalogoService = inject(CatalogoService);
  private messageService = inject(MessageService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  kbId!: number;
  kbNombre?: string;
  deploys: deploy[] = [];
  deploysFiltrados: deploy[] = [];
  loading: boolean = false;
  
  // Filtros
  filtroAmbiente: string = '';
  filtroHosting: string = '';
  filtroEstado: string = '';
  
  // Opciones para filtros (valores únicos de los deploys)
  opcionesAmbiente: string[] = [];
  opcionesHosting: string[] = [];
  
  // Modo edición
  editando: boolean = false;
  deployEditandoId: number | null = null;
  
  // Formulario
  form!: FormGroup;
  
  // Tipos de catálogo (para usar en el template)
  readonly TipoCatalogo = TipoCatalogo;

  constructor(protected confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.kbId = this.config.data?.kbId;
    this.kbNombre = this.config.data?.kbNombre;
    
    if (!this.kbId) {
      this.showError('No se proporcionó el ID de la KB');
      this.cerrar();
      return;
    }

    this.buildForm();
    this.cargarDeploys();
  }

  cargarCatalogos(): void {
    // Ya no se usa - las opciones se extraen de los deploys
  }

  extraerOpcionesDeFiltros(): void {
    // Extraer valores únicos de ambiente
    const ambientesSet = new Set(this.deploys.map(d => d.ambiente).filter(Boolean));
    this.opcionesAmbiente = Array.from(ambientesSet).sort();
    
    // Extraer valores únicos de hosting
    const hostingsSet = new Set(this.deploys.map(d => d.hosting).filter(Boolean));
    this.opcionesHosting = Array.from(hostingsSet).sort();
  }

  buildForm(): void {
    this.form = new FormGroup({
      ambiente: new FormControl('', [Validators.required]),
      hosting: new FormControl('', [Validators.required]),
      nombre: new FormControl(''),
      url: new FormControl(''),
      observaciones: new FormControl(''),
      activo: new FormControl(true)
    });
  }

  cargarDeploys(): void {
    this.loading = true;
    this.kbService.findAllDeploys(this.kbId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (deploys) => {
          this.deploys = deploys;
          this.extraerOpcionesDeFiltros();
          this.aplicarFiltros();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al cargar los deploys');
        }
      });
  }

  nuevo(): void {
    this.editando = true;
    this.deployEditandoId = null;
    this.form.reset({
      ambiente: '',
      hosting: '',
      nombre: '',
      url: '',
      observaciones: '',
      activo: true
    });
  }

  editar(deploy: deploy): void {
    this.editando = true;
    this.deployEditandoId = deploy.id;
    this.form.patchValue({
      ambiente: deploy.ambiente,
      hosting: deploy.hosting,
      nombre: deploy.nombre || '',
      url: deploy.url || '',
      observaciones: deploy.observaciones || '',
      activo: deploy.activo
    });
  }

  cancelar(): void {
    this.editando = false;
    this.deployEditandoId = null;
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.showError('Por favor complete los campos obligatorios');
      return;
    }

    const deployData = {
      ...this.form.value,
      kbId: this.kbId  // Agregar el kbId al body
    };

    if (this.deployEditandoId) {
      // Actualizar
      this.kbService.updateDeploy(this.kbId, this.deployEditandoId, deployData)
        .subscribe({
          next: () => {
            this.showSuccess('Deploy actualizado correctamente');
            this.cargarDeploys();
            this.cancelar();
          },
          error: (err) => {
            this.showError(err.error?.message || 'Error al actualizar el deploy');
          }
        });
    } else {
      // Crear
      this.kbService.createDeploy(this.kbId, deployData)
        .subscribe({
          next: () => {
            this.showSuccess('Deploy creado correctamente');
            this.cargarDeploys();
            this.cancelar();
          },
          error: (err) => {
            this.showError(err.error?.message || 'Error al crear el deploy');
          }
        });
    }
  }

  eliminarDirecto(deploy: deploy): void {
    this.kbService.removeDeploy(this.kbId, deploy.id)
      .subscribe({
        next: () => {
          this.showSuccess('Deploy eliminado correctamente');
          this.cargarDeploys();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al eliminar el deploy');
        }
      });
  }

  delete(item: deploy, label: string = 'el registro'): void {
    this.confirmationService.confirm({
      message: `¿Seguro que querés eliminar ${label}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarDirecto(item);
      }
    });
  }

  cerrar(): void {
    this.ref.close();
  }

  aplicarFiltros(): void {
    this.deploysFiltrados = this.deploys.filter(deploy => {
      const cumpleAmbiente = !this.filtroAmbiente || deploy.ambiente === this.filtroAmbiente;
      const cumpleHosting = !this.filtroHosting || deploy.hosting === this.filtroHosting;
      const cumpleEstado = !this.filtroEstado || 
        (this.filtroEstado === 'activo' && deploy.activo) || 
        (this.filtroEstado === 'inactivo' && !deploy.activo);
      
      return cumpleAmbiente && cumpleHosting && cumpleEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroAmbiente = '';
    this.filtroHosting = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}
