import { ClienteProyecto } from "./proyecto";

export interface Cliente {
  id?: number;
  sigla: string;
  nombre?: string;
  activo: boolean;
  proyectoIds?: number[];

  proyectos?: ClienteProyecto[];
  // eventos?: Evento[];
}
