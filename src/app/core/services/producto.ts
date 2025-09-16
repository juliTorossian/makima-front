import { FiltroActivo } from '@/app/constants/filtros_activo';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Producto } from '@core/interfaces/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.URL_COMPLETA}/producto?activo=${activo}`);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.URL_COMPLETA}/producto/${id}`);
  }

  create(producto:Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.URL_COMPLETA}/producto`, producto);
  }

  update(id:number, producto:Producto): Observable<Producto> {
    return this.http.patch<Producto>(`${this.URL_COMPLETA}/producto/${id}`, producto);
  }

  delete(id:number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.URL_COMPLETA}/producto/${id}`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/producto/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/producto/importacion/export?activo=${activo}`, finalOptions);
  }

  importarProductos(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/producto/importacion/excel`, formData);
  }

}