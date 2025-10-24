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
  private messageService = inject(MessageService);

  usuarios: Usuario[] = [];
  usuario!:Usuario;

  reqComentario: boolean = false;
  comentario: string = '';

  mensaje: string = '';
  modo: string = '';
  rol: string = '';

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

    this.rol = data.rol;
    console.log(this.rol)
    if (this.rol) {
      this.usuarioService.getByRol(this.rol).pipe(
        tap((res: any) => console.log('getByRol', res))
      ).subscribe({
        next: (res: any) => {
          this.usuarios = res || [];
          // si no hay resultados para el rol, cargar todos
          if (!this.usuarios.length) {
            this.cargarTodos();
          } else {
            this.usuarios = res || [];
            this.searchUsuario = createTypeaheadSearch(this.usuarios, u => `${u.usuario} | ${u.nombre} ${u.apellido}`);
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
    console.log(this.rol)
    this.usuarioService.getByRol(this.rol).pipe(
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

    // Si hay un rol exigido, comprobar que el usuario lo tenga; si no, impedir la asignación.
    // if (this.rol) {
    //   const rolesUsuario = this.usuario?.roles ?? [];
    //   const roles = rolesUsuario.map(r => r.rolCodigo);
    //   let hasRole = false;
    //   if (Array.isArray(roles)) {
    //     hasRole = roles.includes(this.rol);
    //   } else if (roles && typeof roles === 'object') {
    //     // soporte para objeto { rolName: true } o similar
    //     hasRole = this.rol in roles || Object.values(roles).includes(this.rol);
    //   }

    //   if (!hasRole) {
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Rol no permitido',
    //       detail: 'El usuario no tiene el rol requerido y no puede ser asignado.'
    //     });
    //     return;
    //   }
    // }

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