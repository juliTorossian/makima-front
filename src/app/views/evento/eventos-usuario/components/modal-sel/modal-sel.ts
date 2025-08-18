import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '@core/interfaces/usuario';
import { UsuarioService } from '@core/services/usuario';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modal-sel',
  imports: [
    FormsModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './modal-sel.html',
  styleUrl: './modal-sel.scss'
})
export class ModalSel implements OnInit{
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  private usuarioService = inject(UsuarioService);

  private cdr = inject(ChangeDetectorRef);

  usuarios! :Usuario[];
  usuario! :Usuario;

  reqComentario: boolean = false;
  comentario!: string;

  mensaje!: string;

  ngOnInit(): void { 
    console.log(this.config.data);
    this.reqComentario = this.config.data.reqComentario;
    this.comentario = this.config.data.comentario;
    this.mensaje = this.config.data.mensaje;
    if (this.config.data.rol) {
      this.usuarioService.getByRol(this.config.data.rol).pipe(
        tap((res: any) => console.log(res))
      ).subscribe({
        next: (res: any) => {
          this.usuarios = res;
          this.cdr.detectChanges();
        }
      });
    }

    if (!(this.config.data.rol) || this.usuarios.length === 0) {
      this.usuarioService.getAll().pipe(
        tap((res: any) => console.log(res))
      ).subscribe({
        next: (res: any) => {
          this.usuarios = res;
          this.cdr.detectChanges();
        }
      });
    }
  }

  seleccionar($event:any){
    if (this.usuario){
      if ((this.reqComentario) && !(this.comentario)) {
      }else{

        let res = {
          usuarioSeleccionado: this.usuario,
          comentario: this.comentario
        }

        this.ref.close(res);
      }
    }
  }
  
  get mensajeHtml(): string {
    return this.mensaje ? this.mensaje.replace(/\n/g, '<br>') : '';
  }
}

