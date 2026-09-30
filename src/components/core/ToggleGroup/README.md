# ToggleGroup

A toggle group lets people pick one option (a view mode) or several (filters, formatting) from a short set of buttons.

```jsx
import { ToggleGroup } from '@gaudi/design-system';

<ToggleGroup
  label='Collection view'
  defaultValue='list'
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board', disabled: true }
  ]}
/>
```

- `type='single'` (default) keeps one value and allows clearing it; `type='multiple'` keeps an array.
- `variant` (`outline` or `default`), `size` (`sm`, `default`, `lg`) and `spacing` (0 attaches the items) change the look.
- Icon-only options need an `ariaLabel`.
- For custom item content, compose `ToggleGroupRoot` and `ToggleGroupItem`; use `Toggle` for a single on/off button.
- Arrow keys move between options and skip disabled ones.
