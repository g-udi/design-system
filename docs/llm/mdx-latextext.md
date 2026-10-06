# LatexText

> MDX/LatexText · mdx · `@gaudi/design-system/mdx/LatexText`

Render inline mathematical notation inside text.

## Import

```js
import LatexText from '@gaudi/design-system/mdx/LatexText';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `style` | `CSSProperties` | — | no | Additional inline styling. |

## Usage

```jsx
<LatexText>11$^{th}$ International Conference</LatexText>
```

## Accessibility

Provide surrounding prose that explains the notation and preserves the reading flow.

## Examples

- Playground (Storybook `mdx-latextext--playground`)
