# Hooks

Curated React hooks for blogs and applications, documented in Storybook under **Hooks** (after Charts).

```js
import { useHotkey, useLocalStorage, useMediaQuery } from '@gaudi/design-system/hooks';
// or, next to components
import { Button, useDisclosure } from '@gaudi/design-system';
```

## Layout

```
src/hooks/
  index.js                 barrel for the ./hooks entry (re-exported from the package root)
  catalogue.js             documentation data for every public hook (Storybook docs, overview, tests)
  story-helpers.jsx        hookMeta() and example() for the docs pages
  Overview.stories.jsx     Hooks/Overview
  a11y/ data/ environment/ interaction/ layout/ state/
    use-x.js               one hook per file, kebab-case file, camelCase export
    use-x.stories.jsx      Hooks/<Group>/useX
  shared/                  internal helpers (DOM guards, latest-value ref); not exported
  hooks.contract.test.js   exports, docs, story wiring and SSR rendering
  logic.contract.test.js   the pure logic behind the hooks
```

## Groups

| Group | Hooks |
| --- | --- |
| A11y | useArrowKeyNav, useFocusTrap, useLiveAnnouncer, usePrefersReducedMotion |
| Data | useLocalStorage, useSessionStorage, useSelection |
| Environment | useMediaQuery, useIsMobile, useIsClient, usePrefersColorScheme, usePageVisibility, useOnlineStatus |
| Interaction | useCopyToClipboard, useEventListener, useOnClickOutside, useHotkey, useHover, useScrollLock |
| Layout | useCollapsibleSections, useElementSize, useInView, useScrollPosition |
| State | useControllableState, useDisclosure, usePrevious, useEventCallback, useMergedRefs, useIsomorphicLayoutEffect, useDebounceValue, useDebounceCallback, useThrottleCallback, useInterval, useTimeout, useStep, useSliderInput |

Some hooks also export their pure core for non-React code: `announce`, `getNextIndex`, `matchesMediaQuery`, `subscribeMediaQuery`, `writeToClipboard`, `parseHotkey`, `matchHotkey`, `toAriaKeyShortcuts`, `toKbdKeys`, `lockScroll`, `collapsibleSectionsReducer`, `createDebouncer`, `createThrottler`, `mergeRefs`, `clampStep`, `toggleInSet` and `selectionState`.

## Rules

- **SSR-safe.** Read `window`, `document`, `navigator` and storage only in effects, subscriptions or guarded `useSyncExternalStore` snapshots. Document the server value (usually a `fallback` or initial option), and keep it equal to the hydration value.
- **Latest callbacks, stable subscriptions.** Callbacks may change on every render; keep them in a latest-value ref (`shared/use-latest-ref.js`) instead of re-subscribing.
- **Behaviour, not markup.** Hooks return state and prop getters. The component keeps roles, names, focus order and announcements; each hook's docs say what it still owes.
- **Generic only.** Product rules (validation, persistence policy, analytics) stay in the application. Prefer a Gaudi component when one already owns the behaviour (Dialog traps focus and locks scroll, Tabs handle arrow keys).
- **JS, relative imports, no new dependencies.**
- Components reuse these hooks instead of re-declaring generic ones (controllable state, media queries, isomorphic layout effects, reduced motion, mounted flags).

## Adding a hook

1. Add `src/hooks/<group>/use-x.js` and export it from `index.js`.
2. Add its entry to `catalogue.js` (summary, description, params, returns, accessibility, notes, usage with a public import).
3. Add `use-x.stories.jsx` with the literal `title: 'Hooks/<Group>/useX'`, `id`, `tags: ['autodocs']` and `...hookMeta('useX')`, plus live examples with copyable source and play functions where interaction matters.
4. Cover its logic in `logic.contract.test.js` and its server render in `hooks.contract.test.js`.
5. Run `pnpm catalogue:sync`, `pnpm lint`, `pnpm test:contracts` and `npx vitest run --project=storybook src/hooks`.

## Sources

The existing Gaudi hooks (useCopyToClipboard, useMediaQuery, useIsMobile, useScrollPosition, useSliderInput) keep their behaviour; useCopyToClipboard and useMediaQuery merge in the Mav9 design system versions. useArrowKeyNav, useCollapsibleSections, useDebounceCallback, useDebounceValue, useEventListener, useFocusTrap, useIsClient, useLocalStorage, useOnClickOutside, useScrollLock and useSelection are ported from the Mav9 design system and adapted to Gaudi. The others are new.
