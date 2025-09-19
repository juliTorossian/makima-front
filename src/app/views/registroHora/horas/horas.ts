import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon, UiCard } from '@app/components/index';
import { RegistroHora, UsuarioHorasGenerales } from '@core/interfaces/registro-hora';
import { RegistroHoraService } from '@core/services/registro-hora';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HoraCrud } from '../hora-crud/hora-crud';
import { modalConfig } from '@/app/types/modals';
import { ShortcutDirective } from '@core/directive/shortcut';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { getFechaLocal, parseIsoAsLocal } from '@/app/utils/datetime-utils';

@Component({
  selector: 'app-horas',
  imports: [
    UiCard,
    TableModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    DatePickerModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './horas.html',
  styleUrl: './horas.scss'
})
export class Horas extends TrabajarCon<RegistroHora> {
  protected override exportarExcelImpl(): void {
    throw new Error('Method not implemented.');
  }
  protected override procesarExcel(file: File): void {
    throw new Error('Method not implemented.');
  }
  protected override descargarPlantilla(): void {
    throw new Error('Method not implemented.');
  }
  private registroHoraService = inject(RegistroHoraService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;
  getFechaLocal=getFechaLocal

  registrosHorasGenerales!: UsuarioHorasGenerales[];
  registrosHorasGeneralesFiltradas!: UsuarioHorasGenerales[];

  dateFilter = new Date();

  constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.HORAS_GENERALES;
  }

  protected loadItems(): void {
    this.consultarRegistros(this.dateFilter);
  }

  alta(registroHora: RegistroHora): void {
    delete registroHora.id
    this.registroHoraService.create(registroHora).subscribe({
      next: () => this.afterChange('Registro de Hora creado correctamente.'),
      error: () => this.showError('Error al crear el registro de Hora.')
    });
  }

  editar(registroHora: RegistroHora): void {
    let registroHoraId = registroHora.id ?? 0;
    this.registroHoraService.update(registroHoraId, registroHora).subscribe({
      next: () => this.afterChange('Registro de Hora actualizado correctamente.'),
      error: () => this.showError('Error al modificar el registro de Hora.')
    });
  }

  eliminarDirecto(registroHora: RegistroHora): void {
    let registroHoraId = registroHora.id ?? 0;
    this.registroHoraService.delete(registroHoraId).subscribe({
      next: () => this.afterChange('Registro de Hora eliminado correctamente.'),
      error: () => this.showError('Error al eliminar el registro de Hora.')
    });
  }

  mostrarModalCrud(registroHora: RegistroHora | null, modo: 'A' | 'M') {
    const data = { item: registroHora, modo };
    const header = modo === 'A' ? 'Nuevo Registro de Hora' : 'Modificar Registro de Hora';

    this.ref = this.dialogService.open(HoraCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((registroHoraCrud: RegistroHora) => {
      if (!registroHoraCrud) return;
      modo === 'M' ? this.editar(registroHoraCrud) : this.alta(registroHoraCrud);
    });
  }

  consultarRegistros(fechaFiltro: Date) {
    this.loadingService.show();
    this.registroHoraService.getHorasGenerales(fechaFiltro).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        // console.log(res)
        const registros = (res || []).map((usuario: any) => {
          const registrosHora = Array.isArray(usuario.registrosHora)
            ? usuario.registrosHora.map((reg: any) => {
                const fecha = reg?.fecha ? parseIsoAsLocal(reg.fecha) : undefined;
                const horas = Array.isArray(reg.horas)
                  ? reg.horas.map((h: any) => ({
                      ...h,
                      inicio: h?.inicio ? parseIsoAsLocal(h.inicio) : undefined,
                      fin: h?.fin ? parseIsoAsLocal(h.fin) : undefined
                    }))
                  : reg.horas;
                return { ...reg, fecha, horas };
              })
            : usuario.registrosHora;
          return { ...usuario, registrosHora };
        });

        const filtrados = registros.filter((usuario: any) =>
          Array.isArray(usuario.registrosHora) && usuario.registrosHora.length > 0
        );
        this.registrosHorasGenerales = filtrados;
        this.registrosHorasGeneralesFiltradas = filtrados;
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los registros de Hora.')
    });
  }

  aplicarFiltroFecha(fechaSel: any) {
    const aux = new Date(fechaSel);
    this.consultarRegistros(aux);
  }
  
}
