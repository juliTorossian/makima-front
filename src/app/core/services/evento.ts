import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Evento, Evento_requisito, Evento_requisito_completo, EventoCompleto, VidaEvento } from '@core/interfaces/evento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.URL_COMPLETA}/evento`);
  }

  getAllComplete(): Observable<EventoCompleto[]> {
    return this.http.get<EventoCompleto[]>(`${this.URL_COMPLETA}/evento/completo`);
  }

  getAllCompleteByUsuario(usuarioId:string): Observable<EventoCompleto[]> {
    return this.http.get<EventoCompleto[]>(`${this.URL_COMPLETA}/evento/completo/usuario/${usuarioId}`);
  }

  getById(eventoId: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.URL_COMPLETA}/evento/${eventoId}`);
  }

  getByIdCompleto(eventoId: string): Observable<EventoCompleto> {
    return this.http.get<EventoCompleto>(`${this.URL_COMPLETA}/evento/${eventoId}/completo`);
  }

  getAdjuntos(eventoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_COMPLETA}/evento/${eventoId}/adjuntos`);
  }

  getRequisitos(eventoId: string): Observable<Evento_requisito_completo[]> {
    return this.http.get<Evento_requisito_completo[]>(`${this.URL_COMPLETA}/evento/${eventoId}/requisitos`);
  }

  getActividad(eventoId: string): Observable<VidaEvento[]> {
    return this.http.get<VidaEvento[]>(`${this.URL_COMPLETA}/evento/${eventoId}/actividad`);
  }

  create(evento:Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.URL_COMPLETA}/evento`, evento);
  }

  createAdicional(formData:FormData): Observable<Evento> {
    return this.http.post<Evento>(`${this.URL_COMPLETA}/evento/adicional`, formData);
  }

  update(eventoId:string, evento:Evento): Observable<Evento> {
    return this.http.patch<Evento>(`${this.URL_COMPLETA}/evento/${eventoId}`, evento);
  }

  updateAdicional(eventoId:string, formData:FormData): Observable<Evento> {
    return this.http.patch<Evento>(`${this.URL_COMPLETA}/evento/${eventoId}/adicional`, formData);
  }

  delete(eventoId:string): Observable<Evento> {
    return this.http.delete<Evento>(`${this.URL_COMPLETA}/evento/${eventoId}`);
  }

  getAdjuntoBlob(adjuntoId:number): Observable<Blob> {
    return this.http.get<Blob>(`${this.URL_COMPLETA}/evento/adjunto/${adjuntoId}`, { responseType: 'blob' as 'json' });
  }

  agregarAdicional(eventoId:string, formData:FormData): Observable<Evento> {
    return this.http.post<Evento>(`${this.URL_COMPLETA}/evento/adicion`, formData);
  }

  toggleObservador(eventoId: string, usuarioId: string): Observable<any> {
    return this.http.post<any>(
      `${this.URL_COMPLETA}/evento/toggle-observador/${eventoId}/${usuarioId}`,
      {}
    );
  }

  // requisitos
  registrarEventoRequisito(eventoId: string, dto: any): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/evento/requisito/${eventoId}`, dto);
  }

  updateEventoRequisito(eventoId: string, requisitoId: string, dto: any): Observable<any> {
    return this.http.patch<any>(`${this.URL_COMPLETA}/evento/requisito/${eventoId}/${requisitoId}`, dto);
  }

  removeEventoRequisito(eventoId: string, requisitoId: string): Observable<any> {
    return this.http.delete<any>(`${this.URL_COMPLETA}/evento/requisito/${eventoId}/${requisitoId}`);
  }

}
