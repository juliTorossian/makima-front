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
import { ClienteSelect } from '../../cliente/cliente-select/cliente-select';
import { NgIcon } from '@ng-icons/core';
import { createTypeaheadFormatter, createTypeaheadSearch } from '@/app/utils/typeahead-utils';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ClienteService } from '@core/services/cliente';

@Component({
  selector: 'app-proyecto-crud',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    ToastModule,
    NgbTypeaheadModule,
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
  protected modalSel = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  clientes!: Cliente[];
  
  selectedCliente?: Cliente;
  
  private dataLoadedCount = 0;
  private totalDataToLoad = 1;

  override ngOnInit(): void {
    super.ngOnInit();
      

    this.clienteService.getAll().subscribe({
      next: (res:any) => {
        console.log(res)
        this.clientes = res;
        this.searchCliente = createTypeaheadSearch(this.clientes, c => `${c.sigla} - ${c.nombre}`);
        this.checkAndSetupEditMode();
      }
    });
  }

  private checkAndSetupEditMode() {
    this.dataLoadedCount++;
    if (this.dataLoadedCount === this.totalDataToLoad && this.modo === 'M') {
      this.setupEditMode();
    }
  }
  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl('', ),
      sigla: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      activo: new FormControl(true, []),
      critico: new FormControl(false, []),
      cliente: new FormControl(null, [Validators.required]),
    });
  }

  protected populateForm(data: Proyecto): void {
    const clienteObj = this.clientes?.find(c => c.id === data.clienteId) || null;

    setTimeout(() => {
      this.form.patchValue({
        id: data.id,
        sigla: data.sigla,
        nombre: data.nombre,
        activo: data.activo,
        critico: data.critico,
        cliente: clienteObj,
      });
      this.cdr.detectChanges();
    }, 0);
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Proyecto {
    let cliente = this.get('cliente')?.value;
    
    return {
      id: this.get('id')?.value,
      sigla: this.get('sigla')?.value,
      nombre: this.get('nombre')?.value,
      activo: this.get('activo')?.value,
      critico: this.get('critico')?.value,
      clienteId: cliente.id,
    };
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }
  
  
  modalSelCliente(event: Event) {
    event.preventDefault();
    this.modalSel = this.dialogService.open(ClienteSelect, {
      ...modalConfig,
      header: "Seleccionar Cliente"
    });

    this.modalSel.onClose.subscribe((result: any) => {
      if (!result) return;
      this.form.patchValue({
        cliente: result
      });
    });
  }
  
  searchCliente = createTypeaheadSearch<Cliente>(
    this.clientes,
    item => `${item.sigla} - ${item.nombre}`
  );
  formatterCliente = createTypeaheadFormatter<Cliente>(
    item => `${item.sigla} - ${item.nombre}`
  );
  
}


