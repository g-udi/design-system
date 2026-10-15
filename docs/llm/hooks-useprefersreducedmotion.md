# usePrefersReducedMotion

> Hooks/A11y/usePrefersReducedMotion · hooks · `@gaudi/design-system/hooks`

True when the operating system reduce-motion setting is on, updated live. Built on useMediaQuery.

## Import

```js
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks';
```

Exports: `usePrefersReducedMotion`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `fallback` | `boolean` | `false` | no | Value during server rendering and hydration. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `reduced` | `boolean` | True when motion should be reduced. |

## Usage

```jsx
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks';

const reduced = usePrefersReducedMotion();

window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
```

## Accessibility

When set, skip autoplay, parallax, typing effects and smooth scrolling, or replace them with an instant change. global.css already shortens CSS transitions; use this hook for motion driven from JavaScript.

## Notes

- `REDUCED_MOTION_QUERY` is exported for CSS-in-JS or imperative checks.

## Examples

- Read the preference (Storybook `hooks-a11y-useprefersreducedmotion--reading`)
- Turn autoplay off (Storybook `hooks-a11y-useprefersreducedmotion--autoplay-off`)

## Related

`hooks-usemediaquery`
