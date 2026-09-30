# AspectRatio

Keeps media at a fixed width-to-height ratio as its container resizes, so images and video do not shift the layout while they load.

```jsx
import { AspectRatio } from '@gaudi/design-system';

<AspectRatio ratio={16 / 9} className='overflow-hidden rounded-lg border'>
  <img src='/images/art/0.svg' alt='' className='size-full object-cover' />
</AspectRatio>
```

`ratio` is width divided by height (default `1`). Give related media, such as thumbnails in one row, the same ratio.
