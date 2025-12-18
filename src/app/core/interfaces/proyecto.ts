import { Cliente } from "./cliente";

export interface Proyecto {
  id?: number;
  sigla: string;
  nombre?: string;
  activo: boolean;
  critico?: boolean;

  // eventos?: Evento[];
}

export interface ClienteProyecto {
  clienteId: number;
  proyectoId: number;

  cliente?: Cliente;
  proyecto?: Proyecto;
}