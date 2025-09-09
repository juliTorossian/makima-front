import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { BadgeClickComponent } from '@app/components/badge-click';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { UiCard } from '@app/components/ui-card';
import { ShortcutDirective } from '@core/directive/shortcut';
import { CircularEvento, Evento, EventoCompleto } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { UserStorageService, UsuarioLogeado } from '@core/services/user-storage';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ModalSel } from './components/modal-sel/modal-sel';
import { modalConfig } from '@/app/types/modals';
import { EventoAccionesService } from '@core/services/evento-acciones';

import { DrawerModule } from 'primeng/drawer';
import { EventoDrawerComponent } from '../evento-drawer/evento-drawer';
import { CommonModule } from '@angular/common';
import { UsuarioDrawerComponent } from '../../usuario/usuario-drawer/usuario-drawer';
import { PadZeroPipe } from '@core/pipes/pad-zero.pipe';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'primeng/tooltip';
import { PrioridadIconComponent } from '@app/components/priority-icon';

@Component({
  selector: 'app-eventos-usuario',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    BadgeClickComponent,
    DatePipe,
    DrawerModule,
    CommonModule,
    EventoDrawerComponent,
    UsuarioDrawerComponent,
    PadZeroPipe,
    NgbPopoverModule,
    TooltipModule,
    PrioridadIconComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './eventos-usuario.html',
  styleUrl: './eventos-usuario.scss'
})
export class EventosUsuario extends TrabajarCon<Evento> {
  // ...existing code...
  private eventoService = inject(EventoService);
  private eventoAccionesService = inject(EventoAccionesService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;
  private userStorageService = inject(UserStorageService);
  @ViewChild('dt') table!: Table;

  // Estado para el offcanvas
  showEventoDrawer = false;
  eventoSeleccionadoId: string | null = null;
  // Estado para el usuario drawer
  showUsuarioDrawer = false;
  usuarioSeleccionadoId: string | null = null;

  usuarioActivo: UsuarioLogeado | null = this.userStorageService.getUsuario();

  eventos: EventoCompleto[] = [];

  override ngOnInit(): void {
    setTimeout(() => {
      this.loadItems();
    });
  }

  constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisos = ['A', 'M', 'B'];
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.eventoService.getAllCompleteByUsuario(this.usuarioActivo?.id ?? '').subscribe({
      next: (res) => {
        console.log(res)
        setTimeout(() => {
          this.eventos = [...res];
          if (this.table) {
            this.table.reset(); // Esto fuerza el refresco de la grilla
          }
          this.cdr.detectChanges();
          this.loadingService.hide();
        });
      },
      error: () => {
        this.showError('Error al cargar los eventos.');
        this.loadingService.hide();
      }
    });
  }

  alta(evento: Evento): void { }
  editar(evento: Evento): void { }
  eliminarDirecto(evento: Evento): void { }

  mostrarModalCrud(evento: EventoCompleto | null, modo: 'AVZ' | 'RTO' | 'RAS' | 'AUT' | 'REC') {
    let header: string;
    let data = {
      reqComentario: false,
      comentario: '',
      mensaje: '',
      modo: modo,
      etapaActual: '',
      proximaEtapa: '',
    };

    switch (modo) {
      case 'AVZ':
        header = "Avanzar Evento";
        // data.reqComentario = evento?.etapaSiguiente?.requiereComentario || false;
        data.etapaActual = evento?.etapaActualData?.nombre!;
        data.proximaEtapa = evento?.etapaSiguiente?.nombre!;
        // rol = evento?.etapaSiguiente?.rolPreferido;
        break;
      case 'RTO':
        header = "Retroceder Evento";
        data.etapaActual = evento?.etapaActualData?.nombre!;
        data.proximaEtapa = evento?.etapaSiguiente?.nombre!;
        // data.rol = evento?.etapaAnterior?.rolPreferido;
        break;
      case 'RAS':
        header = "Reasignar Evento";
        data.etapaActual = evento?.etapaActualData?.nombre!;
        // data.rol = evento?.etapaActualData?.rolPreferido;
        break;
      case 'AUT':
        header = "Autorizar Evento";
        data.etapaActual = evento?.etapaActualData?.nombre!;
        data.proximaEtapa = evento?.etapaSiguiente?.nombre!;
        // data.rol = evento?.etapaActualData?.rolPreferido;
        break;
      case 'REC':
        header = "Rechazar Evento";
        data.etapaActual = evento?.etapaActualData?.nombre!;
        data.proximaEtapa = evento?.etapaAnterior?.nombre!;
        // rol = evento?.etapaActualData?.rolPreferido;
        break;
    }


    this.ref = this.dialogService.open(ModalSel, {
      ...modalConfig,
      width: '50%',
      header,
      data
    });

    this.ref.onClose.subscribe((result: any) => {
      if (!result) return;

      console.log(result);
      if (evento) {
        const body: CircularEvento = {
          eventoId: evento.id || '',
          usuarioId: result.usuarioSeleccionado,
          comentario: result.comentario
        }
        this.loadingService.show();

        if (modo === 'AVZ') {
          this.eventoAccionesService.avanzar(body).subscribe({
            next: () => this.showSuccess('Evento avanzado correctamente.'),
            error: (err: any) => { this.showError(err.error.message || 'Error al avanzar el evento.') },
            complete: () => {
              this.loadItems();
            },
          });
        } else if (modo === 'RTO') {
          this.eventoAccionesService.retroceder(body).subscribe({
            next: () => this.showSuccess('Evento retrocedido correctamente.'),
            error: (err: any) => this.showError(err.error.message || 'Error al retroceder el evento.'),
            complete: () => {
              this.loadItems();
            },
          });
        } else if (modo === 'RAS') {
          this.eventoAccionesService.reasignar(body).subscribe({
            next: () => this.showSuccess('Evento reasignado correctamente.'),
            error: (err: any) => this.showError(err.error.message || 'Error al reasignar el evento.'),
            complete: () => {
              this.loadItems();
            },
          });
        } else if (modo === 'AUT') {
          this.eventoAccionesService.autorizar(body).subscribe({
            next: () => this.showSuccess('Evento autorizado correctamente.'),
            error: (err: any) => this.showError(err.error.message || 'Error al autorizar el evento.'),
            complete: () => {
              this.loadItems();
            },
          });
        } else if (modo === 'REC') {
          this.eventoAccionesService.rechazar(body).subscribe({
            next: () => this.showSuccess('Evento rechazado correctamente.'),
            error: (err: any) => this.showError(err.error.message || 'Error al rechazar el evento.'),
            complete: () => {
              this.loadItems();
            },
          });
        }
      }
    });

  }

  abrirEventoDrawer(evento: EventoCompleto) {
    this.eventoSeleccionadoId = evento.id || null;
    this.showEventoDrawer = true;
    this.cdr.detectChanges();
  }

  cerrarEventoDrawer() {
    this.showEventoDrawer = false;
    this.eventoSeleccionadoId = null;
    this.loadItems();
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

  getRequisitosFaltantes(evento: EventoCompleto): string {
    // console.log(evento.etapaActualData?.requisitosFaltantes);
    if (evento.etapaActualData?.requisitosFaltantes?.length === 0) return '';
    let req = '';
    evento.etapaActualData?.requisitosFaltantes?.forEach((r) => {
      req += `- ${r.descripcion}\n`;
    });
    // console.log(req);
    return req;
  }

}
