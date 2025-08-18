import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol as RolInterface } from '@core/interfaces/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<RolInterface[]> {
    return this.http.get<RolInterface[]>(`${this.URL_COMPLETA}/rol`);
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
}
