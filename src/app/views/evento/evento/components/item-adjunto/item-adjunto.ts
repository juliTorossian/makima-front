import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EventoService } from '@core/services/evento';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-item-adjunto',
  templateUrl: './item-adjunto.html',
  styleUrls: ['./item-adjunto.scss'],
  imports: [
    NgIcon
  ]
})
export class ItemAdjuntoComponent {
  private eventoService = inject(EventoService);
  @Input() adjunto: any;
  @Input() puedeEliminar: boolean = false;
  @Output() eliminar = new EventEmitter<any>();

  // Mapeo de tipos a iconos Lucide
  iconosTipo: Record<string, string> = {
    pdf: 'lucideFile-text',
    png: 'lucideImage',
    jpg: 'lucideImage',
    jpeg: 'lucideImage',
    xlsx: 'lucideFile-spreadsheet',
    doc: 'lucideFile-text',
    docx: 'lucideFile-text',
    txt: 'lucideFile-text',
    default: 'lucideFile'
  };

  getIcon(): string {
    const mime = this.adjunto?.mimeType || '';
    if (mime.includes('pdf')) return this.iconosTipo['pdf'];
    if (mime.includes('png')) return this.iconosTipo['png'];
    if (mime.includes('jpg')) return this.iconosTipo['jpg'];
    if (mime.includes('jpeg')) return this.iconosTipo['jpeg'];
    if (mime.includes('xlsx')) return this.iconosTipo['xlsx'];
    if (mime.includes('docx')) return this.iconosTipo['docx'];
    if (mime.includes('doc')) return this.iconosTipo['doc'];
    if (mime.includes('txt')) return this.iconosTipo['txt'];
    return this.iconosTipo['default'];
  }

  abrirAdjunto() {
    if (this.adjunto?.pathFile) {
      this.eventoService.getAdjuntoBlob(this.adjunto.id).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const mime = this.adjunto?.mimeType || '';
        // Archivos visualizables: pdf, imágenes, txt
        if (
          mime.includes('pdf') ||
          mime.includes('png') ||
          mime.includes('jpg') ||
          mime.includes('jpeg') ||
          mime.includes('gif') ||
          mime.includes('bmp') ||
          mime.includes('webp') ||
          mime.includes('txt')
        ) {
          const win = window.open(url, '_blank');
          if (win) {
            win.onload = () => {
              win.document.title = this.adjunto.nameFile;
            };
          }
        } else {
          // Descargar con nombre correcto
          const a = document.createElement('a');
          a.href = url;
          a.download = this.adjunto.nameFile;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        // Liberar el objeto URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
  }

  onEliminar() {
    this.eliminar.emit(this.adjunto);
  }

  getFecha(): string {
    console.log(this.adjunto);
    console.log(this.adjunto.auditorias[0]);
    console.log(this.adjunto.auditorias[0].fecha);
    let fecha = '';
    if (this.adjunto?.auditorias[0].fecha) {
      fecha = new Date(this.adjunto.auditorias[0].fecha).toLocaleDateString();
    }
    console.log(fecha);
    return fecha;
  }

  getTipo(): string {
    // Extrae el tipo del mimeType
    return this.adjunto?.mimeType?.split('/')[1]?.toUpperCase() || '';
  }
}
