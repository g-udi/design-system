/*
 * Gaudi hooks, grouped as in Storybook (Hooks/<Group>/<hook>). Every hook is SSR-safe: browser
 * globals are only read in effects, subscriptions or guarded snapshots. Also re-exported from the
 * package root, so `@gaudi/design-system` and `@gaudi/design-system/hooks` both work.
 */

// A11y
export { getNextIndex } from './a11y/arrow-key-nav-model.js';
export { useArrowKeyNav } from './a11y/use-arrow-key-nav.js';
export { getTrapTarget } from './a11y/focus-trap-model.js';
export { useFocusTrap } from './a11y/use-focus-trap.js';
export { announce } from './a11y/live-announcer-model.js';
export { useLiveAnnouncer } from './a11y/use-live-announcer.js';
export { REDUCED_MOTION_QUERY } from './a11y/reduced-motion-model.js';
export { usePrefersReducedMotion } from './a11y/use-prefers-reduced-motion.js';

// Data
export { useReadLocalStorage } from './data/use-read-local-storage.js';
export { useMap } from './data/use-map.js';
export { localStorageStore, sessionStorageStore } from './data/storage-model.js';
export { useLocalStorage } from './data/use-local-storage.js';
export { useSessionStorage } from './data/use-session-storage.js';
export { selectionState, toggleInSet } from './data/selection-model.js';
export { useSelection } from './data/use-selection.js';

// Environment
export { useScript } from './environment/use-script.js';
export { useScreen } from './environment/use-screen.js';
export { useWindowSize } from './environment/use-window-size.js';
export { useDocumentTitle } from './environment/use-document-title.js';
export { useIsMounted } from './environment/use-is-mounted.js';
export { useIsClient } from './environment/use-is-client.js';
export { matchesMediaQuery, subscribeMediaQuery } from './environment/media-query-model.js';
export { useMediaQuery } from './environment/use-media-query.js';
export { MOBILE_BREAKPOINT } from './environment/mobile-model.js';
export { useIsMobile } from './environment/use-mobile.js';
export { useOnlineStatus } from './environment/use-online-status.js';
export { usePageVisibility } from './environment/use-page-visibility.js';
export { usePrefersColorScheme } from './environment/use-prefers-color-scheme.js';

// Interaction
export { useMousePosition } from './interaction/use-mouse-position.js';
export { writeToClipboard } from './interaction/clipboard-model.js';
export { useCopyToClipboard } from './interaction/use-copy-to-clipboard.js';
export { useEventListener } from './interaction/use-event-listener.js';
export { isApplePlatform, matchHotkey, parseHotkey, toAriaKeyShortcuts, toKbdKeys } from './interaction/hotkey-model.js';
export { useHotkey } from './interaction/use-hotkey.js';
export { useHover } from './interaction/use-hover.js';
export { isOutside } from './interaction/click-outside-model.js';
export { useOnClickOutside } from './interaction/use-on-click-outside.js';
export { lockScroll } from './interaction/scroll-lock-model.js';
export { useScrollLock } from './interaction/use-scroll-lock.js';

// Layout
export { areAllSectionsExpanded, collapsibleSectionsReducer, createCollapsibleSectionsState } from './layout/collapsible-sections-model.js';
export { useCollapsibleSections } from './layout/use-collapsible-sections.js';
export { useElementSize } from './layout/use-element-size.js';
export { useInView } from './layout/use-in-view.js';
export { useScrollPosition } from './layout/use-scroll-position.js';

// State
export { useUnmount } from './state/use-unmount.js';
export { useCountdown } from './state/use-countdown.js';
export { useCounter } from './state/use-counter.js';
export { useBoolean } from './state/use-boolean.js';
export { useControllableState } from './state/use-controllable-state.js';
export { createDebouncer } from './state/debounce-model.js';
export { useDebounceCallback } from './state/use-debounce-callback.js';
export { useDebounceValue } from './state/use-debounce-value.js';
export { useDisclosure } from './state/use-disclosure.js';
export { useEventCallback } from './state/use-event-callback.js';
export { useInterval } from './state/use-interval.js';
export { useIsomorphicLayoutEffect } from './state/use-isomorphic-layout-effect.js';
export { assignRef, mergeRefs } from './state/merged-refs-model.js';
export { useMergedRefs } from './state/use-merged-refs.js';
export { usePrevious } from './state/use-previous.js';
export { useSliderInput } from './state/use-slider-input.js';
export { clampStep } from './state/step-model.js';
export { useStep } from './state/use-step.js';
export { createThrottler } from './state/throttle-model.js';
export { useThrottleCallback } from './state/use-throttle-callback.js';
export { useTimeout } from './state/use-timeout.js';
