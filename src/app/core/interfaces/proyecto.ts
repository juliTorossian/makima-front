import { Cliente } from "./cliente";

export interface Proyecto {
  id?: number;
  sigla: string;
  nombre?: string;
  activo: boolean;
  critico?: boolean;
  clienteId?: number;

  cliente?: Cliente;
  // eventos?: Evento[];
}
