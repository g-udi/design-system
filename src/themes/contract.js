// The theme contract: the semantic --ds-* tokens a theme may override, per mode, plus the
// mode-independent fonts, radius and density. Everything else in tokens.css derives from these.
// Documented in src/tokens/THEMING.md; mirrored by themes/theme.schema.json (contract-tested).

export const DEFAULT_THEME_ID = 'gaudi';
export const THEME_ATTRIBUTE = 'data-theme';
export const DARK_CLASS = 'dark';

export const STATUS_ROLES = ['success', 'warning', 'danger', 'discovery', 'info', 'attention'];
const statusTokens = (role) => [role, `${role}-foreground`, `${role}-muted`, `${role}-subtle`, `${role}-border`];

export const COLOR_GROUPS = [
  { id: 'surfaces', label: 'Surfaces', tokens: ['surface', 'surface-muted', 'surface-raised'] },
  { id: 'text', label: 'Text', tokens: ['text', 'text-muted', 'text-subtle', 'text-inverse'] },
  { id: 'borders', label: 'Borders', tokens: ['border', 'border-muted'] },
  { id: 'accent', label: 'Accent (primary)', tokens: ['accent', 'accent-dark', 'accent-foreground', 'accent-muted', 'accent-subtle'] },
  { id: 'focus', label: 'Focus', tokens: ['focus', 'focus-foreground'] },
  ...STATUS_ROLES.map((role) => ({ id: role, label: role[0].toUpperCase() + role.slice(1), tokens: statusTokens(role) })),
  { id: 'charts', label: 'Charts', tokens: Array.from({ length: 8 }, (_, index) => `chart-${index + 1}`) },
  { id: 'sidebar', label: 'Sidebar', tokens: ['sidebar', 'sidebar-foreground', 'sidebar-accent', 'sidebar-border'] }
];

export const COLOR_TOKENS = COLOR_GROUPS.flatMap((group) => group.tokens);
export const SHADOW_TOKENS = ['card', 'card-hover', 'floating', 'popover', 'launcher', 'table'];
export const FONT_TOKENS = ['sans', 'serif', 'mono', 'heading'];

export const colorVar = (key) => `--ds-color-${key}`;
export const shadowVar = (key) => `--ds-shadow-${key}`;
export const fontVar = (key) => `--ds-font-${key}`;
export const RADIUS_VAR = '--ds-radius';
export const SPACING_VAR = '--ds-space-scale';

/** Total number of themeable values: colours and shadows per mode, plus fonts, radius and density. */
export const TOKEN_COUNT = (COLOR_TOKENS.length + SHADOW_TOKENS.length) * 2 + FONT_TOKENS.length + 2;

export const TOKEN_DESCRIPTIONS = {
  surface: 'Page background (shadcn background).',
  'surface-muted': 'Muted panels, table headers, hover rows (shadcn muted).',
  'surface-raised': 'Cards, popovers and raised panels (shadcn card/popover).',
  text: 'Body text (shadcn foreground).',
  'text-muted': 'Secondary text (shadcn muted-foreground).',
  'text-subtle': 'Tertiary text, captions and placeholders.',
  'text-inverse': 'Text on inverted (text-coloured) surfaces.',
  border: 'Borders and input outlines (shadcn border/input).',
  'border-muted': 'Hairline dividers.',
  accent: 'Primary actions, links and selection (shadcn primary).',
  'accent-dark': 'Stronger accent for hover/pressed states.',
  'accent-foreground': 'Text on the accent (shadcn primary-foreground).',
  'accent-muted': 'Tinted chips and secondary fills (shadcn secondary).',
  'accent-subtle': 'Selection surfaces and soft highlights (shadcn accent).',
  focus: 'Keyboard focus and live indicators (shadcn ring).',
  'focus-foreground': 'Text on focus-coloured fills.',
  sidebar: 'Sidebar background.',
  'sidebar-foreground': 'Sidebar text.',
  'sidebar-accent': 'Sidebar hover/active item background.',
  'sidebar-border': 'Sidebar border.'
};
for (const role of STATUS_ROLES) {
  Object.assign(TOKEN_DESCRIPTIONS, {
    [role]: `${role} status colour; also its text on surfaces.`,
    [`${role}-foreground`]: `Text on a solid ${role} fill.`,
    [`${role}-muted`]: `Medium ${role} tint (badges).`,
    [`${role}-subtle`]: `Soft ${role} background (alerts).`,
    [`${role}-border`]: `${role} border.`
  });
}
for (let index = 1; index <= 8; index += 1) TOKEN_DESCRIPTIONS[`chart-${index}`] = `Categorical chart series ${index}.`;

/**
 * WCAG pairs every theme must pass in both modes: 4.5:1 for text, 3:1 for graphics/UI
 * (focus indicators and chart series). Borders are decorative and deliberately excluded.
 */
