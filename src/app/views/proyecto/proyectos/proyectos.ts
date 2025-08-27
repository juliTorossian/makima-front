import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { UiCard } from '@app/components/ui-card';
import { ShortcutDirective } from '@core/directive/shortcut';
import { Proyecto } from '@core/interfaces/proyecto';
import { ProyectoService } from '@core/services/proyecto';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProyectoCrud } from '../proyecto-crud/proyecto-crud';
import { modalConfig } from '@/app/types/modals';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos',
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
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss'
})
export class Proyectos extends TrabajarCon<Proyecto> {
  private proyectoService = inject(ProyectoService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;
  proyectos!: Proyecto[];

  constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
        this.permisoClave = PermisoClave.CLIENTE;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.proyectoService.getAll().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.proyectos = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showError('Error al cargar los proyectos.');
      }
    });
  }

  alta(proyecto: Proyecto): void {
    delete proyecto.id
    this.proyectoService.create(proyecto).subscribe({
      next: () => this.afterChange('Proyecto creado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear el proyecto.')
    });
  }

  editar(proyecto: Proyecto): void {
    let proyectoId = proyecto.id ?? 0;
    this.proyectoService.update(proyectoId, proyecto).subscribe({
      next: () => this.afterChange('Proyecto actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el proyecto.')
    });
  }

  eliminarDirecto(proyecto: Proyecto): void {
    let proyectoId = proyecto.id ?? 0;
    this.proyectoService.delete(proyectoId).subscribe({
      next: () => this.afterChange('Proyecto eliminado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar el Proyecto.')
    });
  }

  mostrarModalCrud(proyecto: Proyecto | null, modo: 'A' | 'M') {
    const data = { item: proyecto, modo };
    const header = modo === 'A' ? 'Nuevo Proyecto' : 'Modificar Proyecto';

    this.ref = this.dialogService.open(ProyectoCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((proyectoCrud: Proyecto) => {
      if (!proyectoCrud) return;
      modo === 'M' ? this.editar(proyectoCrud) : this.alta(proyectoCrud);
    });
  }
}
