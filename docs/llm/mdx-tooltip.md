# Tooltip

> MDX/Tooltip · mdx · `@gaudi/design-system/mdx/Tooltip`

Supplementary explanations for a term in article prose.

## Import

```js
import Tooltip from '@gaudi/design-system/mdx/Tooltip';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `message` | `ReactNode` | — | no | Tooltip explanation. |
| `text / children` | `ReactNode` | — | no | Visible trigger text. |

## Usage

```jsx
A <Tooltip message='Compact supporting context.'>technical term</Tooltip> can carry a short explanation.
```

## Accessibility

Keep essential information in the article. The trigger must remain discoverable and keyboard accessible.

## Examples

- Playground (Storybook `mdx-tooltip--playground`)

## Related

`core-tooltip`
