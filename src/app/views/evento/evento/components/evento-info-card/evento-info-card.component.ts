import { UsuarioDrawerComponent } from '@/app/views/usuario/usuario-drawer/usuario-drawer';
import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { BadgeClickComponent } from '@app/components/badge-click';
import { UiCard } from '@app/components/ui-card';
import { Evento, EventoCompleto, eventoFromEventoCompleto } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from "@angular/forms";
import { PrioridadIconComponent } from '@app/components/priority-icon';

@Component({
  selector: 'app-evento-info-card',
  templateUrl: './evento-info-card.component.html',
  styleUrls: ['./evento-info-card.component.scss'],
  imports: [
    UiCard,
    BadgeClickComponent,
    DatePipe,
    UsuarioDrawerComponent,
    DividerModule,
    FormsModule,
    PrioridadIconComponent,
]
})
export class EventoInfoCardComponent implements OnInit {
  private eventoService = inject(EventoService);
  @Input() evento!: EventoCompleto;
  
  // Estado para el usuario drawer
  showUsuarioDrawer = false;
  usuarioSeleccionadoId: string | null = null;

    // Utilidad para mostrar fechas en formato yyyy-MM-dd
    formatDateForInput(dateStr: string | null | undefined): string | null {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      // Ajuste de zona horaria para evitar desfases
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
      return localISO;
    }

  ngOnInit(): void {
    // console.log('Evento recibido en info card:', this.evento);
  }

  abrirUsuarioDrawer(usuarioId: string) {
    this.usuarioSeleccionadoId = usuarioId;
    this.showUsuarioDrawer = true;
  }

  cerrarUsuarioDrawer() {
    this.showUsuarioDrawer = false;
    this.usuarioSeleccionadoId = null;
  }

  onFechaChange(event:any, campo:string) {
    // event es el valor del input (string yyyy-MM-dd)
    const fecha = event ? new Date(event).toISOString() : null;
    // console.log(`Cambio en ${campo}: ${fecha}`);
    if (campo && this.evento) {
      (this.evento as any)[campo] = fecha;
    }
    let aux:Evento = eventoFromEventoCompleto(this.evento);
    aux = {
      ...aux,
      [campo]: (this.evento as any)[campo]
    }
    this.eventoService.update(this.evento.id!, aux).subscribe({
      next: () => {
        console.log(`Evento ${campo} actualizado`);
      },
      error: (err) => {
        console.error(`Error al actualizar evento ${campo}:`, err);
      }
    });
  }

}
