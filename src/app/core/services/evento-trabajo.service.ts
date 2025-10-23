import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventoCompleto } from '@core/interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoTrabajoService {
  private eventoEnTrabajoSubject = new BehaviorSubject<EventoCompleto | null>(null);
  private tiempoInicioSubject = new BehaviorSubject<Date | null>(null);

  eventoEnTrabajo$ = this.eventoEnTrabajoSubject.asObservable();
  tiempoInicio$ = this.tiempoInicioSubject.asObservable();

  setEventoEnTrabajo(evento: EventoCompleto | null, tiempoInicio?: Date): void {
    this.eventoEnTrabajoSubject.next(evento);
    this.tiempoInicioSubject.next(tiempoInicio || null);
  }

  getEventoEnTrabajo(): EventoCompleto | null {
    return this.eventoEnTrabajoSubject.value;
  }

  getTiempoInicio(): Date | null {
    return this.tiempoInicioSubject.value;
  }

  limpiarEvento(): void {
    this.eventoEnTrabajoSubject.next(null);
    this.tiempoInicioSubject.next(null);
  }
}
