# FloatingMenu

> Core/FloatingMenu · core · `@gaudi/design-system/core/FloatingMenu`

A compact, inverted pill of destinations that floats over the page once the reader scrolls away from the header, with an optional Back to top button. LayoutContainer renders it for the site; pass targetRef and position sticky to use it inside a scroll container.

## Import

```js
import FloatingMenu from '@gaudi/design-system/core/FloatingMenu';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `links` | `Array<{ href, title, active? }>` | `SiteConfig navigation.links` | no | Destinations; the most specific match for the current path gets aria-current. |
| `revealOn` | `scroll-up \| scroll` | `scroll-up` | no | Show while scrolling back up past the threshold, or whenever past it. |
| `threshold` | `number` | `50` | no | Scroll offset in pixels before the pill can show. |
| `targetRef` | `RefObject<HTMLElement>` | `window` | no | Scroll container to observe and scroll back to the top. |
| `position` | `fixed \| sticky` | `fixed` | no | fixed floats over the viewport; sticky pins it to the top of a scroll container (render it as the first child). |
| `actions` | `ReactNode` | — | no | Extra controls after the links, such as a call to action. |
| `backToTop` | `boolean` | `true` | no | Show the Back to top button. |
| `currentPath` | `string` | `Next.js pathname` | no | Path used to mark the current link. |
| `label` | `string` | `Quick navigation` | no | Accessible name of the navigation landmark. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `revealOn`: `scroll-up`, `scroll`
- `position`: `fixed`, `sticky`

## Usage

```jsx
import { FloatingMenu } from '@gaudi/design-system';

// Fixed over the window; links default to SiteConfig navigation.links.
<FloatingMenu links={[{ href: '/blog', title: 'Blog' }, { href: '/about', title: 'About' }]} />
```

## Accessibility

A labelled navigation landmark that stays in the tab order while hidden; focusing it reveals it. The current link has aria-current="page". Reduced motion removes the slide and makes Back to top jump. On phones the links scroll inside the pill and Back to top collapses to its icon, so the page never overflows.

## Examples

- Playground (Storybook `core-floatingmenu--playground`)
- Reveal Past Threshold (Storybook `core-floatingmenu--reveal-past-threshold`)
- With Call To Action (Storybook `core-floatingmenu--with-call-to-action`)
- Keyboard Reveal (Storybook `core-floatingmenu--keyboard-reveal`)

## Related

`layout-layoutcontainer`

## README

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

### Accessibility

The pill is a navigation landmark named by `label` (Quick navigation). It stays in the tab order while hidden, and focusing any of its controls reveals it, so keyboard users are never stranded. Transitions stop and Back to top jumps instantly when the reader prefers reduced motion. On narrow screens the Back to top label collapses to its icon and the links scroll inside the pill rather than widening the page.
