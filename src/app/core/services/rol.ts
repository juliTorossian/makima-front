import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol as RolInterface } from '@core/interfaces/rol';
import { FiltroActivo } from '@/app/constants/filtros_activo';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<RolInterface[]> {
    return this.http.get<RolInterface[]>(`${this.URL_COMPLETA}/rol?activo=${activo}`);
  }

  getByCodigo(rolCodigo: string): Observable<RolInterface> {
    return this.http.get<RolInterface>(`${this.URL_COMPLETA}/rol/${rolCodigo}`);
  }

  create(rol:RolInterface): Observable<RolInterface> {
    return this.http.post<RolInterface>(`${this.URL_COMPLETA}/rol`, rol);
  }

  update(rolCodigo:string, rol:RolInterface): Observable<RolInterface> {
    return this.http.patch<RolInterface>(`${this.URL_COMPLETA}/rol/${rolCodigo}`, rol);
  }

  delete(rolCodigo:string): Observable<RolInterface> {
    return this.http.delete<RolInterface>(`${this.URL_COMPLETA}/rol/${rolCodigo}`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/rol/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/rol/importacion/export?activo=${activo}`, finalOptions);
  }

  importarExcel(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/rol/importacion/excel`, formData);
  }

}
