import { createTypeaheadFormatter, createTypeaheadSearch } from '@/app/utils/typeahead-utils';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '@core/interfaces/usuario';
import { UsuarioService } from '@core/services/usuario';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon } from '@ng-icons/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modal-sel',
  imports: [
    FormsModule,
    ToastModule,
    NgIcon,
    NgbTypeaheadModule,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './modal-sel.html',
  styleUrls: ['./modal-sel.scss']
})
export class ModalSel implements OnInit{
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  private usuarioService = inject(UsuarioService);

  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  usuario!:Usuario;

  reqComentario: boolean = false;
  comentario: string = '';

  mensaje: string = '';
  modo: string = '';

  etapaActual: string = '';
  proximaEtapa: string = '';

  ngOnInit(): void {
    // lectura segura de config
    const data = this.config?.data ?? {};
    this.reqComentario = !!data.reqComentario;
    this.comentario = data.comentario ?? '';
    this.mensaje = data.mensaje ?? '';
    this.modo = data.modo ?? '';
    this.etapaActual = data.etapaActual ?? '';
    this.proximaEtapa = data.proximaEtapa ?? '';

    console.log('ModalSel data', data);

    const rol = data.rol;
    if (rol) {
      this.usuarioService.getByRol(rol).pipe(
        tap((res: any) => console.log('getByRol', res))
      ).subscribe({
        next: (res: any) => {
          this.usuarios = res || [];
          // si no hay resultados para el rol, cargar todos
          if (!this.usuarios.length) {
            this.cargarTodos();
          } else {
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.cargarTodos();
        }
      });
    } else {
      this.cargarTodos();
    }
  }

  private cargarTodos(){
    this.usuarioService.getAll().pipe(
      tap((res: any) => console.log('getAll', res))
    ).subscribe({
      next: (res: any) => {
        this.usuarios = res || [];
        this.searchUsuario = createTypeaheadSearch(this.usuarios, u => `${u.usuario} | ${u.nombre} ${u.apellido}`);
        // this.checkAndSetupEditMode();
      }
    });
  }

  seleccionar($event:any){
    // validar usuario cuando corresponde
    if (this.modo !== 'REC' && (this.usuario === null || this.usuario === undefined)) {
      return;
    }

    if (this.reqComentario && !this.comentario) {
      return;
    }

    this.cerrar({
      usuarioSeleccionado: this.usuario.id,
      comentario: this.comentario,
    });
  }

  cerrar(res:any){
    this.ref.close(res);
  }
  
  get mensajeHtml(): string {
    return this.mensaje ? this.mensaje.replace(/\n/g, '<br>') : '';
  }

  searchUsuario = createTypeaheadSearch<Usuario>(
    this.usuarios,
    item => `${item.usuario} | ${item.nombre} ${item.apellido}`,
  );
  formatterUsuario = createTypeaheadFormatter<Usuario>(
    item => `${item.usuario} | ${item.nombre} ${item.apellido}`,
  );
}