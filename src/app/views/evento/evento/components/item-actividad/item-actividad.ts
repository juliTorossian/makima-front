import { ACCIONES, ACCIONES_NO_MOSTRAR } from '@/app/constants/actividad_acciones';
import { Component, Input } from '@angular/core';
import { VidaEvento } from '@core/interfaces/evento';
import { NgIcon } from '@ng-icons/core';
import { getIconNameAccion, getTitleAccion, getDescripcionAccion} from '@/app/constants/actividad_acciones';
import { getTimeAgo } from '@/app/utils/datetime-utils';

@Component({
  selector: 'app-item-actividad',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './item-actividad.html',
  styleUrl: './item-actividad.scss'
})
export class ItemActividadComponent {
  @Input() actividad!: VidaEvento;
  @Input() last: boolean = false;
  ACCIONES = ACCIONES;
  ACCIONES_NO_MOSTRAR = ACCIONES_NO_MOSTRAR;

  getIconNameAccion() { return getIconNameAccion(this.actividad.accion) }
  getTitleAccion() { return getTitleAccion(this.actividad) }
  getDescripcionAccion() { return getDescripcionAccion(this.actividad) }
  getTimeAgo() { return getTimeAgo(new Date(this.actividad.fecha)) }
}
