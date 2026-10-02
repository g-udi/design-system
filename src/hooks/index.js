/*
 * Gaudi hooks, grouped as in Storybook (Hooks/<Group>/<hook>). Every hook is SSR-safe: browser
 * globals are only read in effects, subscriptions or guarded snapshots. Also re-exported from the
 * package root, so `@gaudi/design-system` and `@gaudi/design-system/hooks` both work.
 */

// A11y
export { getNextIndex, useArrowKeyNav } from './a11y/use-arrow-key-nav.js';
export { useFocusTrap } from './a11y/use-focus-trap.js';
export { announce, useLiveAnnouncer } from './a11y/use-live-announcer.js';
export { REDUCED_MOTION_QUERY, usePrefersReducedMotion } from './a11y/use-prefers-reduced-motion.js';

// Data
export { useLocalStorage } from './data/use-local-storage.js';
export { useSessionStorage } from './data/use-session-storage.js';
export { selectionState, toggleInSet, useSelection } from './data/use-selection.js';

// Environment
export { useIsClient } from './environment/use-is-client.js';
export { matchesMediaQuery, subscribeMediaQuery, useMediaQuery } from './environment/use-media-query.js';
export { MOBILE_BREAKPOINT, useIsMobile } from './environment/use-mobile.js';
export { useOnlineStatus } from './environment/use-online-status.js';
export { usePageVisibility } from './environment/use-page-visibility.js';
export { usePrefersColorScheme } from './environment/use-prefers-color-scheme.js';

// Interaction
export { useCopyToClipboard, writeToClipboard } from './interaction/use-copy-to-clipboard.js';
export { useEventListener } from './interaction/use-event-listener.js';
export { isApplePlatform, matchHotkey, parseHotkey, toAriaKeyShortcuts, toKbdKeys, useHotkey } from './interaction/use-hotkey.js';
export { useHover } from './interaction/use-hover.js';
export { useOnClickOutside } from './interaction/use-on-click-outside.js';
export { lockScroll, useScrollLock } from './interaction/use-scroll-lock.js';

// Layout
export { areAllSectionsExpanded, collapsibleSectionsReducer, createCollapsibleSectionsState } from './layout/collapsible-sections-model.js';
export { useCollapsibleSections } from './layout/use-collapsible-sections.js';
export { useElementSize } from './layout/use-element-size.js';
export { useInView } from './layout/use-in-view.js';
export { useScrollPosition } from './layout/use-scroll-position.js';

// State
export { useControllableState } from './state/use-controllable-state.js';
export { createDebouncer, useDebounceCallback } from './state/use-debounce-callback.js';
export { useDebounceValue } from './state/use-debounce-value.js';
export { useDisclosure } from './state/use-disclosure.js';
export { useEventCallback } from './state/use-event-callback.js';
export { useInterval } from './state/use-interval.js';
export { useIsomorphicLayoutEffect } from './state/use-isomorphic-layout-effect.js';
export { mergeRefs, useMergedRefs } from './state/use-merged-refs.js';
export { usePrevious } from './state/use-previous.js';
export { useSliderInput } from './state/use-slider-input.js';
export { clampStep, useStep } from './state/use-step.js';
export { createThrottler, useThrottleCallback } from './state/use-throttle-callback.js';
export { useTimeout } from './state/use-timeout.js';
