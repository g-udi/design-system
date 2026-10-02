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

// The app owns the endpoint; Gaudi never fetches third-party pages.
<SiteConfigProvider preview={{ endpoint: '/api/preview' }}>{children}</SiteConfigProvider>
```

## What each link shows

`normalizeLinkPreview(data, { url, title, screenshotFallback, locale })` returns `{ kind, status, unavailable, title, linkTitle, description, excerpt, image, favicon, icon, site, label, author, date, formattedDate, readingTime, duration, tags, stats, meta, videoId, embeddable }`. The payload `type` wins; otherwise the URL decides the kind:

| Kind | Detected from | Rich information |
| --- | --- | --- |
| `internal` | `type: 'internal'` or an app path (`/blog/…`) | Category badge, post title, summary, date, reading time, tags. No image. |
| `repository` | `github.com` | `owner/repo` title, GitHub Open Graph card, language, stars and forks when the endpoint supplies them. |
| `video` | YouTube, youtu.be, Vimeo | Thumbnail with a play badge and duration chip, channel, views. |
| `social` | x.com, twitter.com, bsky.app | Author handle (from the URL when missing), the post text, replies and likes. |
| `wikipedia` | `wikipedia.org` | Article name and excerpt instead of an image. |
| `package` | `npmjs.com` (synthesized, no fetch) | Package name, npm icon, version. |
| `docs` | MDN, `docs.*`, readthedocs, `/docs` paths | Cleaned title (site suffixes removed), description. |
| `image` / `file` | Image or document extensions | The image itself / the file type badge (PDF, CSV…). |
| `article` | Medium, Substack, dev.to, or any payload with an author or published time | Author, date, reading time. |
| `website` | Everything else | Title, description, image, site name. |

Titles drop noisy suffixes (` - MDN Web Docs`, ` - YouTube`, ` · GitHub`…) and cap at 60 characters. Failures with status 400, 404 or 410 are `unavailable` and render a red link named "(link may be unavailable)"; other failures and missing endpoints render an ordinary link. The screenshot service is only used with `screenshotFallback` (the MDX adapter turns it on to match the blog).

## Data

`usePreviewData(url, title, { previewData, endpoint, timeout })` calls the endpoint (`endpoint` option, then `SiteConfigProvider preview.endpoint`, then `/api/preview`; `null` disables it) with an LRU + TTL cache, request deduplication and a stale-response guard. A string endpoint receives `?url=`; a function returns the full request URL.

## Parts

`LinkPreviewBody`, `LinkPreviewCard`, `LinkPreviewCompact`, `LinkPreviewMedia`, `LinkPreviewMeta`, `LinkPreviewTags`, `LinkPreviewFavicon`, `LinkPreviewSkeleton` and `LinkPreviewFallback` take the normalised `preview` and can be composed into other surfaces (chat sources, link lists).

## Accessibility

Every variant is a real link with a readable name, so the destination never depends on the card. The hover card opens on focus as well as hover and only adds detail. Stats are read with their unit ("1.3K stars"), and images inside cards are decorative except for image links.
