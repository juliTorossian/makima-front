import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { PermisoDisponible, Rol, RolPayload } from '@core/interfaces/rol';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RolService } from '@core/services/rol';
import { finalize } from 'rxjs';
import { TableModule } from 'primeng/table';
import { LoadingSpinnerComponent } from '@app/components/loading-spinner/loading-spinner';
import { ContextMenuModule } from 'primeng/contextmenu';

@Component({
  selector: 'app-rol-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    LoadingSpinnerComponent,
    ContextMenuModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './rol-crud.html',
  styleUrl: './rol-crud.scss'
})
export class RolCrud extends CrudFormModal<Rol> implements OnInit {
  private rolService = inject(RolService);
  private cdr = inject(ChangeDetectorRef);
  
  // Variable estática para mantener los permisos copiados entre instancias
  private static permisosCopiados: Map<number, boolean> | null = null;
  
  permisosDisponibles: PermisoDisponible[] = [];
  loading = false;
  private dataParaPopular: Rol | null = null;
  selectedModulo: PermisoDisponible | null = null;
  menuItems: MenuItem[] = [];

  override ngOnInit(): void {
    // Guardar los datos si vienen del config
    this.dataParaPopular = this.config.data.item as Rol | null;
    
    // Primero inicializar el formulario vacío
    super.ngOnInit();
    
    // Inicializar menuItems
    this.menuItems = [
      {
        label: 'Copiar permisos',
        icon: 'pi pi-copy',
        command: () => this.copiarPermisos()
      },
      {
        label: 'Combinar permisos',
        icon: 'pi pi-plus-circle',
        command: () => this.pegarPermisosCombinado(),
        disabled: !RolCrud.permisosCopiados
      },
      {
        label: 'Remplazar permisos',
        icon: 'pi pi-clone',
        command: () => this.pegarPermisos(),
        disabled: !RolCrud.permisosCopiados
      },
    ];
    
    // Luego cargar permisos
    this.cargarPermisosDisponibles();
  }

