# Footnote

> MDX/Footnote · mdx · `@gaudi/design-system/mdx/Footnote`

Footnote hydrates generated markdown footnote references with hover and focus popover previews.

Authors do not write a React component for each footnote. They write standard markdown footnote syntax in the post. The blog MDX pipeline extracts the definitions, enhances the generated footnote reference anchors with `data-footnote-*` attributes, and may visually collapse the bottom notes section. Gaudi only owns the small client runtime that reads those generated attributes and shows the preview popover on hover or keyboard focus.

## Import

```js
import Footnote from '@gaudi/design-system/mdx/Footnote';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Runtime contract

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Footnote` | `Runtime component; no props` | — | no | Enhances generated article markup. Mount once per article runtime. |

## Authoring Example

```jsx
Inline prose can use a normal markdown footnote reference.[^model-note]

[^model-note]: This explanatory note can include links, emphasis, and short supporting context.

<!-- Runtime wiring lives outside the post:
app layout/page shell: <MDXLayoutRenderer ... />
article runtime: <Footnote />
-->

<!-- The blog pipeline generates anchors with data-footnote-popover, data-footnote-number, and data-footnote-content. -->
```

## Accessibility

Generated footnote references are real anchors, so readers can still jump to the notes list. `Footnote` adds hover and focus previews without replacing the underlying link or removing the accessible footnote relationship.

## Notes

- `Footnote` listens for `mouseenter`, `mouseleave`, `focusin`, and `focusout` on generated links marked with `data-footnote-popover="true"`.
- The popover body is read from generated `data-footnote-content`, so the plugin must sanitize and serialize the note content before runtime.
- The component positions the popover next to the reference and flips left when it would overflow the viewport.
- The visible footnotes list remains the source of truth; the popover is a reading convenience.

## Do

- Write standard markdown footnotes with `[^id]` references and `[^id]: note text` definitions.
- Let `remarkFootnoteData` extract note content and let `rehypeFootnotePopoverV2` attach popover data to generated reference links.
- Use `Footnote` as a page-level runtime binder after the article has rendered.
- Keep footnote copy short enough for a compact popover; long supporting material belongs in the visible footnotes section.

## Don’t

- Do not hand-write `data-footnote-*` attributes in article MDX.
- Do not use `<Footnote />` as an inline MDX component or wrapper around footnote text.
- Do not hide the underlying footnote references without preserving anchor navigation and focus behavior.

## Consumer responsibilities

- Enable markdown footnotes in the blog MDX pipeline with `remarkGfm`.
- Run `remarkFootnoteData` before rehype so footnote definitions are available on `file.data.footnotes`.
- Run `rehypeFootnotePopoverV2` after footnotes are converted to HTML so reference anchors receive `data-footnote-popover`, `data-footnote-number`, and `data-footnote-content`.
- Mount `Footnote` once near the rendered MDX article, not inside the MDX document itself.

## Examples

- Playground (Storybook `mdx-footnote--playground`)
