import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { BadgeClickComponent } from '@app/components/badge-click';
import { DrawerService } from '@core/services/drawer.service';
import { UiCard } from '@app/components/ui-card';
import { Evento, EventoCompleto, eventoFromEventoCompleto } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from "@angular/forms";
import { PrioridadIconComponent } from '@app/components/priority-icon';
import { parseIsoAsLocal } from '@/app/utils/datetime-utils';

@Component({
  selector: 'app-evento-info-card',
  templateUrl: './evento-info-card.component.html',
  styleUrls: ['./evento-info-card.component.scss'],
  imports: [
    UiCard,
    BadgeClickComponent,
    DatePipe,
    DividerModule,
    FormsModule,
    PrioridadIconComponent,
]
})
export class EventoInfoCardComponent implements OnInit {
  private eventoService = inject(EventoService);
  private drawerService = inject(DrawerService);
  @Input() evento!: EventoCompleto;
  
    // Utilidad para mostrar fechas en formato yyyy-MM-dd
    formatDateForInput(dateVal: string | Date | null | undefined): string | null {
      if (!dateVal) return null;
      const d = dateVal instanceof Date ? dateVal : parseIsoAsLocal(dateVal as any);
      if (!d || isNaN(d.getTime())) return null;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

  ngOnInit(): void {
    // console.log('Evento recibido en info card:', this.evento);
  }

  abrirUsuarioDrawer(usuarioId: string) {
    this.drawerService.abrirUsuarioDrawer(usuarioId);
  }

  onFechaChange(event:any, campo:string) {
    // event es el valor del input (string yyyy-MM-dd) o null
    const iso = event ? `${event}T00:00:00.000Z` : null; // enviar ISO con Z para backend
    if (campo && this.evento) {
      (this.evento as any)[campo] = iso;
    }
    const aux: Evento = {
      ...eventoFromEventoCompleto(this.evento),
      [campo]: iso
    };
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
