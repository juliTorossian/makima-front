import { Component, EventEmitter, Input, Output } from '@angular/core'
import { UiCard } from '@app/components/ui-card'
import { NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  imports: [
    NgIcon,
    UiCard,
    ],
  template: `
    <app-ui-card
      title="Actividad reciente"
      [isReloadable]="true"
      [reloading]="loading"
      (reload)="reload.emit()"
    >
      <div card-body>
        <ul class="list-unstyled mb-0">

          <li class="d-flex align-items-start mb-3">
            <ng-icon name="lucideCirclePlus" class="me-2 text-primary" />
            <div>
              <div class="fw-semibold">Evento creado</div>
              <small class="text-muted">Cliente ACME · hace 5 min</small>
            </div>
          </li>

          <li class="d-flex align-items-start mb-3">
            <ng-icon name="lucideCircleCheck" class="me-2 text-success" />
            <div>
              <div class="fw-semibold">Evento finalizado</div>
              <small class="text-muted">Proyecto Interno · hace 1 h</small>
            </div>
          </li>

          <li class="d-flex align-items-start">
            <ng-icon name="lucideSquarePen" class="me-2 text-warning" />
            <div>
              <div class="fw-semibold">Evento actualizado</div>
              <small class="text-muted">Cliente GACI · ayer</small>
            </div>
          </li>

        </ul>
      </div>
    </app-ui-card>
  `,
})
export class ActividadReciente {
  @Input() loading = false
  @Output() reload = new EventEmitter<void>()
}
