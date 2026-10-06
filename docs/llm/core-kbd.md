# Kbd

> Core/Kbd · core · `@gaudi/design-system/core/Kbd`

Kbd renders keyboard keys and multi-key shortcuts.

## Import

```js
import Kbd from '@gaudi/design-system/core/Kbd';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `KbdGroup`, `KbdRoot`, `default`, `kbdVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Single visible key when keys is not provided. |
| `keys` | `string \| string[]` | — | no | Shortcut list such as "command,shift,k". |
| `size` | `xs \| sm \| md \| lg` | `md` | no | Controls key dimensions and text size. |
| `variant` | `raised \| outline \| flat` | `raised` | no | Visual keycap treatment. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `size`: `xs`, `sm`, `md`, `lg`
- `variant`: `raised`, `outline`, `flat`

## Usage

```jsx
import { Kbd } from '@gaudi/design-system';

<Kbd keys='command,shift,k' size='sm' variant='raised' />
```

## Accessibility

Keyboard shortcuts expose readable aria-label text such as Command plus K while keeping visual symbols compact.

## Examples

- Playground (Storybook `core-kbd--playground`)
- Key Set (Storybook `core-kbd--key-set`)
- Variants and sizes (Storybook `core-kbd--variants`)

Curated patterns:

- Shortcuts in controls — registry item `@gaudi/kbd-in-controls` (uses `Button`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `KbdGroup`, `KbdRoot`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Keys, groups and icons — registry item `@gaudi/kbd-keys-groups` (uses `KbdGroup`, `KbdRoot`, `RegistryIcon`)

## README

A keyboard key or shortcut hint, such as "Press ⌘ K to search".

```jsx
import { Kbd } from '@gaudi/design-system';

Press <Kbd keys='command,k' size='sm' /> to search
```

- `keys` takes comma-separated key names (`command`, `shift`, `enter`, `escape`, `up`…) or an array of them (`['command', 'k']`). Named keys show as symbols, and a combination is announced as one label ("Command plus K").
- `children` render one literal key with no extra label.
- `variant`: `raised` (default) for standalone hints, `outline` or `flat` inside dense UI. `size`: `xs`, `sm`, `md`, `lg`.
- For custom content such as icons, compose `KbdRoot` and `KbdGroup`; inside a tooltip they pick up its colours.
