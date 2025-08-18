import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { Cliente } from '@core/interfaces/cliente';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cliente-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './cliente-crud.html',
  styleUrl: './cliente-crud.scss'
})
export class ClienteCrud extends CrudFormModal<Cliente> {

  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl('', ),
      sigla: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      acivo: new FormControl(true, []),
    });
  }

  protected populateForm(data: Cliente): void {
    this.form.patchValue({
      id: data.id,
      sigla: data.sigla,
      nombre: data.nombre,
      activo: data.activo
    });
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Cliente {
    return {
      id: this.get('id')?.value,
      sigla: this.get('sigla')?.value,
      nombre: this.get('nombre')?.value,
      activo: this.get('activo')?.value,
    };
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }
}


