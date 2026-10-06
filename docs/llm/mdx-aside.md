# Aside

> MDX/Aside · mdx · `@gaudi/design-system/mdx/Aside`

Supporting article content outside the main reading flow.

## Import

```js
import Aside from '@gaudi/design-system/mdx/Aside';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
<Aside>
  Additional context for the article that should sit outside the main argument.
</Aside>
```

## Accessibility

Keep the aside understandable in document order and give distinct sections headings when needed.

## Examples

- Playground (Storybook `mdx-aside--playground`)
