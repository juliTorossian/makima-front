import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventoUsuario } from '@core/interfaces/evento';

@Component({
  selector: 'app-comentario-mencion',
  standalone: true,
  template: `
    <span 
      class="mencion-usuario" 
      [style.color]="usuario.color"
      [title]="usuario.nombre + ' ' + usuario.apellido"
      (click)="onMencionClick()"
    >
      @{{ usuario.usuario }}
    </span>
  `,
  styles: [`
    .mencion-usuario {
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
    }
    .mencion-usuario:hover {
      text-decoration: underline;
    }
  `]
})
export class ComentarioMencionComponent {
  @Input() usuario!: EventoUsuario;
  @Output() usuarioClick = new EventEmitter<string>();

  onMencionClick() {
    this.usuarioClick.emit(this.usuario.id);
  }
}
