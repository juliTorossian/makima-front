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
        super.ngOnInit();
        
        // Obtener el clienteId después de la inicialización
        this.clienteId = this.config?.data?.clienteId ?? null;
        
        // Recargar items con el clienteId actualizado
        if (this.clienteId !== null) {
            this.loadItems();
        }
    }

    loadItems() {
        this.loadingSelect = true;
        this.proyectoService.getAll(FiltroActivo.TRUE, this.clienteId).pipe(
            finalize(() => {
                this.loadingSelect = false
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (res: Proyecto[]) => {
                this.proyectos = res;
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
