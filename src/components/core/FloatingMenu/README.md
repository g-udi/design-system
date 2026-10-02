# FloatingMenu

A compact, inverted pill of destinations that floats over the top of the page once the reader has scrolled away from the site header, with an optional Back to top button. `LayoutContainer` renders it with the SiteConfig `navigation.links`; use it directly for a custom shell or a scrollable panel.

```jsx
import { FloatingMenu } from '@gaudi/design-system';

<FloatingMenu links={[{ href: '/blog', title: 'Blog' }, { href: '/about', title: 'About' }]} />
```

By default the pill appears when the reader scrolls back up past `threshold` (50px) and hides on the way down; `revealOn='scroll'` keeps it visible whenever the threshold is passed. `links` falls back to SiteConfig `navigation.links`; the link matching the current path (or one with `active`) gets `aria-current="page"`. `actions` adds controls such as a call to action after the links, and `backToTop={false}` drops the Back to top button.

Inside a scroll container, pass `targetRef` to observe it and `position='sticky'`, and render the menu as the container's first child:

```jsx
const pageRef = useRef(null);

<div ref={pageRef} className='h-96 overflow-y-auto'>
  <FloatingMenu targetRef={pageRef} position='sticky' links={links} />
  <article>…</article>
</div>
```

## Accessibility

The pill is a navigation landmark named by `label` (Quick navigation). It stays in the tab order while hidden, and focusing any of its controls reveals it, so keyboard users are never stranded. Transitions stop and Back to top jumps instantly when the reader prefers reduced motion. On narrow screens the Back to top label collapses to its icon and the links scroll inside the pill rather than widening the page.
