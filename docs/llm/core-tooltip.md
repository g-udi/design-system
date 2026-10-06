# Tooltip

> Core/Tooltip · core · `@gaudi/design-system/core/Tooltip`

Brief contextual help attached to an independently labelled control.

## Import

```js
import Tooltip from '@gaudi/design-system/core/Tooltip';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactElement` | `Required` | no | Single focusable, ref-forwarding trigger. |
| `content` | `ReactNode` | — | no | Supporting tooltip text. |
| `side` | `top \| right \| bottom \| left` | `top` | no | Preferred placement; collision handling may adjust it. |
| `delayDuration` | `number` | `300` | no | Hover delay in milliseconds. |
| `open / defaultOpen / onOpenChange` | `boolean / function` | `uncontrolled` | no | Controlled or initial visibility. |

## Variants

- `side`: `top`, `right`, `bottom`, `left`

## Usage

```jsx
import Tooltip from '@gaudi/design-system/core/Tooltip';
import Button from '@gaudi/design-system/core/Button';

<Tooltip content='Copy link'><Button aria-label='Copy link' onClick={copyLink}>Copy</Button></Tooltip>
```

## Accessibility

Tooltips open on focus and hover, dismiss with Escape and do not replace the control’s accessible name. Use Popover for interactive content.

## Examples

- Playground (Storybook `core-tooltip--playground`)

Curated patterns:

- Disabled button — registry item `@gaudi/tooltip-disabled-button` (uses `Button`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- People — registry item `@gaudi/tooltip-people` (uses `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Sides — registry item `@gaudi/tooltip-sides` (uses `Button`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Status and metadata — registry item `@gaudi/tooltip-status-metadata` (uses `Badge`, `Button`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)

## Related

`core-popover`

## README

Short, supplementary hints for named controls. Pass content and a single ref-forwarding trigger. Keep it to short text; use a Popover when the content needs a link or a button.

### Usage

```jsx
import Tooltip from '@gaudi/design-system/core/Tooltip';

<Tooltip content='Copy a link to this article'>
  <Button variant='outline' tone='neutral'>
    Copy link
  </Button>
</Tooltip>;
```

### Accessibility

Opens on focus and hover and closes with Escape. The trigger still needs its own accessible name; use Dialog or Popover for interactive details.

### Composition

`TooltipProvider`, `TooltipRoot`, `TooltipTrigger` and `TooltipContent` build custom tooltips; the `Tooltip` component is those parts with one trigger and one hint. Mount one `TooltipProvider` around a toolbar so moving between buttons skips the delay.
