import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TrabajarCon } from '@app/components/trabajar-con/trabajar-con';
import { UiCard } from '@app/components/ui-card';
import { ShortcutDirective } from '@core/directive/shortcut';
import { Producto } from '@core/interfaces/producto';
import { ProductoService } from '@core/services/producto';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductosCrud } from '../productos-crud/productos-crud';
import { modalConfig } from '@/app/types/modals';
import { PermisoClave } from '@core/interfaces/rol';
import { finalize } from 'rxjs';
import { BooleanLabelPipe } from '@core/pipes/boolean-label.pipe';
import { CommonModule } from '@angular/common';
import { FiltroRadioGroupComponent } from '@app/components/filtro-check';
import { FiltroActivo } from '@/app/constants/filtros_activo';

@Component({
  selector: 'app-productos',
  imports: [
    UiCard,
    TableModule,
    NgIcon,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    ShortcutDirective,
    BooleanLabelPipe,
    CommonModule,
    FiltroRadioGroupComponent,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class Productos extends TrabajarCon<Producto> {
  private productoService = inject(ProductoService);
  private dialogService = inject(DialogService);
  ref!: DynamicDialogRef;

  productos!:Producto[];

 constructor() {
    super(
      inject(ChangeDetectorRef),
      inject(MessageService),
      inject(ConfirmationService)
    );
    this.permisoClave = PermisoClave.PRODUCTO;
  }

  protected loadItems(): void {
    this.loadingService.show();
    this.productoService.getAll(this.filtroActivo).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (res) => {
        this.productos = res;
        if (this.filtroActivo !== FiltroActivo.ALL){
          this.productos = this.productos.filter((producto) => {
            let aux = this.filtroActivo === FiltroActivo.TRUE;
            return producto.activo === aux;
          });
        }
        this.cdr.detectChanges();
      },
      error: () => this.showError('Error al cargar los productos.')
    });
  }

  alta(producto: Producto): void {
    delete producto.id
    this.productoService.create(producto).subscribe({
      next: () => this.afterChange('Producto creado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al crear el producto.')
    });
  }

  editar(producto: Producto): void {
    let productoId = producto.id ?? 0;
    this.productoService.update(productoId, producto).subscribe({
      next: () => this.afterChange('Producto actualizado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al modificar el producto.')
    });
  }

  eliminarDirecto(producto: Producto): void {
    let productoId = producto.id ?? 0;
    this.productoService.delete(productoId).subscribe({
      next: () => this.afterChange('Producto eliminado correctamente.'),
      error: (err) => this.showError(err.error.message ||'Error al eliminar el Producto.')
    });
  }

  mostrarModalCrud(producto: Producto | null, modo: 'A' | 'M') {
    const data = { item: producto, modo };
    const header = modo === 'A' ? 'Nuevo Producto' : 'Modificar Producto';

    this.ref = this.dialogService.open(ProductosCrud, {
      ...modalConfig,
      header,
      data
    });

    this.ref.onClose.subscribe((productoCrud: Producto) => {
      if (!productoCrud) return;
      modo === 'M' ? this.editar(productoCrud) : this.alta(productoCrud);
    });
  }
}