  private cargarPermisosDisponibles(): void {
    this.loading = true;
    this.rolService.getPermisosDisponibles()
      .pipe(finalize(() => {
        this.loading = false;
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (permisos) => {
          this.permisosDisponibles = permisos;
          // Construir el FormArray con los permisos disponibles
          this.buildPermisosFormArray();
          
          // Si hay datos para popular (modo edición), hacerlo ahora
          if (this.dataParaPopular) {
            this.populateFormPermisos(this.dataParaPopular);
          }
          
        },
        error: (error) => {
          console.error('Error al cargar permisos disponibles:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los permisos disponibles'
          });
        }
      });
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      codigo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      color: new FormControl('#AF342A'),
      esAdmin: new FormControl(false),
      permisos: new FormArray([])
    });
  }

  private buildPermisosFormArray(): void {
    const permisosArray = this.permisosArray;
    
    // Limpiar el FormArray
    while (permisosArray.length) {
      permisosArray.removeAt(0);
    }

    // Crear un control para cada acción de cada permiso disponible
    // Excluir SYS.ADMIN ya que se maneja con el checkbox
    this.permisosDisponibles.forEach(modulo => {
      modulo.acciones.forEach(accion => {
        // Excluir SYS.ADMIN de la tabla
        if (modulo.codigo === 'SYS' && accion.subcodigo === 'ADMIN') {
          return;
        }
        
        permisosArray.push(new FormGroup({
          permisoId: new FormControl(accion.id),
          activo: new FormControl(false),
          // Campos auxiliares para mostrar en la tabla
          moduloCodigo: new FormControl(modulo.codigo),
          moduloNombre: new FormControl(modulo.modulo),
          accionSubcodigo: new FormControl(accion.subcodigo),
          accionDescripcion: new FormControl(accion.descripcion)
        }));
      });
    });
  }

  get permisosArray(): FormArray {
    return this.form.get('permisos') as FormArray;
  }

  protected populateForm(data: Rol): void {
    // Verificar si tiene permiso de admin (código SYS.ADMIN o id 1)
    const esAdmin = data.permisos?.some(p => 
      p.permiso?.codigo === 'SYS' && p.permiso?.subcodigo === 'ADMIN'
    ) || false;

    this.form.patchValue({
      codigo: data.codigo,
      descripcion: data.descripcion,
      color: data.color || '#AF342A',
      esAdmin: esAdmin
    });
  }

  private populateFormPermisos(data: Rol): void {
    // Marcar los permisos activos
    if (data.permisos) {
      const permisosActivos = new Set(
        data.permisos
          .filter(p => p.activo)
          .map(p => p.permisoId)
      );

      this.permisosArray.controls.forEach(control => {
        const permisoId = control.get('permisoId')?.value;
        control.patchValue({
          activo: permisosActivos.has(permisoId)
        });
      });
    }
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): RolPayload {
    const formValue = this.form.value;
    
    let permisos: any[];
    
    if (formValue.esAdmin) {
      // Si es admin, buscar el ID del permiso SYS.ADMIN
      const permisoAdmin = this.permisosDisponibles
        .find(m => m.codigo === 'SYS')
        ?.acciones.find(a => a.subcodigo === 'ADMIN');
      
      if (permisoAdmin) {
        permisos = [{
          permisoId: permisoAdmin.id,
          activo: true
        }];
      } else {
        permisos = [];
      }
    } else {
      // Si no es admin, enviar SOLO los permisos activos
      permisos = formValue.permisos
        .filter((p: any) => p.activo === true)
        .map((p: any) => ({
          permisoId: p.permisoId,
          activo: true
        }));
    }
    
    const payload: RolPayload = {
      codigo: formValue.codigo,
      descripcion: formValue.descripcion,
      color: formValue.color || '#AF342A',
      permisos: permisos
    };

    return payload;
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }

  copiarPermisos(): void {
    RolCrud.permisosCopiados = new Map<number, boolean>();
    
    // Copiar el estado de TODOS los checkboxes del rol actual
    this.permisosArray.controls.forEach(control => {
      const permisoId = control.get('permisoId')?.value;
      const activo = control.get('activo')?.value || false;
      if (permisoId) {
        RolCrud.permisosCopiados!.set(permisoId, activo);
      }
    });
    
    this.messageService.add({
      severity: 'success',
      summary: 'Copiado',
      detail: 'Configuración de permisos copiada',
      life: 2000
    });
  }

  pegarPermisos(): void {
    if (!RolCrud.permisosCopiados) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay permisos copiados',
        life: 2000
      });
      return;
    }
    
    // Pegar los permisos copiados en TODOS los checkboxes del rol actual
    this.permisosArray.controls.forEach(control => {
      const permisoId = control.get('permisoId')?.value;
      const valorCopiado = RolCrud.permisosCopiados?.get(permisoId);
      
      if (valorCopiado !== undefined) {
        control.patchValue({ activo: valorCopiado });
      }
    });
    
    this.messageService.add({
      severity: 'success',
      summary: 'Pegado',
      detail: 'Configuración de permisos aplicada',
      life: 2000
    });
  }

  pegarPermisosCombinado(): void {
    if (!RolCrud.permisosCopiados) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay permisos copiados',
        life: 2000
      });
      return;
    }
    
    // Pegar los permisos copiados SIN sobrescribir los que ya están activos
    this.permisosArray.controls.forEach(control => {
      const permisoId = control.get('permisoId')?.value;
      const valorCopiado = RolCrud.permisosCopiados?.get(permisoId);
      const valorActual = control.get('activo')?.value;
      
      // Solo activar si el permiso copiado está activo O si ya estaba activo
      if (valorCopiado !== undefined) {
        control.patchValue({ activo: valorActual || valorCopiado });
      }
    });
    
    this.messageService.add({
      severity: 'success',
      summary: 'Combinado',
      detail: 'Permisos combinados correctamente',
      life: 2000
    });
  }

  onRowContextMenu(event: any, modulo: PermisoDisponible): void {
    this.menuItems = [
      {
        label: 'Copiar todos los permisos',
        icon: 'pi pi-copy',
        command: () => this.copiarPermisos()
      },
      {
        label: 'Pegar todos los permisos',
        icon: 'pi pi-clone',
        command: () => this.pegarPermisos(),
        disabled: !RolCrud.permisosCopiados
      }
    ];
  }

  // Método auxiliar para obtener las acciones únicas (columnas de la tabla)
  getAccionesUnicas(): { subcodigo: string, descripcion: string }[] {
    if (!this.permisosDisponibles.length) return [];
    
    const accionesMap = new Map<string, string>();
    this.permisosDisponibles.forEach(modulo => {
      modulo.acciones.forEach(accion => {
        if (!accionesMap.has(accion.subcodigo)) {
          accionesMap.set(accion.subcodigo, accion.descripcion);
        }
      });
    });
    
    const accionesArray = Array.from(accionesMap.entries()).map(([subcodigo, descripcion]) => ({
      subcodigo,
      descripcion
    }));
    
    const orden = ['LEER', 'CREAR', 'MODIFICAR', 'ELIMINAR'];
    
    // Separar acciones prioritarias y resto
    const prioritarias = orden
      .filter(s => accionesArray.some(a => a.subcodigo === s))
      .map(s => accionesArray.find(a => a.subcodigo === s)!);
    const resto = accionesArray
      .filter(a => !orden.includes(a.subcodigo))
      .sort((a, b) => a.subcodigo.localeCompare(b.subcodigo));
    
    return [...prioritarias, ...resto];
  }

  // Método auxiliar para verificar si un módulo tiene una acción específica
  tieneAccion(moduloCodigo: string, accionSubcodigo: string): boolean {
    if (!this.form) return false;
    
    const permiso = this.permisosArray.controls.find(c => 
      c.get('moduloCodigo')?.value === moduloCodigo && 
      c.get('accionSubcodigo')?.value === accionSubcodigo
    );
    return !!permiso;
  }

  // Método auxiliar para obtener el FormGroup de un permiso específico
  getPermisoControl(moduloCodigo: string, accionSubcodigo: string): FormGroup | null {
    if (!this.form) return null;
    
    return this.permisosArray.controls.find(c => 
      c.get('moduloCodigo')?.value === moduloCodigo && 
      c.get('accionSubcodigo')?.value === accionSubcodigo
    ) as FormGroup || null;
  }
}
