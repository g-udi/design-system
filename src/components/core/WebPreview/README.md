# WebPreview

A framed browser for showing a live or generated page inside an interface: back, forward and reload, an editable address bar, open in a new tab, device widths, a sandboxed iframe with a loading state, an optional console, and a LinkPreview card when a site refuses to be framed. Use it for assistant replies that built a page, deploy previews and documentation demos.

Inspired by the Vercel AI Elements web preview and the shadcn.io "AI message with web preview" block (Apache-2.0 / MIT); rebuilt on Gaudi's Button, Tooltip, InputGroup, ToggleGroup, Collapsible, Spinner and LinkPreview.

## Usage

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

## Parts

Compose `WebPreviewRoot`, `WebPreviewNavigation`, `WebPreviewHistoryButtons`, `WebPreviewNavigationButton`, `WebPreviewUrl`, `WebPreviewOpenButton`, `WebPreviewDevices`, `WebPreviewBody` and `WebPreviewConsole` for a different toolbar; `useWebPreview()` reads the state. The history, address and log rules are pure functions in the same entry.

## Accessibility

The controls sit in a labelled toolbar with named buttons and tooltips, the address bar is a labelled field that reports unusable input in an alert, the width toggle is a radio group, the iframe has a `title`, the body is `aria-busy` while loading, and the console is a disclosure over a `role="log"` list whose toggle names errors and warnings.
