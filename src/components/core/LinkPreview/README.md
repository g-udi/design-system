# LinkPreview

A link enriched with what the destination is. One pure normaliser, `normalizeLinkPreview`, turns the app's preview payload into a display model, and three variants present it:

- `inline` (default): the link text, with a rich card on hover or focus. This is what the blog's MDX `Preview` renders.
- `card`: a Card with the Open Graph image, `orientation` vertical or horizontal; the title links to the destination.
- `compact`: a one-line row with the favicon, title, host and leading metadata.

## Usage

```jsx
import { LinkPreview, SiteConfigProvider } from '@gaudi/design-system';

<p>The source is in <LinkPreview url='https://github.com/ahmadassaf/design-system' title='Gaudi on GitHub' />.</p>

<LinkPreview url='https://www.youtube.com/watch?v=qh3NGpYRG3I' variant='card' previewData={payload} />
<LinkPreview url='https://medium.com/@ahmadassaf/knowledge-graphs' variant='compact' />

// The app owns the endpoint and any derived images; Gaudi loads nothing by default.
<SiteConfigProvider preview={{ endpoint: '/api/preview', resolveImage }}>{children}</SiteConfigProvider>
```

## What each link shows

`normalizeLinkPreview(data, { url, title, resolveImage, locale })` returns `{ kind, status, unavailable, title, linkTitle, description, excerpt, image, favicon, icon, site, label, author, date, formattedDate, readingTime, duration, tags, stats, meta, videoId, embeddable }`. The payload `type` wins; otherwise the URL decides the kind:

| Kind | Detected from | Rich information |
| --- | --- | --- |
| `internal` | `type: 'internal'` or an app path (`/blog/…`) | Category badge, post title, summary, date, reading time, tags. No image. |
| `repository` | `github.com` | `owner/repo` title, image (payload or `resolveImage`), language, stars and forks when the endpoint supplies them. |
| `video` | YouTube, youtu.be, Vimeo | Thumbnail with a play badge and duration chip, channel, views. |
| `social` | x.com, twitter.com, bsky.app | Author handle (from the URL when missing), the post text, replies and likes. |
| `wikipedia` | `wikipedia.org` | Article name and excerpt instead of an image. |
| `package` | `npmjs.com` (synthesized, no fetch) | Package name, package icon, version. |
| `docs` | MDN, `docs.*`, readthedocs, `/docs` paths | Cleaned title (site suffixes removed), description. |
| `image` / `file` | Image or document extensions | The image itself / the file type badge (PDF, CSV…). |
| `article` | Medium, Substack, dev.to, or any payload with an author or published time | Author, date, reading time. |
| `website` | Everything else | Title, description, image, site name. |

Titles drop noisy suffixes (` - MDN Web Docs`, ` - YouTube`, ` · GitHub`…) and cap at 60 characters. Failures with status 400, 404 or 410 are `unavailable` and render a red link named "(link may be unavailable)"; other failures and missing endpoints render an ordinary link. Gaudi derives no images of its own; see [Images](#images).

## Data

`usePreviewData(url, title, { previewData, endpoint, timeout })` calls the endpoint (`endpoint` option, then `SiteConfigProvider preview.endpoint`) with an LRU + TTL cache, request deduplication and a stale-response guard. A string endpoint receives `?url=`; a function returns the full request URL. **There is no default endpoint**: with none configured nothing is fetched, and links render from `previewData` or as plain links. Stories and tests pass static `previewData`.

## Images

A card shows the payload's `image`, or the link itself when it points at an image. Gaudi ships no thumbnail, Open Graph or screenshot service URLs. For anything else, pass `resolveImage` (prop, or `SiteConfigProvider preview.resolveImage`); it is called for links whose payload has no image with `{ kind, url, host, data, videoId, repository }` (`videoId` for YouTube links, `repository: { owner, repo }` for GitHub links) and returns an image URL or `null`. Instead of a function, `resolveImage` can be a template map: link kinds (`video`, `repository`, `website`, `article`…, plus `default`) to URL templates with `{url}` (encoded), `{rawUrl}`, `{host}`, `{videoId}`, `{owner}` and `{repo}`. A kind mapped to `null` shows no image, and a template whose placeholder has no value yields none. Templates are plain data, so a server component can pass them. Without a resolver those links show no image.

## Migrating from the built-in defaults (2026-10-02)

Earlier versions called `/api/preview` without being asked, derived YouTube thumbnails and GitHub Open Graph cards from the URL, used a Microlink screenshot when the MDX `Preview` had no image, and gave npm links a favicon from npmjs.com. Those defaults are gone, along with the `MICROLINK_SCREENSHOT_API`, `YOUTUBE_THUMBNAIL_API`, `GITHUB_OPENGRAPH_API`, `NPM_FAVICON_URL` and `DEFAULT_PREVIEW_ENDPOINT` exports and the `screenshotFallback` option. An app that wants the old behaviour configures it once:

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

The old screenshot applied only to the MDX `Preview`; with this setting it applies to every LinkPreview without an image. To keep it MDX-only, pass `resolveImage` to the MDX `Preview` map entry instead of the provider.

## Parts

`LinkPreviewBody`, `LinkPreviewCard`, `LinkPreviewCompact`, `LinkPreviewMedia`, `LinkPreviewMeta`, `LinkPreviewTags`, `LinkPreviewFavicon`, `LinkPreviewSkeleton` and `LinkPreviewFallback` take the normalised `preview` and can be composed into other surfaces (chat sources, link lists).

## Accessibility

Every variant is a real link with a readable name, so the destination never depends on the card. The hover card opens on focus as well as hover and only adds detail. Stats are read with their unit ("1.3K stars"), and images inside cards are decorative except for image links.
