# ButtonGroup

A button group joins related buttons into one control: a toolbar, a split button, a pager, or an input with its action.

```jsx
import { Button, ButtonGroup, ButtonGroupSeparator } from '@gaudi/design-system';

<ButtonGroup aria-label='Reply'>
  <Button>Reply all</Button>
  <ButtonGroupSeparator />
  <Button size='icon' aria-label='More reply options'>…</Button>
</ButtonGroup>
```

- Give each group an `aria-label` so assistive tech announces what the buttons do together.
- `orientation='vertical'` stacks the buttons; turn any `ButtonGroupSeparator` to `horizontal` with it.
- `ButtonGroupText` holds a label or value (such as "Page 2 of 26") inside the group.
- Groups can hold inputs and selects, and can nest to keep a small gap between sets.
