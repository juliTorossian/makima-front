export enum UsuarioPreferencias {
    MANTENER_OBSERVADOR = 'mantener_obs', // mantiene al usuario como observador
    NOTIFICAR_CAMBIOS = 'notificar_cambios', // notifica al usuario sobre cambios en eventos // AVANZO, RETOCEDIO, REASIGNO
    NOTIFICAR_ADICION = 'notificar_adicion', // notifica al usuario sobre nuevas adiciones // COMENTARIO, ADJUNTO
    NOTIFICAR_ELIMINACION = 'notificar_eliminacion', // notifica al usuario sobre eliminaciones
    RECORDATORIO_HORAS = 'recordatorio_horas', // envía recordatorios sobre la carga de horas
    RECORDATORIO_EVENTOS = 'recordatorio_eventos', // envía recordatorios sobre eventos pendientes
}

export const USUARIO_PREFERENCIAS_CLAVES = Object.values(UsuarioPreferencias);

export const getDescripcionUsuarioPref = (pref:UsuarioPreferencias) => {
    switch (pref) {
        case UsuarioPreferencias.MANTENER_OBSERVADOR:
            return 'Al avanzar un evento, se mantiene al usuario como observador';
        case UsuarioPreferencias.NOTIFICAR_CAMBIOS:
            return 'Notificar al usuario sobre cambios en eventos (Avanzo, Retrocedio, Reasigno)';
        case UsuarioPreferencias.NOTIFICAR_ADICION:
            return 'Notificar al usuario sobre nuevas adiciones (Comentario, Adjunto)';
        case UsuarioPreferencias.NOTIFICAR_ELIMINACION:
            return 'Notificar al usuario sobre la eliminación (Comentario, Adjunto)';
        case UsuarioPreferencias.RECORDATORIO_HORAS:
            return 'Enviar recordatorios sobre la carga de horas';
        case UsuarioPreferencias.RECORDATORIO_EVENTOS:
            return 'Enviar recordatorios sobre eventos pendientes';
        default:
            return '';
    }
}

export const USUARIO_PREFERENCIAS_GRUPOS = [
    {
        titulo: 'Notificaciones',
        icono: 'lucideBell',
        pref: [
            {
                clave: UsuarioPreferencias.NOTIFICAR_CAMBIOS,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.NOTIFICAR_CAMBIOS)
            },
            {
                clave: UsuarioPreferencias.NOTIFICAR_ADICION,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.NOTIFICAR_ADICION)
            },
            {
                clave: UsuarioPreferencias.NOTIFICAR_ELIMINACION,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.NOTIFICAR_ELIMINACION)
            }
        ]
    },
    {
        titulo: 'Recordatorios',
        icono: 'lucideMessageCircleWarning',
        pref: [
            {
                clave: UsuarioPreferencias.RECORDATORIO_HORAS,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.RECORDATORIO_HORAS)
            },
            {
                clave: UsuarioPreferencias.RECORDATORIO_EVENTOS,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.RECORDATORIO_EVENTOS)
            }
        ]
    },
    {
        titulo: 'Otros',
        icono: 'lucideShell',
        pref: [
            {
                clave: UsuarioPreferencias.MANTENER_OBSERVADOR,
                descripcion: getDescripcionUsuarioPref(UsuarioPreferencias.MANTENER_OBSERVADOR)
            }
        ]
    }
];