import { Etapa_requisito, Etapa } from "./etapa";

// Evento completo con datos enriquecidos
export interface EventoCompleto {
  id: string;
  tipoCodigo: string;
  numero: number;
  titulo: string;
  cerrado: boolean;
  etapaActual: number;
  clienteId: number;
  productoId: number;
  usuarioAltaId: string;
  estimacion: number;
  moduloCodigo: string;
  activo: boolean;
  prioridad: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  cliente: ClienteEvento;
  modulo: ModuloEvento;
  producto: ProductoEvento;
  tipo: TipoEvento;
  usuarioAlta: UsuarioEvento;
  usuarioActual: UsuarioEvento;
  _count: EventoCount;
  etapaActualData: EventoEtapa;
  etapaSiguiente: EventoEtapa | null;
  etapaAnterior: EventoEtapa | null;
  observadores?: UsuarioEvento[];
}

export interface ClienteEvento {
  id: number;
  sigla: string;
  nombre: string;
  activo: boolean;
}

export interface ModuloEvento {
  codigo: string;
  nombre: string;
  padreCodigo: string | null;
  activo: boolean;
}

export interface ProductoEvento {
  id: number;
  sigla: string;
  nombre: string;
  entornoCodigo: string;
  activo: boolean;
}

export interface TipoEvento {
  codigo: string;
  descripcion: string;
  activo: boolean;
  color: string;
}

export interface UsuarioEvento {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  color: string;
}
// Evento completo con datos enriquecidos
export interface EventoCompleto {
  id: string;
  tipoCodigo: string;
  numero: number;
  titulo: string;
  cerrado: boolean;
  etapaActual: number;
  clienteId: number;
  productoId: number;
  usuarioAltaId: string;
  estimacion: number;
  moduloCodigo: string;
  activo: boolean;
  prioridad: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  cliente: EventoCliente;
  modulo: EventoModulo;
  producto: EventoProducto;
  tipo: EventoTipo;
  usuarioAlta: EventoUsuario;
  usuarioActual: EventoUsuario;
  _count: EventoCount;
  etapaActualData: EventoEtapa;
  etapaSiguiente: EventoEtapa | null;
  etapaAnterior: EventoEtapa | null;
}

/** Cliente enriquecido para EventoCompleto */
export interface EventoCliente {
  id: number;
  sigla: string;
  nombre: string;
  activo: boolean;
}

/** Módulo enriquecido para EventoCompleto */
export interface EventoModulo {
  codigo: string;
  nombre: string;
  padreCodigo: string | null;
  activo: boolean;
}

/** Producto enriquecido para EventoCompleto */
export interface EventoProducto {
  id: number;
  sigla: string;
  nombre: string;
  entornoCodigo: string;
  activo: boolean;
}

/** Tipo enriquecido para EventoCompleto */
export interface EventoTipo {
  codigo: string;
  descripcion: string;
  activo: boolean;
  color: string;
}

/** Usuario enriquecido para EventoCompleto */
export interface EventoUsuario {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  color: string;
}

/** Contador de relaciones para EventoCompleto */
export interface EventoCount {
  registrosHora: number;
  auditorias: number;
  eventosAdicion: number;
}

/** Etapa enriquecida para EventoCompleto */
export interface RequisitoFaltante {
  id: number;
  tipo: string;
  codigo: string;
  descripcion: string;
}

export interface EventoEtapa {
  id: number;
  nombre: string;
  rolPreferido: string;
  activo: boolean;
  puedeContinuar?: boolean;
  requisitosFaltantes?: RequisitoFaltante[];
}

// Evento base
export interface Evento {
  id?: string;
  tipoCodigo: string;
  numero: number;
  titulo: string;
  cerrado?: boolean;
  etapaActual: number;
  clienteId: number;
  productoId: number;
  usuarioAltaId: string;
  estimacion?: number;
  moduloCodigo: string;
  prioridad?: number;
  activo?: boolean;
  comentario?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  registrosHora?: RegistroHora[];
  auditorias?: VidaEvento[];
  eventosAdicion?: EventoAdicion[];
}

/** Registro de horas asociadas a un evento */
export interface RegistroHora {}

/** Auditoría de vida de un evento */
export interface VidaEvento {
  id?: number;
  eventoId: string;
  etapaNumero: number;
  usuarioId: string;
  fecha: Date;
  adicionId?: number;
  accion: string;
  adicion?: EventoAdicion;
  usuario?: EventoUsuario;
}

/** Adición de información o archivos a un evento */
export interface EventoAdicion {
  id?: number;
  eventoId: string;
  tipo: string;
  comentario?: string;
  adjFile?: boolean;
  pathFile?: string;
  mimeType?: string;
  nameFile?: string;
  activo?: boolean;
  auditorias?: VidaEvento[];
}

/** Comentario circular entre usuarios y eventos */
export interface CircularEvento {
  eventoId: string;
  usuarioId: string;
  comentario: string;
}

export interface Evento_requisito {
  eventoId:string;
  requisitoId:number;

  valorTexto?:string;
  valorNumero?:number;
  valorFecha?:Date;
  valorBooleano?:boolean;
  valor?:any;
  url?:string;
  createdAt?:Date;
  updatedAt?:Date;
  deletedAt?:Date;

  // evento          evento      @relation(fields: [eventoId], references: [id])
  requisito?:Etapa_requisito;
}

export interface Evento_requisito_completo {
  etapa: EventoEtapa | Etapa;
  requisito: Etapa_requisito;
  obligatorio: boolean;
  cumplido: boolean;
  cumplimiento: Evento_requisito;
} 