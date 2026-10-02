/**
 * The documented hook catalogue: one entry per public hook, read by the Storybook docs pages, the
 * Hooks overview and the hooks contract test. Plain data, so Node can import it.
 *
 * params:  [name, type, default, description]
 * returns: [name, type, description]
 * origin:  'Gaudi' (existing Gaudi hook), 'Mav9' (ported from the Mav9 design system), 'New'
 */

export const hookGroups = [ 'A11y', 'Data', 'Environment', 'Interaction', 'Layout', 'State' ];

export const hookGroupDescriptions = {
  A11y: 'Keyboard focus, screen reader announcements and motion preferences.',
  Data: 'Persisted values and multi-select collections.',
  Environment: 'The browser around the component: breakpoints, client rendering, network and visibility.',
  Interaction: 'Pointer, keyboard, clipboard and page-scroll behaviour.',
  Layout: 'Element size, viewport visibility, scroll offset and collapsible sections.',
  State: 'Controlled state, refs, timers, debouncing and step flows.'
};

const imp = (names) => `import { ${names} } from '@gaudi/design-system/hooks';`;

export const hookCatalogue = [
  // MARK: A11y
  {
    name: 'useArrowKeyNav',
    group: 'A11y',
    file: 'a11y/use-arrow-key-nav.js',
    origin: 'Mav9',
    summary: 'Arrow-key navigation with a roving tabindex for toolbars, lists and grids.',
    description: 'Moves focus between items with the arrow keys, Home and End while the group stays one Tab stop. The active item has tabIndex 0 and the rest -1. Keys typed in text fields and keys with Command, Control or Alt are left alone.',
    params: [
      [ 'itemCount', 'number', '—', 'Number of navigable items; the active index is clamped when items are removed.' ],
      [ 'options.orientation', "'vertical' | 'horizontal' | 'both'", "'vertical'", 'Which arrow keys move: Up and Down, Left and Right, or all four.' ],
      [ 'options.wrap', 'boolean', 'false', 'Loop from the last item to the first and back.' ],
      [ 'options.dir', "'ltr' | 'rtl'", "'ltr'", 'In right-to-left layouts ArrowLeft moves forward.' ],
      [ 'options.role', 'string', "'group'", 'Container role; aria-orientation is added for roles that support it (toolbar, listbox, menu, tablist…).' ],
      [ 'options.defaultIndex / onActiveChange', 'number / (index) => void', '0 / —', 'Initial active item, and a callback when it changes.' ]
    ],
    returns: [
      [ 'activeIndex', 'number', 'The item that holds tabIndex 0.' ],
      [ 'getItemProps(index)', '{ tabIndex, onKeyDown, onFocus, ref }', 'Spread on each item.' ],
      [ 'containerProps', '{ role, aria-orientation? }', 'Spread on the container, then give it an accessible name.' ],
      [ 'setActiveIndex(index, { focus })', 'function', 'Move the active item from code; focuses it unless focus is false.' ]
    ],
    accessibility: 'Implements the WAI-ARIA roving tabindex pattern: one Tab stop for the group, arrows inside it. Name the container (aria-label or aria-labelledby) and give it the role the widget really is, such as toolbar.',
    notes: [ 'Gaudi Tabs, ToggleGroup, RadioGroup and menus already handle their own arrow keys.', '`getNextIndex(current, key, options)` is exported for custom key handling.' ],
    usage: `${imp('useArrowKeyNav')}

const { getItemProps, containerProps } = useArrowKeyNav(tools.length, { orientation: 'horizontal', role: 'toolbar', wrap: true });

<div {...containerProps} aria-label='Formatting'>
  {tools.map((tool, index) => <Button key={tool} {...getItemProps(index)}>{tool}</Button>)}
</div>`
  },
  {
    name: 'useFocusTrap',
    group: 'A11y',
    file: 'a11y/use-focus-trap.js',
    origin: 'Mav9',
    summary: 'Keep Tab focus inside a custom overlay and restore it on close.',
    description: 'While active, Tab and Shift+Tab wrap inside the container. On activation it focuses the first tabbable element (or the container), and on release it returns focus to where it was. Traps nest, and portaled menus inside the trap keep their own focus.',
    params: [
      [ 'options.active', 'boolean', 'true', 'Whether the trap is on.' ],
      [ 'options.autoFocus', 'boolean', 'true', 'Move focus into the container when it activates.' ],
      [ 'options.initialFocus', "'first' | 'container'", "'first'", 'Focus the first tabbable element or the container itself (give it tabIndex={-1}).' ],
      [ 'options.returnFocus', 'boolean', 'true', 'Return focus to the previously focused element on release.' ],
      [ 'options.containerRef', 'RefObject<HTMLElement>', '—', 'Use an existing ref instead of the returned one.' ]
    ],
    returns: [ [ 'ref', 'RefObject<HTMLElement>', 'Attach to the container.' ] ],
    accessibility: 'A trap must always have a visible, keyboard-reachable way out (a Close button and Escape). Pair it with role="dialog", aria-modal and a label, and with useScrollLock so the page behind does not scroll.',
    notes: [ 'Gaudi Dialog, AlertDialog, Sheet and Drawer already trap focus; use this hook only for custom overlays.' ],
    usage: `${imp('useFocusTrap')}

const trapRef = useFocusTrap({ active: open });

<div ref={trapRef} role='dialog' aria-modal='true' aria-labelledby='menu-title'>…</div>`
  },
  {
    name: 'useLiveAnnouncer',
    group: 'A11y',
    file: 'a11y/use-live-announcer.js',
    origin: 'New',
    summary: 'Polite or assertive screen reader announcements for changes away from focus.',
    description: 'Announces short messages ("Saved", "3 results", "Copied") through shared visually hidden live regions. The regions exist before the first message so it is not lost, and repeating a message announces it again.',
    params: [ [ 'options.clearAfter', 'number', '5000', 'Milliseconds before an announced message is cleared from the region.' ] ],
    returns: [
      [ 'announce(message, politeness)', "(string, 'polite' | 'assertive') => void", "Read a message; 'polite' waits, 'assertive' interrupts." ],
      [ 'clear()', 'function', 'Empty both regions.' ]
    ],
    accessibility: "Use 'polite' for almost everything. Reserve 'assertive' for errors and time-critical changes, keep messages short, and never announce every keystroke or streamed token.",
    notes: [ '`announce(message, politeness)` is also exported for non-React code.' ],
    usage: `${imp('useLiveAnnouncer')}

const { announce } = useLiveAnnouncer();

const save = async () => {
  await saveDraft();
  announce('Draft saved');
};`
  },
  {
    name: 'usePrefersReducedMotion',
    group: 'A11y',
    file: 'a11y/use-prefers-reduced-motion.js',
    origin: 'New',
    summary: 'Whether the reader asked to reduce motion.',
    description: 'True when the operating system reduce-motion setting is on, updated live. Built on useMediaQuery.',
    params: [ [ 'fallback', 'boolean', 'false', 'Value during server rendering and hydration.' ] ],
    returns: [ [ 'reduced', 'boolean', 'True when motion should be reduced.' ] ],
    accessibility: 'When set, skip autoplay, parallax, typing effects and smooth scrolling, or replace them with an instant change. global.css already shortens CSS transitions; use this hook for motion driven from JavaScript.',
    notes: [ '`REDUCED_MOTION_QUERY` is exported for CSS-in-JS or imperative checks.' ],
    usage: `${imp('usePrefersReducedMotion')}

const reduced = usePrefersReducedMotion();

window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });`
  },

  // MARK: Data
  {
    name: 'useLocalStorage',
    group: 'Data',
    file: 'data/use-local-storage.js',
    origin: 'Mav9',
    summary: 'useState persisted to localStorage, synced across components and tabs.',
    description: 'Stores a JSON value under a key. The server render and hydration use the initial value, and the stored value is read right after. Every caller with the same key stays in sync in this tab and in other tabs; blocked storage falls back to memory.',
    params: [
      [ 'key', 'string', '—', 'Storage key; namespace it, for example reader:font-size.' ],
      [ 'initialValue', 'any', '—', 'Value on the server, during hydration and when nothing is stored.' ],
      [ 'options.serialize / deserialize', '(value) => string / (raw) => any', 'JSON', 'Custom encoding.' ],
      [ 'options.syncTabs', 'boolean', 'true', 'Follow writes from other tabs.' ]
    ],
    returns: [
      [ '[0] value', 'any', 'Current value.' ],
      [ '[1] setValue', '(value | (current) => value) => void', 'Store a new value.' ],
      [ '[2] removeValue', '() => void', 'Delete the key and fall back to initialValue.' ]
    ],
    accessibility: 'Persisted preferences (text size, reduced motion, dismissed notices) must still have a visible control to change them back.',
    notes: [ 'Never store secrets, tokens or personal data in localStorage.' ],
    usage: `${imp('useLocalStorage')}

const [fontSize, setFontSize, resetFontSize] = useLocalStorage('reader:font-size', 'md');`
  },
  {
    name: 'useSessionStorage',
    group: 'Data',
    file: 'data/use-session-storage.js',
    origin: 'New',
    summary: 'useState persisted to sessionStorage for one tab.',
    description: 'The same API as useLocalStorage over sessionStorage: survives a reload, not a new tab. Good for wizard progress and half-filled forms.',
    params: [
      [ 'key', 'string', '—', 'Storage key.' ],
      [ 'initialValue', 'any', '—', 'Value on the server, during hydration and when nothing is stored.' ],
      [ 'options.serialize / deserialize', '(value) => string / (raw) => any', 'JSON', 'Custom encoding.' ]
    ],
    returns: [
      [ '[0] value', 'any', 'Current value.' ],
      [ '[1] setValue', '(value | (current) => value) => void', 'Store a new value.' ],
      [ '[2] removeValue', '() => void', 'Delete the key and fall back to initialValue.' ]
    ],
    accessibility: 'Restoring a form after a reload helps people who navigate slowly or lose their place; tell them the draft was restored and let them clear it.',
    notes: [ 'Session storage is per tab, so there is no cross-tab sync.' ],
    usage: `${imp('useSessionStorage')}

const [draft, setDraft, clearDraft] = useSessionStorage('contact:draft', { name: '', message: '' });`
  },
  {
    name: 'useSelection',
    group: 'Data',
    file: 'data/use-selection.js',
    origin: 'Mav9',
    summary: 'Multi-select state in a Set, with select-all and indeterminate support.',
    description: 'Tracks selected ids for lists, tables and bulk actions. Uncontrolled from initialSelectedIds, or controlled with selectedIds and onSelectionChange; every change produces a new Set.',
    params: [
      [ 'options.selectedIds', 'Set<id>', '—', 'Controlled selection.' ],
      [ 'options.initialSelectedIds', 'Set<id>', 'new Set()', 'Initial selection when uncontrolled.' ],
      [ 'options.onSelectionChange', '(ids: Set<id>) => void', '—', 'Called with the next selection.' ]
    ],
    returns: [
      [ 'selectedIds / count', 'Set<id> / number', 'The selection and its size.' ],
      [ 'isSelected(id)', 'boolean', 'Whether an id is selected.' ],
      [ "getSelectAllState(ids)", "true | false | 'indeterminate'", 'State for a select-all checkbox.' ],
      [ 'toggleSelection / select / deselect', '(id) => void', 'Change one id.' ],
      [ 'selectAll / toggleAll / clearSelection / setSelection', 'function', 'Change many ids at once.' ]
    ],
    accessibility: 'Give every checkbox a label naming its row, give the select-all checkbox an indeterminate state, and announce bulk results (for example with useLiveAnnouncer).',
    notes: [ 'DataTable has its own selection; use this hook for custom lists, galleries and cards.' ],
    usage: `${imp('useSelection')}

const { isSelected, toggleSelection, getSelectAllState, toggleAll, count } = useSelection();`
  },

  // MARK: Environment
  {
    name: 'useMediaQuery',
    group: 'Environment',
    file: 'environment/use-media-query.js',
    origin: 'Gaudi',
    summary: 'Track a CSS media query, SSR-safe.',
    description: 'Returns whether a media query matches and follows changes. Returns the fallback during server rendering and hydration so markup stays stable; client-only renders read the real value at once. Merges the Gaudi and Mav9 versions.',
    params: [
      [ 'query', 'string', '—', "A media query such as '(min-width: 1024px)'." ],
      [ 'fallback', 'boolean', 'false', 'Value during server rendering and hydration.' ]
    ],
    returns: [ [ 'matches', 'boolean', 'Whether the query matches.' ] ],
    accessibility: 'Prefer CSS for purely visual changes. Use the hook when the tree really differs (one pane instead of two), and keep the same content and controls reachable in both layouts.',
    notes: [ '`matchesMediaQuery(query)` and `subscribeMediaQuery(query, notify)` are exported for non-React code.' ],
    usage: `${imp('useMediaQuery')}

const wide = useMediaQuery('(min-width: 1024px)', true);`
  },
  {
    name: 'useIsMobile',
    group: 'Environment',
    file: 'environment/use-mobile.js',
    origin: 'Gaudi',
    summary: 'True below the 768px phone breakpoint.',
    description: 'The breakpoint the AppShell sidebar and DateSelector use to switch to their phone layouts. False during server rendering and hydration.',
    params: [ [ '(none)', '—', '—', 'Takes no arguments; the breakpoint is MOBILE_BREAKPOINT (768).' ] ],
    returns: [ [ 'isMobile', 'boolean', 'True when the viewport is narrower than 768px.' ] ],
    accessibility: 'Switching layouts must not remove features: the phone layout should reach the same actions, often through a Sheet or Drawer.',
    notes: [ 'Built on useMediaQuery; use that directly for other breakpoints.' ],
    usage: `${imp('useIsMobile')}

const isMobile = useIsMobile();
return isMobile ? <Drawer>{filters}</Drawer> : <aside>{filters}</aside>;`
  },
  {
    name: 'useIsClient',
    group: 'Environment',
    file: 'environment/use-is-client.js',
    origin: 'Mav9',
    summary: 'False on the server and during hydration, true on the client.',
    description: 'Defers browser-only output (theme toggles, local times, storage-backed values) without a hydration mismatch, and without the extra render of a mounted flag set in an effect.',
    params: [ [ '(none)', '—', '—', 'Takes no arguments.' ] ],
    returns: [ [ 'isClient', 'boolean', 'True once rendering on the client.' ] ],
    accessibility: 'Render a same-size placeholder on the server so the layout does not jump and focus order does not change when the client value appears.',
    notes: [ 'The ThemeSwitcher uses it for its mounted state.' ],
    usage: `${imp('useIsClient')}

const isClient = useIsClient();
return <time>{isClient ? date.toLocaleTimeString() : '—'}</time>;`
  },
  {
    name: 'usePrefersColorScheme',
    group: 'Environment',
    file: 'environment/use-prefers-color-scheme.js',
    origin: 'New',
    summary: "The operating system colour scheme: 'light' or 'dark'.",
    description: 'Follows the system preference live. This is not the site theme: read the active theme from the theme provider, and use this hook for system-default choices such as an embed or a chart palette.',
    params: [ [ 'fallback', "'light' | 'dark'", "'light'", 'Value during server rendering and hydration.' ] ],
    returns: [ [ 'scheme', "'light' | 'dark'", 'The system preference.' ] ],
    accessibility: 'Both schemes must meet contrast requirements; use Gaudi tokens, which resolve per theme.',
    notes: [ 'Built on useMediaQuery.' ],
    usage: `${imp('usePrefersColorScheme')}

const scheme = usePrefersColorScheme();`
  },
  {
    name: 'usePageVisibility',
    group: 'Environment',
    file: 'environment/use-page-visibility.js',
    origin: 'New',
    summary: 'Whether the tab is visible, to pause work in the background.',
    description: 'True while the page is visible. Pause polling, carousels, video and animation loops when the reader switches tabs, and resume when they return.',
    params: [ [ '(none)', '—', '—', 'Takes no arguments.' ] ],
    returns: [ [ 'visible', 'boolean', 'False while the tab is hidden; true during server rendering.' ] ],
    accessibility: 'Pausing hidden work also stops rotating content from moving on while the reader is away, so they return to what they left.',
    notes: [ 'Combine with useInterval: pass null as the delay while hidden.' ],
    usage: `${imp('useInterval, usePageVisibility')}

const visible = usePageVisibility();
useInterval(refresh, visible ? 30000 : null);`
  },
  {
    name: 'useOnlineStatus',
    group: 'Environment',
    file: 'environment/use-online-status.js',
    origin: 'New',
    summary: 'Whether the browser reports a network connection.',
    description: "Follows the online and offline events. False is reliable: queue work and say so. True only means 'maybe' (a captive portal reports online), so request errors stay the source of truth.",
    params: [ [ '(none)', '—', '—', 'Takes no arguments.' ] ],
    returns: [ [ 'online', 'boolean', 'False when the browser is offline; true during server rendering.' ] ],
    accessibility: 'Show offline state as text (an Alert or a status region), not only as a colour, and keep entered work.',
    notes: [ 'Do not block reading content offline; disable only the actions that need the network.' ],
    usage: `${imp('useOnlineStatus')}

const online = useOnlineStatus();
<Button disabled={!online}>Publish</Button>`
  },

  // MARK: Interaction
  {
    name: 'useCopyToClipboard',
    group: 'Interaction',
    file: 'interaction/use-copy-to-clipboard.js',
    origin: 'Gaudi',
    summary: 'Copy text with a temporary copied state and a fallback.',
    description: 'Writes text with the Clipboard API and falls back to a hidden textarea (restoring focus and selection) where the API is blocked. isCopied resets after the timeout. Merges the Gaudi and Mav9 versions: copyToClipboard and copy are the same function.',
    params: [
      [ 'options.timeout', 'number', '2000', 'Milliseconds before isCopied resets; 0 keeps it. A number may be passed instead of the options.' ],
      [ 'options.onCopy / onError', '(text) => void', '—', 'Called after a successful or failed copy.' ]
    ],
    returns: [
      [ 'copy(text) / copyToClipboard(text)', '(text) => Promise<boolean>', 'Copy; resolves to whether it worked.' ],
      [ 'isCopied / copiedText', 'boolean / string | null', 'Feedback state.' ],
      [ 'reset()', 'function', 'Clear the copied state now.' ]
    ],
    accessibility: 'Keep the button name stable ("Copy link") and announce the result in a polite status region; swapping only the icon is not announced.',
    notes: [ 'CodeBlock already has a copy button; use this hook for custom copy actions.' ],
    usage: `${imp('useCopyToClipboard')}

const { copy, isCopied } = useCopyToClipboard();

<Button onClick={() => copy(url)}>{isCopied ? 'Copied' : 'Copy link'}</Button>`
  },
  {
    name: 'useEventListener',
    group: 'Interaction',
    file: 'interaction/use-event-listener.js',
    origin: 'Mav9',
    summary: 'Declarative DOM event listener with cleanup.',
    description: 'Attaches a listener to window (default), document, an element or a ref, and removes it on unmount. The latest handler always runs without re-subscribing, and refs are re-read after every commit so the listener follows conditional elements.',
    params: [
      [ 'eventName', 'string', '—', "DOM event such as 'keydown', 'scroll' or 'resize'." ],
      [ 'handler', '(event) => void', '—', 'Called for each event; may change on every render.' ],
      [ 'target', "'window' | 'document' | Element | RefObject | null", "'window'", 'Where to listen; null detaches.' ],
      [ 'options', 'boolean | AddEventListenerOptions', '—', 'capture, passive, once and signal.' ]
    ],
    returns: [ [ '(nothing)', 'void', 'The listener lives as long as the component.' ] ],
    accessibility: 'Keyboard listeners on window or document must not swallow keys that belong to focused controls; check event.target and event.defaultPrevented.',
    notes: [ 'Mark scroll and touch listeners passive so they never delay scrolling.' ],
    usage: `${imp('useEventListener')}

useEventListener('resize', () => setWidth(window.innerWidth));
useEventListener('scroll', onScroll, panelRef, { passive: true });`
  },
  {
    name: 'useOnClickOutside',
    group: 'Interaction',
    file: 'interaction/use-on-click-outside.js',
    origin: 'Mav9',
    summary: 'Run a callback when a press lands outside one or more elements.',
    description: 'Listens for pointerdown on the document and calls the handler when the target is outside every ref, for custom panels and inline editors. Pass several refs, such as a trigger and its panel.',
    params: [
      [ 'ref', 'RefObject | RefObject[]', '—', 'Element or elements that count as inside.' ],
      [ 'handler', '(event) => void', '—', 'Called on an outside press.' ],
      [ 'options', "string | { event?, enabled? }", "{ event: 'pointerdown', enabled: true }", "Event name ('pointerdown', 'mousedown', 'click', 'focusin'…) or options." ]
    ],
    returns: [ [ '(nothing)', 'void', 'The listener lives as long as the component.' ] ],
    accessibility: 'An outside click is a pointer shortcut. Also close on Escape and return focus to the trigger, so keyboard users can dismiss the panel.',
    notes: [ 'Popover, Dialog, Select and menus already dismiss themselves.' ],
    usage: `${imp('useOnClickOutside')}

useOnClickOutside([triggerRef, panelRef], () => setOpen(false), { enabled: open });`
  },
  {
    name: 'useHotkey',
    group: 'Interaction',
    file: 'interaction/use-hotkey.js',
    origin: 'New',
    summary: 'Keyboard shortcuts with platform-aware mod keys.',
    description: "Runs a callback for a combination such as 'mod+k' (Command+K on macOS, Control+K elsewhere), 'shift+?' or 'escape'. Skips plain keys while the reader types in a field, and returns aria-keyshortcuts and Kbd keys for the hint.",
    params: [
      [ 'keys', 'string | string[]', '—', "One or more combinations: 'mod+k', 'ctrl+shift+p', '/', 'escape'." ],
      [ 'callback', '(event, combo) => void', '—', 'Called when a combination matches.' ],
      [ 'options.enabled / target / event', "boolean / target / 'keydown' | 'keyup'", "true / 'document' / 'keydown'", 'When and where to listen.' ],
      [ 'options.preventDefault', 'boolean', 'true', 'Stop the browser default for a matched shortcut.' ],
      [ 'options.enableInInputs / allowRepeat', 'boolean', 'false', 'Also fire in text fields, and on held-key repeats.' ]
    ],
    returns: [
      [ 'ariaKeyShortcuts', 'string', "Value for aria-keyshortcuts, e.g. 'Meta+K Control+K'." ],
      [ 'kbdKeys', 'string', "Keys for Kbd, e.g. 'command,k' on macOS and 'ctrl,k' elsewhere." ]
    ],
    accessibility: 'Every shortcut needs a visible control that does the same thing. Put aria-keyshortcuts on that control and show the keys with Kbd. Avoid single-key shortcuts unless they can be turned off (WCAG 2.1.4).',
    notes: [ '`parseHotkey`, `matchHotkey`, `toAriaKeyShortcuts` and `toKbdKeys` are exported for custom handling.' ],
    usage: `${imp('useHotkey')}

const { ariaKeyShortcuts, kbdKeys } = useHotkey('mod+k', () => setOpen(true));

<Button aria-keyshortcuts={ariaKeyShortcuts} onClick={() => setOpen(true)}>Search <Kbd keys={kbdKeys} /></Button>`
  },
  {
    name: 'useHover',
    group: 'Interaction',
    file: 'interaction/use-hover.js',
    origin: 'New',
    summary: 'Pointer hover state with props to spread, ignoring touch.',
    description: 'Tracks pointer hover through onPointerEnter and onPointerLeave. Touch pointers are ignored so a tap does not leave an element stuck in its hover state.',
    params: [
      [ 'options.disabled', 'boolean', 'false', 'Stop tracking and clear the state.' ],
      [ 'options.onHoverChange', '(hovered) => void', '—', 'Called when hover starts or ends.' ]
    ],
    returns: [
      [ 'isHovered', 'boolean', 'Whether a mouse or pen is over the element.' ],
      [ 'hoverProps', '{ onPointerEnter, onPointerLeave }', 'Spread on the element.' ]
    ],
    accessibility: 'Hover is an enhancement. Anything revealed on hover must also appear on focus (track :focus-within or onFocus) and be reachable on touch.',
    notes: [ 'Use CSS :hover for purely visual effects; use the hook when hover changes behaviour, such as pausing a carousel.' ],
    usage: `${imp('useHover')}

const { isHovered, hoverProps } = useHover();

<Card {...hoverProps}>{isHovered ? 'Paused' : 'Playing'}</Card>`
  },
  {
    name: 'useScrollLock',
    group: 'Interaction',
    file: 'interaction/use-scroll-lock.js',
    origin: 'Mav9',
    summary: 'Lock page scrolling while a custom overlay is open.',
    description: 'Sets overflow hidden on the body while locked and pads it by the scrollbar width so content does not shift. Locks from several components nest; the last release restores the page.',
    params: [ [ 'locked', 'boolean', 'true', 'Whether scrolling is locked.' ] ],
    returns: [ [ '(nothing)', 'void', 'The lock is released on unlock or unmount.' ] ],
    accessibility: 'Lock scrolling together with a focus trap, so neither the pointer nor the keyboard reaches the page behind the overlay.',
    notes: [ 'Dialog, Sheet and Drawer lock scrolling themselves.', '`lockScroll()` returns a release function for non-React code.' ],
    usage: `${imp('useFocusTrap, useScrollLock')}

useScrollLock(open);
const trapRef = useFocusTrap({ active: open });`
  },

  // MARK: Layout
  {
    name: 'useCollapsibleSections',
    group: 'Layout',
    file: 'layout/use-collapsible-sections.js',
    origin: 'Mav9',
    summary: 'Expanded state for several sections, with expand all and collapse all.',
    description: 'Coordinates individual and bulk disclosure for settings pages, filter sidebars, FAQs and inspectors. The initial expansion is read once; onChange receives the expanded ids after each change. The pure reducer is exported too.',
    params: [
      [ 'config.sections', 'string[]', '—', 'Every section id.' ],
      [ 'config.initialExpanded / expandAll', 'string[] / boolean', '[] / false', 'Sections open at first, or all of them.' ],
      [ 'config.onChange', '(expanded: string[]) => void', '—', 'Called after each change.' ]
    ],
    returns: [
      [ 'isExpanded(id)', 'boolean', 'Whether a section is open.' ],
      [ 'expandedSections / expandedCount', 'string[] / number', 'The open sections.' ],
      [ 'allExpanded / allCollapsed', 'boolean', 'For the bulk buttons.' ],
      [ 'toggle / expand / collapse', '(id) => void', 'Change one section.' ],
      [ 'expandAll / collapseAll / setExpanded', 'function', 'Change many at once.' ]
    ],
    accessibility: 'Render each section with Collapsible or Accordion so triggers expose aria-expanded. Disable "Expand all" when everything is open rather than hiding it, so the controls do not move.',
    notes: [ '`collapsibleSectionsReducer`, `createCollapsibleSectionsState` and `areAllSectionsExpanded` are exported.' ],
    usage: `${imp('useCollapsibleSections')}

const sections = useCollapsibleSections({ sections: ['profile', 'billing', 'privacy'], initialExpanded: ['profile'] });`
  },
  {
    name: 'useElementSize',
    group: 'Layout',
    file: 'layout/use-element-size.js',
    origin: 'New',
    summary: "An element's size, kept current with a ResizeObserver.",
    description: 'Measures the border box and follows resizes, for container-driven layouts, truncation and drawing at real pixel sizes. Returns a callback ref and the size; onResize receives each size without a render.',
    params: [
      [ 'options.initialSize', '{ width, height }', '{ width: 0, height: 0 }', 'Size on the server and before the first measurement.' ],
      [ 'options.onResize', '(size) => void', '—', 'Called with each measured size.' ],
      [ 'options.round', 'boolean', 'true', 'Round to whole pixels.' ]
    ],
    returns: [
      [ '[0] ref', '(node) => void', 'Callback ref for the element.' ],
      [ '[1] size', '{ width, height }', 'The current size in pixels.' ]
    ],
    accessibility: 'Size-driven layouts must still reflow at 400% zoom and keep reading order; prefer CSS container queries when only styles change.',
    notes: [ 'Charts measure themselves; use this for your own canvases and layouts.' ],
    usage: `${imp('useElementSize')}

const [ref, { width }] = useElementSize();
<div ref={ref}>{width < 480 ? <CompactCard /> : <WideCard />}</div>`
  },
  {
    name: 'useInView',
    group: 'Layout',
    file: 'layout/use-in-view.js',
    origin: 'New',
    summary: 'Whether an element is in the viewport, from an IntersectionObserver.',
    description: 'For lazy sections, "load more" sentinels, reading progress and reveal effects. With once, it stops observing after the element is first seen.',
    params: [
      [ 'options.root / rootMargin / threshold', 'Element / string / number | number[]', "viewport / '0px' / 0", 'IntersectionObserver options.' ],
      [ 'options.once', 'boolean', 'false', 'Stop after the first time the element is in view.' ],
      [ 'options.initialInView', 'boolean', 'false', 'Value on the server and without IntersectionObserver.' ],
      [ 'options.onChange', '(inView, entry) => void', '—', 'Called on each change.' ]
    ],
    returns: [
      [ '[0] ref', '(node) => void', 'Callback ref for the element.' ],
      [ '[1] inView', 'boolean', 'Whether it intersects.' ],
      [ '[2] entry', 'IntersectionObserverEntry | null', 'The latest entry.' ]
    ],
    accessibility: 'Never hide content until it scrolls into view for readers without JavaScript or with reduced motion; keep "load more" available as a real button too.',
    notes: [ 'Set initialInView to true for content that must render without JavaScript.' ],
    usage: `${imp('useInView')}

const [ref, inView] = useInView({ rootMargin: '200px', once: true });
<section ref={ref}>{inView ? <Comments /> : <Skeleton className='h-40' />}</section>`
  },
  {
    name: 'useScrollPosition',
    group: 'Layout',
    file: 'layout/use-scroll-position.js',
    origin: 'Gaudi',
    summary: 'The vertical scroll offset of the page or a scroll container.',
    description: 'Follows window scrolling, or the element in targetRef, with a passive listener. 0 during server rendering.',
    params: [ [ 'options.targetRef', 'RefObject<HTMLElement>', 'the page', 'Scroll container to follow instead of the window.' ] ],
    returns: [ [ 'scrollY', 'number', 'Pixels scrolled from the top.' ] ],
    accessibility: 'A back-to-top control revealed by scrolling should stay in the tab order (hidden with inert or visibility, not just opacity) and move focus sensibly.',
    notes: [ 'Updates on every scroll event; throttle derived work with useThrottleCallback.' ],
    usage: `${imp('useScrollPosition')}

const scrollY = useScrollPosition();
const compact = scrollY > 64;`
  },

  // MARK: State
  {
    name: 'useControllableState',
    group: 'State',
    file: 'state/use-controllable-state.js',
    origin: 'New',
    summary: 'State that works controlled or uncontrolled, like native inputs.',
    description: 'The component owns the state until its host passes value; then the host accepts, refuses or replaces each change offered through onChange. The setter takes a value or an updater and skips unchanged values. DataTable uses it.',
    params: [
      [ 'options.value', 'any', '—', 'Controlled value; undefined means uncontrolled.' ],
      [ 'options.defaultValue', 'any', '—', 'Initial value when uncontrolled.' ],
      [ 'options.onChange', '(value) => void', '—', 'Called with each change.' ]
    ],
    returns: [
      [ '[0] value', 'any', 'The current value.' ],
      [ '[1] setValue', '(value | (current) => value) => void', 'Offer a change.' ]
    ],
    accessibility: 'Controlled components must still reflect every change visibly and to assistive technology (checked, expanded, selected), even when the host refuses it.',
    notes: [ 'Decide once: switching between controlled and uncontrolled during a component life is not supported.' ],
    usage: `${imp('useControllableState')}

function Rating({ value, defaultValue = 0, onChange }) {
  const [rating, setRating] = useControllableState({ value, defaultValue, onChange });
}`
  },
  {
    name: 'useDisclosure',
    group: 'State',
    file: 'state/use-disclosure.js',
    origin: 'New',
    summary: 'Open, close and toggle state for overlays and disclosures.',
    description: 'Open state for dialogs, menus, drawers and custom disclosures, controlled or uncontrolled, with getTriggerProps for a custom trigger.',
    params: [
      [ 'options.open / defaultOpen', 'boolean', '— / false', 'Controlled or initial state.' ],
      [ 'options.onOpenChange', '(open) => void', '—', 'Called with each change.' ],
      [ 'options.id', 'string', '—', 'Id of the controlled region, added as aria-controls by getTriggerProps.' ]
    ],
    returns: [
      [ 'open', 'boolean', 'Whether it is open.' ],
      [ 'onOpen / onClose / onToggle / setOpen', 'function', 'Change the state.' ],
      [ 'getTriggerProps(props)', '{ aria-expanded, aria-controls?, onClick }', 'Spread on a custom trigger button.' ]
    ],
    accessibility: 'A custom trigger must be a button with aria-expanded and, when the region is in the page, aria-controls; getTriggerProps adds both.',
    notes: [ 'Gaudi overlays take open and onOpenChange directly: pass them through.' ],
    usage: `${imp('useDisclosure')}

const { open, setOpen, onOpen } = useDisclosure();

<Button onClick={onOpen}>Share</Button>
<Dialog open={open} onOpenChange={setOpen} title='Share'>…</Dialog>`
  },
  {
    name: 'usePrevious',
    group: 'State',
    file: 'state/use-previous.js',
    origin: 'New',
    summary: 'The value a prop or state held before it last changed.',
    description: 'For "went up / went down" indicators, transition direction and change detection. Tracked in state, so it is safe under concurrent rendering, and unchanged re-renders keep the same previous value.',
    params: [
      [ 'value', 'any', '—', 'The value to track.' ],
      [ 'initial', 'any', 'undefined', 'Returned until the value first changes.' ]
    ],
    returns: [ [ 'previous', 'any', 'The value before the last change.' ] ],
    accessibility: 'When a change direction is shown with colour or an arrow, also state it in text ("up 12%").',
    notes: [ 'Comparison uses Object.is; pass primitives or stable objects.' ],
    usage: `${imp('usePrevious')}

const previous = usePrevious(count);
const trend = previous === undefined ? 'flat' : count > previous ? 'up' : 'down';`
  },
  {
    name: 'useEventCallback',
    group: 'State',
    file: 'state/use-event-callback.js',
    origin: 'New',
    summary: 'A stable function that always calls the latest callback.',
    description: 'Pass handlers to effects, subscriptions and memoised children without re-running them when an inline callback changes. Call it from events and effects, not during render.',
    params: [ [ 'callback', '(...args) => any', '—', 'The latest implementation.' ] ],
    returns: [ [ 'stableCallback', '(...args) => any', 'Same identity for the component lifetime.' ] ],
    accessibility: 'No direct accessibility impact; it keeps listeners stable so focus and announcements are not reset by re-subscriptions.',
    notes: [ 'Do not call the returned function during render.' ],
    usage: `${imp('useEventCallback')}

const onMessage = useEventCallback((message) => setLog((log) => [...log, message]));
useEffect(() => socket.subscribe(onMessage), [onMessage]);`
  },
  {
    name: 'useMergedRefs',
    group: 'State',
    file: 'state/use-merged-refs.js',
    origin: 'New',
    summary: 'Combine a forwarded ref with your own refs.',
    description: 'One stable callback ref that forwards the node to every ref passed, object or callback, including React 19 ref cleanups.',
    params: [ [ '...refs', 'Ref[]', '—', 'Object refs, callback refs or undefined.' ] ],
    returns: [ [ 'ref', '(node) => void', 'Callback ref to attach.' ] ],
    accessibility: 'Lets a component keep its own ref for focus management while still forwarding the host ref.',
    notes: [ '`mergeRefs(...refs)` is exported for use outside components.' ],
    usage: `${imp('useMergedRefs')}

function SearchField({ ref, ...props }) {
  const inputRef = useRef(null);
  return <Input ref={useMergedRefs(ref, inputRef)} {...props} />;
}`
  },
  {
    name: 'useIsomorphicLayoutEffect',
    group: 'State',
    file: 'state/use-isomorphic-layout-effect.js',
    origin: 'New',
    summary: 'useLayoutEffect in the browser, useEffect on the server.',
    description: 'For measure-before-paint code in components that also render on the server. CodeBlock, EventCalendar and Flow use it.',
    params: [ [ 'effect, deps', 'EffectCallback, DependencyList', '—', 'The same arguments as useLayoutEffect.' ] ],
    returns: [ [ '(nothing)', 'void', 'Runs the effect.' ] ],
    accessibility: 'Measuring before paint avoids visible jumps that can disorient readers and move focus targets.',
    notes: [ 'Prefer useEffect unless you must read layout before the browser paints.' ],
    usage: `${imp('useIsomorphicLayoutEffect')}

useIsomorphicLayoutEffect(() => {
  setHeight(ref.current.scrollHeight);
}, [content]);`
  },
  {
    name: 'useDebounceValue',
    group: 'State',
    file: 'state/use-debounce-value.js',
    origin: 'Mav9',
    summary: 'A value that updates only after it stops changing.',
    description: 'Delays a fast-changing value, such as a search query, until it has been still for the delay, so filtering and requests do not run on every keystroke.',
    params: [
      [ 'value', 'any', '—', 'The live value.' ],
      [ 'delay', 'number', '300', 'Milliseconds of stillness before updating.' ]
    ],
    returns: [ [ 'debouncedValue', 'any', 'The settled value.' ] ],
    accessibility: 'Announce result counts after the debounced update, not per keystroke, so screen readers are not flooded.',
    notes: [ 'Use useDebounceCallback when you need cancel or flush.' ],
    usage: `${imp('useDebounceValue')}

const debouncedQuery = useDebounceValue(query, 300);
const results = useMemo(() => search(debouncedQuery), [debouncedQuery]);`
  },
  {
    name: 'useDebounceCallback',
    group: 'State',
    file: 'state/use-debounce-callback.js',
    origin: 'Mav9',
    summary: 'A debounced function with cancel and flush.',
    description: 'Runs the latest callback once, delay ms after the last call, with the latest arguments: autosave, search requests and resize work. Pending work is cancelled on unmount.',
    params: [
      [ 'callback', '(...args) => void', '—', 'The work to run.' ],
      [ 'delay', 'number', '300', 'Milliseconds after the last call.' ]
    ],
    returns: [
      [ 'debounced(...args)', 'function', 'Schedule the work.' ],
      [ 'debounced.cancel / flush / isPending', 'function', 'Drop pending work, run it now, or check for it.' ]
    ],
    accessibility: 'For autosave, show and announce the saved state once the debounced save finishes, and flush on blur so work is not lost.',
    notes: [ '`createDebouncer(callback, delay)` is exported for non-React code.' ],
    usage: `${imp('useDebounceCallback')}

const save = useDebounceCallback((text) => saveDraft(text), 800);
<Textarea onChange={(event) => save(event.target.value)} onBlur={save.flush} />`
  },
  {
    name: 'useThrottleCallback',
    group: 'State',
    file: 'state/use-throttle-callback.js',
    origin: 'New',
    summary: 'A function that runs at most once per interval.',
    description: 'Keeps scroll, pointer and resize handlers responsive without running on every event: the first call runs at once and later calls fold into one trailing call with the latest arguments.',
    params: [
      [ 'callback', '(...args) => void', '—', 'The work to run.' ],
      [ 'wait', 'number', '200', 'Minimum milliseconds between runs.' ],
      [ 'options.leading / trailing', 'boolean', 'true / true', 'Run on the first call, and once more after the window.' ]
    ],
    returns: [
      [ 'throttled(...args)', 'function', 'Call as often as you like.' ],
      [ 'throttled.cancel / flush', 'function', 'Drop or run the pending trailing call.' ]
    ],
    accessibility: 'Keep the final state accurate (trailing: true) so progress indicators and announcements end on the real value.',
    notes: [ '`createThrottler(callback, wait, options)` is exported for non-React code.' ],
    usage: `${imp('useThrottleCallback')}

const onScroll = useThrottleCallback(() => setProgress(readProgress()), 100);`
  },
  {
    name: 'useInterval',
    group: 'State',
    file: 'state/use-interval.js',
    origin: 'New',
    summary: 'setInterval that can pause and always runs the latest callback.',
    description: 'Calls the callback every delay ms. Pass null to pause; the callback can read fresh state without restarting the interval.',
    params: [
      [ 'callback', '() => void', '—', 'Called on each tick.' ],
      [ 'delay', 'number | null', '—', 'Milliseconds between ticks; null or false pauses.' ]
    ],
    returns: [ [ '(nothing)', 'void', 'The interval stops on unmount.' ] ],
    accessibility: 'Content that moves or updates automatically for more than five seconds needs a pause control (WCAG 2.2.2); pass null while paused.',
    notes: [ 'Pause in hidden tabs with usePageVisibility.' ],
    usage: `${imp('useInterval')}

useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);`
  },
  {
    name: 'useTimeout',
    group: 'State',
    file: 'state/use-timeout.js',
    origin: 'New',
    summary: 'A one-off timer with reset and clear.',
    description: 'Calls the callback once, delay ms after mount or after the delay changes. Pass null to hold it; reset restarts it and clear cancels it.',
    params: [
      [ 'callback', '() => void', '—', 'Called when the timer fires.' ],
      [ 'delay', 'number | null', '—', 'Milliseconds; null holds the timer.' ]
    ],
    returns: [ [ 'reset / clear', '() => void', 'Restart or cancel the timer.' ] ],
    accessibility: 'Auto-dismissed messages must stay long enough to read, pause while hovered or focused, and stay available elsewhere (WCAG 2.2.1).',
    notes: [ 'Clear on hover and focus, reset on leave and blur, for dismissible notices.' ],
    usage: `${imp('useTimeout')}

const { clear, reset } = useTimeout(() => setVisible(false), visible ? 5000 : null);`
  },
  {
    name: 'useStep',
    group: 'State',
    file: 'state/use-step.js',
    origin: 'New',
    summary: 'Zero-based step state for wizards and multi-page forms.',
    description: 'The current step with next, previous, goTo and reset, clamped to the step count, controlled or uncontrolled. Pairs with Stepper and Progress.',
    params: [
      [ 'options.count', 'number', '—', 'Number of steps.' ],
      [ 'options.step / defaultStep', 'number', '— / 0', 'Controlled or initial step.' ],
      [ 'options.onStepChange', '(step) => void', '—', 'Called with each change.' ]
    ],
    returns: [
      [ 'step / count', 'number', 'The current step and the total.' ],
      [ 'isFirst / isLast / canGoPrevious / canGoNext', 'boolean', 'For button state.' ],
      [ 'next / previous / goTo(step) / reset', 'function', 'Move between steps; goTo clamps.' ]
    ],
    accessibility: 'Move focus to the new step heading after Next or Back, and state the position in text ("Step 2 of 4").',
    notes: [ 'Validate the current step before calling next; the hook does not know your rules.' ],
    usage: `${imp('useStep')}

const { step, next, previous, canGoNext, canGoPrevious } = useStep({ count: 4 });`
  },
  {
    name: 'useSliderInput',
    group: 'State',
    file: 'state/use-slider-input.js',
    origin: 'Gaudi',
    summary: 'Keep a range slider and its number inputs in sync.',
    description: 'For a two-thumb range with min and max inputs: slider moves update the inputs, and typed values are clamped against the bounds and the other thumb when committed.',
    params: [ [ 'options.minValue / maxValue / initialValue', 'number / number / [number, number]', '—', 'Bounds and the starting range.' ] ],
    returns: [
      [ 'sliderValues / inputValues', '[number, number]', 'Committed range and what the inputs show.' ],
      [ 'handleSliderChange(values)', 'function', 'Pass to the Slider onValueChange.' ],
      [ 'handleInputChange(event, index)', 'function', 'Pass to each input onChange.' ],
      [ 'validateAndUpdateValue(value, index)', 'function', 'Commit a typed value on blur or Enter.' ]
    ],
    accessibility: 'Label both inputs ("Minimum price", "Maximum price") and both slider thumbs; the inputs give keyboard and screen reader users an exact entry.',
    notes: [ 'Commit typed values on blur or Enter, not on every keystroke.' ],
    usage: `${imp('useSliderInput')}

const price = useSliderInput({ minValue: 0, maxValue: 500, initialValue: [50, 300] });`
  }
];

/** Storybook title, story id and docs id for a hook. */
export const hookTitle = (hook) => `Hooks/${hook.group}/${hook.name}`;
export const hookStoryId = (hook) => `hooks-${hook.group.toLowerCase()}-${hook.name.toLowerCase()}`;
export const hookDocsId = (hook) => `${hookStoryId(hook)}--docs`;
export const getHook = (name) => hookCatalogue.find((hook) => hook.name === name);
