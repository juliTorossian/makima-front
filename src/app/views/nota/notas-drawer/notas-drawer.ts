import { AfterViewInit, Component, ComponentRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { Notas } from '../notas/notas';

@Component({
  selector: 'app-notas-drawer',
  imports: [
    DrawerModule,
  ],
  template: `
    <p-drawer [(visible)]="visible" class="user-notes-drawer" position="right" [style]="{ width: '35%' }" [modal]="true" (onHide)="onClose()">
      <ng-template #notasDrawerContainer style="width: 35%;"></ng-template>
    </p-drawer>
  `,
  styles: ''
})
export class NotasDrawer implements AfterViewInit {
  @Input() visible: boolean = false;
  @Input() eventoId: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('notasDrawerContainer', { read: ViewContainerRef }) notasDrawerContainer!: ViewContainerRef;
  notasComponentRef?: ComponentRef<Notas>;

  ngAfterViewInit(): void {
    this.loadEventoComponent();
  }

  ngOnChanges(): void {
    this.loadEventoComponent();
  }

  loadEventoComponent() {
    if (!this.notasDrawerContainer || !this.eventoId) return;
    this.notasDrawerContainer.clear();
    this.notasComponentRef = this.notasDrawerContainer.createComponent(Notas);
    // this.notasComponentRef.instance.eventoIdParam = this.eventoId;
    this.notasComponentRef.changeDetectorRef.detectChanges();
  }

  onClose() {
    this.closed.emit();
    if (this.notasComponentRef) {
      this.notasComponentRef.destroy();
      this.notasComponentRef = undefined;
    }
    if (this.notasComponentRef) {
      this.notasDrawerContainer.clear();
    }
  }
}
