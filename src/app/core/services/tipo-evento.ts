import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoEvento } from '@core/interfaces/tipo-evento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(`${this.URL_COMPLETA}/tipo-evento`);
  }

  getById(id: string): Observable<TipoEvento> {
    return this.http.get<TipoEvento>(`${this.URL_COMPLETA}/tipo-evento/${id}`);
  }

  create(tipoEvento:TipoEvento): Observable<TipoEvento> {
    return this.http.post<TipoEvento>(`${this.URL_COMPLETA}/tipo-evento`, tipoEvento);
  }

  update(id:string, tipoEvento:TipoEvento): Observable<TipoEvento> {
    return this.http.patch<TipoEvento>(`${this.URL_COMPLETA}/tipo-evento/${id}`, tipoEvento);
  }

  delete(id:string): Observable<TipoEvento> {
    return this.http.delete<TipoEvento>(`${this.URL_COMPLETA}/tipo-evento/${id}`);
  }
}
