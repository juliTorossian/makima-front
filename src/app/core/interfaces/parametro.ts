export interface Parametro {
    id?:string;
    clave:string;
    valor:string;
    tipo?:TipoParametro;
    ambito?:AmbitoParametro;
    descripcion?:string;
    editable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export const TIPOS_PARAMETRO = ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'] as const;
export type TipoParametro = typeof TIPOS_PARAMETRO[number];

export const AMBITOS_PARAMETRO = ['SISTEMA', 'INTEGRACION', 'FEATURE'] as const;
export type AmbitoParametro = typeof AMBITOS_PARAMETRO[number];
