# Hero

A responsive marketing introduction, showcased in **Blocks → Marketing → Heroes**.

```jsx
import { Hero } from '@gaudi/design-system/blocks/Hero';
import Button from '@gaudi/design-system/core/Button';

<Hero
  layout='split'
  title='A good place to start.'
  description='Your content. Shared foundations.'
  actions={<Button href='/start'>Get started</Button>}
  media={<img src='/cover.jpg' alt='Your image description' />}
/>
```

`layout` supports `centered`, `split`, `editorial`, and `background`. Split and editorial layouts stack below a 48rem container width. With no media, split keeps a single content column. Slots accept existing Gaudi components; the block does not own navigation, forms, destinations, or product data. `eyebrow` places a short label, Badge, or mark above the heading without changing the section name. `children` adds supporting content below the actions.

The section labels itself with its heading. Use `headingAs` to fit the document hierarchy. Supply decorative, non-interactive media for `background`; its opaque content panel keeps text readable in both themes. Images require descriptive alt text unless decorative. Button and Link provide the action semantics, focus, and keyboard behavior.

For an animated hero, place the Hero inside a Gaudi background such as `Borealis` or `Grainient`, give the Hero `className='bg-transparent'`, and offer a pause control. Use the dark theme scope for dark effects so text keeps its contrast.
