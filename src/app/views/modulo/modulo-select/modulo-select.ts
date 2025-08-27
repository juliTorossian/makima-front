import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoadingSpinnerComponent } from '@app/components/index';
import { SelectBase } from '@app/components/select-base/select-base';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { Modulo } from '@core/interfaces/modulo';
import { ModuloService } from '@core/services/modulo';
import { CommonModule } from '@angular/common';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';

@Component({
    selector: 'app-evento-select',
    templateUrl: './modulo-select.html',
    styleUrl: './modulo-select.scss',
    providers: [MessageService],
    imports: [
        LoadingSpinnerComponent,
        TableModule,
        NgIcon,
        BooleanLabelPipe,
        CommonModule,
    ]
})
export class ModuloSelect extends SelectBase<Modulo> {
    private moduloService = inject(ModuloService);

    modulos: Modulo[] = [];
    moduloSeleccionado!: Modulo;

    constructor() {
        super(
            inject(ChangeDetectorRef),
            inject(MessageService),
            inject(ConfirmationService)
        );
    }

    loadItems() {
        this.loadingSelect = true;
        this.moduloService.getAll().pipe(
            finalize(() => this.loadingSelect = false)
        ).subscribe({
            next: (res: Modulo[]) => {
                // console.log(res);
                this.modulos = res;
                this.cdr.detectChanges();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los modulos' });
            }
        });
    }

    select(modulo: Modulo) {
        this.moduloSeleccionado = modulo;
        this.submit()
    }

    toModel(): Modulo {
        return this.moduloSeleccionado;
    }

}
