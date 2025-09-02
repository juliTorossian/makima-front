import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferencia, UsuarioCompleto, Usuario as UsuarioInterface } from '@core/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;
  
  getAll(activo: 'true' | 'false' | 'all' = 'true') : Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(`${this.URL_COMPLETA}/usuario?activo=${activo}`);
  }

  getByID(usuarioId:string) : Observable<UsuarioInterface>{
    return this.http.get<UsuarioInterface>(`${this.URL_COMPLETA}/usuario/${usuarioId}`);
  }

  getByIdCompleto(usuarioId:string) : Observable<UsuarioCompleto>{
    return this.http.get<UsuarioCompleto>(`${this.URL_COMPLETA}/usuario/${usuarioId}/completo`);
  }

  getByRol(rol:string) : Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(`${this.URL_COMPLETA}/usuario/rol/${rol}`);
  }
  
  create(usuario:UsuarioInterface): Observable<UsuarioInterface> {
    return this.http.post<UsuarioInterface>(`${this.URL_COMPLETA}/auth/crearUsuario`, usuario);
  }

  update(usuarioId:string, usuario:UsuarioInterface): Observable<UsuarioInterface> {
    return this.http.patch<UsuarioInterface>(`${this.URL_COMPLETA}/usuario/${usuarioId}`, usuario);
  }

  delete(usuarioId:string): Observable<UsuarioInterface> {
    return this.http.delete<UsuarioInterface>(`${this.URL_COMPLETA}/usuario/${usuarioId}`);
  }

  cambiarPassword(usuarioId: string, contrasenaActual: string, nuevaContrasena: string): Observable<any> {
    return this.http.post<any>(`${this.URL_COMPLETA}/auth/cambiar-contrasena`, {
      usuarioId,
      contrasenaActual,
      nuevaContrasena
    });
  }
  
  // PREFERENCIAS

  setPreferencias(usuarioId:string, preferencias: Preferencia[]) : Observable<Preferencia[]>{
    return this.http.post<Preferencia[]>(`${this.URL_COMPLETA}/usuario/${usuarioId}/preferencias`, preferencias);
  }

  getPreferencias(usuarioId:string) : Observable<Preferencia[]>{
    return this.http.get<Preferencia[]>(`${this.URL_COMPLETA}/usuario/${usuarioId}/preferencias`);
  }




}
