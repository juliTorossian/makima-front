import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { Evento as EventoComponent } from '../evento/evento';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-evento-drawer',
  template: `
    <p-drawer [(visible)]="visible" position="right" [style]="{width: '50vw'}" [modal]="true" (onHide)="onClose()">
      <ng-template #eventoDrawerContainer></ng-template>
    </p-drawer>
  `,
  styles: `
    .drawer-content {
        padding: 1rem;
    }

  `,
  imports: [
    DrawerModule
]
})
export class EventoDrawerComponent implements AfterViewInit {
  @Input() visible: boolean = false;
  @Input() eventoId: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('eventoDrawerContainer', { read: ViewContainerRef }) eventoDrawerContainer!: ViewContainerRef;
  eventoComponentRef?: ComponentRef<EventoComponent>;

  ngAfterViewInit(): void {
    this.loadEventoComponent();
  }

  ngOnChanges(): void {
    this.loadEventoComponent();
  }

  loadEventoComponent() {
    if (!this.eventoDrawerContainer || !this.eventoId) return;
    this.eventoDrawerContainer.clear();
    this.eventoComponentRef = this.eventoDrawerContainer.createComponent(EventoComponent);
    this.eventoComponentRef.instance.eventoIdParam = this.eventoId;
    this.eventoComponentRef.changeDetectorRef.detectChanges();
  }

  onClose() {
    this.closed.emit();
    if (this.eventoComponentRef) {
      this.eventoComponentRef.destroy();
      this.eventoComponentRef = undefined;
    }
    if (this.eventoDrawerContainer) {
      this.eventoDrawerContainer.clear();
    }
  }
}
