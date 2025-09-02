import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Proyecto } from '@core/interfaces/proyecto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: 'true' | 'false' | 'all' = 'true'): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.URL_COMPLETA}/proyecto?activo=${activo}`);
  }

  getById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.URL_COMPLETA}/proyecto/${id}`);
  }

  create(proyecto:Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.URL_COMPLETA}/proyecto`, proyecto);
  }

  update(id:number, proyecto:Proyecto): Observable<Proyecto> {
    return this.http.patch<Proyecto>(`${this.URL_COMPLETA}/proyecto/${id}`, proyecto);
  }

  delete(id:number): Observable<Proyecto> {
    return this.http.delete<Proyecto>(`${this.URL_COMPLETA}/proyecto/${id}`);
  }
}
