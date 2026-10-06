# WebPreview

> Core/WebPreview · core · `@gaudi/design-system/core/WebPreview`

A framed browser for a live or generated page: back, forward and reload, an editable address bar, open in a new tab, device widths, a sandboxed iframe with a loading state, an optional console, and a link preview card when a site refuses framing.

## Import

```js
import WebPreview from '@gaudi/design-system/core/WebPreview';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DEFAULT_WEB_PREVIEW_SANDBOX`, `WebPreviewBody`, `WebPreviewConsole`, `WebPreviewDevices`, `WebPreviewHistoryButtons`, `WebPreviewNavigation`, `WebPreviewNavigationButton`, `WebPreviewOpenButton`, `WebPreviewRoot`, `WebPreviewUrl`, `countWebPreviewLogs`, `createWebPreviewHistory`, `default`, `defaultWebPreviewLabels`, `formatWebPreviewUrl`, `normalizeWebPreviewUrl`, `pushWebPreviewHistory`, `stepWebPreviewHistory`, `useWebPreview`, `webPreviewDevices`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `url / defaultUrl` | `string` | `''` | no | Controlled or initial address. |
| `onUrlChange` | `(url) => void` | — | no | Called with each visited address. |
| `srcDoc` | `string \| (url) => string \| null` | — | no | Generated HTML instead of loading the address; a function serves several pages. |
| `title` | `string` | `Preview of <url>` | no | Accessible name of the framed page. |
| `device / defaultDevice` | `desktop \| tablet \| phone` | `desktop` | no | Frame width: full, 768px or 390px. Narrow screens scroll inside the frame. |
| `onDeviceChange` | `(device) => void` | — | no | Called with the chosen width. |
| `devices` | `boolean \| string[]` | `true` | no | Show the width toggle, or limit it. |
| `logs` | `Array<{ level, message, timestamp? }>` | — | no | Console entries; passing an array shows the console. |
| `defaultConsoleOpen` | `boolean` | `false` | no | Open the console initially. |
| `embeddable` | `boolean` | `true` | no | false replaces the frame with a LinkPreview card. |
| `previewData / endpoint` | `object / string` | — | no | Metadata or endpoint for that fallback card. |
| `sandbox` | `string` | `allow-scripts allow-forms allow-popups allow-presentation allow-modals` | no | iframe sandbox; allow-same-origin is left out on purpose. |
| `actions` | `ReactNode` | — | no | Extra toolbar controls. |
| `labels` | `object` | `English` | no | Copy overrides. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { WebPreview } from '@gaudi/design-system';

<>
<WebPreview
  defaultUrl='https://preview.example.dev/'
  srcDoc={(url) => generatedPages[url]}
  logs={logs}
  title='Generated landing page'
/>

{/* A site that refuses framing: the app knows from the headers. */}
<WebPreview defaultUrl='https://github.com/vercel/next.js' embeddable={false} />
</>
```

## Accessibility

The toolbar is a labelled toolbar of named buttons, the address bar is a labelled text field that flags unusable input in an alert, the width toggle is a radio group, the iframe has a title, the body is aria-busy while loading, and the console is a disclosure over a role="log" list.

## Notes

- Compose WebPreviewRoot, WebPreviewNavigation, WebPreviewHistoryButtons, WebPreviewUrl, WebPreviewOpenButton, WebPreviewDevices, WebPreviewBody and WebPreviewConsole for a different toolbar.
- Browsers do not report blocked frames, so the app decides embeddable (for example from X-Frame-Options read by its preview endpoint).

## Examples

- Playground (Storybook `core-webpreview--playground`)
- AI message with web preview (Storybook `core-webpreview--ai-message-with-web-preview`)
- Blocked embed (Storybook `core-webpreview--blocked-embed`)
- Controlled navigation (Storybook `core-webpreview--controlled-navigation`)

## Related

`core-linkpreview`

## README

A framed browser for showing a live or generated page inside an interface: back, forward and reload, an editable address bar, open in a new tab, device widths, a sandboxed iframe with a loading state, an optional console, and a LinkPreview card when a site refuses to be framed. Use it for assistant replies that built a page, deploy previews and documentation demos.

### Usage

```jsx
import { WebPreview } from '@gaudi/design-system';

<WebPreview
  defaultUrl='https://preview.example.dev/'
  srcDoc={(url) => generatedPages[url]}
  logs={logs}
  title='Generated landing page'
/>

// The app knows a site refuses framing (its preview endpoint can read X-Frame-Options).
<WebPreview defaultUrl='https://github.com/vercel/next.js' embeddable={false} previewData={payload} />
```

- `url` / `defaultUrl` with `onUrlChange`; `device` / `defaultDevice` (`desktop`, `tablet` 768px, `phone` 390px) with `onDeviceChange`. Narrow screens scroll inside the frame, never the page.
- `srcDoc` renders generated HTML; a function `(url) => html | null` serves several pages so the address bar works offline.
- `logs` (`{ level: 'log' | 'info' | 'warn' | 'error', message, timestamp? }`) shows the console; the host collects them (for example over `postMessage`), the preview never reads the framed page.
- `sandbox` defaults to `allow-scripts allow-forms allow-popups allow-presentation allow-modals`. `allow-same-origin` is left out on purpose: with scripts it would let the page reach the host.
- The address bar adds `https://` to bare hosts and refuses `javascript:`, `data:` and `file:` addresses (`normalizeWebPreviewUrl`).

### Parts

Compose `WebPreviewRoot`, `WebPreviewNavigation`, `WebPreviewHistoryButtons`, `WebPreviewNavigationButton`, `WebPreviewUrl`, `WebPreviewOpenButton`, `WebPreviewDevices`, `WebPreviewBody` and `WebPreviewConsole` for a different toolbar; `useWebPreview()` reads the state. The history, address and log rules are pure functions in the same entry.

### Accessibility

The controls sit in a labelled toolbar with named buttons and tooltips, the address bar is a labelled field that reports unusable input in an alert, the width toggle is a radio group, the iframe has a `title`, the body is `aria-busy` while loading, and the console is a disclosure over a `role="log"` list whose toggle names errors and warnings.
