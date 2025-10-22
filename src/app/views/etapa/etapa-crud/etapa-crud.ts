import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { Etapa, Etapa_requisito, Tipo_requisito } from '@core/interfaces/etapa';
import { Rol } from '@core/interfaces/rol';
import { RolService } from '@core/services/rol';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-etapa-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './etapa-crud.html',
  styleUrl: './etapa-crud.scss'
})
export class EtapaCrud extends CrudFormModal<Etapa> implements OnInit{
  private rolService = inject(RolService);
  private cdr = inject(ChangeDetectorRef);
  Tipo_requisito = Tipo_requisito

  cargandoRoles:boolean=true;
  roles!:Rol[];

    private etapaPendiente: Etapa | null = null;

  override ngOnInit(): void {
    super.ngOnInit();

    this.rolService.getAll().subscribe({
      next: (res:any) => {
        this.roles = res;
        this.cargandoRoles = false;
        // Forzar actualización de la vista para evitar ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
          // Si hay una etapa pendiente de poblar, hacerlo ahora
          if (this.etapaPendiente) {
            this.populateForm(this.etapaPendiente);
            this.etapaPendiente = null;
          }
      },
      error: () => this.showError('Error', 'Error al cargar los roles.')
    })
  }

  protected buildForm(): FormGroup {
      return new FormGroup({
        id: new FormControl(''),
        nombre: new FormControl('', [Validators.required]),
        rolPreferido: new FormControl(null),
        activo: new FormControl(true, [Validators.required]),
        deAutoriza: new FormControl(false),
        deArchivo: new FormControl(false),
        requisitos: new FormArray([])
      });
  }

  protected populateForm(data: Etapa): void {
      if (this.cargandoRoles) {
        this.etapaPendiente = data;
        return;
      }
      this.form.patchValue({
        id: data.id,
        nombre: data.nombre,
        rolPreferido: (data as any)['rolPreferido'] != null ? String((data as any)['rolPreferido']) : (data.rolPreferido != null ? String(data.rolPreferido) : ''),
        activo: data.activo,
        deAutoriza: data.deAutoriza,
        deArchivo: data.deArchivo
      });
      // Limpiar requisitos existentes
      const requisitosArray = this.requisitosFormArray;
      while (requisitosArray.length) {
        requisitosArray.removeAt(0);
      }
      if (data.requisitos && Array.isArray(data.requisitos)) {
        data.requisitos.forEach(req => {
          requisitosArray.push(this.createRequisitoGroup(req));
        });
      }
  }
  get requisitosFormArray(): FormArray {
    return this.form.get('requisitos') as FormArray;
  }

  addRequisito(): void {
    this.requisitosFormArray.push(this.createRequisitoGroup());
  }

  removeRequisito(index: number): void {
    this.requisitosFormArray.removeAt(index);
  }

  private createRequisitoGroup(data?: Partial<Etapa_requisito>): FormGroup {
    return new FormGroup({
      codigo: new FormControl(data?.codigo || '', [Validators.required]),
      descripcion: new FormControl(data?.descripcion || ''),
      tipo: new FormControl(data?.tipo || null, [Validators.required]),
      obligatorio: new FormControl(data?.obligatorio ?? true)
    });
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Etapa {
      return {
        id: this.get('id')?.value,
        nombre: this.get('nombre')?.value,
        rolPreferido: this.get('rolPreferido')?.value,
        activo: this.get('activo')?.value,
        deAutoriza: this.get('deAutoriza')?.value,
        deArchivo: this.get('deArchivo')?.value,
        requisitos: this.requisitosFormArray.value
      };
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }
}
