import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { UiCard } from '@app/components/ui-card';
import { ShortcutDirective } from '@core/directive/shortcut';
import { Modulo } from '@core/interfaces/modulo';
import { ModuloService } from '@core/services/modulo';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ModuloCrud } from '../modulo-crud/modulo-crud';
import { modalConfig } from '@/app/types/modals';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulos',
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
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './modulos.html',
  styleUrl: './modulos.scss'
})
export class Modulos extends TrabajarCon<Modulo> {
  private moduloService = inject(ModuloService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  modulos!:Modulo[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.MODULO;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.moduloService.getAll().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.modulos = res;
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los modulos.')
    });
  }

  alta(modulo: Modulo): void {
    this.moduloService.create(modulo).subscribe({
      next: () => this.afterChange('Modulo creado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear el modulo.')
    });
  }

  editar(modulo: Modulo): void {
    let moduloCodigo = modulo.codigo ?? '';
    this.moduloService.update(moduloCodigo, modulo).subscribe({
      next: () => this.afterChange('Modulo actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el modulo.')
    });
  }

  eliminarDirecto(modulo: Modulo): void {
    let moduloCodigo = modulo.codigo ?? '';
    this.moduloService.delete(moduloCodigo).subscribe({
      next: () => this.afterChange('Modulo eliminado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar el Modulo.')
    });
  }

  mostrarModalCrud(modulo: Modulo | null, modo: 'A' | 'M') {
    const data = { item: modulo, modo };
    const header = modo === 'A' ? 'Nuevo Modulo' : 'Modificar Modulo';

    this.ref = this.dialogService.open(ModuloCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((moduloCrud: Modulo) => {
      if (!moduloCrud) return;
      modo === 'M' ? this.editar(moduloCrud) : this.alta(moduloCrud);
    });
  }
}