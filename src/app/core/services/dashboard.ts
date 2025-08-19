import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { DashboardEventosPorEtapa } from "@core/interfaces/dashboard";
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
}