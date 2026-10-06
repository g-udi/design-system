# Quote

> MDX/Quote · mdx · `@gaudi/design-system/mdx/Quote`

An editorial quotation with attribution and an optional portrait.

## Import

```js
import Quote from '@gaudi/design-system/mdx/Quote';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text / author / title` | `string` | — | no | Quotation and attribution. |
| `image / imageAlt` | `string` | — | no | Optional portrait source and alternative text. |

## Usage

```jsx
<Quote text='Good component systems make product code calmer.' author='Design System' />
```

## Accessibility

The quotation uses blockquote semantics. Keep attribution readable and avoid repeating the author in decorative image text.

## Examples

- Playground (Storybook `mdx-quote--playground`)
