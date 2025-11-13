export interface TipoEvento {
  codigo: string;
  descripcion: string;
  activo?: boolean;
  color: string;
  propio?: boolean;
  facturable?: boolean;
  facturableAuto?: boolean;
  label?: string;
  // eventos?: Evento[];
  etapas?: TipoEventoEtapa[];
}

export interface TipoEventoEtapa {
  tipoEventoCodigo?: string;
  etapaId: number;
  etapaSecuencia: number;
  rollbackSec?: number;
}