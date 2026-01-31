// changelog.ts
export interface ChangelogEntry {
    version: string;
    date: string;
    isFuture?: boolean;
    estimatedDate?: string;
    changes: ChangelogChange[];
}

export interface ChangelogChange {
    type: 'feature' | 'improvement' | 'fix';
    text: string;
    link?: string;
    urlReport?: string;
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: '0.0.2',
        date: '2026-02-02',
        changes: [
            { type: 'improvement', text: 'Primer rediseño del dashboard.' },
            { type: 'feature', text: 'Integración con Notion.' },
        ]
    },
    {
        version: '0.0.1',
        date: '2026-01-10',
        changes: [
            { type: 'feature', text: 'Menciones en comentarios.' },
            { type: 'feature', text: 'Administracion de KBs y deploys.', link: '/kb/kbs', urlReport: 'https://discord.com/channels/1366451551064821782/1450234207480582255' },
            { type: 'feature', text: 'Notas personales y compartidas.' },
            { type: 'feature', text: 'Rework del Perfil de usuario.', link: '/usuario/perfil' },
            { type: 'feature', text: 'Notificaciones.' },
            { type: 'fix', text: 'Correccion en calculo de horas.', urlReport: 'https://discord.com/channels/1366451551064821782/1440429435944829049' },
        ],
    },
];

/*
futuro:
{
    version: '0.0.2',
    date: '',
    isFuture: true,
    estimatedDate: '2026-02-02',
    changes: [
        { type: 'improvement', text: 'Primer rediseño del dashboard.' },
        { type: 'feature', text: 'Integración con Notion.' },
    ]
},

actual:
{
    version: '0.0.2',
    date: '2026-02-02',
    changes: [
        { type: 'improvement', text: 'Primer rediseño del dashboard.' },
        { type: 'feature', text: 'Integración con Notion.' },
    ]
},
*/

