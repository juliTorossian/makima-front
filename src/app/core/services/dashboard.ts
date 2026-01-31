import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ActividadReciente, DashboardResponse, EventosPorEtapa, EventosPorTipo, TendenciaEventos } from '@core/interfaces/dashboard'
import { environment } from '@/environments/environment';
import { get } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // private readonly baseUrl = '/api/dashboard'
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL + '/dashboard';

  /**
   * Dashboard completo (KPIs + gráficos)
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.URL_COMPLETA)
  }

  /**
   * Eventos agrupados por etapa
   */
  getEventosPorEtapa(): Observable<EventosPorEtapa[]> {
    return this.http.get<EventosPorEtapa[]>(
      `${this.URL_COMPLETA}/eventos-por-etapa`,
    )
  }


  /**
   * Eventos agrupados por tipo
   */
  getEventosPorTipo(): Observable<EventosPorTipo[]> {
    return this.http.get<EventosPorTipo[]>(
      `${this.URL_COMPLETA}/eventos-por-tipo`,
    )
  }

  /**
   * Tendencia creados vs cerrados
   */
  getTendenciaEventos(): Observable<TendenciaEventos[]> {
    return this.http.get<TendenciaEventos[]>(
      `${this.URL_COMPLETA}/tendencia-eventos`,
    )
  }

  getActividadReciente(): Observable<ActividadReciente[]> {
    return this.http.get<ActividadReciente[]>(
      `${this.URL_COMPLETA}/actividad-reciente`,
    )
  }
}
