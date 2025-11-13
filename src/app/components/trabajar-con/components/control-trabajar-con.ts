import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon } from '@ng-icons/core';
import { ShortcutDirective } from '@core/directive/shortcut';
import { SHORTCUTS } from '@/app/constants/shortcut';

@Component({
  selector: 'app-control-trabajar-con',
  standalone: true,
  imports: [
    NgIcon,
    CommonModule,
    NgbDropdownModule,
    ShortcutDirective,
  ],
  template: `
    <div class="btn-group" ngbDropdown>
      <input #fileInput type="file" accept=".xlsx,.xls" hidden (change)="onFileChange($event)" />
      <button
        class="btn btn-soft-primary btn-md"
        (click)="onNuevo()"
        [attr.title]="tituloNuevo"
        [appShortcut]="SHORTCUTS.NUEVO"
        (appShortcutTrigger)="onNuevo()"
      >
        <ng-icon name="lucideCirclePlus"></ng-icon>
      </button>
      <button type="button" class="btn btn-soft-primary dropdown-toggle-split drop-arrow-none btn-md" ngbDropdownToggle>
        <ng-icon name="tablerChevronDown"></ng-icon>
      </button>
      <div ngbDropdownMenu>
        <p class="titulo_dropdown">Exportaciones</p>
        <a ngbDropdownItem (click)="onExportarExcel()">Descargar Excel</a>
        <div class="dropdown-divider"></div>
        <p class="titulo_dropdown">Importaciones</p>
        <a ngbDropdownItem (click)="onPlantilla()">Descargar Plantilla</a>
        <a ngbDropdownItem (click)="fileInput.click()">Subir Excel</a>
      </div>
    </div>
  `
})
export class ControlTrabajarCon {
  readonly SHORTCUTS = SHORTCUTS;

  @Input() tituloNuevo = 'Nuevo';
  @Output() nuevo = new EventEmitter<void>();
  @Output() plantilla = new EventEmitter<void>();
  @Output() exportarExcel = new EventEmitter<void>();
  @Output() importar = new EventEmitter<File>();

  onNuevo() {
    this.nuevo.emit();
  }

  onPlantilla() {
    this.plantilla.emit();
  }

  onExportarExcel() {
    this.exportarExcel.emit();
  }

  onFileChange(event: any) {
    this.importar.emit(event);
    // console.log(event);
    // const input = event.target as HTMLInputElement;
    // console.log(input);
    // console.log(input.files);
    // const file = input.files && input.files.length ? input.files[0] : null;
    
    // if (file) {
    //   this.importar.emit(file);
    //   // limpiar input para permitir subir el mismo archivo otra vez si es necesario
    //   input.value = '';
    // }
  }
}