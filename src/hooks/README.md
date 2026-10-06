# Hooks

Curated React hooks for blogs and applications, documented in Storybook under **Hooks** (after Charts).

```js
import { useHotkey, useLocalStorage, useMediaQuery } from '@gaudi/design-system/hooks';
// or, next to components
import { Button, useDisclosure } from '@gaudi/design-system';
```

## Layout

```text
src/hooks/
  index.js                 barrel for the ./hooks entry (re-exported from the package root)
  a11y/ data/ environment/ interaction/ layout/ state/
    use-x.js               one hook per file, kebab-case file, camelCase export
  shared/                  internal helpers (DOM guards, latest-value ref); not exported

src/docs/hooks/
  catalogue.js             documentation data for every public hook
  HookDocs.jsx             hookMeta() and example() for the docs pages
  stories/
    Overview.stories.jsx    Hooks/Overview
    <group>/use-x.stories.jsx  Hooks/<Group>/useX

tests/hooks/
  hooks.contract.test.js   exports, docs, story wiring and SSR rendering
  logic.contract.test.js   the pure logic behind the hooks
```

## Groups

| Group | Hooks |
| --- | --- |
| A11y | useArrowKeyNav, useFocusTrap, useLiveAnnouncer, usePrefersReducedMotion |
| Data | useLocalStorage, useSessionStorage, useSelection, useMap, useReadLocalStorage |
| Environment | useMediaQuery, useIsMobile, useIsClient, usePrefersColorScheme, usePageVisibility, useOnlineStatus, useIsMounted, useDocumentTitle, useWindowSize, useScreen, useScript |
| Interaction | useCopyToClipboard, useEventListener, useOnClickOutside, useHotkey, useHover, useScrollLock, useMousePosition |
| Layout | useCollapsibleSections, useElementSize, useInView, useScrollPosition |
| State | useControllableState, useDisclosure, usePrevious, useEventCallback, useMergedRefs, useIsomorphicLayoutEffect, useDebounceValue, useDebounceCallback, useThrottleCallback, useInterval, useTimeout, useStep, useSliderInput, useBoolean, useCounter, useCountdown, useUnmount |

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
2. Add its entry to `src/docs/hooks/catalogue.js` (summary, description, params, returns, accessibility, notes, usage with a public import).
3. Add `src/docs/hooks/stories/<group>/use-x.stories.jsx` with the literal `title: 'Hooks/<Group>/useX'`, `id`, `tags: ['autodocs']` and `...hookMeta('useX')`, plus live examples with copyable source and play functions where interaction matters.
4. Cover its logic in `tests/hooks/logic.contract.test.js` and its server render in `tests/hooks/hooks.contract.test.js`.
5. Run `pnpm catalogue:sync`, `pnpm lint`, `pnpm test:contracts` and `pnpm exec vitest run --project=storybook src/docs/hooks/stories`.

## Sources

The existing Gaudi hooks (useCopyToClipboard, useMediaQuery, useIsMobile, useScrollPosition, useSliderInput) keep their behaviour; useCopyToClipboard and useMediaQuery merge in earlier versions by the same author. useArrowKeyNav, useCollapsibleSections, useDebounceCallback, useDebounceValue, useEventListener, useFocusTrap, useIsClient, useLocalStorage, useOnClickOutside, useScrollLock and useSelection are ported from an earlier design system by the same author and adapted to Gaudi. The others are new.

## Catalogue equivalents

The [shadcn.io hook catalogue](https://www.shadcn.io/hooks#categories) informed the coverage review; the additions are original Gaudi implementations using our existing helpers. Gaudi covers these names through its existing owners:

| Reference hook | Gaudi API |
| --- | --- |
| useToggle | useBoolean: `value`, `toggle`, `setValue` |
| useClickAnywhere | `useEventListener('click', callback, 'document')` |
| useIntersectionObserver | useInView: `[ref, inView, entry]` |
| useResizeObserver | useElementSize: `[ref, size]`, measuring the border box |
| useDarkMode / useTernaryDarkMode | `useTheme` from `@gaudi/design-system/themes`: `mode`, `resolvedMode`, `setMode('light' / 'dark' / 'system')` |

These cover the use cases with Gaudi's contracts; they are not drop-in shadcn signatures. The theme provider stays the single owner of persisted site appearance. `usePrefersColorScheme` reads only the OS preference.
