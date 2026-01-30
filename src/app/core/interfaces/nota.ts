
export interface Nota {
    id?: number;
    usuarioId: string;
    titulo: string;
    descripcion: string;
    tipo: NotaTipo;
    estado?: NotaEstado;
    prioridad?: NotaPrioridad;
    fechaVencimiento?: Date;
    creadaEn: Date;
    actualizadaEn: Date;
    anclada?: boolean;
}
export interface NotaCompartida {
    id?: number;
    notaId: number;
    usuarioId: string;
    permiso: NotaPermiso;
    fecha: Date;
    nota: Nota;
}
export interface NotaUsuariosCompartidos {
    id: number;
    notaId: number;
    usuarioId: string;
    permiso: NotaPermiso;
    fecha: Date;
    usuario: UsuarioCompartido[];
}
export interface UsuarioCompartido{
    id:string;
    nombre:string;
    apellido:string;
    usuario:string;
    color:string;
}


export enum NotaTipo {
    NOTA = 'NOTA',
    TODO = 'TODO'
}
export enum NotaEstado {
    PENDIENTE = 'PE',
    EN_PROGRESO = 'EP',
    COMPLETADO = 'CO'
}
export enum NotaPrioridad {
    BAJA = 'B',
    MEDIA = 'M',
    ALTA = 'A'
}

export enum NotaPermiso {
    VER = 'VER',
    EDITAR = 'EDITAR'
}

export interface NotaCompartir {
    usuarioId: number;
    permiso: NotaPermiso;
}
export interface NotaComplete extends Nota {
    tipoRelacion?: "C" | "P";
    permiso?: NotaPermiso;
}