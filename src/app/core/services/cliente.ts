import { FiltroActivo } from '@/app/constants/filtros_activo';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cliente } from '@core/interfaces/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.URL_COMPLETA}/cliente?activo=${activo}`);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`);
  }

  create(cliente:Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.URL_COMPLETA}/cliente`, cliente);
  }

  update(id:number, cliente:Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`, cliente);
  }

  delete(id:number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/cliente/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/cliente/importacion/export?activo=${activo}`, finalOptions);
  }

  importarExcel(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/cliente/importacion/excel`, formData);
  }
}
