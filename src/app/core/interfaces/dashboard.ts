import { ACCIONES } from "@/app/constants/actividad_acciones";

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

export interface ActividadReciente {
  id: number;
  eventoId: string;
  etapaNumero: number;
  usuarioId: string;
  fecha: string;
  adicionId: null;
  accion: ACCIONES,
  usuario: {
    id: string,
    usuario: string
  },
  evento: {
    id: string,
    tipoCodigo: string,
    numero: number,
    eventoSearch: string,
    cliente: {
      id: number,
      nombre: string
    }
  }
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
