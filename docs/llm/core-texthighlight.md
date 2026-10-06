# TextHighlight

> Core/TextHighlight · core · `@gaudi/design-system/core/TextHighlight`

TextHighlight emphasizes short inline phrases inside prose.

Use TextHighlight sparingly inside article copy or compact editorial headings when a phrase needs emphasis without becoming a link, button, or badge.

## Import

```js
import { TextHighlight } from '@gaudi/design-system/core/TextHighlight';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `TextHighlight`, `textHighlightVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Inline text to emphasize. |
| `variant` | `marker \| soft \| underline` | `marker` | no | Highlight treatment. |
| `tone` | `gray \| neutral \| blue \| teal \| green \| amber \| yellow \| red \| rose \| indigo` | `blue` | no | Color family. |
| `animate` | `boolean` | `true` | no | Enables the marker draw animation. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `variant`: `marker`, `soft`, `underline`
- `tone`: `gray`, `neutral`, `blue`, `teal`, `green`, `amber`, `yellow`, `red`, `rose`, `indigo`

## Usage

```jsx
import { TextHighlight } from '@gaudi/design-system';

<p>Design systems make <TextHighlight>consistency visible</TextHighlight>.</p>
```

## Accessibility

TextHighlight is inline text emphasis. It must keep the original text readable and must not be the only way meaning is conveyed.

## Examples

- Playground (Storybook `core-texthighlight--playground`)
- Tones (Storybook `core-texthighlight--tones`)

## Related

`mdx-highlight`
