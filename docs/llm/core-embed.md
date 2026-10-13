# Embed

> Core/Embed · core · `@gaudi/design-system/core/Embed`

The shared preview vocabulary for messages and content: one switch that hands each piece of content to its owner. Links go to LinkPreview, code to CodeBlock, generated pages to WebPreview; images and videos default to a LinkPreview card until you pass a renderer.

## Import

```js
import Embed from '@gaudi/design-system/core/Embed';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`, `embedTypes`, `resolveEmbedType`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `auto \| link \| web \| code \| image \| video` | `auto` | no | What to render; auto decides from code, html and the address. |
| `url / src` | `string` | — | no | Link, page or media address. |
| `code / language / filename` | `string` | — | no | Code for CodeBlock. |
| `html` | `string` | — | no | Generated HTML for WebPreview. |
| `title / alt` | `string` | — | no | Link text or page title; image alternative text. |
| `previewData` | `object` | — | no | Static link metadata. |
| `variant` | `card \| compact \| inline` | `card` | no | LinkPreview presentation for links and media. |
| `components` | `{ link?, web?, code?, image?, video? }` | `{}` | no | Renderer overrides, for example a lightbox image or a video player. |
| `codeProps / webPreviewProps / linkPreviewProps` | `object` | — | no | Passed to the owner. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `type`: `auto`, `link`, `web`, `code`, `image`, `video`
- `variant`: `card`, `compact`, `inline`

## Usage

```jsx
import { Embed } from '@gaudi/design-system';

<>
<Embed url='https://github.com/g-udi/design-system' />
<Embed code={source} language='html' filename='index.html' />
<Embed url='https://preview.example.dev/' html={generatedHtml} title='Generated page' />
<Embed src='/images/diagram.png' alt='Architecture diagram' components={{ image: ImageWithLightbox }} />
</>
```

## Accessibility

Embed adds no markup of its own beyond a wrapper; accessibility comes from the owner it renders. Give images alt text and generated pages a title.

## Notes

- resolveEmbedType(content) is pure, so a message parser can classify parts before rendering.

## Examples

- Playground (Storybook `core-embed--playground`)

## Related

`core-linkpreview`, `core-codeblock`, `core-webpreview`, `core-link`, `mdx-code`

## README

The shared preview vocabulary for messages and content. `Embed` is a thin switch that hands each piece of content to the owner that already renders it, so a chat reply, an article and a dashboard show links, code and pages the same way.

| Type | Rendered by |
| --- | --- |
| `link` | `LinkPreview` (`variant` card, compact or inline) |
| `code` | `CodeBlock` |
| `web` | `WebPreview` (generated HTML through `html`, or a live `url` with `type='web'`) |
| `image` | A LinkPreview image card, or `components.image` (for example a lightbox image) |
| `video` | A LinkPreview thumbnail card, or `components.video` (for example the MDX Video) |

`type='auto'` (default) picks from the content: `code` means code, `html` means a page, an image or video address means media, anything else is a link. `resolveEmbedType(content)` is the same rule as a pure function.

### Usage

```jsx
import { Embed } from '@gaudi/design-system';

<Embed url='https://github.com/g-udi/design-system' />
<Embed code={source} language='html' filename='index.html' />
<Embed url='https://preview.example.dev/' html={generatedHtml} title='Generated page' />
<Embed src='/images/diagram.png' alt='Architecture diagram' components={{ image: ImageWithLightbox }} />
```

Core does not import the MDX `Image` or `Video` (they stay in the `./mdx` entry), which is why media renderers are passed in rather than built in.

### Accessibility

Embed adds only a wrapper (`span` for inline links); accessibility comes from the owner it renders. Give images `alt` text and generated pages a `title`.
