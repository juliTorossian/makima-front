
export interface PrioridadRegla {
  id?:number;

  tipoEventoCodigo?:string;

  contexto:string;
  operador:PrioridadOperadores;
  valor:string;
  peso:number;

  activo?:boolean;

  createdAt?:Date;
  updatedAt?:Date;
}

export enum PrioridadOperadores {
    IGUAL='=',
    DIFERENTE='!=',
    MAYOR='>',
    MAYOR_IGUAL='>=',
    MENOR='<',
    MENOR_IGUAL='<=',
    IN='IN',
    CONTAINS='CONTAINS'
}

export const PrioridadContexto = [
    'cliente.id',
    'cliente.sigla',
    'cliente.nombre',
    'cliente.critico',
    'producto.id',
    'producto.sigla',
    'producto.nombre',
    'producto.entornoCodigo',
    'producto.critico',
    'modulo.codigo',
    'modulo.nombre',
    'modulo.padreCodigo',
    'proyecto.id',
    'proyecto.sigla',
    'proyecto.nombre',
    'proyecto.critico',
    'etapa.id',
    'etapa.nombre',
    'etapa.deAutoriza',
    'evento.etapaActual',
    'evento.facEventoCerr',
    'evento.fechaInicio',
    'evento.fechaFinEst',
    'evento.fechaFinReal',
    'evento.fechaEntrega',
    'evento.createdAt',
]