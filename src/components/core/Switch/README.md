# Switch

A toggle for a setting that takes effect immediately, such as notifications or dark mode. Use a Checkbox when the choice is only saved with a form.

## Usage

```jsx
import { Switch } from '@gaudi/design-system';

<Switch label='Email notifications' size='md' checked={enabled} onCheckedChange={setEnabled} />;
```

`size` is `sm`, `md` or `lg`. For rows with icons and descriptions, compose `SwitchRoot` (sizes `sm`, `default`, `lg`) with the Field parts.

## Accessibility

The control is a `switch` with `aria-checked`, toggled by Space or a click on its label.
