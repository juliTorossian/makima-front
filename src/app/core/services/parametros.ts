import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Parametro } from "@core/interfaces/parametro";
import { map, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ParametroService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<Parametro[]> {
    return this.http.get<Parametro[]>(`${this.URL_COMPLETA}/parametros`);
  }

  getById(id: string): Observable<Parametro> {
    return this.http.get<Parametro>(`${this.URL_COMPLETA}/parametros/${id}`);
  }

  create(parametro: Parametro): Observable<Parametro> {
    return this.http.post<Parametro>(`${this.URL_COMPLETA}/parametros`, parametro);
  }

  update(id:string, parametro:Parametro): Observable<Parametro> {
    return this.http.patch<Parametro>(`${this.URL_COMPLETA}/parametros/${id}`, parametro);
  }
  updateByCodigo(codigo:string, parametro:Parametro): Observable<Parametro> {
    return this.http.patch<Parametro>(`${this.URL_COMPLETA}/parametros/codigo/${codigo}`, parametro);
  }

  delete(id:string): Observable<Parametro> {
    return this.http.delete<Parametro>(`${this.URL_COMPLETA}/parametros/${id}`);
  }
  

  getParametroActivo(parametroCodigo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_COMPLETA}/parametros/activo/${parametroCodigo}`).pipe(
        map((res:any) => {
          return res.activo as boolean;
        })
    );
  }

}