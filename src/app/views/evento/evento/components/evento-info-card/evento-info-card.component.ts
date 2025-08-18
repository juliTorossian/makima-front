import { UsuarioDrawerComponent } from '@/app/views/usuario/usuario-drawer/usuario-drawer';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BadgeClickComponent } from '@app/components/badge-click';
import { UiCard } from '@app/components/ui-card';
import { EventoCompleto } from '@core/interfaces/evento';

@Component({
  selector: 'app-evento-info-card',
  templateUrl: './evento-info-card.component.html',
  styleUrls: ['./evento-info-card.component.scss'],
  imports: [
    UiCard,
    BadgeClickComponent,
    DatePipe,
    UsuarioDrawerComponent,
  ]
})
export class EventoInfoCardComponent {
  @Input() evento!: EventoCompleto;
  
  // Estado para el usuario drawer
  showUsuarioDrawer = false;
  usuarioSeleccionadoId: string | null = null;

  abrirUsuarioDrawer(usuarioId: string) {
    this.usuarioSeleccionadoId = usuarioId;
    this.showUsuarioDrawer = true;
  }

  cerrarUsuarioDrawer() {
    this.showUsuarioDrawer = false;
    this.usuarioSeleccionadoId = null;
  }
}
