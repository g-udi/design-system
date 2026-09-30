# Separator

A thin rule that divides content horizontally or vertically.

```jsx
import { Separator } from '@gaudi/design-system';

<Separator />
<Separator orientation='vertical' />
```

- Separators are decorative by default and hidden from assistive technology. Set `decorative={false}` when the rule marks a real change of section, so it is announced as a separator.
- Vertical separators stretch to the height of their flex row; give them a height to keep them shorter.
