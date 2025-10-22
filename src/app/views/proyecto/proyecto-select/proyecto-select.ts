import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { LoadingSpinnerComponent } from '@app/components/index';
import { SelectBase } from '@app/components/select-base/select-base';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';
import { Proyecto } from '@core/interfaces/proyecto';
import { ProyectoService } from '@core/services/proyecto';
import { FiltroActivo } from '@/app/constants/filtros_activo';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-evento-select',
    templateUrl: './proyecto-select.html',
    styleUrl: './proyecto-select.scss',
    providers: [MessageService],
    imports: [
        LoadingSpinnerComponent,
        TableModule,
        NgIcon,
        BooleanLabelPipe,
        CommonModule,
    ]
})
export class ProyectoSelect extends SelectBase<Proyecto> {
    private proyectoService = inject(ProyectoService);
    protected config = inject(DynamicDialogConfig);

    proyectos: Proyecto[] = [];
    proyectoSeleccionado!: Proyecto;
    clienteId: number | null = null;

    constructor() {
        super(
            inject(ChangeDetectorRef),
            inject(MessageService),
            inject(ConfirmationService)
        );
    }

    override ngOnInit(): void {
        // Obtener el clienteId de la configuración del diálogo
        this.clienteId = this.config?.data?.clienteId ?? null;
        
        super.ngOnInit();
    }

    loadItems() {
        this.loadingSelect = true;
        this.proyectoService.getAll(FiltroActivo.TRUE, this.clienteId).pipe(
            finalize(() => this.loadingSelect = false)
        ).subscribe({
            next: (res: Proyecto[]) => {
                this.proyectos = res;
                this.cdr.detectChanges();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proyectos' });
            }
        });
    }

    select(proyecto: Proyecto) {
        this.proyectoSeleccionado = proyecto;
        this.submit()
    }

    toModel(): Proyecto {
        return this.proyectoSeleccionado;
    }

}
