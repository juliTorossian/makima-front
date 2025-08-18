import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { Etapa } from '@core/interfaces/etapa';
import { EtapaService } from '@core/services/etapa';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EtapaCrud } from '../etapa-crud/etapa-crud';
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
import { CommonModule } from '@angular/common';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';

@Component({
  selector: 'app-etapas',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
    CommonModule,
    BooleanLabelPipe,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './etapas.html',
  styleUrl: './etapas.scss'
})
export class Etapas extends TrabajarCon<Etapa> {
  private etapaService = inject(EtapaService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  etapas!:Etapa[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.ETAPA;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.etapaService.getAll().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.etapas = res;
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar las etapas.')
    });
  }

  alta(etapa: Etapa): void {
    delete etapa.id;
    etapa.requisitos?.map(req => {
      delete req.id
      return req;
    });
    this.etapaService.create(etapa).subscribe({
      next: () => this.afterChange('Etapa creada correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear la etapa.')
    });
  }

  editar(etapa: Etapa): void {
    let etapaId = etapa.id ?? '';
    this.etapaService.update(etapaId, etapa).subscribe({
      next: () => this.afterChange('Etapa actualizada correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar la etapa.')
    });
  }

  eliminarDirecto(etapa: Etapa): void {
    let etapaId = etapa.id ?? '';
    this.etapaService.delete(etapaId).subscribe({
      next: () => this.afterChange('Etapa eliminada correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar la Etapa.')
    });
  }

  mostrarModalCrud(etapa: Etapa | null, modo: 'A' | 'M') {
    const data = { item: etapa, modo };
    const header = modo === 'A' ? 'Nueva Etapa' : 'Modificar Etapa';

    this.ref = this.dialogService.open(EtapaCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((etapaCrud: Etapa) => {
      if (!etapaCrud) return;
      modo === 'M' ? this.editar(etapaCrud) : this.alta(etapaCrud);
    });
  }
}
