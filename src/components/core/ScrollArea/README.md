# ScrollArea

A fixed-size region with styled scrollbars, for content that must scroll inside a card or panel instead of stretching the page.

```jsx
import { ScrollArea, ScrollBar } from '@gaudi/design-system';

<ScrollArea aria-label='Changelog' className='h-72 rounded-lg border'>
  {releases}
</ScrollArea>
```

- `type` controls when scrollbars show: `hover` (default), `auto`, `always`, or `scroll`.
- Add `<ScrollBar orientation='horizontal' />` inside for content wider than the frame.
- The viewport is focusable so keyboard users can scroll it. Give it an `aria-label` that names the content.
