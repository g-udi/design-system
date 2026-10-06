# useInView

> Hooks/Layout/useInView · hooks · `@gaudi/design-system/hooks`

For lazy sections, "load more" sentinels, reading progress and reveal effects. With once, it stops observing after the element is first seen.

## Import

```js
import { useInView } from '@gaudi/design-system/hooks';
```

Exports: `useInView`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.root / rootMargin / threshold` | `Element / string / number \| number[]` | `viewport / '0px' / 0` | no | IntersectionObserver options. |
| `options.once` | `boolean` | `false` | no | Stop after the first time the element is in view. |
| `options.initialInView` | `boolean` | `false` | no | Value on the server and without IntersectionObserver. |
| `options.onChange` | `(inView, entry) => void` | — | no | Called on each change. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `[0] ref` | `(node) => void` | Callback ref for the element. |
| `[1] inView` | `boolean` | Whether it intersects. |
| `[2] entry` | `IntersectionObserverEntry \| null` | The latest entry. |

## Usage

```jsx
import { useInView } from '@gaudi/design-system/hooks';

const [ref, inView] = useInView({ rootMargin: '200px', once: true });
<section ref={ref}>{inView ? <Comments /> : <Skeleton className='h-40' />}</section>
```

## Accessibility

Never hide content until it scrolls into view for readers without JavaScript or with reduced motion; keep "load more" available as a real button too.

## Notes

- Set initialInView to true for content that must render without JavaScript.

## Examples

- Load a section when it is reached (Storybook `hooks-layout-useinview--lazy-section`)
- "Load more" sentinel with a button (Storybook `hooks-layout-useinview--infinite-list`)
