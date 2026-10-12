'use client';
import { memo } from 'react';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { cn } from '../../../../utilities/cn/index.js';
const TOKEN_COLOR_CLASS =
  '[&_[data-slot=code-block-token]]:text-[color:color-mix(in_srgb,var(--cb-c,currentColor)_70%,var(--ds-color-text))] dark:[&_[data-slot=code-block-token]]:text-[color:color-mix(in_srgb,var(--cb-cd,currentColor)_80%,var(--ds-color-text))]';
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
      role={selectable ? 'row' : void 0}
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
      <span role={selectable ? 'gridcell' : void 0}>
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
              'text-ui-muted-foreground hover:bg-ui-muted hover:text-ui-foreground focus-visible:ring-ui-primary sticky z-20 inline-flex size-(--code-block-fold-width) shrink-0 translate-y-[calc((var(--code-block-line-height)-var(--code-block-fold-width))/2)] cursor-pointer items-center justify-center rounded-sm align-top outline-none focus-visible:ring-2',
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
            <RegistryIcon lucide={folded ? 'ChevronRight' : 'ChevronDown'} className='size-3' strokeWidth={2.5} />
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
                onToggleFold?.(foldRegion.start);
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
              className='ml-0.5 inline-block h-[0.12em] w-[0.55em] translate-y-[0.02em] animate-pulse rounded-sm bg-(--code-block-caret-color) motion-reduce:animate-none'
            />
          ) : null}
        </span>
      </span>
    </span>
  );
});
export { TOKEN_COLOR_CLASS, TOKEN_MOTION_CLASS, CodeBlockLineRow };
