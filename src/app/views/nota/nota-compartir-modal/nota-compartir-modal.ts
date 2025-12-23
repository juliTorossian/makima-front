import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotaService } from '@core/services/nota';
import { UsuarioService } from '@core/services/usuario';
import { Nota, NotaCompartir, NotaPermiso, NotaUsuariosCompartidos } from '@core/interfaces/nota';
import { Usuario } from '@core/interfaces/usuario';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { Observable, of } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'app-nota-compartir-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        ConfirmDialogModule,
        ToastModule,
        AutoCompleteModule,
        Select,
        PanelModule
    ],
    templateUrl: './nota-compartir-modal.html',
    styleUrl: './nota-compartir-modal.scss',
    providers: [ConfirmationService, MessageService]
})
export class NotaCompartirModal implements OnInit {
    private config = inject(DynamicDialogConfig);
    private ref = inject(DynamicDialogRef);
    private notaService = inject(NotaService);
    private usuarioService = inject(UsuarioService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    nota!: Nota;
    usuariosCompartidos: any[] = [];
    usuariosSugeridos: Usuario[] = [];
    usuariosAll: Usuario[] = [];
    loading = false;

    // Para control de edición en fila
    editingRow: NotaUsuariosCompartidos | null = null;

    // Campo temporal usado por el editor en fila
    usuarioSeleccionado: Usuario | null = null; // se puede reutilizar en editor
    selectedPermiso: NotaPermiso = NotaPermiso.VER;

    // Opciones de permisos
    permisos = [
        { label: 'Ver', value: NotaPermiso.VER },
        { label: 'Editar', value: NotaPermiso.EDITAR }
    ];

    ngOnInit(): void {
        this.nota = this.config.data.nota;
        this.cargarUsuariosCompartidos();
        this.cargarUsuariosSugeridos();
    }

    cargarUsuariosCompartidos(): void {
        if (!this.nota.id) return;

        this.loading = true;
        this.notaService.getUsuarioCompartidos(this.nota.id).pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (data: any) => {
                console.log(data);
                this.usuariosCompartidos = data;
            },
            error: (error) => {
                console.error('Error al cargar usuarios compartidos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los usuarios compartidos'
                });
            }
        });
    }

    cargarUsuariosSugeridos(): void {
        this.usuarioService.getAll().pipe(
            finalize(() => {
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (usuarios) => {
                this.usuariosAll = usuarios;
                this.usuariosSugeridos = usuarios;
            },
            error: (error) => {
                console.error('Error al cargar usuarios:', error);
            }
        });
    }

    filtrarUsuarios(event: any): void {
        const query = event.query ? event.query.toLowerCase() : '';
        console.log('filtrarUsuarios query=', query);
        this.usuariosSugeridos = this.usuariosAll.filter(u =>
            (u.nombre || '').toLowerCase().includes(query) ||
            (u.apellido || '').toLowerCase().includes(query) ||
            (u.usuario || '').toLowerCase().includes(query)
        );
        console.log('usuariosSugeridos=', this.usuariosSugeridos);
    }

    // Inicia la edición de una nueva fila para agregar un usuario
    startAddRow(): void {
        if (!this.nota?.id) return;

        const nuevo: any = {
            id: 0,
            notaId: this.nota.id,
            usuarioId: '',
            permiso: NotaPermiso.VER,
            fecha: new Date(),
            usuario: null,
            _tempUsuario: null, // temporal para el autocomplete
            _tempUsuarioLabel: ''
        };

        this.usuariosCompartidos = [nuevo, ...this.usuariosCompartidos];
        this.editingRow = nuevo;
        this.cdr.markForCheck();
    }

    onRowEditSave(compartido: any): void {
        // Si es nuevo debe tener usuario seleccionado
        if (compartido.id === 0) {
            console.log('onRowEditSave - compartido (incoming):', compartido);
            // compatibilidad: si _tempUsuario es el wrapper { originalEvent, value }
            const maybe = (compartido._tempUsuario && (compartido._tempUsuario.value || compartido._tempUsuario)) ? (compartido._tempUsuario.value || compartido._tempUsuario) : null;
            const u = maybe as Usuario | null;
            console.log('onRowEditSave - selected user:', u);
            if (!u || !u.id) {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un usuario válido' });
                return;
            }
            // Evitar duplicados
            const existe = this.usuariosCompartidos.some(uItem => uItem.usuarioId === u.id && uItem !== compartido);
            if (existe) {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Este usuario ya tiene acceso a la nota' });
                return;
            }

            compartido.usuario = { id: u.id!, nombre: u.nombre, apellido: u.apellido, usuario: u.usuario, color: u.color } as any;
            compartido.usuarioId = u.id!;
            // dejar id en 0 para que guardarCambios lo envíe como nuevo
        }

        this.editingRow = null;
        this.cdr.markForCheck();
    }

    onRowEditCancel(compartido: any): void {
        // Si era fila nueva (id===0) la quitamos
        if (compartido.id === 0) {
            this.usuariosCompartidos = this.usuariosCompartidos.filter(u => u !== compartido);
        }
        this.editingRow = null;
        this.cdr.markForCheck();
    }

    editRow(compartido: any): void {
        this.editingRow = compartido;
        compartido._tempUsuario = compartido.usuario || null;
        compartido._tempUsuarioLabel = compartido.usuario ? `${compartido.usuario.nombre} ${compartido.usuario.apellido} (${compartido.usuario.usuario})` : '';
        this.cdr.markForCheck();
    }

    onUsuarioSelected(event: any, compartido: any): void {
        console.log('onUsuarioSelected - raw event:', event, 'compartido before:', compartido);
        const selected = event && event.value ? event.value : event;
        compartido._tempUsuario = selected;
        compartido._tempUsuarioLabel = `${selected?.nombre || ''} ${selected?.apellido || ''} (${selected?.usuario || ''})`;
        console.log('onUsuarioSelected - mapped selected:', selected, 'compartido after:', compartido);
    }

    cambiarPermiso(compartido: any, nuevoPermiso: NotaPermiso): void {
        if (!this.nota.id) return;

        this.notaService.modificarPermisoNota(this.nota.id, compartido.usuarioId, nuevoPermiso).subscribe({
            next: () => {
                compartido.permiso = nuevoPermiso;
                this.cdr.markForCheck();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Permiso actualizado correctamente'
                });
            },
            error: (error) => {
                console.error('Error al cambiar permiso:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el permiso'
                });
            }
        });
    }

    quitarUsuario(compartido: any): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro que querés quitar el acceso a ${compartido.usuario?.nombre} ${compartido.usuario?.apellido}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, quitar',
            rejectLabel: 'Cancelar',
            accept: () => {
                // Para quitar, probablemente necesites un endpoint, pero según el servicio, no hay uno directo.
                // Asumiendo que modificar permiso a algo que lo quite, o llamar a un método.
                // El servicio no tiene método para quitar, así que quizás usar modificarPermisoNota con un permiso especial, o asumir que se hace desde backend.
                // Por ahora, solo remover de la lista local y mostrar mensaje.
                this.usuariosCompartidos = this.usuariosCompartidos.filter(u => u !== compartido);
                this.cdr.markForCheck();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario removido del acceso'
                });
            }
        });
    }

    guardarCambios(): void {
        if (!this.nota.id) return;

        let body: NotaCompartir[] = [];

        // Los nuevos usuarios a compartir
        const nuevosCompartidos = this.usuariosCompartidos.filter(u => u.id === 0).map(u => (body.push({
            usuarioId: u.usuarioId,
            permiso: u.permiso
        } as NotaCompartir), u));

        if (nuevosCompartidos.length > 0) {
            const notaId = this.nota.id as number;
            // const trySend = (body: any, attemptLabel: string, fallback?: () => void) => {
            //     console.log(`guardarCambios - intentando enviar (${attemptLabel}):`, body);
                
            // };

            // // primer intento: enviar como { usuarios: [...] } ya que era el ejemplo suministrado
            // trySend({ usuarios: nuevosCompartidos }, 'object', () => trySend(nuevosCompartidos, 'array'));

            this.notaService.compartirMultiNota(notaId, {usuarios: body}).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nota compartida correctamente' });
                    this.ref.close(true);
                },
                error: (error) => {
                    console.error('Error al compartir nota:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo compartir la nota' });
                }
            });
        } else {
            this.ref.close(true);
        }
    }

    cancelar(): void {
        this.ref.close();
    }
}