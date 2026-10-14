# Theming

A Gaudi theme overrides a fixed set of semantic `--ds-*` tokens (the **theme contract**) for light and dark. Every other token in `tokens.css` either aliases a contract token or is derived from one, so components never need theme-specific code. Themes are JSON (`themes/theme.schema.json`), compiled to CSS scoped by `[data-theme="<id>"]`, and interchangeable with [shadcn/ui](https://ui.shadcn.com/themes), [tweakcn](https://tweakcn.com) and [StyleGlide](https://www.styleglide.ai/themes) themes. **Bring any StyleGlide, tweakcn or shadcn theme:** paste its CSS into Theme Studio or run `gaudi-ds theme import`, and it applies as-is.

The default theme, `gaudi`, is extracted programmatically from `tokens.css`; applying it changes nothing. Source of truth for the contract: `src/themes/contract.js`.

## Contract (134 values)

Per mode (`light`, `dark`): 58 colours + 6 shadows. Shared: 4 font families, radius and density.

| Group | Tokens (`--ds-color-<token>`) | shadcn equivalent |
| --- | --- | --- |
| Surfaces | `surface`, `surface-muted`, `surface-raised` | background, muted, card/popover |
| Text | `text`, `text-muted`, `text-subtle`, `text-inverse` | foreground, muted-foreground |
| Borders | `border`, `border-muted` | border, input |
| Accent | `accent`, `accent-dark`, `accent-foreground`, `accent-muted`, `accent-subtle` | primary, primary-foreground, secondary, accent |
| Focus | `focus`, `focus-foreground` | ring |
| Status (×6) | `success`, `warning`, `danger`, `discovery`, `info`, `attention`, each with `-foreground`, `-muted`, `-subtle`, `-border` | destructive (+ success/warning/info when present) |
| Charts | `chart-1` … `chart-8` | chart-1 … chart-5 |
| Sidebar | `sidebar`, `sidebar-foreground`, `sidebar-accent`, `sidebar-border` | sidebar-* |

| Shared / per-mode value | Variable | Theme JSON |
| --- | --- | --- |
| Shadows (per mode) | `--ds-shadow-card`, `-card-hover`, `-floating`, `-popover`, `-launcher`, `-table` | `shadows.light`, `shadows.dark` |
| Fonts | `--ds-font-sans`, `--ds-font-serif`, `--ds-font-mono`, `--ds-font-heading` | `fonts` |
| Radius | `--ds-radius` (every corner token follows it) | `radius` |
| Density | `--ds-space-scale` | `spacing` (0.5–2, default 1) |
| Letter-spacing | body `letter-spacing` | `tracking` (optional) |

`focus`, `focus-foreground` and the `sidebar*` tokens default to `discovery`, `discovery-foreground`, `surface-muted`, `text`, `accent-subtle` and `border`; `--ds-font-heading` defaults to the sans stack.

### Derived tokens

- **Aliases** (`--ds-color-table-*`, `--ds-color-mermaid-*`, `--ds-radius-*`, `--radius-*` and the shadcn bridge `--background`, `--primary`, …) are re-declared inside themed scopes, so a nested `data-theme` element (a preview card) resolves them against its own values.
- **Recomputed for non-default themes**: chart cursor/grid/neutrals, sequential and heatmap ramps (from the accent and `chart-3`, with contrast-picked inks), positive/negative (`success`/`danger`), launcher, popover, citation, caption, scrollbar and aurora colours.
- Unchanged: code-block chrome and the diverging chart ramp.

### Contrast

Every preset passes these WCAG AA pairs in both modes (`checkContrast`, `gaudi-ds theme check`): 4.5:1 for `text`/`text-muted`/`text-subtle` on the surfaces, `text` on `accent-subtle`/`accent-muted`/status `-muted`, `surface` on `text`, `accent-foreground` on `accent`/`accent-dark`, `accent` on surfaces, `focus-foreground` on `focus`, each status on the surface and its `-subtle`, each `-foreground` on its status, and the sidebar pairs; 3:1 for `focus` and `chart-1…8` on the surface. Borders are decorative and not checked. The `contrast` preset goes further, with 7:1 body text.

`checkContrast(theme)` returns `{ pass, checked, failures, results }` (each result: `mode`, `fg`, `bg`, `min`, `ratio`, `pass`). The auto-fix, `repairContrast(theme)` (also `importTheme(input, { repair: true })` and `gaudi-ds theme import --fix`), nudges failing pairs by the smallest lightness change (tints first, then foregrounds); `generateTheme` and `randomTheme` run it on their output.

## Presets

`gaudi` (default), `folio` (warm editorial serif), `graphite` (cool minimal mono, square, flat), `contrast` (7:1 text), `pastel` (soft, rounded), `midnight` (dark-first indigo), `grove` (nature), `ember` (vivid orange). JSON in `themes/presets/`, registry items in `public/r/theme-<id>.json`. Regenerate with `pnpm themes:build` (recipes in `scripts/themes/presets.mjs`; `pnpm themes:check` in CI).

## Applying a theme

**Static.** Import `@gaudi/design-system/themes.css` (every preset) and set `data-theme="<id>"` on `<html>`. Dark values apply with `.dark` on the themed element or an ancestor (or on a descendant); `.light` on a themed element opts out of an ancestor's `.dark`.

**Runtime (Next.js app router).**

```jsx
// app/layout.jsx (server component)
import { getThemeScript } from '@gaudi/design-system/themes';
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: getThemeScript() }} /></head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}

// app/providers.jsx
'use client';
import { ThemeProvider } from '@gaudi/design-system/themes';
export const Providers = ({ children }) => <ThemeProvider defaultMode='system'>{children}</ThemeProvider>;

// A settings picker
const { theme, themes, setTheme, mode, setMode, resolvedMode, applyCustomTheme } = useTheme();
```

`ThemeProvider` props: `themes` (default: presets), `defaultTheme` (`'gaudi'`), `defaultMode` (`'system'`), `storageKey` (`'gaudi-theme'`), `storage` (Web Storage-shaped `{ getItem, setItem, removeItem }`, default `localStorageAdapter`; `null` disables persistence), `enableMode` (`true`), `attribute` (`'data-theme'`), `darkClass` (`'dark'`), `nonce`, `onThemeChange(id)`. It injects the active non-default theme's CSS (so `themes.css` is optional) and stores it for `getThemeScript`, which applies `data-theme`, that CSS and `.dark` before first paint. Server and first client renders use the defaults; the stored choice is read after mount.

`useTheme()` returns `{ theme, themes, mode, resolvedMode, setTheme(id), setMode('light' | 'dark' | 'system'), applyCustomTheme(themeJson) }`; outside a provider it returns the defaults with no-op setters.

Apps that already manage light/dark with `next-themes` (Gaudi's `ThemeSwitch`, `Commander` and `LayoutContainer` use it) keep it and pass `enableMode={false}` to `ThemeProvider` and `getThemeScript({ enableMode: false })`.

```jsx
// app/providers.jsx: next-themes owns light/dark, Gaudi owns the theme
'use client';
import { ThemeProvider as ModeProvider } from 'next-themes';
import { ThemeProvider } from '@gaudi/design-system/themes';

export const Providers = ({ children }) => (
  <ModeProvider attribute='class' defaultTheme='system' enableSystem>
    <ThemeProvider enableMode={false}>{children}</ThemeProvider>
  </ModeProvider>
);
// app/layout.jsx: <script dangerouslySetInnerHTML={{ __html: getThemeScript({ enableMode: false }) }} />
```

Invalid saved custom themes and theme IDs that are no longer available fall back to `defaultTheme`. The provider reuses the same validation as theme imports.

`applyTheme(themeJson, { document?, nonce?, attribute?, darkClass? })` compiles and injects a theme anywhere (returns `{ css, remove }`). `compileTheme(theme, { attribute?, darkClass? })` returns the CSS string using the same selectors as the provider; `listThemes()` and `getThemePreset(id)` support pickers. A custom dark class controls theme tokens; applications must also configure their CSS dark variants to use that class.

### Fonts

Gaudi never downloads fonts. Theme font stacks name an open-source family first and fall back to system faces. `@fontsource/<family>` registers the real family name, so the stack picks it up automatically. `next/font` (`next/font/google` or `next/font/local`) generates its own family name: expose it as a CSS variable and put it first in the theme's stack, as the default theme does with `--font-space-inter`. Curated pairs: `FONT_PAIRS` in `@gaudi/design-system/themes`.

```jsx
// app/layout.jsx
import { Fraunces, Source_Sans_3 } from 'next/font/google';
const serif = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const sans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' });
// <html lang='en' className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
```

```css
/* app/globals.css, after the Gaudi stylesheets */
[data-theme='folio'] {
  --ds-font-sans: var(--font-source-sans), ui-sans-serif, system-ui, sans-serif;
  --ds-font-heading: var(--font-fraunces), ui-serif, Georgia, serif;
}
```

## Import and export

`importTheme(input, { id?, name?, repair? })` accepts shadcn/tweakcn/StyleGlide CSS (`:root`/`.dark`, optionally inside `@layer base`; OKLCH, HSL, bare v3 HSL triplets, hex or rgb; `var()` references are resolved), a shadcn registry item (`cssVars.theme/light/dark`) or Gaudi theme JSON, and returns `{ theme, report, warnings, format }`. Mapped values are kept verbatim; missing tokens are derived (status families from conventional hues, tints from their base, `chart-6…8` by hue rotation, `text-subtle` contrast-solved). `repair: true` nudges failing pairs (tints move first, then foregrounds, by the smallest lightness change).

| shadcn variable | Gaudi token |
| --- | --- |
| `--background` / `--foreground` | `surface` / `text` |
| `--card` (also exported as `--popover`) | `surface-raised` |
| `--muted` / `--muted-foreground` | `surface-muted` / `text-muted` |
| `--primary` / `--primary-foreground` | `accent` / `accent-foreground` |
| `--secondary` | `accent-muted` |
| `--accent` | `accent-subtle` |
| `--destructive` / `--destructive-foreground` | `danger` / `danger-foreground` |
| `--success`, `--warning`, `--info` (+ `-foreground`) | matching status tokens |
| `--border` (also exported as `--input`) | `border` |
| `--ring` | `focus` |
| `--chart-1` … `--chart-5` | `chart-1` … `chart-5` |
| `--sidebar` (or `--sidebar-background`), `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border` | `sidebar*` |
| `--radius` | `radius` |
| `--font-sans`, `--font-serif`, `--font-mono` | `fonts` (heading = sans) |
| `--shadow-sm`, `-xs`, `-md`, `-lg`, `-xl`, `-2xl` | `card`, `table`, `floating`, `card-hover`, `popover`, `launcher` |
| `--spacing` (rem ÷ 0.25) / `--tracking-normal` | `spacing` / `tracking` |

`*-foreground` variables for card, popover, secondary, accent and sidebar are written by the exporter (as `text` or `sidebar-foreground`) and ignored on import.

`exportTheme(theme, format)`: `json`, `css` (scoped Gaudi CSS), `shadcn` (`:root`/`.dark` + `@theme inline`) or `registry` (a `registry:theme` item with `cssVars`; `meta.gaudiTheme` keeps the lossless Gaudi JSON).

### CLI and MCP

```sh
gaudi-ds theme list
gaudi-ds theme import ./tweakcn.css --id ocean --out themes/ [--fix]
gaudi-ds theme export folio --format shadcn|css|registry|json [--out file]
gaudi-ds theme check ./themes/ocean.json --verbose
gaudi-ds theme generate --brand '#0e7490' --secondary '#f59e0b' --id teal --out themes/
```

MCP tools: `list_themes`, `get_theme`, `import_theme` (returns theme JSON and the contrast report), `export_theme`.

## Generating

`generateTheme({ brand, secondary?, seed?, ... })` turns one or two seed colours into a full OKLCH palette for both modes (accent kept on the brand hue and moved only in lightness until it passes; status roles keep conventional hues; neutrals tinted towards the brand), with fonts, radius and shadows. `randomTheme(seed)` produces a harmonious random theme. Both are deterministic and offline. The Storybook **Theming / Theme Studio** page puts the gallery, editor, generator, contrast report and import/export together.

## Credits

Gaudi does not reinvent theme authoring. The theme contract follows the [shadcn/ui](https://ui.shadcn.com/themes) CSS-variable convention (`--background`, `--primary`, `--chart-1`, …), so any theme made in [StyleGlide](https://www.styleglide.ai/themes), [tweakcn](https://tweakcn.com) or the [shadcn/ui theme editor](https://ui.shadcn.com/themes) can be imported as-is; we encourage designing themes there. Their names are used only to describe compatibility.
