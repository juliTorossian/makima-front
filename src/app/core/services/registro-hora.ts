import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegistroHora, UsuarioHorasGenerales } from '@core/interfaces/registro-hora';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroHoraService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<RegistroHora[]> {
    return this.http.get<RegistroHora[]>(`${this.URL_COMPLETA}/registro-hora`);
  }

  getById(registroId: number): Observable<RegistroHora> {
    return this.http.get<RegistroHora>(`${this.URL_COMPLETA}/registro-hora/${registroId}`);
  }

  getByUsuario(usuarioId: string): Observable<RegistroHora[]> {
    return this.http.get<RegistroHora[]>(`${this.URL_COMPLETA}/registro-hora/usuario/${usuarioId}`);
  }

  getHorasGenerales(fechaFiltro:Date): Observable<UsuarioHorasGenerales[]> {
    return this.http.get<UsuarioHorasGenerales[]>(`${this.URL_COMPLETA}/usuario/usuario/horasGenerales?fecha=${fechaFiltro.toISOString()}`);
  }

  create(registro:RegistroHora): Observable<RegistroHora> {
    return this.http.post<RegistroHora>(`${this.URL_COMPLETA}/registro-hora`, registro);
  }

  update(registroId:number, registro:RegistroHora): Observable<RegistroHora> {
    return this.http.patch<RegistroHora>(`${this.URL_COMPLETA}/registro-hora/${registroId}`, registro);
  }

  delete(registroId:number): Observable<RegistroHora> {
    return this.http.delete<RegistroHora>(`${this.URL_COMPLETA}/registro-hora/${registroId}`);
  }
}
