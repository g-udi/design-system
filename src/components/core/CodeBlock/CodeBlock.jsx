'use client';
import { useCallback, useContext, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  highlightCode,
  resolveCodeBlockLanguage,
  toPlainLines
} from './CodeBlockHighlight.jsx';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import {
  CodeBlockConfigContext,
  CodeBlockDocumentContext,
  CodeBlockSurfacePropsContext,
  CodeBlockActionsContext,
  useCodeBlockConfig,
  useCodeBlockFolding,
  useCodeBlockSelection
} from './CodeBlockContext.jsx';
import { computeFoldRegions, EMPTY_FOLD_REGIONS } from './codeBlockFolding.js';
import { containsElementType, CodeBlockSurface } from './components/CodeBlockSurface.jsx';
import { CodeBlockHeader, CodeBlockTitle, CodeBlockLanguage } from './components/CodeBlockHeader.jsx';
import {
  CodeBlockCopyButton,
  CodeBlockWrapToggle,
  CodeBlockExpandButton,
  CodeBlockDownloadButton,
  CodeBlockLineActions
} from './components/CodeBlockControls.jsx';
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
  '[--code-block-expand-clearance:calc(--spacing(11)*var(--ds-space-scale,1))]',
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
  const [wrap, setWrap] = useControllableState({ value: wrapProp, defaultValue: defaultWrap, onChange: onWrapChange });
  const collapsible = typeof maxLines === 'number' && lines.length > maxLines;
  const [expanded, setExpanded] = useControllableState({ value: expandedProp, defaultValue: defaultExpanded, onChange: onExpandedChange });
  const isExpanded = collapsible ? expanded : true;
  const [selection, commitSelection] = useControllableState({ value: selectedLines, defaultValue: defaultSelectedLines ?? [], onChange: onSelectedLinesChange });
  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const lastSelectedRef = useRef(null);
  const selectionStateRef = useRef({
    selection,
    selectedSet
  });
  selectionStateRef.current = {
    selection,
    selectedSet
  };
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
  const [foldedValue, commitFolded] = useControllableState({ value: folded, defaultValue: defaultFolded ?? [], onChange: onFoldedChange });
  const foldedSet = useMemo(() => new Set(foldedValue), [foldedValue]);
  const foldStateRef = useRef({
    foldedValue,
    foldedSet
  });
  foldStateRef.current = {
    foldedValue,
    foldedSet
  };
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
