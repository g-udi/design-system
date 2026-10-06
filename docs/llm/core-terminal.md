# Terminal

> Core/Terminal · core · `@gaudi/design-system/core/Terminal`

Terminal renders mac-style shell examples with typed commands and structured output lines.

## Import

```js
import Terminal from '@gaudi/design-system/core/Terminal';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`, `terminalBodyVariants`, `terminalLineVariants`, `terminalVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `commands` | `Array<string \| { command, output, tone }>` | `example commands` | no | Command history. output can be strings or { text, tone } lines. |
| `outputs` | `Record<number, output[]>` | `{}` | no | Legacy output mapping for string command arrays. |
| `ariaLabel` | `string` | `Terminal` | no | Accessible name for the terminal region. |
| `title` | `string` | `terminal` | no | Header title. |
| `username` | `string` | `ahmad` | no | Prompt username segment. |
| `promptSymbol` | `string` | `$` | no | Prompt separator. |
| `variant` | `dark \| light \| translucent` | `dark` | no | Terminal surface treatment. |
| `size` | `sm \| md \| lg` | `md` | no | Controls max width, body height, and text size. |
| `radius` | `none \| sm \| md \| lg` | `lg` | no | Legacy aliases use the global --ds-radius setting; none keeps square corners. |
| `showHeader` | `boolean` | `true` | no | Shows mac window controls and title. |
| `animate` | `boolean` | `true` | no | Types commands over time unless reduced motion is preferred. |
| `typingSpeed` | `number` | `35` | no | Milliseconds between typed characters. |
| `initialDelay` | `number` | `400` | no | Delay before the first command starts. |
| `delayBetweenCommands` | `number` | `700` | no | Delay after a command before the next command starts. |
| `className` | `string` | — | no | Root class override. |
| `classNames` | `{ root, header, controls, title, body, line, prompt, command, output }` | — | no | Slot-level class overrides. |

## Variants

- `variant`: `dark`, `light`, `translucent`
- `size`: `sm`, `md`, `lg`
- `radius`: `none`, `sm`, `md`, `lg`

## Usage

```jsx
import { Terminal } from '@gaudi/design-system';

<Terminal
  title='blog — zsh'
  username='ahmad'
  commands={[
    { command: 'pnpm test:ds-contracts', output: [{ text: '85 component contracts passed.', tone: 'success' }] },
  ]}
/>
```

## Accessibility

Terminal renders readable command history inside a labelled region. Motion is disabled when users prefer reduced motion.

## Examples

- Playground (Storybook `core-terminal--playground`)
- Legacy Outputs (Storybook `core-terminal--legacy-outputs`)
