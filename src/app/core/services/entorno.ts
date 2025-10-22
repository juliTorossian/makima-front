import { FiltroActivo } from '@/app/constants/filtros_activo';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Entorno } from '@core/interfaces/entorno';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntornoService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<Entorno[]> {
    return this.http.get<Entorno[]>(`${this.URL_COMPLETA}/entorno?activo=${activo}`);
  }

  getByCodigo(entornoCodigo: string): Observable<Entorno> {
    return this.http.get<Entorno>(`${this.URL_COMPLETA}/entorno/${entornoCodigo}`);
  }

  create(entorno:Entorno): Observable<Entorno> {
    return this.http.post<Entorno>(`${this.URL_COMPLETA}/entorno`, entorno);
  }

  update(entornoCodigo:string, entorno:Entorno): Observable<Entorno> {
    return this.http.patch<Entorno>(`${this.URL_COMPLETA}/entorno/${entornoCodigo}`, entorno);
  }

  delete(entornoCodigo:string): Observable<Entorno> {
    return this.http.delete<Entorno>(`${this.URL_COMPLETA}/entorno/${entornoCodigo}`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/entorno/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/entorno/importacion/export?activo=${activo}`, finalOptions);
  }

  importarExcel(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/entorno/importacion/excel`, formData);
  }
}
