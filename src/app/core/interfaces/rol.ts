import { Usuario } from "./usuario";

export interface Rol {
  codigo: string;
  descripcion: string;
  activo?: boolean;
  color?: string;
  usuarios?: Usuario[];
  permisos?: Permiso[];
  // etapas?: Etapa[];
}

export interface Permiso {
  rolCodigo: string;
  clave: string;
  nivel: number;
  activo?: boolean;
}

export interface PermisoConfig {
  clave: string;
  descripcion: string;
  nivel: number;
  acciones: Niveles;
}

interface Niveles {
  Lee: Nivel;
  Mod: Nivel;
  Eli: Nivel;
}

interface Nivel {
  activo: boolean;
  label: string;
}

export enum PermisoClave {
  ADMIN = 'ADM',
  EVENTO = 'EVT',
  EVENTO_TIPO_FAC = 'ETF',
  CLIENTE = 'CLI',
  PROYECTO = 'PRO',
  USUARIO = 'USR',
  MODULO = 'MOD',
  ENTORNO = 'ENT',
  PRODUCTO = 'PRD',
  HORAS_GENERALES = 'HOG',
  EVENTO_DOCUMENTO = 'EVD',
  ETAPA = 'ETA',
  TIPO_EVENTO = 'TEV',
  ROL = 'ROL'
}

export const permisosVacios = {
  [PermisoClave.ADMIN]: 0,
  [PermisoClave.EVENTO]: 0,
  [PermisoClave.EVENTO_TIPO_FAC]: 0,
  [PermisoClave.CLIENTE]: 0,
  [PermisoClave.PROYECTO]: 0,
  [PermisoClave.USUARIO]: 0,
  [PermisoClave.MODULO]: 0,
  [PermisoClave.ENTORNO]: 0,
  [PermisoClave.PRODUCTO]: 0,
  [PermisoClave.HORAS_GENERALES]: 0,
  [PermisoClave.EVENTO_DOCUMENTO]: 0,
  [PermisoClave.ETAPA]: 0,
  [PermisoClave.TIPO_EVENTO]: 0,
  [PermisoClave.ROL]: 0
};

const LEER = "Leer";
const ESCRIBIR = "Escribir";
const ELIMINAR = "Eliminar";
const LEER_Y_ESCRIBIR = `${LEER} y ${ESCRIBIR}`;
const TODO = `${LEER}, ${ESCRIBIR} y ${ELIMINAR}`;


export const permisosData: PermisoConfig[] = [
  {
    clave: PermisoClave.EVENTO,
    descripcion: 'Eventos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.EVENTO_TIPO_FAC,
    descripcion: 'Eventos tipo de facturacion',
    nivel: 0,
    acciones: { Lee: { activo: false, label: '' }, Mod: { activo: true, label: ESCRIBIR }, Eli: { activo: false, label: '' } }
  },
  {
    clave: PermisoClave.EVENTO_DOCUMENTO,
    descripcion: 'Documentos de eventos',
    nivel: 0,
    acciones: { Lee: { activo: false, label: "" }, Mod: { activo: false, label: "" }, Eli: { activo: true, label: ELIMINAR } }
  },
  {
    clave: PermisoClave.CLIENTE,
    descripcion: 'Clientes',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.PROYECTO,
    descripcion: 'Proyectos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.HORAS_GENERALES,
    descripcion: 'Horas Generales',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: false, label: "" }, Eli: { activo: false, label: "" } }
  },
  {
    clave: PermisoClave.MODULO,
    descripcion: 'Modulos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.ENTORNO,
    descripcion: 'Entornos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.PRODUCTO,
    descripcion: 'Productos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.ETAPA,
    descripcion: 'Etapa',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.TIPO_EVENTO,
    descripcion: 'Tipo de Eventos',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.ROL,
    descripcion: 'Roles',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
  {
    clave: PermisoClave.USUARIO,
    descripcion: 'Usuarios',
    nivel: 0,
    acciones: { Lee: { activo: true, label: LEER }, Mod: { activo: true, label: LEER_Y_ESCRIBIR }, Eli: { activo: true, label: TODO } }
  },
]