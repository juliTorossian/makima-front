import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { Entorno } from '@core/interfaces/entorno';
import { EntornoService } from '@core/services/entorno';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EntornosCrud } from '../entornos-crud/entornos-crud';
import { modalConfig } from '@/app/types/modals';
import { UiCard } from '@app/components/ui-card';
import { TableModule } from 'primeng/table';
import { NgIcon } from '@ng-icons/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ShortcutDirective } from '@core/directive/shortcut';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-entornos',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './entornos.html',
  styleUrl: './entornos.scss'
})
export class Entornos extends TrabajarCon<Entorno> {
  private entornoService = inject(EntornoService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  entornos!:Entorno[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.ENTORNO;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.entornoService.getAll().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.entornos = res;
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los entornos.')
    });
  }

  alta(entorno: Entorno): void {
    this.entornoService.create(entorno).subscribe({
      next: () => this.afterChange('Entorno creado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear el entorno.')
    });
  }

  editar(entorno: Entorno): void {
    let entornoCodigo = entorno.codigo ?? '';
    this.entornoService.update(entornoCodigo, entorno).subscribe({
      next: () => this.afterChange('Entorno actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el entorno.')
    });
  }

  eliminarDirecto(entorno: Entorno): void {
    let entornoCodigo = entorno.codigo ?? '';
    this.entornoService.delete(entornoCodigo).subscribe({
      next: () => this.afterChange('Entorno eliminado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar el Entorno.')
    });
  }

  mostrarModalCrud(entorno: Entorno | null, modo: 'A' | 'M') {
    const data = { item: entorno, modo };
    const header = modo === 'A' ? 'Nuevo Entorno' : 'Modificar Entorno';

    this.ref = this.dialogService.open(EntornosCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((entornoCrud: Entorno) => {
      if (!entornoCrud) return;
      modo === 'M' ? this.editar(entornoCrud) : this.alta(entornoCrud);
    });
  }
}
