import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BadgeClickComponent, LoadingSpinnerComponent } from '@app/components/index';
import { SelectBase } from '@app/components/select-base/select-base';
import { Evento, EventoCompleto, formatEventoNumero } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { DrawerService } from '@core/services/drawer.service';
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
        NgIcon,
    ]
})
export class EventoSelect extends SelectBase<Evento> {
    private eventoService = inject(EventoService);
    protected config = inject(DynamicDialogConfig);
    private drawerService = inject(DrawerService);

    filtroEvento: FiltroActivo = FiltroActivo.ALL;

    eventos: EventoCompleto[] = [];
    eventoSeleccionado!: Evento;
    modalVisible: boolean = false;

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
        if (evento.id) {
            this.drawerService.abrirEventoDrawer(evento.id);
        }
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
                // this.eventos = res;
                this.eventos = res.map(evento => ({
                    ...evento,
                    evento: formatEventoNumero(evento.tipo.codigo, evento.numero)
                }));
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
