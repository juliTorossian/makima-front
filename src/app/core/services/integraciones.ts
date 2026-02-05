import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IntegracionesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.BASE_URL}/integraciones`;

  linkPreview(token: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/link/preview?token=${token}`);
  }

  link(token: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/link/confirmar`, { token });
  }

}