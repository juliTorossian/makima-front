import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UiCard } from '@app/components/ui-card';
import { Usuario } from '@core/interfaces/usuario';
import { UsuarioService } from '@core/services/usuario';
import { NgIcon } from '@ng-icons/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { UsuarioCrud } from '../usuario-crud/usuario-crud';
import { modalConfig } from '@/app/types/modals';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SHORTCUTS } from 'src/app/constants/shortcut';
import { ShortcutDirective } from '@core/directive/shortcut';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { FiltroActivo } from '@/app/constants/filtros_activo';
import { FiltroRadioGroupComponent } from '@app/components/filtro-check';
import { UsuarioDrawerComponent } from '../usuario-drawer/usuario-drawer';

@Component({
  selector: 'app-usuarios',
  imports: [
    UiCard,
    TableModule,
    DatePipe,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
    FiltroRadioGroupComponent,
    UsuarioDrawerComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios extends TrabajarCon<Usuario> {
  private usuarioService = inject(UsuarioService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  // Estado para el usuario drawer
  showUsuarioDrawer = false;
  usuarioSeleccionadoId: string | null = null;

  usuarios!:Usuario[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.USUARIO;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.usuarioService.getAll(this.filtroActivo).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.usuarios = res;
        if (this.filtroActivo !== FiltroActivo.ALL){
          this.usuarios = this.usuarios.filter((usuario) => {
            let aux = this.filtroActivo === FiltroActivo.TRUE;
            return usuario.activo === aux;
          });
        }
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los usuarios.')
    });
  }

  alta(usuario: Usuario): void {
    delete usuario.id;
    this.usuarioService.create(usuario).subscribe({
      next: () => this.afterChange('Usuario creado correctamente.'),
      error: (err) => this.showError(err.error.message || 'Error al crear el usuario.')
    });
  }

  editar(usuario: Usuario): void {
    delete usuario.password;
    let usuarioId = usuario.id ?? '';
    this.usuarioService.update(usuarioId, usuario).subscribe({
      next: () => this.afterChange('Usuario actualizado correctamente.'),
      error: (err) => this.showError(err.error.message || 'Error al modificar el usuario.')
    });
  }

  eliminarDirecto(usuario: Usuario): void {
    let usuarioId = usuario.id ?? '';
    this.usuarioService.delete(usuarioId).subscribe({
      next: () => this.afterChange('Usuario eliminado correctamente.'),
      error: (err) => this.showError(err.error.message || 'Error al eliminar el usuario.')
    });
  }

  mostrarModalCrud(usuario: Usuario | null, modo: 'A' | 'M') {
    const data = { item: usuario, modo };
    const header = modo === 'A' ? 'Nuevo Usuario' : 'Modificar Usuario';

    this.ref = this.dialogService.open(UsuarioCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((usuarioCrud: Usuario) => {
      if (!usuarioCrud) return;
      modo === 'M' ? this.editar(usuarioCrud) : this.alta(usuarioCrud);
    });
  }

  abrirUsuarioDrawer(usuarioId: string) {
    this.usuarioSeleccionadoId = usuarioId;
    this.showUsuarioDrawer = true;
    this.cdr.detectChanges();
  }

  cerrarUsuarioDrawer() {
    this.showUsuarioDrawer = false;
    this.usuarioSeleccionadoId = null;
    this.cdr.detectChanges();
  }
  
}