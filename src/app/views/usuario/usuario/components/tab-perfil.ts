import { EventoDrawerComponent } from "@/app/views/evento/evento-drawer/evento-drawer";
import { ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { BadgeClickComponent } from "@app/components/badge-click";
import { UiCard } from "@app/components/ui-card";
import { EventoCompleto } from "@core/interfaces/evento";
import { PadZeroPipe } from "@core/pipes/pad-zero.pipe";
import { TableModule } from "primeng/table";

@Component({
    selector: 'app-tab-perfil',
    imports: [
        UiCard,
        BadgeClickComponent,
        PadZeroPipe,
        TableModule,
        EventoDrawerComponent,
    ],
    template: `
        @if (eventosActuales) {
            <app-ui-card title="Eventos" [isTogglable]="true" [initialCollapsed]="false">
                <div card-body>
                    <p-table [value]="eventosActuales" size="small">
                        <ng-template pTemplate="header">
                            <tr>
                                <th hidden>Id</th>
                                <th hidden>Tipo</th>
                                <th hidden>Numero</th>
                                <th>Evento</th>
                                <th>Titulo</th>
                                <th>Producto</th>
                                <th>Cliente</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-evento>
                            <tr>
                                <td hidden>{{ evento.id }}</td>
                                <td hidden>{{ evento.tipo.id }}</td>
                                <td hidden>{{ evento.numero }}</td>
                                <td>
                                    <app-badge-click 
                                        [backgroundColor]="evento.tipo.color"
                                        (click)="abrirEventoDrawer(evento)"
                                        style="cursor:pointer"
                                    >
                                        {{ evento.tipo.codigo }}-{{evento.numero | padZero:3}}
                                    </app-badge-click>
                                </td>
                                <td>{{ evento.titulo }}</td>
                                <td>{{ evento.cliente.sigla }} - {{ evento.cliente.nombre }}</td>
                                <td>{{ evento.producto.sigla }} - {{ evento.producto.nombre }} | {{ evento.producto.entornoCodigo }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </app-ui-card>

            <!-- Drawer para mostrar el detalle del evento -->
            <app-evento-drawer
                [visible]="showEventoDrawer"
                [eventoId]="eventoSeleccionadoId"
                (closed)="cerrarEventoDrawer()"
            ></app-evento-drawer>
        }
    `,
})
export class TabPerfil implements OnInit {
    @Input() usuarioId!: string;
    @Input() eventosActuales: EventoCompleto[] = [];

    private cdr = inject(ChangeDetectorRef);
    
    // Estado para el offcanvas
    showEventoDrawer = false;
    eventoSeleccionadoId: string | null = null;

    ngOnInit(): void {
        
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

}
