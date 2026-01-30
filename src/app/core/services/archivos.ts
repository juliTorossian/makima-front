import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

export interface FolderEntry {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileEntry {
  name: string;
  createdAt: string;
  updatedAt: string;
  size?: number;
}

export interface TreeResponse {
  tipo: string;
  path: string;
  folders: FolderEntry[];
  files: FileEntry[];
}

@Injectable({ providedIn: 'root' })
export class ArchivosService {
  URL_COMPLETA = environment.BASE_URL + '/archivos';

  constructor(private http: HttpClient) {}

  getTree(tipo: string, path: string = '') {
    return this.http.get<TreeResponse>(`${this.URL_COMPLETA}/tree?tipo=${tipo}&path=${path}`);
  }

  descargarArchivo(tipo: string, path: string) {
    return this.http.get(`${this.URL_COMPLETA}/file?tipo=${tipo}&path=${path}`, {
      responseType: 'blob',
    });
  }

  descargarZip(tipo: string, path: string) {
    return this.http.get(
        `${this.URL_COMPLETA}/zip`,
        {
        params: { tipo, path },
        responseType: 'blob'
        }
    );
    }
}
