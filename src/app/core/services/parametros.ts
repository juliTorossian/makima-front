import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ParametroService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getParametroActivo(parametroCodigo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_COMPLETA}/parametros/activo/${parametroCodigo}`).pipe(
        map((res:any) => {
          return res.activo as boolean;
        })
    );
  }

}