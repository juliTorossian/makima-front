import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reporte } from '@core/interfaces/reporte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: 'true' | 'false' | 'all' = 'true'): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.URL_COMPLETA}/reporte?activo=${activo}`);
  }

  getById(reporteId: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.URL_COMPLETA}/reporte/${reporteId}`);
  }

  create(reporte:Reporte): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.URL_COMPLETA}/reporte`, reporte);
  }

  update(reporteId:number, reporte:Reporte): Observable<Reporte> {
    return this.http.patch<Reporte>(`${this.URL_COMPLETA}/reporte/${reporteId}`, reporte);
  }

  delete(reporteId:number): Observable<Reporte> {
    return this.http.delete<Reporte>(`${this.URL_COMPLETA}/reporte/${reporteId}`);
  }

  descargarReporte(reporteId:number, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/reporte/${reporteId}/descargar`, finalOptions);
  }
}
