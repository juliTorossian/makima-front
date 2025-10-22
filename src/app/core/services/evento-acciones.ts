import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CircularEvento } from '@core/interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoAccionesService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  avanzar(body:CircularEvento) {
    return this.http.post(`${this.URL_COMPLETA}/evento/avanzar`, body);
  }

  retroceder(body:CircularEvento) {
    return this.http.post(`${this.URL_COMPLETA}/evento/retroceder`, body);
  }

  reasignar(body:CircularEvento) {
    return this.http.post(`${this.URL_COMPLETA}/evento/reasignar`, body);
  }

  autorizar(body:CircularEvento) {
    return this.http.post(`${this.URL_COMPLETA}/evento/autorizar`, body);
  }

  rechazar(body:CircularEvento) {
    return this.http.post(`${this.URL_COMPLETA}/evento/rechazar`, body);
  }

}
