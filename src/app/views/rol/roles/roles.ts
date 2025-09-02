import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { PermisoClave, Rol } from '@core/interfaces/rol';
import { RolService } from '@core/services/rol';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RolCrud } from '../rol-crud/rol-crud';
import { modalConfig } from '@/app/types/modals';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';
import { UiCard } from '@app/components/ui-card';
import { ShortcutDirective } from '@core/directive/shortcut';
import { finalize } from 'rxjs';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';
import { CommonModule } from '@angular/common';
import { FiltroRadioGroupComponent } from '@app/components/filtro-check';
import { FiltroActivo } from '@/app/constants/filtros_activo';

@Component({
  selector: 'app-roles',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
    BooleanLabelPipe,
    CommonModule,
    FiltroRadioGroupComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles extends TrabajarCon<Rol> {
  private rolService = inject(RolService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  roles!:Rol[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.ROL;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.rolService.getAll(this.filtroActivo).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.roles = res;
        if (this.filtroActivo !== FiltroActivo.ALL){
          this.roles = this.roles.filter((rol) => {
            let aux = this.filtroActivo === FiltroActivo.TRUE;
            return rol.activo === aux;
          });
        }
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los roles.')
    });
  }

  alta(rol: Rol): void {
    this.rolService.create(rol).subscribe({
      next: () => this.afterChange('Rol creado correctamente.'),
      error: (err) => this.showError(err.error.message || 'Error al crear el rol.')
    });
  }

  editar(rol: Rol): void {
    let rolCodigo = rol.codigo ?? '';
    this.rolService.update(rolCodigo, rol).subscribe({
      next: () => this.afterChange('Rol actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el rol.')
    });
  }

  eliminarDirecto(rol: Rol): void {
    let rolCodigo = rol.codigo ?? '';
    this.rolService.delete(rolCodigo).subscribe({
      next: () => this.afterChange('Rol eliminado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar el Rol.')
    });
  }

  mostrarModalCrud(rol: Rol | null, modo: 'A' | 'M') {
    const data = { item: rol, modo };
    const header = modo === 'A' ? 'Nuevo Rol' : 'Modificar Rol';

    this.ref = this.dialogService.open(RolCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((rolCrud: Rol) => {
      if (!rolCrud) return;
      modo === 'M' ? this.editar(rolCrud) : this.alta(rolCrud);
    });
  }
}
