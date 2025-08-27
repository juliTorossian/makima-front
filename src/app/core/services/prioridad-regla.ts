import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PrioridadRegla } from '@core/interfaces/prioridad-reglas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrioridadService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<PrioridadRegla[]> {
    return this.http.get<PrioridadRegla[]>(`${this.URL_COMPLETA}/prioridad/regla`);
  }

  getById(id: number): Observable<PrioridadRegla> {
    return this.http.get<PrioridadRegla>(`${this.URL_COMPLETA}/prioridad/regla/${id}`);
  }

  getByTipo(tipoCodigo: string): Observable<PrioridadRegla[]> {
    return this.http.get<PrioridadRegla[]>(`${this.URL_COMPLETA}/prioridad/regla/tipo/${tipoCodigo}`);
  }

  create(prioridad: PrioridadRegla): Observable<PrioridadRegla> {
    return this.http.post<PrioridadRegla>(`${this.URL_COMPLETA}/prioridad/regla`, prioridad);
  }

  upsert(prioridad: PrioridadRegla): Observable<PrioridadRegla> {
    return this.http.post<PrioridadRegla>(`${this.URL_COMPLETA}/prioridad/regla/upsert`, prioridad);
  }

  update(id:number, prioridad:PrioridadRegla): Observable<PrioridadRegla> {
    return this.http.patch<PrioridadRegla>(`${this.URL_COMPLETA}/prioridad/regla/${id}`, prioridad);
  }

  delete(id:number): Observable<PrioridadRegla> {
    return this.http.delete<PrioridadRegla>(`${this.URL_COMPLETA}/prioridad/regla/${id}`);
  }

}
