import { modalConfig } from '@/app/types/modals';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { Cliente } from '@core/interfaces/cliente';
import { Proyecto } from '@core/interfaces/proyecto';
import { ProyectoService } from '@core/services/proyecto';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { ClienteService } from '@core/services/cliente';

@Component({
  selector: 'app-proyecto-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    MultiSelectModule,
    CommonModule
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './proyecto-crud.html',
  styleUrl: './proyecto-crud.scss'
})
export class ProyectoCrud extends CrudFormModal<Proyecto> {
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  
  private dataLoadedCount = 0;
  private totalDataToLoad = 1;

  override ngOnInit(): void {
    super.ngOnInit();

    this.clienteService.getAll().subscribe({
      next: (res: any) => {
        this.clientes = res;
        this.cdr.detectChanges();
        this.checkAndSetupEditMode();
      }
    });
  }

  private checkAndSetupEditMode() {
    this.dataLoadedCount++;
    if (this.dataLoadedCount === this.totalDataToLoad && this.modo === 'M') {
      this.setupEditMode();
      this.cdr.detectChanges();
    }
  }
  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      sigla: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      activo: new FormControl(true),
      critico: new FormControl(false),
      clienteIds: new FormControl([], [Validators.required]),
    });
  }

  protected populateForm(data: Proyecto): void {
    console.log('Populating form with data:', data);
    
    // Extraer los IDs de los clientes desde la relación muchos a muchos
    let clienteIds: number[] = [];
    if (data.clienteIds && data.clienteIds.length > 0) {
      // Si viene clienteIds directamente
      clienteIds = data.clienteIds;
    } else if (data.clientes && data.clientes.length > 0) {
      // Si viene el array de relaciones, extraer los clienteId
      clienteIds = data.clientes.map(c => c.clienteId);
    }
    
    console.log('Cliente IDs extracted:', clienteIds);
    
    this.form.patchValue({
      id: data.id,
      sigla: data.sigla,
      nombre: data.nombre,
      activo: data.activo,
      critico: data.critico,
      clienteIds: clienteIds,
    });
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Proyecto {
    return {
      id: this.get('id')?.value,
      sigla: this.get('sigla')?.value,
      nombre: this.get('nombre')?.value,
      activo: this.get('activo')?.value,
      critico: this.get('critico')?.value,
      clienteIds: this.get('clienteIds')?.value || [],
    };
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }
}


