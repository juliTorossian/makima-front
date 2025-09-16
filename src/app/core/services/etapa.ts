import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Etapa_requisito, Etapa as EtapaInterface } from '@core/interfaces/etapa';
import { FiltroActivo } from '@/app/constants/filtros_activo';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(activo: FiltroActivo = FiltroActivo.TRUE): Observable<EtapaInterface[]> {
    return this.http.get<EtapaInterface[]>(`${this.URL_COMPLETA}/etapa?activo=${activo}`);
  }

  getById(id: string): Observable<EtapaInterface> {
    return this.http.get<EtapaInterface>(`${this.URL_COMPLETA}/etapa/${id}`);
  }

  create(etapa:EtapaInterface): Observable<EtapaInterface> {
    return this.http.post<EtapaInterface>(`${this.URL_COMPLETA}/etapa`, etapa);
  }

  update(id:string, etapa:EtapaInterface): Observable<EtapaInterface> {
    return this.http.patch<EtapaInterface>(`${this.URL_COMPLETA}/etapa/${id}`, etapa);
  }

  delete(id:string): Observable<EtapaInterface> {
    return this.http.delete<EtapaInterface>(`${this.URL_COMPLETA}/etapa/${id}`);
  }

  // Requisitos

  agregarRequisito(etapaRequisito:Etapa_requisito): Observable<Etapa_requisito> {
    return this.http.post<Etapa_requisito>(`${this.URL_COMPLETA}/etapa/requisito`, etapaRequisito);
  }

  modificarRequisito(id:string, etapaRequisito:Etapa_requisito): Observable<Etapa_requisito> {
    return this.http.patch<Etapa_requisito>(`${this.URL_COMPLETA}/etapa/requisito/${id}`, etapaRequisito);
  }

  eliminarRequisito(id:string): Observable<Etapa_requisito> {
    return this.http.delete<Etapa_requisito>(`${this.URL_COMPLETA}/etapa/requisito/${id}`);
  }

  getAllArchivo(): Observable<EtapaInterface[]> {
    return this.http.get<EtapaInterface[]>(`${this.URL_COMPLETA}/etapa/archivo/`);
  }

  // importaciones

  descargarPlantilla(options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/etapa/importacion/plantilla`, finalOptions);
  }

  exportarExcel(activo: FiltroActivo = FiltroActivo.TRUE, options?: any): Observable<any> {
    const defaultOptions = { responseType: 'blob' as 'json' };
    const finalOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
    return this.http.get<any>(`${this.URL_COMPLETA}/etapa/importacion/export?activo=${activo}`, finalOptions);
  }

  importarExcel(formData:FormData): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/etapa/importacion/excel`, formData);
  }

}
