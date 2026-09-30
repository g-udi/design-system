// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import {
  Children,
  createContext,
  isValidElement,
  memo,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  highlightCode,
  markdownCodeProps,
  markdownFences,
  resolveCodeBlockLanguage,
  stripNotationComments,
  toPlainLines
} from './code-block-highlight-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
const CodeBlockConfigContext = createContext(null);
const CodeBlockDocumentContext = createContext(null);
const CodeBlockHeaderContext = createContext(false);
const CodeBlockSurfacePropsContext = createContext(null);
const CodeBlockActionsContext = createContext(null);
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
function useInternalConfig(part) {
  const context = useContext(CodeBlockConfigContext);
  if (!context) {
    throw new Error(`${part} must be used within a CodeBlock`);
  }
  return context;
}
function useCodeBlockConfig(part) {
  const context = useContext(CodeBlockConfigContext);
  const document2 = useContext(CodeBlockDocumentContext);
  if (!context || !document2) {
    throw new Error(`${part} must be used within a CodeBlock`);
  }
  return useMemo(
    () => ({ ...context, code: document2.code }),
    [context, document2.code]
  );
}
const ROOT_GHOST_CLASS = '[--code-block-bg:transparent]';
const ROOT_RADIUS_CLASS = '[--code-block-radius:var(--radius-lg)]';
const ROOT_TOKEN_CLASS = [
  '[--code-block-padding:--spacing(3)]',
  '[--code-block-gutter-width:--spacing(9)]',
  '[--code-block-gutter-gap:--spacing(2.5)]',
  /* The fold channel sits between the numbers and the code, so both the number
     cell's padding and the gutter width are expressed against it and a block
     without folding pays nothing for it. */
  '[--code-block-fold-width:--spacing(4.5)]',
  '[--code-block-number-pad:var(--code-block-gutter-gap)]',
  'data-[gutter-channel]:[--code-block-number-pad:calc(var(--code-block-gutter-gap)+var(--code-block-fold-width))]',
  /* A diff column breathes: the +/- glyph gets a wider channel. */
  'data-[has-diff]:[--code-block-gutter-gap:--spacing(4)]',
  '[--code-block-line-height:1.5rem]',
  '[--code-block-font-size:0.8125rem]',
  '[--code-block-copy-inset:--spacing(2)]',
  /* Where a PINNED control starts. With a header composed in, the root's top
     edge is the header, so an unadjusted inset drops the copy button onto the
     title row instead of the code. The header's own `min-h-9` is the height
     assumed here, plus its 1px bottom border; override the variable for a
     header built taller than one row. */
  '[--code-block-header-height:--spacing(9)]',
  '[--code-block-copy-top:var(--code-block-copy-inset)]',
  'data-[has-header]:[--code-block-copy-top:calc(var(--code-block-header-height)+1px+var(--code-block-copy-inset))]',
  /* Room the expanded block keeps under the last line for the floating
     "Show less" control. */
  '[--code-block-expand-clearance:--spacing(9)]',
  /* What sits behind a sticky line number while the code scrolls under it.
     `ghost` blanks it, because there the surface belongs to the wrapper. */
  '[--code-block-bg:var(--card)]',
  '[--code-block-highlight-bg:color-mix(in_oklch,var(--primary)_6%,transparent)]',
  'dark:[--code-block-highlight-bg:color-mix(in_oklch,var(--primary)_12%,transparent)]',
  '[--code-block-highlight-bar:color-mix(in_oklch,var(--primary)_60%,transparent)]',
  '[--code-block-diff-add-bg:color-mix(in_oklch,var(--success)_8%,transparent)]',
  'dark:[--code-block-diff-add-bg:color-mix(in_oklch,var(--success)_12%,transparent)]',
  '[--code-block-diff-remove-bg:color-mix(in_oklch,var(--destructive)_8%,transparent)]',
  'dark:[--code-block-diff-remove-bg:color-mix(in_oklch,var(--destructive)_12%,transparent)]',
  '[--code-block-error-bg:color-mix(in_oklch,var(--destructive)_8%,transparent)]',
  'dark:[--code-block-error-bg:color-mix(in_oklch,var(--destructive)_12%,transparent)]',
  '[--code-block-warning-bg:color-mix(in_oklch,var(--warning)_10%,transparent)]',
  'dark:[--code-block-warning-bg:color-mix(in_oklch,var(--warning)_14%,transparent)]',
  '[--code-block-info-bg:color-mix(in_oklch,var(--info)_8%,transparent)]',
  'dark:[--code-block-info-bg:color-mix(in_oklch,var(--info)_12%,transparent)]',
  '[--code-block-caret-color:var(--primary)]'
].join(' ');
const ROOT_BASE_CLASS =
  'group/code-block relative flex min-w-0 flex-col rounded-(--code-block-radius) text-left';
const ROOT_SURFACE_CLASS =
  'border border-ui-border bg-ui-card text-ui-card-foreground bg-clip-padding';
const TOKEN_COLOR_CLASS =
  '[&_[data-slot=code-block-token]]:text-[color:color-mix(in_srgb,var(--cb-c,currentColor)_70%,var(--ds-color-text))] dark:[&_[data-slot=code-block-token]]:text-[color:color-mix(in_srgb,var(--cb-cd,currentColor)_85%,var(--ds-color-text))]';
