import { environment } from "@/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { kb, deploy } from "@/app/core/interfaces/kb";

@Injectable({
  providedIn: 'root'
})
export class KbService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.BASE_URL}/kb`;

  // ============= CATÁLOGOS =============
  
  /**
   * Obtener todos los catálogos disponibles para KB
   */
  getCatalogos(): Observable<Record<string, any[]>> {
    return this.http.get<Record<string, any[]>>(`${this.baseUrl}/catalogos`);
  }

  // ============= KB CRUD =============

  /**
   * Crear una nueva KB
   */
  create(data: Partial<kb>): Observable<kb> {
    return this.http.post<kb>(`${this.baseUrl}`, data);
  }

  /**
   * Obtener todas las KBs
   * @param activo - Filtrar por estado activo (opcional)
   */
  findAll(activo?: boolean): Observable<kb[]> {
    let params = new HttpParams();
    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }
    return this.http.get<kb[]>(`${this.baseUrl}`, { params });
  }

  /**
   * Obtener una KB por ID
   */
  findOne(id: number): Observable<kb> {
    return this.http.get<kb>(`${this.baseUrl}/${id}`);
  }

  /**
   * Actualizar una KB
   */
  update(id: number, data: Partial<kb>): Observable<kb> {
    return this.http.patch<kb>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar una KB (soft delete)
   */
  remove(id: number): Observable<kb> {
    return this.http.delete<kb>(`${this.baseUrl}/${id}`);
  }

  // ============= DEPLOYS =============

  /**
   * Crear un deploy para una KB
   */
  createDeploy(kbId: number, data: Partial<deploy>): Observable<deploy> {
    return this.http.post<deploy>(`${this.baseUrl}/${kbId}/deploys`, data);
  }

  /**
   * Obtener todos los deploys de una KB
   * @param kbId - ID de la KB
   * @param activo - Filtrar por estado activo (opcional)
   */
  findAllDeploys(kbId: number, activo?: boolean): Observable<deploy[]> {
    let params = new HttpParams();
    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }
    return this.http.get<deploy[]>(`${this.baseUrl}/${kbId}/deploys`, { params });
  }

  /**
   * Obtener un deploy específico de una KB
   */
  findOneDeploy(kbId: number, deployId: number): Observable<deploy> {
    return this.http.get<deploy>(`${this.baseUrl}/${kbId}/deploys/${deployId}`);
  }

  /**
   * Actualizar un deploy
   */
  updateDeploy(kbId: number, deployId: number, data: Partial<deploy>): Observable<deploy> {
    return this.http.patch<deploy>(`${this.baseUrl}/${kbId}/deploys/${deployId}`, data);
  }

  /**
   * Eliminar un deploy (soft delete)
   */
  removeDeploy(kbId: number, deployId: number): Observable<deploy> {
    return this.http.delete<deploy>(`${this.baseUrl}/${kbId}/deploys/${deployId}`);
  }

  /**
   * Eliminar permanentemente un deploy
   */
  hardDeleteDeploy(kbId: number, deployId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${kbId}/deploys/${deployId}/hard`);
  }
}
