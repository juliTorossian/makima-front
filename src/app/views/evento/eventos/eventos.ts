import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { Evento, EventoCompleto } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EventoCrud } from '../evento-crud/evento-crud';
import { modalConfig } from '@/app/types/modals';
import { ShortcutDirective } from '@core/directive/shortcut';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';
import { UiCard } from '@app/components/ui-card';
import { BadgeClickComponent } from "@app/components/badge-click";
import { DatePipe } from '@angular/common';

import { DrawerModule } from 'primeng/drawer';
import { EventoDrawerComponent } from '../evento-drawer/evento-drawer';
import { UsuarioDrawerComponent } from '../../usuario/usuario-drawer/usuario-drawer';
import { CommonModule } from '@angular/common';
import { UserStorageService, UsuarioLogeado } from '@core/services/user-storage';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { PadZeroPipe } from '@core/pipes/pad-zero.pipe';

@Component({
  selector: 'app-eventos',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
    BadgeClickComponent,
    DatePipe,
    DrawerModule,
    CommonModule,
    EventoDrawerComponent,
    UsuarioDrawerComponent,
    PadZeroPipe,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export class Eventos extends TrabajarCon<Evento> {
  // ...existing code...
  private eventoService = inject(EventoService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;
  private userStorageService = inject(UserStorageService);

  usuarioActivo: UsuarioLogeado | null = this.userStorageService.getUsuario();

  eventos!: EventoCompleto[];

  // Estado para el offcanvas
  showEventoDrawer = false;
  eventoSeleccionadoId: string | null = null;
  // Estado para el usuario drawer
  showUsuarioDrawer = false;
  usuarioSeleccionadoId: string | null = null;

  override ngOnInit(): void {
    this.loadItems();
  }

  constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.EVENTO;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.eventoService.getAllComplete().pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        // console.log(res)
        this.eventos = res;
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los eventos.')
    });
  }

  abrirEventoDrawer(evento: EventoCompleto) {
    this.eventoSeleccionadoId = evento.id;
    this.showEventoDrawer = true;
    this.cdr.detectChanges();
  }

  cerrarEventoDrawer() {
    this.showEventoDrawer = false;
    this.eventoSeleccionadoId = null;
    this.cdr.detectChanges();
  }

  abrirUsuarioDrawer(usuarioId: string) {
    this.usuarioSeleccionadoId = usuarioId;
    this.showUsuarioDrawer = true;
    this.cdr.detectChanges();
  }

  cerrarUsuarioDrawer() {
    this.showUsuarioDrawer = false;
    this.usuarioSeleccionadoId = null;
    this.cdr.detectChanges();
  }

  alta(evento: Evento): void {
    delete evento.id
    this.eventoService.create(evento).subscribe({
      next: () => this.afterChange('Evento creado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear el evento.')
    });
  }

  editar(evento: Evento): void {
    let eventoCodigo = evento.id ?? '';
    this.eventoService.update(eventoCodigo, evento).subscribe({
      next: () => this.afterChange('Evento actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el evento.')
    });
  }

  eliminarDirecto(evento: Evento): void {
    let eventoCodigo = evento.id ?? '';
    this.eventoService.delete(eventoCodigo).subscribe({
      next: () => this.afterChange('Evento eliminado correctamente.'),
      error: (err) => this.showError(err.error.message || 'Error al eliminar el Evento.')
    });
  }

  mostrarModalCrud(evento: Evento | null, modo: 'A' | 'M') {
    const data = { item: evento, modo };
    const header = modo === 'A' ? 'Nuevo Evento' : 'Modificar Evento';

    this.ref = this.dialogService.open(EventoCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((result: any) => {
      if (!result) return;
      // Si es FormData, usar los métodos privados
      if (result instanceof FormData) {
        if (modo === 'M') {
          // Necesitas el id para editar, puedes obtenerlo del modal si lo agregas en el FormData
          const id = evento?.id ?? '';
          this.editarFormData(id, result);
        } else {
          this.altaFormData(result);
        }
      } else {
        // fallback por si alguna vez retorna un objeto plano
        modo === 'M' ? this.editar(result) : this.alta(result);
      }
    });
  }

  // Métodos privados para manejar FormData
  private altaFormData(formData: FormData): void {
    this.eventoService.createAdicional(formData).subscribe({
      next: () => this.afterChange('Evento creado correctamente.'),
      error: () => this.showError('Error al crear el evento.')
    });
  }

  private editarFormData(id: string, formData: FormData): void {
    this.eventoService.updateAdicional(id, formData).subscribe({
      next: () => this.afterChange('Evento actualizado correctamente.'),
      error: () => this.showError('Error al modificar el evento.')
    });
  }
}
