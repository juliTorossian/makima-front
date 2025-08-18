import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { PermisoClave, permisosData, Rol } from '@core/interfaces/rol';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-rol-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './rol-crud.html',
  styleUrl: './rol-crud.scss'
})
export class RolCrud extends CrudFormModal<Rol> {
  permisosData = permisosData;

  protected buildForm(): FormGroup {
    return new FormGroup({
      codigo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', []),
      esAdmin: new FormControl(false),
      permisos: new FormArray(
        permisosData.map(p => new FormGroup({
          clave: new FormControl(p.clave),
          rolCodigo: new FormControl(''),
          nivel: new FormControl(p.nivel),
          activo: new FormControl(true),
        }))
      )
    });
  }
  get permisosArray(): FormArray {
    return this.form.get('permisos') as FormArray;
  }

  protected populateForm(data: Rol): void {
    this.form.patchValue({
      codigo: data.codigo,
      descripcion: data.descripcion,
      esAdmin: data.permisos?.some(p => p.clave === PermisoClave.ADMIN)
    });

    // Limpiar el FormArray existente (si hay permisos previos)
    const permisosArray = this.permisosArray;
    while (permisosArray.length) {
      permisosArray.removeAt(0);
    }

    // Llenar el FormArray con los permisos del objeto
    permisosData.forEach(pd => {
      let nf = new FormGroup({
        clave: new FormControl(pd.clave),
        rolCodigo: new FormControl(''),
        nivel: new FormControl(pd.nivel),
        activo: new FormControl(true)
      })
      data.permisos?.forEach(permiso => {
        if (permiso.clave === pd.clave){
          nf.patchValue({
            ...permiso
          })
        }
      });
      permisosArray.push(
        nf
      );
    })
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): Rol {
    const rol: Rol = {
      codigo: this.get('codigo')?.value,
      descripcion: this.get('descripcion')?.value,
      color: '#AF342A',
      permisos: []
    };

    if (this.get('esAdmin')?.value) {
      // Si es admin, agregamos el permiso de administrador
      rol.permisos?.push({
        rolCodigo: rol.codigo,
        clave: PermisoClave.ADMIN,
        nivel: 1
      });
    } else {
      // Si no es admin, filtramos los permisos con nivel > 0
      const permisosFormArray = this.permisosArray; // Obtenemos el FormArray de permisos

      permisosFormArray.controls.forEach(control => {
        const nivel = control.get('nivel')?.value;
        const clave = control.get('clave')?.value;

        if (nivel > 0) {
          rol.permisos?.push({
            rolCodigo: rol.codigo,
            clave: clave,
            nivel: Number(nivel)
          });
        }
      });
    }

    return rol;
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }
}
