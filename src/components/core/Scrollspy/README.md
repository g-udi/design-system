# Scrollspy

Highlights the link for the section currently in view and scrolls to a section when its link is clicked. Use it for a table of contents beside a long document or a scrollable panel.

```jsx
import { useRef } from 'react';
import { ScrollArea, Scrollspy } from '@gaudi/design-system';

const targetRef = useRef(null);

<Scrollspy targetRef={targetRef} offset={44}>
  <button data-scrollspy-anchor='overview'>Overview</button>
  <button data-scrollspy-anchor='usage'>Usage</button>
</Scrollspy>
<div ref={targetRef}>
  <ScrollArea className='h-72'>
    <section id='overview'>…</section>
    <section id='usage'>…</section>
  </ScrollArea>
</div>
```

Each anchor names the id of its section; the active anchor gets `data-active="true"` for styling and `onUpdate` receives its id. `offset` reserves room for a sticky header, `smooth` animates the jump, and `history` (off by default) writes the active section to the URL hash. Point `targetRef` at `document` to follow the page scroll.