export const CONTRAST_PAIRS = [
  ...['surface', 'surface-muted', 'surface-raised', 'accent-subtle', 'accent-muted'].map((bg) => ({ fg: 'text', bg, min: 4.5 })),
  ...['surface', 'surface-muted', 'surface-raised'].flatMap((bg) => [{ fg: 'text-muted', bg, min: 4.5 }, { fg: 'text-subtle', bg, min: 4.5 }]),
  { fg: 'surface', bg: 'text', min: 4.5 },
  { fg: 'accent-foreground', bg: 'accent', min: 4.5 },
  { fg: 'accent-foreground', bg: 'accent-dark', min: 4.5 },
  { fg: 'accent', bg: 'surface', min: 4.5 },
  { fg: 'accent', bg: 'surface-raised', min: 4.5 },
  { fg: 'focus', bg: 'surface', min: 3 },
  { fg: 'focus-foreground', bg: 'focus', min: 4.5 },
  ...STATUS_ROLES.flatMap((role) => [
    { fg: `${role}-foreground`, bg: role, min: 4.5 },
    { fg: role, bg: 'surface', min: 4.5 },
    { fg: role, bg: `${role}-subtle`, min: 4.5 },
    { fg: 'text', bg: `${role}-muted`, min: 4.5 }
  ]),
  { fg: 'sidebar-foreground', bg: 'sidebar', min: 4.5 },
  { fg: 'sidebar-foreground', bg: 'sidebar-accent', min: 4.5 },
  ...Array.from({ length: 8 }, (_, index) => ({ fg: `chart-${index + 1}`, bg: 'surface', min: 3 }))
];

/**
 * shadcn/tweakcn/StyleGlide variable → DS token. `import` rows are read by the importer; every row
 * is written by the shadcn exporter (several shadcn names share one DS role).
 */
export const SHADCN_COLOR_MAP = [
  { shadcn: 'background', ds: 'surface', import: true },
  { shadcn: 'foreground', ds: 'text', import: true },
  { shadcn: 'card', ds: 'surface-raised', import: true },
  { shadcn: 'card-foreground', ds: 'text' },
  { shadcn: 'popover', ds: 'surface-raised' },
  { shadcn: 'popover-foreground', ds: 'text' },
  { shadcn: 'primary', ds: 'accent', import: true },
  { shadcn: 'primary-foreground', ds: 'accent-foreground', import: true },
  { shadcn: 'secondary', ds: 'accent-muted', import: true },
  { shadcn: 'secondary-foreground', ds: 'text' },
  { shadcn: 'muted', ds: 'surface-muted', import: true },
  { shadcn: 'muted-foreground', ds: 'text-muted', import: true },
  { shadcn: 'accent', ds: 'accent-subtle', import: true },
  { shadcn: 'accent-foreground', ds: 'text' },
  { shadcn: 'destructive', ds: 'danger', import: true },
  { shadcn: 'destructive-foreground', ds: 'danger-foreground', import: true },
  { shadcn: 'success', ds: 'success', import: true },
  { shadcn: 'success-foreground', ds: 'success-foreground', import: true },
  { shadcn: 'warning', ds: 'warning', import: true },
  { shadcn: 'warning-foreground', ds: 'warning-foreground', import: true },
  { shadcn: 'info', ds: 'info', import: true },
  { shadcn: 'info-foreground', ds: 'info-foreground', import: true },
  { shadcn: 'border', ds: 'border', import: true },
  { shadcn: 'input', ds: 'border' },
  { shadcn: 'ring', ds: 'focus', import: true },
  ...Array.from({ length: 5 }, (_, index) => ({ shadcn: `chart-${index + 1}`, ds: `chart-${index + 1}`, import: true })),
  { shadcn: 'sidebar', ds: 'sidebar', import: true },
  { shadcn: 'sidebar-background', ds: 'sidebar', import: true, exportSkip: true },
  { shadcn: 'sidebar-foreground', ds: 'sidebar-foreground', import: true },
  { shadcn: 'sidebar-primary', ds: 'accent' },
  { shadcn: 'sidebar-primary-foreground', ds: 'accent-foreground' },
  { shadcn: 'sidebar-accent', ds: 'sidebar-accent', import: true },
  { shadcn: 'sidebar-accent-foreground', ds: 'sidebar-foreground' },
  { shadcn: 'sidebar-border', ds: 'sidebar-border', import: true },
  { shadcn: 'sidebar-ring', ds: 'focus' }
];

/** shadcn shadow scale → DS shadow role (first match wins on import). */
export const SHADCN_SHADOW_MAP = [
  { shadcn: 'shadow-sm', ds: 'card' },
  { shadcn: 'shadow-xs', ds: 'table' },
  { shadcn: 'shadow-md', ds: 'floating' },
  { shadcn: 'shadow-lg', ds: 'card-hover' },
  { shadcn: 'shadow-xl', ds: 'popover' },
  { shadcn: 'shadow-2xl', ds: 'launcher' }
];
