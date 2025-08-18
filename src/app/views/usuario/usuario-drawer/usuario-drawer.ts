import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit, OnChanges } from '@angular/core';
import { Usuario as UsuarioComponent } from '../usuario/usuario';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-usuario-drawer',
  templateUrl: './usuario-drawer.html',
  styleUrls: ['./usuario-drawer.scss'],
  imports: [
    DrawerModule
  ]
})
export class UsuarioDrawerComponent implements AfterViewInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() usuarioId: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('usuarioDrawerContainer', { read: ViewContainerRef }) usuarioDrawerContainer!: ViewContainerRef;
  usuarioComponentRef?: ComponentRef<UsuarioComponent>;

  ngAfterViewInit(): void {
    this.loadUsuarioComponent();
  }

  ngOnChanges(): void {
    this.loadUsuarioComponent();
  }

  loadUsuarioComponent() {
    if (!this.usuarioDrawerContainer || !this.usuarioId) return;
    this.usuarioDrawerContainer.clear();
    this.usuarioComponentRef = this.usuarioDrawerContainer.createComponent(UsuarioComponent);
    this.usuarioComponentRef.instance.usuarioIdParam = this.usuarioId;
    this.usuarioComponentRef.instance.esMitadPantalla = true;
    this.usuarioComponentRef.changeDetectorRef.detectChanges();
  }

  onClose() {
    this.closed.emit();
    if (this.usuarioComponentRef) {
      this.usuarioComponentRef.destroy();
      this.usuarioComponentRef = undefined;
    }
    if (this.usuarioDrawerContainer) {
      this.usuarioDrawerContainer.clear();
    }
  }
}
