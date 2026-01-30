import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { NotionPageResult } from '@core/interfaces/evento';
import { EventoService } from '@core/services/evento';
import { LoadingService } from '@core/services/loading.service';
import { NgIcon } from '@ng-icons/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { LoadingSpinnerComponent } from "@app/components/index";

@Component({
  selector: 'app-paginas-libres-modal',
  imports: [
    TableModule,
    NgIcon,
    LoadingSpinnerComponent
],
  templateUrl: './paginas-libres-modal.html',
  styleUrl: './paginas-libres-modal.scss',
})
export class PaginasLibresModal implements OnInit {
  protected ref = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);
  private eventoService = inject(EventoService);
  protected cdr = inject(ChangeDetectorRef);

  loading = false;
  
  eventoId!: string;
  paginasLibres: NotionPageResult[] = [];
  paginasSeleccionadas: NotionPageResult[] = [];

  ngOnInit() {
    this.eventoId = this.config.data.eventoId;
    this.loadPaginasLibres();
  }

  loadPaginasLibres() {
    this.loading = true;
    this.eventoService.getPaginasLibres().pipe(
      finalize(() => {this.loading = false; this.cdr.detectChanges();})
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.paginasLibres = res;
      },
      error: () => console.error('Error cargando páginas libres'),
    });
  }

  seleccionar(){
    this.loading = true;
    console.log(this.paginasSeleccionadas);

    this.eventoService.asociarPaginaNotion(this.eventoId, this.paginasSeleccionadas).pipe(
      finalize(() => {this.loading = false; this.cdr.detectChanges();})
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.cerrarModal()
      },
      error: () => console.error('Error asociando páginas'),
    });

  }

  cerrarModal() {
    // cerrar modal
    this.ref.close();
  }
}
