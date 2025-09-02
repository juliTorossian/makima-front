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

  getAll(activo: 'true' | 'false' | 'all' = 'true'): Observable<Entorno[]> {
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
}
