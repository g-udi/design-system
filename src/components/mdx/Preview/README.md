# Preview (MDX)

The `<Preview>` element the blog's markdown pipeline generates for links (`remarkLinks` for external links, `rehypeInternalLinks` for internal ones). It is a thin adapter over the Core [LinkPreview](../../core/LinkPreview/README.md): rendering, kinds and the normaliser live there.

```jsx
import { Preview } from '@gaudi/design-system/mdx';

<Preview url='https://assaf.website' title='assaf.website' previewData={payload} />
```

Props: `url`, `title`, `internal`, `previewData`, `showImage`, `defaultOpen`, `timeout`, `variant`, `orientation`, `endpoint`, `resolveImage`, `onLoad`, `onError`, `fallback`, `className`.

## No built-in network access

Gaudi loads nothing on its own. The adapter fetches metadata only from an endpoint the app configures, and shows images only from the payload or the app's `resolveImage`. Without either, links render from `previewData` or as plain links. Stories pass static `previewData`.

## What the blog must add (2026-10-02)

The blog relied on two defaults that were removed: the implicit `/api/preview` endpoint and the Microlink screenshot fallback for pages without an Open Graph image (plus the YouTube thumbnail and GitHub Open Graph card derived from the URL). Pass them once through the layout (or `SiteConfigProvider`):

```jsx
// Plain data, so it can be passed from the server LayoutContainer.
const preview = {
  endpoint: '/api/preview',
  resolveImage: {
    video: 'https://img.youtube.com/vi/{videoId}/maxresdefault.jpg',
    repository: 'https://opengraph.githubassets.com/1/{owner}/{repo}',
    wikipedia: null, // Wikipedia shows its excerpt instead
    default: 'https://api.microlink.io/?url={url}&screenshot=true&meta=false&embed=screenshot.url'
  }
};

<LayoutContainer preview={preview} …>   // or <SiteConfigProvider preview={preview}>
```

`resolveImage` may also be a function `({ kind, url, host, data, videoId, repository }) => string | null`, but a function cannot cross from a server component to the client provider, so the template map is the simplest fit for the blog's server `LayoutContainer`. See the [LinkPreview images notes](../../core/LinkPreview/README.md#images).
