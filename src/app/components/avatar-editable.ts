import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
    selector: 'app-avatar-editable',
    standalone: true,
    imports: [CommonModule, NgIcon],
    template: `
        <div class="position-relative d-inline-block avatar-container" 
             (mouseenter)="showButton = true" 
             (mouseleave)="showButton = false">
            <img [src]="imageSrc" 
                 class="rounded-circle" 
                 [width]="size" 
                 [height]="size" 
                 [alt]="alt">
            @if (editable && showButton) {
                <button 
                    class="btn btn-primary btn-sm rounded-circle position-absolute edit-button"
                    (click)="onEdit()"
                    type="button">
                    <ng-icon name="lucidePencil" size="16" />
                </button>
            }
        </div>
    `,
    styles: [`
        .avatar-container {
            cursor: pointer;
        }
        .edit-button {
            bottom: 5px;
            right: 5px;
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
    `]
})
export class AvatarEditableComponent {
    @Input() imageSrc: string = 'assets/images/users/User-1.png';
    @Input() size: number = 120;
    @Input() alt: string = 'Foto de perfil';
    @Input() editable: boolean = false;
    @Output() edit = new EventEmitter<void>();

    showButton = false;

    onEdit() {
        this.edit.emit();
    }
}
