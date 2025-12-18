
export interface kb {
  id: number;
  nombre:string;
  descripcion?:string;

  // Clasificación técnica
  plataforma: string;
  tecnologia: string;
  version_plataforma?: string;
  compilador: string;

  // Estado / uso
  tipo: string;
  estado: string;
  uso_actual: string;

  // Migraciones
  migrada: boolean;
  migradaDesdeKbId?: number;

  // Metadata
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // Relaciones
  migradaDesde?: kb;
  migraciones?: kb[];

//   proyectos?: proyecto_kb[];
  deploys?: deploy[];
}



export interface deploy {
  id:number;
  kbId:number;

  ambiente:string;
  hosting:string;
  nombre?:string;
  url?:string;
  observaciones?:string;

  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
