import { ChangeDetectorRef, Component, inject } from '@angular/core';
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

    proyectos: Proyecto[] = [];
    proyectoSeleccionado!: Proyecto;

    constructor() {
        super(
            inject(ChangeDetectorRef),
            inject(MessageService),
            inject(ConfirmationService)
        );
    }

    loadItems() {
        this.loadingSelect = true;
        this.proyectoService.getAll().pipe(
            finalize(() => this.loadingSelect = false)
        ).subscribe({
            next: (res: Proyecto[]) => {
                // console.log(res);
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
