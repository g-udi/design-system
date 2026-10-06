# Kbd

A keyboard key or shortcut hint, such as "Press ⌘ K to search".

```jsx
import { Kbd } from '@gaudi/design-system';

Press <Kbd keys='command,k' size='sm' /> to search
```

- `keys` takes comma-separated key names (`command`, `shift`, `enter`, `escape`, `up`…) or an array of them (`['command', 'k']`). Named keys show as symbols, and a combination is announced as one label ("Command plus K").
- `children` render one literal key with no extra label.
- `variant`: `raised` (default) for standalone hints, `outline` or `flat` inside dense UI. `size`: `xs`, `sm`, `md`, `lg`.
- For custom content such as icons, compose `KbdRoot` and `KbdGroup`; inside a tooltip they pick up its colours.
