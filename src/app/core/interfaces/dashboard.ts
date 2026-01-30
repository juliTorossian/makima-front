/* =========================
   KPIs
========================= */

export interface DashboardKpis {
  eventosActivos: number;
  eventosEnRiesgo: number;
  eventosCreadosPeriodo: number;
  eventosRechazadosPeriodo: number;
  eventosCompletadosPeriodo: number;
}

/* =========================
   Gráficos
========================= */

export interface EventosPorEtapa {
  etapaId: number;
  etapaNombre: string;
  cantidad: number;
}

export interface EventosPorTipo {
  tipo: string;
  cantidad: number;
  color: string; // hex, rgb o var css
}

export interface TendenciaEventos {
  periodo: string; // ej: 2026-W03
  creados: number;
  cerrados: number;
  rechazados: number;
}

/* =========================
   Dashboard completo
========================= */

export interface DashboardResponse {
  kpis: DashboardKpis;
  eventosPorEtapa: EventosPorEtapa[];
  eventosPorTipo: EventosPorTipo[];
  tendenciaEventos: TendenciaEventos[];
}
