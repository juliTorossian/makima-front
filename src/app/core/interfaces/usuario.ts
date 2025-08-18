import { Rol } from "./rol";
import type { EventoCompleto } from "./evento";

export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  password?: string;
  activo?: boolean;
  ultimo_login?: Date;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  // preferencias?: Preferencia[];
  roles?: UsuarioRol[];
  // notificaciones?: Notificacion[];
  // eventosCreados?: Evento[];
  // registrosHora?: RegistroHora[];
  // auditorias?: VidaEvento[];
  // adicionales?: Adicional[];
}

interface UsuarioRol {
  usuarioId: string;
  rolCodigo: string;
}

export interface UsuarioCompleto extends Usuario {
  eventosActuales?: EventoCompleto[];
}

