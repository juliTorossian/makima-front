import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { DashboardKpis } from './components/dashboard-kpis'
import { EventosPorCliente } from './components/eventos-por-cliente'
import { TendenciaEventos } from './components/tendencia-eventos'
import { EventosPorTipo } from './components/eventos-por-tipo'
import { EventosPorEtapa } from './components/eventos-por-etapas'
import { ActividadReciente } from './components/actividad-reciente'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardKpis,
    TendenciaEventos,
    EventosPorTipo,
    EventosPorEtapa,
    ActividadReciente,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // this.reloadActividad();

    setTimeout(() => {
      this.reloadActividad();
    }, 500);
  }
  actividadLoading = false

  reloadActividad() {
    this.actividadLoading = true
    setTimeout(() => {
      this.actividadLoading = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 800)
  }
}
