import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AVATARES_DISPONIBLES } from '@/app/constants/avatares-disponibles';

@Component({
    selector: 'app-modal-seleccionar-avatar',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog 
            [(visible)]="visible" 
            [modal]="true" 
            [style]="{width: '600px'}"
            header="Seleccionar foto de perfil"
            (onHide)="onClose()">
            <div class="row g-3">
                @for (imagen of imagenesDisponibles; track imagen) {
                    <div class="col-3">
                        <div class="text-center">
                            <img 
                                [src]="'assets/images/users/' + imagen" 
                                class="rounded-circle cursor-pointer border"
                                [class.border-primary]="imagenSeleccionada === imagen"
                                [class.border-3]="imagenSeleccionada === imagen"
                                width="100" 
                                height="100"
                                (click)="seleccionarImagen(imagen)"
                                [alt]="imagen">
                        </div>
                    </div>
                }
            </div>
            <ng-template pTemplate="footer">
                <button 
                    pButton 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    class="p-button-text"
                    (click)="onClose()"></button>
                <button 
                    pButton 
                    label="Guardar" 
                    icon="pi pi-check"
                    [disabled]="!imagenSeleccionada"
                    (click)="onGuardar()"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .cursor-pointer {
            cursor: pointer;
            transition: transform 0.2s;
        }
        .cursor-pointer:hover {
            transform: scale(1.1);
        }
    `]
})
export class ModalSeleccionarAvatarComponent {
    @Input() visible: boolean = false;
    @Input() imagenActual: string = 'User-1.png';
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() imagenCambiada = new EventEmitter<string>();

    imagenSeleccionada: string = '';
    imagenesDisponibles: string[] = AVATARES_DISPONIBLES;

    ngOnInit() {
        this.imagenSeleccionada = this.imagenActual;
    }

    seleccionarImagen(imagen: string) {
        this.imagenSeleccionada = imagen;
    }

    onGuardar() {
        this.imagenCambiada.emit(this.imagenSeleccionada);
        this.onClose();
    }

    onClose() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