const LINE_NUMBER_CLASS = [
  '[[data-code-line-numbers]_&]:before:pointer-events-none',
  '[[data-code-line-numbers]_&]:before:sticky',
  '[[data-code-line-numbers]_&]:before:left-0',
  '[[data-code-line-numbers]_&]:before:z-10',
  '[[data-code-line-numbers]_&]:before:-ml-(--code-block-gutter-width)',
  '[[data-code-line-numbers]_&]:before:inline-block',
  '[[data-code-line-numbers]_&]:before:w-(--code-block-gutter-width)',
  '[[data-code-line-numbers]_&]:before:pl-(--code-block-padding)',
  '[[data-code-line-numbers]_&]:before:pr-(--code-block-number-pad)',
  '[[data-code-line-numbers]_&]:before:bg-(--code-block-bg)',
  '[[data-code-line-numbers]_&]:before:text-right',
  '[[data-code-line-numbers]_&]:before:tabular-nums',
  '[[data-code-line-numbers]_&]:before:text-ui-muted-foreground',
  '[[data-code-line-numbers]_&]:before:select-none',
  '[[data-code-line-numbers]_&]:before:[counter-increment:cb-line]',
  '[[data-code-line-numbers]_&]:before:content-[counter(cb-line)]',
  /* A line carrying its own gutter label (a patch's dual numbers, a hunk
     marker) renders that instead of the counter. */
  '[[data-code-line-numbers]_&[data-gutter]]:before:content-[attr(data-gutter)]',
  '[[data-code-line-numbers]_&[data-gutter]]:before:whitespace-pre'
].join(' ');
const LINE_DIFF_CLASS = [
  'data-[diff]:after:absolute',
  /* Above the number cell. That cell is sticky with an opaque backdrop at z-10,
     so a glyph sharing its column is painted out at the default z. */
  'data-[diff]:after:z-20',
  'data-[diff]:after:left-0',
  'data-[diff]:after:w-(--code-block-padding)',
  'data-[diff]:after:text-center',
  '[[data-code-line-numbers]_&]:data-[diff]:after:-left-(--code-block-gutter-gap)',
  '[[data-code-line-numbers]_&]:data-[diff]:after:w-(--code-block-gutter-gap)',
  'data-[diff]:after:select-none',
  'data-[diff=add]:after:text-success',
  'data-[diff=remove]:after:text-ui-destructive',
  "data-[diff=add]:after:content-['+']",
  "data-[diff=remove]:after:content-['-']"
].join(' ');
const LINE_STATE_CLASS = [
  'data-[highlighted]:bg-(--code-block-highlight-bg)',
  'data-[highlighted]:shadow-[inset_2px_0_0_0_var(--code-block-highlight-bar)]',
  'data-[diff=add]:bg-(--code-block-diff-add-bg)',
  'data-[diff=remove]:bg-(--code-block-diff-remove-bg)',
  'data-[level=error]:bg-(--code-block-error-bg)',
  'data-[level=warning]:bg-(--code-block-warning-bg)',
  'data-[level=info]:bg-(--code-block-info-bg)',
  'data-[selected]:bg-ui-accent',
  /* Arrow navigation needs a visible position (WCAG 2.4.7); gated on the
     selectable listbox so plain blocks stay inert on hover. */
  '[[data-selectable]_&]:data-[active]:bg-ui-muted/40'
].join(' ');
const LINE_MOTION_CLASS =
  '[[data-streaming]_&]:animate-in [[data-streaming]_&]:fade-in-0 [[data-streaming]_&]:slide-in-from-bottom-1 [[data-streaming]_&]:duration-150 [[data-streaming]_&]:ease-out motion-reduce:animate-none';
const TOKEN_MOTION_CLASS = '';
const LINE_FOCUS_CLASS =
  'data-[blurred]:saturate-0 data-[blurred]:transition-[filter] group-hover/code-block:data-[blurred]:opacity-100 group-hover/code-block:data-[blurred]:blur-none';
