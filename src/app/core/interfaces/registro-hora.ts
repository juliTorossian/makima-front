import { Evento } from "./evento"
import { Usuario } from "./usuario"

export interface RegistroHora {
  id?: number;
  fecha: Date;
  usuarioId: string;
  usuario?: {
    id: string;
    nombre: string;
    apellido: string;
    usuario: string;
  };
  horasTotales?: number;
  horas?: Hora[];
}

export interface Hora {
  id?: number;
  registroId?: number;
  eventoId: string;
  inicio: string;
  fin: string;
  detalle?: string;
  diferencia?: string;

  evento?: Evento;
  registro?: RegistroHora;
}

export interface UsuarioHorasGenerales {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  totalMes?: number;
  registrosHora: RegistroHora[];
}