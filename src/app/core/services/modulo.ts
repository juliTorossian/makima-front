import { FiltroActivo } from '@/app/constants/filtros_activo';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Modulo } from '@core/interfaces/modulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.URL_COMPLETA}/modulo?activo=${activo}`);
  }

  getByCodigo(moduloCodigo: string): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.URL_COMPLETA}/modulo/${moduloCodigo}`);
  }

  create(modulo:Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(`${this.URL_COMPLETA}/modulo`, modulo);
  }

  update(moduloCodigo:string, modulo:Modulo): Observable<Modulo> {
    return this.http.patch<Modulo>(`${this.URL_COMPLETA}/modulo/${moduloCodigo}`, modulo);
  }

  delete(moduloCodigo:string): Observable<Modulo> {
    return this.http.delete<Modulo>(`${this.URL_COMPLETA}/modulo/${moduloCodigo}`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/modulo/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/modulo/importacion/export?activo=${activo}`, finalOptions);
  }

  importarExcel(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/modulo/importacion/excel`, formData);
  }
}