const LINE_BASE_CLASS = cn(
  'relative block min-h-(--code-block-line-height) w-full px-(--code-block-padding) leading-(--code-block-line-height)',
  /* With numbers on, the left inset lives inside the sticky cell instead, so
     paying it here too would restore the double count the gutter just lost. */
  '[[data-code-line-numbers]_&]:pl-0'
);
const INDENT_RE = /^[ \t]*/;
function computeFoldRegions(lines) {
  const indent = (text) =>
    (INDENT_RE.exec(text)?.[0] ?? '').replace(/\t/g, '  ').length;
  const blank = (text) => text.trim().length === 0;
  const regions = [];
  const stack = [];
  let previous = null;
  for (const line of lines) {
    if (blank(line.text)) continue;
    const own = indent(line.text);
    while (stack.length && own <= stack[stack.length - 1].indent) {
      const open = stack.pop();
      if (open.last > open.start) {
        regions.push({ start: open.start, end: open.last });
      }
    }
    for (const open of stack) open.last = line.number;
    if (previous && own > previous.indent) {
      stack.push({
        start: previous.number,
        indent: previous.indent,
        last: line.number
      });
    }
    previous = { number: line.number, indent: own };
  }
  while (stack.length) {
    const open = stack.pop();
    if (open.last > open.start)
      regions.push({ start: open.start, end: open.last });
  }
  return regions.sort((a, b) => a.start - b.start);
}
const EMPTY_FOLD_REGIONS = [];
function tokenStyle(token) {
  if (!token.color && !token.colorDark && !token.fontStyle) return void 0;
  const style = {};
  if (token.color) style['--cb-c'] = token.color;
  if (token.colorDark) style['--cb-cd'] = token.colorDark;
  if (token.fontStyle === 'italic') style.fontStyle = 'italic';
  if (token.fontStyle === 'bold') style.fontWeight = 700;
  if (token.fontStyle === 'underline') style.textDecoration = 'underline';
  return style;
}
function CodeBlockTokens({ tokens }) {
  return (
    <>
      {tokens.map((token, index) => {
        const style = tokenStyle(token);
        if (!style && !token.word) {
          return <span key={index}>{token.content}</span>;
        }
        return (
          <span
            key={index}
            data-slot='code-block-token'
            data-word={token.word || void 0}
            className={cn(
              token.word &&
                'bg-ui-primary/10 ring-ui-primary/20 rounded-sm px-0.5 py-px ring-1 ring-inset'
            )}
            style={style}
          >
            {token.content}
          </span>
        );
      })}
    </>
  );
}
const CodeBlockLineRow = memo(function CodeBlockLineRow2({
  line,
  selectable,
  selected,
  focusMode,
  active,
  caret,
  actions,
  actionsSide = 'end',
  domIdBase,
  startLine = 1,
  onSelect,
  foldable: _foldable,
  foldRegion,
  folded,
  onToggleFold
}) {
  const state = line.state;
  const blurred = focusMode && !state?.focused;
  const lineDomId = domIdBase ? `${domIdBase}-L${line.number}` : void 0;
  const hiddenCount = foldRegion ? foldRegion.end - foldRegion.start : 0;
  const inGutter = actionsSide === 'gutter' && !foldRegion;
  return (
    <span
      data-slot='code-block-line'
      data-code-line={line.number}
      data-gutter={line.gutter}
      id={lineDomId}
      data-active={active || void 0}
      data-highlighted={state?.highlighted || void 0}
      data-diff={state?.diff}
      data-focused={state?.focused || void 0}
      data-blurred={blurred || void 0}
      data-level={state?.level}
      data-selected={selected || void 0}
      role={selectable ? 'option' : void 0}
      aria-label={
        selectable
          ? `Line ${line.number}: ${line.text || 'Blank line'}`
          : undefined
      }
      aria-selected={selectable ? selected : void 0}
      tabIndex={selectable ? -1 : void 0}
      onMouseDown={
        /* Shift-click is line-range selection here, but the browser also reads
         it as "extend the text selection", which paints a stray highlight
         across the block. Suppressing it only for the shift case leaves plain
         drag-to-select, and therefore copying, untouched. */
        selectable
          ? (event) => {
              if (event.shiftKey) event.preventDefault();
            }
          : void 0
      }
      onClick={
        selectable && onSelect
          ? (event) => onSelect(line.number, event.shiftKey)
          : void 0
      }
      className={cn(
        LINE_BASE_CLASS,
        LINE_NUMBER_CLASS,
        LINE_STATE_CLASS,
        LINE_DIFF_CLASS,
        LINE_FOCUS_CLASS,
        LINE_MOTION_CLASS,
        selectable && 'cursor-pointer'
      )}
      style={{ counterReset: `cb-line ${line.number - 1}` }}
    >
      {foldRegion && onToggleFold ? (
        <button
          type='button'
          tabIndex={selectable ? -1 : void 0}
          data-slot='code-block-fold-toggle'
          data-state={folded ? 'folded' : 'unfolded'}
          aria-expanded={!folded}
          aria-label={
            folded
              ? `Unfold lines ${foldRegion.start + startLine - 1} to ${foldRegion.end + startLine - 1}`
              : `Fold lines ${foldRegion.start + startLine - 1} to ${foldRegion.end + startLine - 1}`
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleFold(foldRegion.start);
          }}
          className={cn(
            /* Styled as a ghost xs button rather than composed from Button:
         the ghost variant paints aria-expanded:bg-muted, which would
         keep every UNFOLDED toggle lit, and its icon rungs do not fit
         an 18px channel. Hover feedback only; folded state reads
         through color. */
            /* Square, centred in the line box: height matches the width and
         the translate makes up the difference to the 24px line. Open
         regions read darker than folded ones. */
            'text-ui-muted-foreground hover:bg-ui-muted hover:text-ui-foreground focus-visible:ring-ui-ring/50 sticky z-20 inline-flex size-(--code-block-fold-width) shrink-0 translate-y-[calc((var(--code-block-line-height)-var(--code-block-fold-width))/2)] cursor-pointer items-center justify-center rounded-[4px] align-top outline-none focus-visible:ring-2',
            /* Margins cancel: -(4px + width) then +4px, so the toggle paints
         in the channel, sits 4px from the code, and the code still
         starts where a row without a toggle does. An uncancelled
         margin slid every foldable row and clipped characters. The
         spacing() shorthand is written as a rem literal because
         `mr-(--spacing(1))` is not valid Tailwind and generates no
         rule at all - measured live as a 4px drift. */
            '-ml-[calc(var(--code-block-fold-width)+0.25rem)]',
            'mr-[0.25rem]',
            'left-[calc(var(--code-block-gutter-width)-var(--code-block-fold-width)-0.25rem)]',
            folded && 'text-ui-muted-foreground'
          )}
        >
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='size-3'
          >
            <path d={folded ? 'm9 18 6-6-6-6' : 'm6 9 6 6 6-6'} />
          </svg>
        </button>
      ) : null}
      {actions && active ? (
        <span
          data-slot='code-block-line-actions'
          data-side={inGutter ? 'gutter' : 'end'}
          contentEditable={false}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            /* Inside the <pre>, so the code surface's mono face, pre
         whitespace and token color would cascade into real buttons
         placed here. Reset to app typography at the boundary. */
            'text-ui-foreground z-20 items-center gap-1 font-sans whitespace-normal select-none',
            !inGutter &&
              'absolute end-2 top-0 flex h-(--code-block-line-height)',
            /* ABSOLUTE and centred on the row's START EDGE: `left-0` is where
         the code column begins (the row box already excludes the
         gutter), and the -50% translate hangs the control half over the
         number column, half over the code - the editor treatment. Being
         out of flow on BOTH axes is the point: an in-flow version
         pushed the code right by its own width, and an earlier block
         level one broke the row onto a new line. The control travels
         with the code on a horizontal scroll; it cannot also be sticky. */
            inGutter &&
              'absolute top-1/2 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center'
          )}
        >
          {actions({ line: line.number, text: line.text, state })}
        </span>
      ) : null}
      <span data-slot='code-block-line-content'>
        {/* An empty line needs an explicit break. Copying a selection relies on
       the browser emitting a newline between block-level rows, and a row
       with no text at all contributes neither text nor separator, so a
       blank line silently vanishes from the pasted source. */}
        {line.tokens.length === 0 ? <br /> : null}
        <CodeBlockTokens tokens={line.tokens} />
        {folded && hiddenCount > 0 ? (
          /* `select-none` is doing real work: a manual drag-select over a
       folded block would otherwise paste this chip into the middle of
       the source. The copy button reads the raw code and never sees it. */
          <button
            type='button'
            tabIndex={selectable ? -1 : void 0}
            data-slot='code-block-fold-marker'
            aria-label={`Unfold ${hiddenCount} hidden lines`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFold?.(line.number);
            }}
            className='bg-ui-muted/80 text-ui-muted-foreground hover:bg-ui-muted ml-2 inline-flex h-(--code-block-fold-width) translate-y-[calc((var(--code-block-line-height)-var(--code-block-fold-width))/2)] cursor-pointer items-center rounded-sm px-1.5 align-top text-[0.8em] leading-none select-none'
          >
            {`... ${hiddenCount} lines`}
          </button>
        ) : null}
        {caret ? (
          <span
            data-slot='code-block-caret'
            aria-hidden='true'
            className='ml-0.5 inline-block h-[0.12em] w-[0.55em] translate-y-[0.02em] animate-pulse rounded-[1px] bg-(--code-block-caret-color) motion-reduce:animate-none'
          />
        ) : null}
      </span>
    </span>
  );
});
function CodeBlock({
  code,
  language,
  lines: linesProp,
  themes,
  highlight = true,
  showLineNumbers = false,
  startLine = 1,
  wrap: wrapProp,
  defaultWrap = false,
  onWrapChange,
  maxLines,
  variant = 'default',
  label,
  highlightedLines,
  highlightedWords,
  focusedLines,
  diff,
  lineLevels,
  transformers,
  streaming = false,
  selectable = false,
  selectedLines,
  defaultSelectedLines,
  onSelectedLinesChange,
  completeAnnouncement,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  foldable = false,
  foldRegions: foldRegionsProp,
  folded,
  defaultFolded,
  onFoldedChange,
  className,
  children,
  ...props
}) {
  const contentId = useId();
  const source = code ?? '';
  const resolvedLanguage = resolveCodeBlockLanguage(language);
  const deferredSource = useDeferredValue(source);
  const plainLines = useMemo(
    () => toPlainLines(deferredSource, startLine),
    [deferredSource, startLine]
  );
  const [highlighted, setHighlighted] = useState(null);
  const shouldHighlight =
    !linesProp && highlight && Boolean(resolvedLanguage) && source.length > 0;
  const specKey = JSON.stringify([
    themes ?? null,
    startLine,
    highlightedLines ?? null,
    highlightedWords ?? null,
    focusedLines ?? null,
    diff ?? null,
    lineLevels ?? null
  ]);
  const transformersWarnedRef = useRef(false);
  const previousTransformersRef = useRef(transformers);
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      streaming &&
      previousTransformersRef.current !== transformers &&
      !transformersWarnedRef.current
    ) {
      transformersWarnedRef.current = true;
      console.warn(
        '[code-block] `transformers` changed identity during a stream, which re-tokenizes the whole document per chunk. Hoist the array to module scope or memoize it.'
      );
    }
    previousTransformersRef.current = transformers;
  }, [transformers, streaming]);
  useEffect(() => {
    if (!shouldHighlight) {
      setHighlighted(null);
      return;
    }
    const [
      specThemes,
      specStartLine,
      specHighlightedLines,
      specHighlightedWords,
      specFocusedLines,
      specDiff,
      specLineLevels
    ] = JSON.parse(specKey);
    let active = true;
    void highlightCode(deferredSource, {
      language,
      instanceKey: contentId,
      themes: specThemes ?? void 0,
      transformers,
      startLine: specStartLine,
      highlightedLines: specHighlightedLines ?? void 0,
      highlightedWords: specHighlightedWords ?? void 0,
      focusedLines: specFocusedLines ?? void 0,
      diff: specDiff ?? void 0,
      lineLevels: specLineLevels ?? void 0
    }).then((next) => {
      if (active) {
        setHighlighted({ source: deferredSource, spec: specKey, lines: next });
      }
    });
    return () => {
      active = false;
    };
  }, [
    shouldHighlight,
    deferredSource,
    language,
    transformers,
    specKey,
    contentId
  ]);
  const lines = useMemo(() => {
    if (linesProp) return linesProp;
    if (!shouldHighlight || !highlighted) return plainLines;
    if (
      highlighted.spec !== specKey ||
      !deferredSource.startsWith(highlighted.source)
    ) {
      return plainLines;
    }
    if (highlighted.lines.length >= plainLines.length) return highlighted.lines;
    return [
      ...highlighted.lines,
      ...plainLines.slice(highlighted.lines.length)
    ];
  }, [
    linesProp,
    shouldHighlight,
    highlighted,
    plainLines,
    deferredSource,
    specKey
  ]);
  const focusMode = useMemo(
    () => lines.some((line) => line.state?.focused),
    [lines]
  );
  const hasDiff = useMemo(
    () => lines.some((line) => line.state?.diff),
    [lines]
  );
  const [internalWrap, setInternalWrap] = useState(defaultWrap);
  const wrap = wrapProp ?? internalWrap;
  const setWrap = useCallback(
    (next) => {
      if (wrapProp === void 0) setInternalWrap(next);
      onWrapChange?.(next);
    },
    [wrapProp, onWrapChange]
  );
  const collapsible = typeof maxLines === 'number' && lines.length > maxLines;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = expandedProp ?? internalExpanded;
  const setExpanded = useCallback(
    (next) => {
      if (expandedProp === void 0) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [expandedProp, onExpandedChange]
  );
  const isExpanded = collapsible ? expanded : true;
  const [internalSelected, setInternalSelected] = useState(
    defaultSelectedLines ?? []
  );
  const selection = selectedLines ?? internalSelected;
  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const lastSelectedRef = useRef(null);
  const selectionStateRef = useRef({
    selection,
    selectedSet,
    controlled: selectedLines !== void 0,
    onSelectedLinesChange
  });
  selectionStateRef.current = {
    selection,
    selectedSet,
    controlled: selectedLines !== void 0,
    onSelectedLinesChange
  };
  const commitSelection = useCallback((next) => {
    if (!selectionStateRef.current.controlled) setInternalSelected(next);
    selectionStateRef.current.onSelectedLinesChange?.(next);
  }, []);
  const toggleLine = useCallback(
    (line, extend) => {
      const anchor = lastSelectedRef.current;
      const { selection: selection2, selectedSet: selectedSet2 } =
        selectionStateRef.current;
      if (extend && anchor !== null) {
        const from = Math.min(anchor, line);
        const to = Math.max(anchor, line);
        const range = [];
        for (let value = from; value <= to; value += 1) range.push(value);
        commitSelection(range);
        return;
      }
      lastSelectedRef.current = line;
      commitSelection(
        selectedSet2.has(line)
          ? selection2.filter((value) => value !== line)
          : [...selection2, line].sort((a, b) => a - b)
      );
    },
    [commitSelection]
  );
  const foldRegions = useMemo(() => {
    if (!foldable) return EMPTY_FOLD_REGIONS;
    if (foldRegionsProp) return foldRegionsProp;
    return computeFoldRegions(lines).map((region) => ({
      start: region.start - startLine + 1,
      end: region.end - startLine + 1
    }));
  }, [foldable, foldRegionsProp, lines, startLine]);
  const foldStarts = useMemo(
    () => new Map(foldRegions.map((region) => [region.start, region])),
    [foldRegions]
  );
  const [internalFolded, setInternalFolded] = useState(defaultFolded ?? []);
  const foldedValue = folded ?? internalFolded;
  const foldedSet = useMemo(() => new Set(foldedValue), [foldedValue]);
  const foldStateRef = useRef({
    foldedValue,
    foldedSet,
    controlled: folded !== void 0,
    onFoldedChange
  });
  foldStateRef.current = {
    foldedValue,
    foldedSet,
    controlled: folded !== void 0,
    onFoldedChange
  };
  const commitFolded = useCallback((next) => {
    if (!foldStateRef.current.controlled) setInternalFolded(next);
    foldStateRef.current.onFoldedChange?.(next);
  }, []);
  const toggleFold = useCallback(
    (start) => {
      const { foldedValue: foldedValue2, foldedSet: foldedSet2 } =
        foldStateRef.current;
      commitFolded(
        foldedSet2.has(start)
          ? foldedValue2.filter((value) => value !== start)
          : [...foldedValue2, start].sort((a, b) => a - b)
      );
    },
    [commitFolded]
  );
  const renderedLines = useMemo(() => {
    if (!foldable || foldedSet.size === 0) return lines;
    const hidden = /* @__PURE__ */ new Set();
    for (const start of foldedSet) {
      const region = foldStarts.get(start);
      if (!region) continue;
      for (let n = region.start + 1; n <= region.end; n += 1) {
        hidden.add(n + startLine - 1);
      }
    }
    return lines.filter((line) => !hidden.has(line.number));
  }, [foldable, foldedSet, foldStarts, lines, startLine]);
  const configValue = useMemo(
    () => ({
      language,
      resolvedLanguage,
      showLineNumbers,
      wrap,
      setWrap,
      wrapControlled: wrapProp !== void 0,
      expanded: isExpanded,
      setExpanded,
      collapsible,
      streaming,
      contentId
    }),
    [
      language,
      resolvedLanguage,
      showLineNumbers,
      wrap,
      setWrap,
      wrapProp,
      isExpanded,
      setExpanded,
      collapsible,
      streaming,
      contentId
    ]
  );
  const clearSelection = useCallback(
    () => commitSelection([]),
    [commitSelection]
  );
  const documentValue = useMemo(
    () => ({
      code: source,
      lines,
      selected: selectedSet,
      selectable,
      toggleLine,
      clearSelection,
      foldable,
      foldRegions,
      folded: foldedSet,
      toggleFold,
      setFolded: commitFolded
    }),
    [
      source,
      lines,
      selectedSet,
      selectable,
      toggleLine,
      clearSelection,
      foldable,
      foldRegions,
      foldedSet,
      toggleFold,
      commitFolded
    ]
  );
  const visibleLines = collapsible && !isExpanded ? maxLines : void 0;
  const hasHeader = containsElementType(children, CodeBlockHeader);
  const [lineActions, setLineActions] = useState(null);
  const [actionsSide, setActionsSide] = useState('end');
  const actionsOwnerRef = useRef(null);
  const actionsRegistry = useMemo(
    () => ({
      /* Wrapped in a setter callback: a render prop IS a function, so passing
         it to setState bare would run it as a state updater. Ownership makes
         a stale unmount a no-op and makes a SECOND live group loud in dev -
         the registry holds one render prop, so the second silently won. */
      register: (owner, render, side = 'end') => {
        if (render) {
          if (
            process.env.NODE_ENV !== 'production' &&
            actionsOwnerRef.current &&
            actionsOwnerRef.current !== owner
          ) {
            console.warn(
              '[code-block] Two CodeBlockLineActions are mounted; the block renders ONE action group and the later mount replaces the earlier one.'
            );
          }
          actionsOwnerRef.current = owner;
        } else if (actionsOwnerRef.current !== owner) {
          return;
        } else {
          actionsOwnerRef.current = null;
        }
        setLineActions(() => render);
        setActionsSide(side);
      }
    }),
    []
  );
  const gutterChannel = foldable;
  const hasContent = containsElementType(children, CodeBlockContent);
  const surfaceProps = {
    lines: renderedLines,
    gutterMax: lines[lines.length - 1]?.number ?? startLine,
    foldable,
    gutterChannel,
    actionsSide,
    foldStarts,
    foldedSet,
    onToggleFold: toggleFold,
    expandClearance: collapsible && isExpanded,
    wrap,
    startLine,
    showLineNumbers,
    focusMode,
    selectable,
    selectedSet,
    toggleLine,
    visibleLines,
    streaming,
    label: label ?? (language ? `${language} code` : 'Code'),
    contentId,
    actions: lineActions,
    completeAnnouncement,
    builtInSurfaceRendered: !hasContent
  };
  return (
    <CodeBlockConfigContext.Provider value={configValue}>
      <CodeBlockDocumentContext.Provider value={documentValue}>
        <CodeBlockActionsContext.Provider value={actionsRegistry}>
          <div
            data-slot='code-block'
            data-variant={variant}
            data-streaming={streaming || void 0}
            data-has-diff={hasDiff || void 0}
            data-foldable={foldable || void 0}
            data-gutter-channel={gutterChannel || void 0}
            data-has-header={hasHeader || void 0}
            className={cn(
              ROOT_BASE_CLASS,
              ROOT_RADIUS_CLASS,
              ROOT_TOKEN_CLASS,
              variant === 'default' && ROOT_SURFACE_CLASS,
              variant === 'ghost' && ROOT_GHOST_CLASS,
              className
            )}
            {...props}
          >
            <CodeBlockSurfacePropsContext.Provider value={surfaceProps}>
              {children}
              {!hasContent && <CodeBlockSurface {...surfaceProps} />}
            </CodeBlockSurfacePropsContext.Provider>
          </div>
        </CodeBlockActionsContext.Provider>
      </CodeBlockDocumentContext.Provider>
    </CodeBlockConfigContext.Provider>
  );
}
function CodeBlockContent({ className }) {
  const surface = useContext(CodeBlockSurfacePropsContext);
  if (!surface) {
    throw new Error('CodeBlockContent must be used within a CodeBlock');
  }
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (surface.builtInSurfaceRendered) {
      console.error(
        "CodeBlockContent is hidden behind a component boundary, so CodeBlock also rendered its built-in surface and the code appears twice. Compose <CodeBlockContent /> directly in the CodeBlock's children (plain wrappers like a ScrollArea are fine)."
      );
    }
  }, [surface.builtInSurfaceRendered]);
  return <CodeBlockSurface {...surface} scroll={false} className={className} />;
}
function containsElementType(node, type) {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue;
    if (child.type === type) return true;
    const inner = child.props.children;
    if (inner && containsElementType(inner, type)) return true;
  }
  return false;
}
function CodeBlockSurface({
  lines,
  wrap,
  startLine,
  showLineNumbers,
  focusMode,
  selectable,
  selectedSet,
  toggleLine,
  visibleLines,
  gutterMax,
  foldable,
  gutterChannel,
  actionsSide,
  foldStarts,
  foldedSet,
  onToggleFold,
  expandClearance,
  streaming,
  label,
  contentId,
  actions,
  completeAnnouncement,
  scroll = true,
  className
}) {
  const viewportRef = useRef(null);
  const preRef = useRef(null);
  const [activeLine, setActiveLine] = useState(null);
  const stickRef = useRef(true);
  const [announcement, setAnnouncement] = useState('');
  const wasStreaming = useRef(streaming);
  useEffect(() => {
    if (wasStreaming.current && !streaming) {
      setAnnouncement(
        completeAnnouncement ??
          `Code generation complete, ${lines.length} lines.`
      );
    }
    wasStreaming.current = streaming;
  }, [streaming, lines.length, completeAnnouncement]);
  const resolveScroller = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return null;
    if (viewport.scrollHeight > viewport.clientHeight + 1) return viewport;
    let node = viewport.parentElement;
    while (node && node !== document.body) {
      const overflowY = getComputedStyle(node).overflowY;
      if (
        (overflowY === 'auto' ||
          overflowY === 'scroll' ||
          overflowY === 'overlay') &&
        node.scrollHeight > node.clientHeight + 1
      ) {
        return node;
      }
      node = node.parentElement;
    }
    const page = document.scrollingElement;
    if (page && page.scrollHeight > page.clientHeight + 1) return page;
    return viewport;
  }, []);
  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    stickRef.current = distance < 24;
  }, []);
  useEffect(() => {
    if (!streaming) return;
    const scroller = resolveScroller();
    if (!scroller || scroller === viewportRef.current) return;
    const onScroll = () => {
      const distance =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      stickRef.current = distance < 24;
    };
    const target = scroller === document.scrollingElement ? window : scroller;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [streaming, lines.length, resolveScroller]);
  useIsoLayoutEffect(() => {
    if (!streaming || !stickRef.current) return;
    const scroller = resolveScroller();
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [lines, streaming, resolveScroller]);
  const trackActive = useCallback(
    (event) => {
      if (!actions && !selectable) return;
      const target = event.target;
      const row = target?.closest?.('[data-code-line]');
      const value = row?.getAttribute('data-code-line');
      if (!value) return;
      setActiveLine(Number(value));
    },
    [actions, selectable]
  );
  const clearActive = useCallback(() => setActiveLine(null), []);
  const toggleDisplayed = useCallback(
    (displayed, extend) => toggleLine(displayed - startLine + 1, extend),
    [toggleLine, startLine]
  );
  const handleKeyDown = useCallback(
    (event) => {
      if (!selectable) return;
      if (event.key === 'Escape') {
        setActiveLine(null);
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && activeLine !== null) {
        event.preventDefault();
        toggleDisplayed(activeLine, event.shiftKey);
        return;
      }
      const isArrow = event.key === 'ArrowDown' || event.key === 'ArrowUp';
      if (!isArrow && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      let next;
      if (event.key === 'Home') {
        next = lines[0]?.number ?? startLine;
      } else if (event.key === 'End') {
        next = lines[lines.length - 1]?.number ?? startLine;
      } else {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const index = lines.findIndex((line) => line.number === activeLine);
        const nextIndex =
          index === -1
            ? step === 1
              ? 0
              : lines.length - 1
            : Math.min(lines.length - 1, Math.max(0, index + step));
        next = lines[nextIndex]?.number ?? startLine;
      }
      setActiveLine(next);
      const row = preRef.current?.querySelector(`[data-code-line="${next}"]`);
      row?.scrollIntoView({ block: 'nearest' });
      if (isArrow && event.shiftKey) toggleDisplayed(next, true);
    },
    [selectable, lines, startLine, activeLine, toggleDisplayed]
  );
  const lastLineNumber = lines[lines.length - 1]?.number;
  const gutterDigits = Math.max(
    2,
    String(gutterMax ?? startLine).length,
    ...lines.map((line) => line.gutter?.length ?? 0)
  );
  const surfaceStyle = {
    '--code-block-gutter-width': gutterChannel
      ? `calc(${gutterDigits}ch + var(--code-block-fold-width) + var(--code-block-gutter-gap) + var(--code-block-padding))`
      : `calc(${gutterDigits}ch + var(--code-block-gutter-gap) + var(--code-block-padding))`,
    counterReset: `cb-line ${startLine - 1}`
  };
  return (
    <div
      data-slot='code-block-content'
      className={cn(
        'relative min-w-0 rounded-[inherit]',
        /* Clipping is the scroll-mode contract only: composed, a clipped pre
         would hide its own width from the ancestor's viewport and the
         horizontal scrollbar would never render. */
        scroll && 'flex-1 overflow-hidden'
      )}
    >
      {/* A polite status, deliberately NOT an aria-live region on the code
       itself: a live region over streaming code narrates every token. */}
      <span role='status' aria-live='polite' className='sr-only'>
        {announcement}
      </span>
      {/* A plain overflow container, deliberately not a ScrollArea primitive.
       The scroll must stay INSIDE the block (the sticky gutter, the
       stick-to-bottom stream and `maxLines` all anchor to it), but nothing
       here needs custom scrollbar machinery, and dropping it leaves the
       block with no UI-library dependency at all - which is why both twins
       are the same file. Compose Card, Frame, or your own ScrollArea
       around the block for outer framing. */}
      <div
        ref={viewportRef}
        data-slot='code-block-viewport'
        id={contentId}
        role='region'
        aria-label={label}
        aria-busy={streaming || void 0}
        aria-activedescendant={
          selectable && activeLine !== null
            ? `${contentId}-L${activeLine}`
            : void 0
        }
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={cn(
          'focus-visible:ring-ui-ring/50 relative min-w-0 rounded-[inherit] outline-none focus-visible:ring-[3px]',
          /* Composed under an ancestor scroller the surface scrolls NOTHING
         itself: both axes belong to the ancestor, whose viewport picks up
         the pre's overflowing width, and the sticky number cell anchors
         to that viewport instead. Mixed ownership shipped once and read
         as two scrollbar styles on one block. */
          scroll && '[scrollbar-width:thin] overflow-auto',
          scroll && visibleLines && 'max-h-(--cb-max-height)',
          className
        )}
        style={
          scroll && visibleLines
            ? {
                '--cb-max-height': `calc(${visibleLines} * var(--code-block-line-height) + 2 * var(--code-block-padding))`
              }
            : void 0
        }
      >
        <pre
          ref={preRef}
          dir='ltr'
          data-code-line-numbers={showLineNumbers || void 0}
          data-wrap={wrap || void 0}
          role={selectable ? 'listbox' : void 0}
          data-selectable={selectable || void 0}
          aria-multiselectable={selectable || void 0}
          aria-label={selectable ? `${label} lines` : void 0}
          onPointerOver={trackActive}
          onPointerLeave={clearActive}
          onFocus={trackActive}
          className={cn(
            'w-max min-w-full py-(--code-block-padding) font-mono text-(length:--code-block-font-size)',
            TOKEN_COLOR_CLASS,
            TOKEN_MOTION_CLASS,
            /* `min-w-0` must beat the `min-w-full` above, or the pre keeps
             a floor of 100% of a scroll container that is itself wider
             than the viewport, and wrapping still leaves a stray
             horizontal scrollbar. */
            wrap && 'w-full max-w-full min-w-0 break-words whitespace-pre-wrap',
            showLineNumbers && 'pl-(--code-block-gutter-width)',
            /* The expand control floats over the surface in BOTH states, so
             an expanded block reserves a row of clearance rather than
             growing a bordered footer under the code. */
            expandClearance && 'pb-(--code-block-expand-clearance)'
          )}
          style={surfaceStyle}
        >
          {/* `content-visibility: auto` is a measured dead end on BOTH axes:
           its style containment breaks the shared gutter counter
           (every number renders as 1), and per-row it still fails -
           the paint containment clips the number cell, which is
           deliberately pulled left OUT of the row's box (verified in
           Chrome: forcing one row visible restored only that row's
           number). Windowing here means rendering fewer rows, not
           containing them. */}
          {/* presentation, so the listbox owns its options directly. */}
          <code
            data-slot='code-block-code'
            role={selectable ? 'presentation' : void 0}
          >
            {lines.map((line) => (
              <CodeBlockLineRow
                key={line.number}
                line={line}
                selectable={selectable}
                selected={selectedSet.has(line.number - startLine + 1)}
                focusMode={focusMode}
                active={activeLine === line.number}
                caret={streaming && line.number === lastLineNumber}
                actions={activeLine === line.number ? actions : null}
                actionsSide={actionsSide}
                domIdBase={contentId}
                startLine={startLine}
                onSelect={toggleDisplayed}
                foldable={foldable}
                foldRegion={foldStarts.get(line.number - startLine + 1)}
                folded={foldedSet.has(line.number - startLine + 1)}
                onToggleFold={onToggleFold}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
function CodeBlockHeader({ className, ...props }) {
  return (
    <CodeBlockHeaderContext.Provider value={true}>
      <div
        data-slot='code-block-header'
        className={cn(
          'border-ui-border flex min-h-9 shrink-0 flex-wrap items-center gap-2 border-b px-3 py-0 text-sm',
          className
        )}
        {...props}
      />
    </CodeBlockHeaderContext.Provider>
  );
}
function CodeBlockTitle({ className, ...props }) {
  return (
    <div
      data-slot='code-block-title'
      className={cn(
        'text-ui-muted-foreground min-w-0 truncate font-mono text-xs',
        className
      )}
      {...props}
    />
  );
}
function CodeBlockLanguage({ className, children, ...props }) {
  const { language, resolvedLanguage } = useInternalConfig('CodeBlockLanguage');
  const label = children ?? resolvedLanguage ?? language;
  if (!label) return null;
  return (
    <span
      data-slot='code-block-language'
      data-unsupported={!resolvedLanguage || void 0}
      className={cn(
        'border-ui-border bg-ui-muted/60 text-ui-muted-foreground inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none uppercase',
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
}
function CopyIcon({ copied }) {
  return copied ? (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M20 6 9 17l-5-5' />
    </svg>
  ) : (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
      <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
    </svg>
  );
}
function CodeBlockCopyButton({
  value,
  timeout = 2e3,
  onCopy,
  onCopyError,
  labels,
  position = 'auto',
  alwaysVisible = false,
  className,
  variant = 'ghost',
  size,
  children,
  ...props
}) {
  const inHeader = useContext(CodeBlockHeaderContext);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const resolvedPosition =
    position === 'auto' ? (inHeader ? 'inline' : 'pinned') : position;
  const resolvedSize =
    size ?? (resolvedPosition === 'inline' ? 'icon-sm' : 'icon');
  useEffect(() => {
    if (!copied || timeout === 0) return;
    const id = window.setTimeout(() => setCopied(false), timeout);
    return () => window.clearTimeout(id);
  }, [copied, timeout]);
  useEffect(() => {
    if (!copyFailed) return;
    const id = window.setTimeout(() => setCopyFailed(false), 2e3);
    return () => window.clearTimeout(id);
  }, [copyFailed]);
  const document_ = useContext(CodeBlockDocumentContext);
  const handleClick = useCallback(() => {
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join('\n');
    const payload = stripNotationComments(value ?? fallback ?? '');
    if (!payload) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }
    navigator.clipboard.writeText(payload).then(
      () => {
        setCopied(true);
        onCopy?.(payload);
      },
      /* Rejection is routine: a denied permission, or a document that lost
         focus. Without the handler it surfaced as an unhandled rejection in
         the consumer's error monitoring. */
      (error) => {
        setCopyFailed(true);
        onCopyError?.(error);
      }
    );
  }, [value, document_, onCopy, onCopyError]);
  return (
    <Button
      type='button'
      data-slot='code-block-copy'
      data-copied={copied || void 0}
      data-copy-failed={copyFailed || void 0}
      data-position={resolvedPosition}
      aria-label={
        copied ? (labels?.copied ?? 'Copied') : (labels?.copy ?? 'Copy code')
      }
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
      className={cn(
        'shrink-0 [&_svg]:size-3.5',
        resolvedPosition ===
          'pinned' /* Physical `right`, not logical `end`: the code surface is forced
         dir="ltr", so in an RTL app the logical inset landed the button
         over the first characters instead of the trailing edge. */ &&
          'absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20',
        resolvedPosition === 'pinned' &&
          !alwaysVisible &&
          'opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100',
        className
      )}
      {...props}
    >
      {children ?? <CopyIcon copied={copied} />}
    </Button>
  );
}
function CodeBlockWrapToggle({
  className,
  children,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}) {
  const { wrap, setWrap } = useInternalConfig('CodeBlockWrapToggle');
  return (
    <Button
      type='button'
      data-slot='code-block-wrap-toggle'
      data-state={wrap ? 'on' : 'off'}
      aria-pressed={wrap}
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setWrap(!wrap);
      }}
      className={cn('shrink-0', className)}
      {...props}
    >
      {children ?? (wrap ? 'No wrap' : 'Wrap')}
    </Button>
  );
}
function CodeBlockExpandButton({
  className,
  children,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}) {
  const { expanded, setExpanded, collapsible, contentId } = useInternalConfig(
    'CodeBlockExpandButton'
  );
  if (!collapsible) return null;
  return (
    <div
      data-slot='code-block-expand'
      data-state={expanded ? 'expanded' : 'collapsed'}
      className={cn(
        /* Both states float over the surface. Expanded used to rejoin the flex
         column as a bordered strip, which read as a card footer and moved the
         block's bottom edge on the first click; the surface reserves a row of
         clearance instead, so only the label changes. */
        'absolute inset-x-0 bottom-0 z-10 order-last flex items-end justify-center pt-10 pb-2',
        /* The fade means "there is more below", so it belongs to the collapsed
         state only. Expanded, the surface already reserves a clear row for
         this control, and keeping the gradient just dimmed the last real
         line of code. */
        !expanded &&
          'from-ui-card via-ui-card/85 bg-gradient-to-t to-transparent',
        className
      )}
    >
      <Button
        type='button'
        aria-expanded={expanded}
        aria-controls={contentId}
        variant={variant}
        size={size}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setExpanded(!expanded);
        }}
        {...props}
      >
        {children ?? (expanded ? 'Show less' : 'Show more')}
      </Button>
    </div>
  );
}
const LANGUAGE_EXTENSIONS = {
  bash: 'sh',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  css: 'css',
  diff: 'patch',
  docker: 'dockerfile',
  go: 'go',
  graphql: 'graphql',
  html: 'html',
  java: 'java',
  javascript: 'js',
  json: 'json',
  jsx: 'jsx',
  kotlin: 'kt',
  markdown: 'md',
  php: 'php',
  python: 'py',
  ruby: 'rb',
  rust: 'rs',
  sql: 'sql',
  swift: 'swift',
  toml: 'toml',
  tsx: 'tsx',
  typescript: 'ts',
  xml: 'xml',
  yaml: 'yaml'
};
function CodeBlockDownloadButton({
  value,
  filename,
  onDownload,
  position = 'auto',
  alwaysVisible = false,
  label,
  className,
  variant = 'ghost',
  size,
  children,
  ...props
}) {
  const context = useContext(CodeBlockConfigContext);
  const document_ = useContext(CodeBlockDocumentContext);
  const inHeader = useContext(CodeBlockHeaderContext);
  const resolvedPosition =
    position === 'auto' ? (inHeader ? 'inline' : 'pinned') : position;
  const resolvedSize =
    size ?? (resolvedPosition === 'inline' ? 'icon-sm' : 'icon');
  const handleClick = useCallback(() => {
    const fallback =
      document_?.code || document_?.lines.map((line) => line.text).join('\n');
    const payload = stripNotationComments(value ?? fallback ?? '');
    if (!payload || typeof window === 'undefined') return;
    const extension =
      LANGUAGE_EXTENSIONS[context?.resolvedLanguage ?? ''] ?? 'txt';
    const name = filename ?? `code.${extension}`;
    const url = URL.createObjectURL(
      new Blob([payload], { type: 'text/plain;charset=utf-8' })
    );
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
    onDownload?.(name);
  }, [value, filename, context, document_, onDownload]);
  return (
    <Button
      type='button'
      data-slot='code-block-download'
      data-position={resolvedPosition}
      aria-label={label ?? 'Download code'}
      variant={variant}
      size={resolvedSize}
      onClick={handleClick}
      className={cn(
        'shrink-0 [&_svg]:size-3.5',
        resolvedPosition === 'pinned' &&
          'absolute top-(--code-block-copy-top) right-(--code-block-copy-inset) z-20',
        resolvedPosition === 'pinned' &&
          !alwaysVisible &&
          'opacity-0 transition-opacity group-hover/code-block:opacity-100 focus-visible:opacity-100',
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2' />
        </svg>
      )}
    </Button>
  );
}
function CodeBlockLineActions({ children, side = 'end' }) {
  const registry = useContext(CodeBlockActionsContext);
  const owner = useRef({}).current;
  useEffect(() => {
    registry?.register(owner, children, side);
    return () => registry?.register(owner, null);
  }, [registry, owner, children, side]);
  return null;
}
function useCodeBlockFolding() {
  const document2 = useContext(CodeBlockDocumentContext);
  if (!document2) {
    throw new Error('useCodeBlockFolding must be used within a CodeBlock');
  }
  const { foldable, foldRegions, folded, toggleFold, setFolded } = document2;
  const foldedStarts = useMemo(
    () => [...folded].sort((a, b) => a - b),
    [folded]
  );
  const foldAll = useCallback(
    () => setFolded(foldRegions.map((region) => region.start)),
    [setFolded, foldRegions]
  );
  const unfoldAll = useCallback(() => setFolded([]), [setFolded]);
  return {
    foldable,
    regions: foldRegions,
    foldedStarts,
    toggleFold,
    foldAll,
    unfoldAll
  };
}
function useCodeBlockSelection() {
  const document2 = useContext(CodeBlockDocumentContext);
  if (!document2) {
    throw new Error('useCodeBlockSelection must be used within a CodeBlock');
  }
  const { selected, selectable, toggleLine, clearSelection } = document2;
  const selectedLines = useMemo(
    () => [...selected].sort((a, b) => a - b),
    [selected]
  );
  return { selectable, selectedLines, toggleLine, clearSelection };
}
export { markdownCodeProps, markdownFences };
export {
  ansiToLines,
  parseUnifiedDiff
} from './code-block-highlight-extended.jsx';
export {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockDownloadButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockLineActions,
  CodeBlockTitle,
  CodeBlockContent,
  CodeBlockWrapToggle,
  useCodeBlockConfig,
  useCodeBlockFolding,
  useCodeBlockSelection
};
