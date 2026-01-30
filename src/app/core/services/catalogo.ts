import { environment } from "@/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Catalogo } from "@/app/core/interfaces/catalogo";

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.BASE_URL}/catalogo`;

  /**
   * Crear un nuevo catálogo
   */
  create(data: Partial<Catalogo>): Observable<Catalogo> {
    return this.http.post<Catalogo>(`${this.baseUrl}`, data);
  }

  /**
   * Obtener todos los catálogos
   * @param tipo - Filtrar por tipo de catálogo (opcional)
   * @param activo - Filtrar por estado activo (opcional)
   */
  findAll(tipo?: string, activo?: boolean): Observable<Catalogo[]> {
    let params = new HttpParams();
    if (tipo !== undefined) {
      params = params.set('tipo', tipo);
    }
    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }
    return this.http.get<Catalogo[]>(`${this.baseUrl}`, { params });
  }

  /**
   * Obtener lista de tipos de catálogo disponibles
   */
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/tipos`);
  }

  /**
   * Obtener catálogos por tipo
   * @param tipo - Tipo de catálogo
   * @param activo - Filtrar por estado activo (opcional)
   */
  findByTipo(tipo: string, activo?: boolean): Observable<Catalogo[]> {
    let params = new HttpParams();
    if (activo !== undefined) {
      params = params.set('activo', activo.toString());
    }
    return this.http.get<Catalogo[]>(`${this.baseUrl}/tipo/${tipo}`, { params });
  }

  /**
   * Obtener un catálogo específico por tipo y código
   * @param tipo - Tipo de catálogo
   * @param codigo - Código del catálogo
   */
  findByTipoAndCodigo(tipo: string, codigo: string): Observable<Catalogo> {
    return this.http.get<Catalogo>(`${this.baseUrl}/tipo/${tipo}/codigo/${codigo}`);
  }

  /**
   * Obtener un catálogo por ID
   */
  findOne(id: number): Observable<Catalogo> {
    return this.http.get<Catalogo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Actualizar un catálogo
   */
  update(id: number, data: Partial<Catalogo>): Observable<Catalogo> {
    return this.http.patch<Catalogo>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar un catálogo (soft delete)
   */
  remove(id: number): Observable<Catalogo> {
    return this.http.delete<Catalogo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Eliminar permanentemente un catálogo
   */
  hardDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/hard`);
  }
}
