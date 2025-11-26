import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Nota, NotaCompartir, NotaComplete } from "@core/interfaces/nota";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class NotaService {
    private http = inject(HttpClient);
    URL_COMPLETA = environment.BASE_URL;
    
    getAll(): Observable<Nota[]> {
        return this.http.get<Nota[]>(`${this.URL_COMPLETA}/nota`);
    }
    getAllComplete(): Observable<NotaComplete[]> {
        return this.http.get<NotaComplete[]>(`${this.URL_COMPLETA}/nota/complete`);
    }

    getById(id: number): Observable<Nota> {
        return this.http.get<Nota>(`${this.URL_COMPLETA}/nota/${id}`);
    }

    create(nota:Nota): Observable<Nota> {
        return this.http.post<Nota>(`${this.URL_COMPLETA}/nota`, nota);
    }
    update(id:number, nota:Nota): Observable<Nota> {
        return this.http.patch<Nota>(`${this.URL_COMPLETA}/nota/${id}`, nota);
    }
    delete(id:number): Observable<Nota> {
        return this.http.delete<Nota>(`${this.URL_COMPLETA}/nota/${id}`);
    }

    // 

    getCompartidas(): Observable<Nota[]> {
        return this.http.get<Nota[]>(`${this.URL_COMPLETA}/nota/compartidas`);
    }

    compartirNota(id:number, body:NotaCompartir): Observable<Nota> {
        return this.http.post<Nota>(`${this.URL_COMPLETA}/nota/${id}/compartir`, body);
    }
    compartirMultiNota(id:number, body:NotaCompartir[]): Observable<Nota> {
        return this.http.post<Nota>(`${this.URL_COMPLETA}/nota/${id}/compartir-multiple`, body);
    }

    hacerPropia(id:number): Observable<Nota> {
        return this.http.post<Nota>(`${this.URL_COMPLETA}/nota/${id}/hacer-propia`, {});
    }

}