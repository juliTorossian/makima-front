import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { Entorno } from '@core/interfaces/entorno';
import { Producto } from '@core/interfaces/producto';
import { EntornoService } from '@core/services/entorno';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-productos-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    AutoCompleteModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './productos-crud.html',
  styleUrl: './productos-crud.scss'
})
export class ProductosCrud extends CrudFormModal<Producto> implements OnInit {
  private entornoService = inject(EntornoService)

  entornos!: Entorno[];
  entornosFiltrados!: Entorno[];

  override ngOnInit(): void {
    super.ngOnInit();

    this.entornoService.getAll().subscribe({
      next: (res: any) => {
        this.entornos = res
      },
      error: () => this.showError('Error', 'Error al cargar los entornos.')
    })
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl('',),
      sigla: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      entornoCodigo: new FormControl('', [Validators.required]),
      activo: new FormControl(true, []),
    });
  }

  protected populateForm(data: Producto): void {
    this.form.patchValue({
      id: data.id,
      sigla: data.sigla,
      nombre: data.nombre,
      entornoCodigo: data.entornoCodigo,
      activo: data.activo
    });
    console.log(data)
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Producto {
    return {
      id: this.get('id')?.value,
      sigla: this.get('sigla')?.value,
      nombre: this.get('nombre')?.value,
      entornoCodigo: this.get('entornoCodigo')?.value,
      activo: this.get('activo')?.value,
    };
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }

  filtroEntorno(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.entornos as any[]).length; i++) {
      let item = (this.entornos as any[])[i];
      if (item.codigo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item.codigo);
      }
    }

    this.entornosFiltrados = filtered;
  }

}

