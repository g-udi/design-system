# Embed

The shared preview vocabulary for messages and content. `Embed` is a thin switch that hands each piece of content to the owner that already renders it, so a chat reply, an article and a dashboard show links, code and pages the same way.

| Type | Rendered by |
| --- | --- |
| `link` | `LinkPreview` (`variant` card, compact or inline) |
| `code` | `CodeBlock` |
| `web` | `WebPreview` (generated HTML through `html`, or a live `url` with `type='web'`) |
| `image` | A LinkPreview image card, or `components.image` (for example a lightbox image) |
| `video` | A LinkPreview thumbnail card, or `components.video` (for example the MDX Video) |

`type='auto'` (default) picks from the content: `code` means code, `html` means a page, an image or video address means media, anything else is a link. `resolveEmbedType(content)` is the same rule as a pure function.

## Usage

```jsx
import { Embed } from '@gaudi/design-system';

<Embed url='https://github.com/g-udi/design-system' />
<Embed code={source} language='html' filename='index.html' />
<Embed url='https://preview.example.dev/' html={generatedHtml} title='Generated page' />
<Embed src='/images/diagram.png' alt='Architecture diagram' components={{ image: ImageWithLightbox }} />
```

Core does not import the MDX `Image` or `Video` (they stay in the `./mdx` entry), which is why media renderers are passed in rather than built in.

## Accessibility

Embed adds only a wrapper (`span` for inline links); accessibility comes from the owner it renders. Give images `alt` text and generated pages a `title`.
