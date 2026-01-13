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
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: '0.0.2',
        date: '',
        isFuture: true,
        estimatedDate: 'Febrero 2026',
        changes: [
            { type: 'improvement', text: 'Rediseño del dashboard.' }
        ]
    },
    {
        version: '0.0.1',
        date: '2026-01-10',
        changes: [
            { type: 'feature', text: 'Menciones en comentarios.' },
            { type: 'feature', text: 'Administracion de KBs y deploys.', link: '/kb/kbs' },
            { type: 'feature', text: 'Notas personales y compartidas.' },
            { type: 'feature', text: 'Imagenes de perfil.' },
        ],
    },
];
