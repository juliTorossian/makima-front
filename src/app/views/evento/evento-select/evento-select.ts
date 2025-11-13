import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BadgeClickComponent, LoadingSpinnerComponent } from '@app/components/index';
import { SelectBase } from '@app/components/select-base/select-base';
import { Evento, EventoCompleto } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { EventoDrawerComponent } from '../evento-drawer/evento-drawer';
import { PadZeroPipe } from '@core/pipes/pad-zero.pipe';
import { NgIcon } from '@ng-icons/core';
import { FiltroActivo } from '@/app/constants/filtros_activo';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-evento-select',
    templateUrl: './evento-select.html',
    styleUrl: './evento-select.scss',
    providers: [MessageService],
    imports: [
        LoadingSpinnerComponent,
        TableModule,
        BadgeClickComponent,
        EventoDrawerComponent,
        PadZeroPipe,
        NgIcon,
    ]
})
export class EventoSelect extends SelectBase<Evento> {
    private eventoService = inject(EventoService);
    protected config = inject(DynamicDialogConfig);

    filtroEvento: FiltroActivo = FiltroActivo.ALL;

    eventos: EventoCompleto[] = [];
    eventoSeleccionado!: Evento;
    modalVisible: boolean = false;
      // Estado para el offcanvas
    showEventoDrawer = false;
    eventoSeleccionadoId: string | null = null;

    constructor() {
        super(
            inject(ChangeDetectorRef),
            inject(MessageService),
            inject(ConfirmationService)
        );
    }

    override ngOnInit(): void {
        const data = this.config.data.filtroEvento;
        if (data) {
            this.filtroEvento = data;
        }
        super.ngOnInit();
    }

    abrirEventoDrawer(evento: EventoCompleto) {
        this.eventoSeleccionadoId = evento.id || null;
        this.showEventoDrawer = true;
        this.cdr.detectChanges();
    }

    cerrarEventoDrawer() {
        this.showEventoDrawer = false;
        this.eventoSeleccionadoId = null;
        this.cdr.detectChanges();
    }

    loadItems() {
        this.loadingSelect = true;
        this.eventoService.getAllComplete(this.filtroEvento).pipe(
            finalize(() => {
                this.loadingSelect = false
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (res: EventoCompleto[]) => {
                // console.log(res);
                this.eventos = res;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los eventos' });
            }
        });
    }

    select(evento:Evento) {
        this.eventoSeleccionado = evento;
        this.submit()
    }

    toModel(): Evento {
        let evento:Evento = this.eventoSeleccionado;
        return evento;
    }

}
