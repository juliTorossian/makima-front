import { VidaEvento } from "@core/interfaces/evento";

export enum ACCIONES {
    CREO = 'CREO',
    AVANZO = 'AVANZO',
    RETROCEDIO = 'RETROCEDIO',
    ASIGNO = 'ASIGNO',
    REASIGNO = 'REASIGNO',
    AUTORIZO = 'AUTORIZO',
    RECHAZO = 'RECHAZO',
    COMENTARIO = 'COMENTARIO',
    ADJUNTO = 'ADJUNTO',
    ELIMINO_ADJUNTO = 'ELIMINO_ADJUNTO',
    ELIMINO = 'ELIMINO',
    ADD_REQUISITO = 'ADD_REQUISITO',
    REMOVE_REQUISITO = 'REMOVE_REQUISITO',
    MOD_REQUISITO = 'MOD_REQUISITO',
    COMPLETADO = 'COMPLETADO',
}

export function getTitleAccion(actividad: VidaEvento): string {
    // Puedes parametrizar el icono por acción aquí
    switch (actividad.accion) {
        case ACCIONES.CREO:
            return `El usuario ${actividad.usuario?.usuario} creó el evento.`;
        case ACCIONES.ELIMINO:
            return `El usuario ${actividad.usuario?.usuario} eliminó el evento.`;
        case ACCIONES.COMENTARIO:
            return `El usuario ${actividad.usuario?.usuario} comentó en el evento.`;
        case ACCIONES.ADJUNTO:
            return `El usuario ${actividad.usuario?.usuario} adjuntó un archivo al evento.`;
        case ACCIONES.ELIMINO_ADJUNTO:
            return `El usuario ${actividad.usuario?.usuario} eliminó un archivo del evento.`;
        case ACCIONES.AVANZO:
            return `El usuario ${actividad.usuario?.usuario} avanzó el evento.`;
        case ACCIONES.RETROCEDIO:
            return `El usuario ${actividad.usuario?.usuario} retrocedió el evento.`;
        case ACCIONES.REASIGNO:
            return `El usuario ${actividad.usuario?.usuario} reasignó el evento.`;
        case ACCIONES.AUTORIZO:
            return `El usuario ${actividad.usuario?.usuario} autorizó el evento.`;
        case ACCIONES.RECHAZO:
            return `El usuario ${actividad.usuario?.usuario} rechazó el evento.`;
        case ACCIONES.ADD_REQUISITO:
            return `El usuario ${actividad.usuario?.usuario} completó un requisito al evento.`;
        case ACCIONES.REMOVE_REQUISITO:
            return `El usuario ${actividad.usuario?.usuario} eliminó un requisito del evento.`;
        case ACCIONES.MOD_REQUISITO:
            return `El usuario ${actividad.usuario?.usuario} modificó un requisito del evento.`;
        case ACCIONES.COMPLETADO:
            return `El usuario ${actividad.usuario?.usuario} completó el evento.`;
        default:
            return `El usuario ${actividad.usuario?.usuario} realizó una acción desconocida.`;
    }
}

export function getIconNameAccion(accion:string): string {
    // Puedes parametrizar el icono por acción aquí
    switch (accion) {
        case ACCIONES.CREO:
            return 'tablerPlus';
        case ACCIONES.ELIMINO:
            return 'tablerTrash';
        case ACCIONES.COMENTARIO:
            return 'tablerMessage';
        case ACCIONES.ADJUNTO:
            return 'tablerPaperclip';
        case ACCIONES.ELIMINO_ADJUNTO:
            return 'tablerTrash';
        case ACCIONES.AVANZO:
            return 'tablerArrowRight';
        case ACCIONES.RETROCEDIO:
            return 'tablerArrowLeft';
        case ACCIONES.AUTORIZO:
            return 'lucideShieldCheck';
        case ACCIONES.RECHAZO:
            return 'lucideShieldX';
        case ACCIONES.ASIGNO:
            return 'lucideArrowDownToLine';
        case ACCIONES.REASIGNO:
            return 'tablerUserBolt';
        case ACCIONES.ADD_REQUISITO:
            return 'lucideBadgePlus';
        case ACCIONES.REMOVE_REQUISITO:
            return 'lucideBadgeMinus';
        case ACCIONES.MOD_REQUISITO:
            return 'lucideBadgeAlert';
        case ACCIONES.COMPLETADO:
            return 'tablerCheck';
        default:
            return 'tablerCircle';
    }
}

export function getDescripcionAccion(actividad:VidaEvento): string {
    if (actividad.accion === ACCIONES.COMENTARIO && actividad.adicion) {
      return actividad.adicion.comentario || '';
    }
    if (actividad.accion === ACCIONES.ADJUNTO && actividad.adicion) {
      return actividad.adicion.nameFile || '';
    }
    if (actividad.accion === ACCIONES.ELIMINO_ADJUNTO && actividad.adicion) {
      return actividad.adicion.nameFile || '';
    }
    return '';
}
