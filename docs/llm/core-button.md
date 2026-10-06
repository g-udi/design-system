# Button

> Core/Button · core · `@gaudi/design-system/core/Button`

Button renders the Gaudi action and link-button variants.

## Import

```js
import Button from '@gaudi/design-system/core/Button';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `buttonSizes`, `buttonToneAliases`, `buttonTones`, `buttonVariants`, `default`, `variants`

## When to use

- Use `solid` with `accent` for the one primary action in a local group.
- Use `outline` or `soft` with `neutral` for secondary actions that still need a visible target.
- Use `ghost`, `subtle`, or inline Link for quiet navigation and toolbar actions.
- Choose semantic tones by meaning: `success`, `warning`, `danger`, `attention`, `discovery`, or `info`.

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Visible button label or content. |
| `variant` | `solid \| soft \| outline \| ghost \| subtle` | `solid` | no | Reusable visual treatment. |
| `size` | `xs \| sm \| md \| lg \| icon \| icon-xs \| icon-sm \| icon-lg` | `md` | no | Compact heights: xs 24px, sm 28px, md/default 32px, lg 36px. Icon sizes match their text-button counterparts. Use matching sizes for controls in the same row. |
| `tone` | `accent \| neutral \| success \| warning \| danger \| attention \| discovery \| info` | `accent (solid, subtle); neutral (soft, outline, ghost)` | no | Semantic meaning for the action. Quiet variants default to neutral so screens do not turn blue. Legacy hue names remain supported as compatibility aliases. |
| `radius` | `sm \| md \| lg \| full` | `md` | no | Legacy aliases use the global --ds-radius setting (4px by default); none stays square where supported. |
| `href` | `string` | — | no | Renders an internal Next link or safe external anchor. |
| `disabled` | `boolean` | `false` | no | Disables native buttons and removes disabled links from the tab order. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `variant`: `solid`, `soft`, `outline`, `ghost`, `subtle`
- `size`: `xs`, `sm`, `md`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- `tone`: `accent`, `neutral`, `success`, `warning`, `danger`, `attention`, `discovery`, `info`
- `radius`: `sm`, `md`, `lg`, `full`

## Usage

```jsx
import { Button } from '@gaudi/design-system';

<Button variant='solid' tone='accent' size='md'>Read article</Button>
```

## Accessibility

Button renders native buttons for actions and links for navigation. Disabled link variants are removed from tab order.

## Examples

- Playground (Storybook `core-button--playground`)
- Variants, tones and sizes (Storybook `core-button--variants`)
- Links and disabled (Storybook `core-button--states`)

Curated patterns:

- Async loading and success — registry item `@gaudi/button-async-success` (uses `Button`, `LoaderRoot`, `RegistryIcon`)
- Avatar and two-line content — registry item `@gaudi/button-avatar-two-line` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `RegistryIcon`)
- Copy with feedback — registry item `@gaudi/button-copy-feedback` (uses `Button`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `useCopyToClipboard`)
- Counts, badges and shortcuts — registry item `@gaudi/button-counts-shortcuts` (uses `Badge`, `Button`, `KbdGroup`, `KbdRoot`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Icons, loading and links — registry item `@gaudi/button-icons-loading` (uses `Button`, `LoaderRoot`, `RegistryIcon`)
- Social sign-in — registry item `@gaudi/button-social-sign-in` (uses `Button`, `RegistryIcon`)
- Toggling icon and label — registry item `@gaudi/button-toggling-label` (uses `Button`, `RegistryIcon`, `cn`)

## Related

`core-link`, `core-icon`

## README

A button starts an action: submit a form, save a draft, open a dialog. Pass `href` to get a link that looks like a button.

```jsx
import { Button } from '@gaudi/design-system';

<Button variant='outline' tone='neutral'>Cancel</Button>
<Button>Publish article</Button>
```

- `variant` sets the hierarchy: `solid` for the one primary action, `outline` or `soft` for supporting actions, `ghost` and `subtle` for low-emphasis ones.
- `tone` carries meaning (`accent`, `neutral`, `danger`, `success`, `warning`, `info`, `attention`, `discovery`). Pick it by intent, not colour.
- Sizes share heights with inputs and selects: `xs` 24px, `sm` 28px, `md` 32px, `lg` 36px. Icon-only buttons use `icon-xs`, `icon-sm`, `icon`, `icon-lg` and need an `aria-label`.
- `href` renders an internal link, or a new-tab anchor for external URLs. `disabled` works on both buttons and links.
- `asChild` passes the button styles to your own element, such as a router link.
