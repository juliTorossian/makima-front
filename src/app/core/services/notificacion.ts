import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Notificacion } from "@core/interfaces/notificacion";
import { Observable } from "rxjs";

export enum EstadosNotificacion {
    Todas = 'todas',
    Leidas = 'leidas',
    NoLeidas = 'noleidas'
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
    private http = inject(HttpClient);
    URL_COMPLETA = environment.BASE_URL;

  
    getAll(limit:number): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.URL_COMPLETA}/notificacion?limit=${limit}`);
    }

    getByUsuario(usuarioId: string, limit:number, estado: EstadosNotificacion = EstadosNotificacion.Todas): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.URL_COMPLETA}/notificacion/usuario/${usuarioId}?estado=${estado}&limit=${limit}`);
    }

    toggleLeida(notificacionId: string): Observable<Notificacion> {
        return this.http.patch<Notificacion>(`${this.URL_COMPLETA}/notificacion/${notificacionId}/toggle-leida`, {});
    }

}