# Icon

Icons from the Gaudi registry at token sizes and semantic colours. Pass `label` when the icon carries meaning on its
own, or `decorative` when text beside it already does. `kind` with `href` renders a labelled social or email link.

```jsx
import { AnimatedIcon, Icon, IconStack, IconTile } from '@gaudi/design-system';

<Icon name='Info' size='lg' color='primary' label='More information' />
<IconTile variant='soft' size='lg'><Icon name='Star' decorative /></IconTile>
<AnimatedIcon name='Bell' active={hovered} size='md' color='primary' />
```

- `IconTile` frames an icon as media in lists, cards and empty states (`outline`, `elevated`, `soft`, `solid`, `frame`;
  sizes `xs` to `xl`; `radius='full'` for circles). Retint it with text and background tokens.
- `IconStack` draws a layered stack of cards behind an icon for empty and onboarding states.
- `AnimatedIcon` moves only while the host sets `active`, and rests for reduced motion, offscreen placement and hidden documents.
