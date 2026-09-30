# Button

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
