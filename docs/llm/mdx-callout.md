# Callout

> MDX/Callout · mdx · `@gaudi/design-system/mdx/Callout`

Highlight an article note, tip, warning or error while preserving readable prose.

## Import

```js
import Callout from '@gaudi/design-system/mdx/Callout';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `info \| warning \| error` | `info` | no | Semantic message tone. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `classNames` | `Record<string, string>` | `{}` | no | Slot class overrides. |

## Variants

- `type`: `info`, `warning`, `error`

## Usage

```jsx
<Callout type='info'>
  Useful article context that readers should notice before continuing.
</Callout>
```

## Accessibility

Text carries the meaning; color and icons support it.

## Examples

- Playground (Storybook `mdx-callout--playground`)

## Related

`mdx-highlight`
