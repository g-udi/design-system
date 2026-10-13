# Separator

> Core/Separator · core · `@gaudi/design-system/core/Separator`

Separate related content with a horizontal or vertical rule.

## Import

```js
import { Separator } from '@gaudi/design-system/core/Separator';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Separator`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Direction of the rule. |
| `decorative` | `boolean` | `true` | no | Keep visual-only separators out of the accessibility tree. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `orientation`: `horizontal`, `vertical`

## Usage

```jsx
import { Separator } from '@gaudi/design-system/core/Separator';

<Separator orientation='horizontal' />
```

## Accessibility

Set decorative={false} only when the separator conveys meaningful structure.

## Examples

- Playground (Storybook `core-separator--playground`)

Curated patterns:

- Horizontal rules — registry item `@gaudi/separator-horizontal` (uses `Separator`)
- Text label — registry item `@gaudi/separator-text-label` (uses `Separator`)
- Vertical rules — registry item `@gaudi/separator-vertical` (uses `Link`, `Separator`)

## Related

`core-direction`

## README

A thin rule that divides content horizontally or vertically.

```jsx
import { Separator } from '@gaudi/design-system';

<Separator />
<Separator orientation='vertical' />
```

- Separators are decorative by default and hidden from assistive technology. Set `decorative={false}` when the rule marks a real change of section, so it is announced as a separator.
- Vertical separators stretch to the height of their flex row; give them a height to keep them shorter.
