import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioMencion } from '@core/interfaces/evento';
import { ComentarioMencionComponent } from '../comentario-mencion/comentario-mencion';

interface TextoParte {
  tipo: 'texto' | 'mencion';
  contenido: string;
  mencion?: ComentarioMencion;
}

@Component({
  selector: 'app-comentario-texto',
  standalone: true,
  imports: [CommonModule, ComentarioMencionComponent],
  template: `
    <div class="comentario-texto">
      @for (parte of partes; track $index) {
        @if (parte.tipo === 'texto') {
          <span>{{ parte.contenido }}</span>
        } @else if (parte.tipo === 'mencion' && parte.mencion) {
          <app-comentario-mencion 
            [usuario]="parte.mencion.usuario"
            (usuarioClick)="onUsuarioClick($event)"
          ></app-comentario-mencion>
        }
      }
    </div>
  `,
  styles: [`
    .comentario-texto {
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.5;
    }
  `]
})
export class ComentarioTextoComponent implements OnInit {
  @Input() texto: string = '';
  @Input() menciones: ComentarioMencion[] = [];
  @Output() usuarioClick = new EventEmitter<string>();
  
  partes: TextoParte[] = [];

  ngOnInit() {
    this.procesarTexto();
  }

  procesarTexto() {
    if (!this.texto) {
      this.partes = [];
      return;
    }

    // Regex para encontrar menciones: @palabra (permite letras, números, guiones y guiones bajos)
    const regex = /@(\w+)/g;
    const partes: TextoParte[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(this.texto)) !== null) {
      const mencionTexto = match[1].toLowerCase(); // usuario mencionado en minúsculas
      const mencionCompleta = match[0]; // @usuario
      const startIndex = match.index;

      // Agregar texto antes de la mención
      if (startIndex > lastIndex) {
        partes.push({
          tipo: 'texto',
          contenido: this.texto.substring(lastIndex, startIndex)
        });
      }

      // Buscar si esta mención corresponde a un usuario en el array de menciones
      const mencionEncontrada = this.menciones?.find(
        m => m.usuario.usuario.toLowerCase() === mencionTexto
      );

      if (mencionEncontrada) {
        // Es una mención válida
        partes.push({
          tipo: 'mencion',
          contenido: mencionCompleta,
          mencion: mencionEncontrada
        });
      } else {
        // No es una mención válida, tratar como texto normal
        partes.push({
          tipo: 'texto',
          contenido: mencionCompleta
        });
      }

      lastIndex = regex.lastIndex;
    }

    // Agregar el texto restante
    if (lastIndex < this.texto.length) {
      partes.push({
        tipo: 'texto',
        contenido: this.texto.substring(lastIndex)
      });
    }

    this.partes = partes;
  }

  onUsuarioClick(usuarioId: string) {
    this.usuarioClick.emit(usuarioId);
  }
}

