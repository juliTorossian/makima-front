import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cliente } from '@core/interfaces/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  URL_COMPLETA = environment.BASE_URL;

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.URL_COMPLETA}/cliente`);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`);
  }

  create(cliente:Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.URL_COMPLETA}/cliente`, cliente);
  }

  update(id:number, cliente:Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`, cliente);
  }

  delete(id:number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_COMPLETA}/cliente/${id}`);
  }
}
