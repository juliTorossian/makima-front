import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-filtro-radio-group',
  imports: [
    NgIcon,
    TooltipModule,
    CommonModule
],
  template: `
    <div class="btn-group" role="group" aria-label="Radio toggle group">
      @for (opt of options; track opt; let i = $index) {
        <ng-container>
          <input
            type="radio"
            class="btn-check"
            [name]="name"
            [id]="name + i"
            [value]="opt.value"
            [checked]="opt.value === checkedValue"
            (change)="onChange($event)"
          />
          <label
            class="btn btn-outline-secondary"
            [for]="name + i"
            [pTooltip]="opt.label"
            tooltipPosition="top"
          >
            @if(!notIcon && (opt.icon || !opt.label)) {
              <ng-icon [name]="opt.icon" />
            }
            @if(!notLabel || !opt.icon) {
              <span [ngClass]="(opt.icon ? 'ms-1' : '')">{{ opt.label }}</span>
            }
          </label>
        </ng-container>
      }
    </div>
  `
})
export class FiltroRadioGroupComponent {
  @Input() options: {value:string, label:string, icon?:string}[] = [
    { value: 'all', label: 'Todos', icon: 'lucideAsterisk' },
    { value: 'false', label: 'Abiertos', icon: 'lucideLockKeyholeOpen' },
    { value: 'true', label: 'Cerrados', icon: 'lucideLockKeyhole' }
  ];
  @Input() name = 'btnradio';
  @Input() checkedValue = 'all';
  @Input() notIcon: boolean = false;
  @Input() notLabel: boolean = false;

  @Output() filtroCambio = new EventEmitter<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filtroCambio.emit(value);
  }
}