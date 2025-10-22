import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { DashboardEventosPorCliente, DashboardEventosPorEtapa, DashboardEventosPorTipo } from "@core/interfaces/dashboard";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getEventosPorEtapa(): Observable<DashboardEventosPorEtapa> {
    return this.http.get<DashboardEventosPorEtapa>(`${this.URL_COMPLETA}/dashboard/eventos-por-etapa`);
  }

  getEventosPorTipo(): Observable<DashboardEventosPorTipo> {
    return this.http.get<DashboardEventosPorTipo>(`${this.URL_COMPLETA}/dashboard/eventos-por-tipo`);
  }

  getEventosPorCliente(): Observable<DashboardEventosPorCliente> {
    return this.http.get<DashboardEventosPorCliente>(`${this.URL_COMPLETA}/dashboard/eventos-por-cliente`);
  }
}