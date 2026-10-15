'use client';

/*
 * The frame every chart renders in: a figure with its caption, the plot as one keyboard stop,
 * the states (loading, empty, invalid, error), and a data table that mirrors the plot.
 *
 * Keyboard: Tab reaches the plot; ArrowLeft/ArrowRight (or Up/Down) walk the points, Home/End
 * jump to the ends, Enter or Space activates the point, Escape clears it. The active point is
 * drawn by the chart and read out above the plot. Pointer: hovering a point makes it active and
 * clicking activates it. Every value is also in the data table, hidden or shown.
 */
import { createContext, useCallback, useContext, useId, useMemo, useRef, useState } from 'react';

import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import Button from '../../core/Button';
import { CardTitle } from '../../core/Card';
import EmptyState from '../../core/EmptyState';
import { Skeleton } from '../../core/Skeleton/SkeletonPrimitives.jsx';
import { cn } from '../../../utilities/cn';
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../mdx/Table/TablePrimitives.jsx';
import { DEFAULT_CHART_LABELS } from './chartLabels.js';
import { resolveFormatter } from './chartScale.js';

const ChartFrameContext = createContext(null);

/**
 * The enclosing frame's active point, for drawing it inside a chart.
 *
 * @returns {{ activeIndex: number | null, setActive: (index: number | null) => void, points: object[], format: (value: unknown) => string, labels: object } | null}
 */
export const useChartFrame = () => useContext(ChartFrameContext);

const pointText = (point, format) => {
  if (!point) return '';
  // Series without a value at this point (a forecast before it starts) are left out of the readout.
  const values = (point.values || [])
    .filter((item) => item.display != null || item.value != null)
    .map((item) => `${item.name ? `${item.name} ` : ''}${item.display ?? format(item.value)}`);

  return [ point.label, values.join(', ') ].filter(Boolean).join(': ');
};

/**
 * Visible or visually hidden table of every point the chart draws.
 *
 * @param {object} props
 * @param {Array<{ label: string, values: Array<{ name?: string, value: unknown, display?: string }> }>} props.points
 * @param {(value: unknown) => string} props.format - Value formatter.
 * @param {string} [props.caption] - Table caption.
 * @param {string} [props.categoryLabel] - Header of the first column.
 */
export function ChartDataTable({ caption, categoryLabel = DEFAULT_CHART_LABELS.category, className, format, points = [], visible = true }) {
  const columns = [];
  for (const point of points) {
    for (const item of point.values || []) if (!columns.includes(item.name || '')) columns.push(item.name || '');
  }

  const table = (
    <table className={ cn('ds-part-table', className) } data-slot='chart-data-table'>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead scope='col'>{categoryLabel}</TableHead>
          {columns.map((name) => <TableHead key={ name || 'value' } scope='col' className='text-end'>{name || 'Value'}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {points.map((point, index) => (
          <TableRow key={ `${point.label}-${index}` }>
            <TableHead scope='row' className='font-normal'>{point.label}</TableHead>
            {columns.map((name) => {
              const item = point.values?.find((entry) => (entry.name || '') === name);

              const text = !item ? '' : item.display ?? (item.value == null ? '—' : format(item.value));

              return <TableCell key={ name || 'value' } className='text-end tabular-nums'>{text}</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </table>
  );

  // Hidden, the table sits in an sr-only box (a table ignores the 1px width itself); shown, it
  // scrolls in its own labelled region.
  if (!visible) return <div className='sr-only'>{table}</div>;

  return (
    // A wide table scrolls sideways, so its region takes focus for keyboard scrolling.
    <div aria-label={ caption || categoryLabel } className='overflow-x-auto' role='region' tabIndex={ 0 }>
      {table}
    </div>
  );
}

/** The panel shown in place of the plot while loading, or when there is nothing valid to draw. */
export function ChartStatePanel({ labels, status }) {
  if (status === 'loading') {
    return (
      <div className='flex h-full flex-col justify-end gap-2' data-slot='chart-state' data-state='loading'>
        <span className='sr-only'>{labels.loading}</span>
        <div className='flex flex-1 items-end gap-2' aria-hidden='true'>
          {[ 45, 70, 55, 85, 60, 75 ].map((height) => <Skeleton key={ height } className='flex-1 rounded-sm' style={{ height: `${height}%` }} />)}
        </div>
        <Skeleton className='h-3 w-full' aria-hidden='true' />
      </div>
    );
  }
  const panel = 'h-full min-h-32 rounded-(--ds-radius-card) border border-dashed';
  if (status === 'empty') {
    return <EmptyState className={ cn(panel, 'border-border bg-surface-muted') } compact data-slot='chart-state' data-state='empty' title={ labels.empty } />;
  }

  return (
    <div className={ cn(panel, 'flex items-center justify-center border-danger-border bg-danger-subtle px-4 text-center text-sm font-medium text-danger') } data-slot='chart-state' data-state={ status } role='alert'>
      {labels[status] || labels.error}
    </div>
  );
}

const nextIndex = (key, current, length, columns) => {
  if (!length) return null;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  const vertical = key === 'ArrowUp' || key === 'ArrowDown';
  // Grids (heatmaps) move a whole row with Up/Down; series move one point either way.
  const size = vertical && columns > 1 ? columns : 1;
  const step = (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1) * size;
  if (current != null && (current + step < 0 || current + step > length - 1) && size > 1) return current;
  if (current == null) return step > 0 ? 0 : length - 1;

  return Math.min(length - 1, Math.max(0, current + step));
};

/**
 * Figure, keyboard model, states and data table shared by every chart.
 *
 * @param {object} props
 * @param {string} [props.ariaLabel] - Accessible name of the plot; defaults to the title.
 * @param {React.ReactNode} [props.title] - Caption heading.
 * @param {React.ReactNode} [props.description] - Caption text.
 * @param {number|string} [props.height=320] - Plot height.
 * @param {object[]} [props.points] - Navigable points `{ label, values: [{ name, value, display, color }] }`.
 * @param {'ready'|'loading'|'empty'|'invalid'|'error'} [props.status='ready'] - Which body to show.
 * @param {(point: object, index: number) => void} [props.onActivate] - Click, Enter or Space on a point.
 * @param {(index: number | null) => void} [props.onActiveChange] - The active point changed.
 * @param {'hidden'|'toggle'|'visible'} [props.showData='hidden'] - Data table visibility.
 * @param {React.ReactNode} [props.toolbar] - Controls or a legend above the plot.
 * @param {boolean} [props.framed=true] - Border and padding around the figure; false for inline sparklines.
 * @param {number} [props.columns] - Points per row for grids, so Up and Down move by a row.
 */
export function ChartFrame({
  ariaLabel,
  children,
  className,
  columns,
  description,
  format,
  formatValue,
  framed = true,
  height = 320,
  labels: labelOverrides,
  locale,
  onActivate,
  onActiveChange,
  plotClassName,
  points = [],
  showData = 'hidden',
  status = 'ready',
  title,
  toolbar
}) {
  const labels = useMemo(() => ({ ...DEFAULT_CHART_LABELS, ...labelOverrides }), [ labelOverrides ]);
  const formatter = useMemo(() => format || resolveFormatter(formatValue, locale), [ format, formatValue, locale ]);
  const [ activeIndex, setActiveIndex ] = useState(null);
  const [ keyboard, setKeyboard ] = useState(false);
  const [ tableOpen, setTableOpen ] = useState(showData === 'visible');
  const hintId = useId();
  const tableId = useId();
  const plotRef = useRef(null);
  const ready = status === 'ready' && points.length > 0;
  const name = ariaLabel || (typeof title === 'string' ? title : undefined) || 'Chart';
  const tableVisible = showData === 'visible' || (showData === 'toggle' && tableOpen);

  const activeRef = useRef(null);
  const onActiveChangeRef = useLatestRef(onActiveChange);
  const setActive = useCallback((index) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setActiveIndex(index);
    onActiveChangeRef.current?.(index);
  }, [ onActiveChangeRef ]);
  useIsomorphicLayoutEffect(() => {
    if (activeIndex != null && (!ready || activeIndex >= points.length)) setActive(null);
  }, [activeIndex, points.length, ready, setActive]);

  const activate = (index) => {
    if (index == null || !points[index]) return;
    onActivate?.(points[index], index);
  };

  const onKeyDown = (event) => {
    // Nested scroll regions and controls keep their native keyboard behavior.
    if (event.target !== event.currentTarget || event.defaultPrevented || !ready || event.altKey || event.ctrlKey || event.metaKey) return;
    if ([ 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End' ].includes(event.key)) {
      event.preventDefault();
      setKeyboard(true);
      setActive(nextIndex(event.key, activeIndex, points.length, columns));
    } else if ((event.key === 'Enter' || event.key === ' ') && activeIndex != null) {
      event.preventDefault();
      activate(activeIndex);
    } else if (event.key === 'Escape' && activeIndex != null) {
      event.preventDefault();
      setActive(null);
    }
  };

  // Pointer: elements a chart draws itself carry data-chart-index; Recharts plots call setActive.
  const indexFromEvent = (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-chart-index]') : null;
    if (!target || !plotRef.current?.contains(target)) return null;
    const index = Number(target.getAttribute('data-chart-index'));

    return Number.isInteger(index) ? index : null;
  };

  // The plot's SVG is decoration for assistive tech: the group's name, the readout and the data
  // table carry the meaning. Recharts re-renders its surface, so keep it hidden as it changes.
  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!plot) return undefined;
    const hide = () => plot.querySelectorAll('svg.recharts-surface').forEach((node) => {
      if (node.getAttribute('aria-hidden') !== 'true') node.setAttribute('aria-hidden', 'true');
      if (node.getAttribute('focusable') !== 'false') node.setAttribute('focusable', 'false');
      // Recharts makes some surfaces, slices and sectors focusable; the plot itself is the one keyboard stop.
      if (node.getAttribute('tabindex') !== '-1' && node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
      if (node.getAttribute('role') === 'application') node.removeAttribute('role');
      node.querySelectorAll('[tabindex]:not([tabindex="-1"])').forEach((child) => child.setAttribute('tabindex', '-1'));
    });
    hide();
    const observer = new MutationObserver(hide);
    observer.observe(plot, { 'attributeFilter': [ 'tabindex' ], 'attributes': true, 'childList': true, 'subtree': true });

    return () => observer.disconnect();
  }, [ ready ]);

  const context = useMemo(() => ({ activeIndex, 'format': formatter, keyboard, labels, points, setActive }), [ activeIndex, formatter, keyboard, labels, points, setActive ]);
  const activePoint = activeIndex == null ? null : points[activeIndex];

  return (
    <ChartFrameContext.Provider value={ context }>
      <figure
        aria-busy={ status === 'loading' || undefined }
        className={ cn('not-prose min-w-0', framed && 'my-8 rounded-(--ds-radius-card) border border-border bg-surface p-4 shadow-sm', className) }
        data-slot='chart'
        data-state={ ready ? 'ready' : status }
      >
        {title || description || toolbar || showData === 'toggle' ? (
          <figcaption className='mb-4 flex flex-wrap items-start justify-between gap-3'>
            {title || description ? (
              <div className='grid min-w-0 gap-1'>
                {title ? <CardTitle as='h3' className='text-text'>{title}</CardTitle> : null}
                {description ? <p className='text-sm leading-6 text-text-muted'>{description}</p> : null}
              </div>
            ) : null}
            {toolbar || (showData === 'toggle' && ready) ? (
              <div className='flex flex-wrap items-center gap-2'>
                {toolbar}
                {showData === 'toggle' && ready ? (
                  <Button aria-controls={ tableId } aria-expanded={ tableOpen } onClick={ () => setTableOpen((open) => !open) } size='xs' tone='neutral' variant='outline'>
                    {tableOpen ? labels.hideData : labels.showData}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </figcaption>
        ) : null}
        <div className='relative'>
          {/* The plot is one tab stop; its points are reached with the arrow keys. */}
          <div
            ref={ plotRef }
            aria-describedby={ ready ? hintId : undefined }
            aria-label={ name }
            aria-roledescription={ ready ? 'chart' : undefined }
            className={ cn('relative min-w-0 w-full rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface', ready && onActivate && 'cursor-pointer', plotClassName) }
            data-slot='chart-plot'
            onBlur={ (event) => {
              if (event.currentTarget.contains(event.relatedTarget)) return;
              setKeyboard(false);
              setActive(null);
            } }
            onClick={ (event) => {
              if (!ready) return;
              const index = indexFromEvent(event);
              activate(index ?? activeIndex);
            } }
            onFocus={ (event) => {
              if (ready && event.target === event.currentTarget && event.currentTarget.matches(':focus-visible')) {
                setKeyboard(true);
                if (activeIndex == null) setActive(0);
              }
            } }
            onKeyDown={ onKeyDown }
            onPointerLeave={ () => {
              if (!keyboard) setActive(null);
            } }
            onPointerMove={ (event) => {
              if (!ready) return;
              const index = indexFromEvent(event);
              if (keyboard) setKeyboard(false);
              if (index != null) setActive(index);
            } }
            role='group'
            style={{ height, 'minHeight': height }}
            tabIndex={ ready ? 0 : -1 }
          >
            {ready ? children : <ChartStatePanel labels={ labels } status={ status === 'ready' ? 'empty' : status } />}
          </div>
          {/* Keyboard readout: visible beside the plot and announced politely. */}
          <p
            aria-live='polite'
            className={ cn(
              'pointer-events-none absolute end-2 top-2 z-10 max-w-[min(20rem,90%)] wrap-anywhere rounded-(--ds-radius-control) border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text shadow-md',
              !(keyboard && activePoint) && 'sr-only'
            ) }
            data-slot='chart-readout'
          >
            {keyboard && activePoint ? pointText(activePoint, formatter) : ''}
          </p>
        </div>
        {ready ? <p className='sr-only' id={ hintId }>{labels.keyboardHint}</p> : null}
        {ready ? (
          <div className={ cn(tableVisible && 'mt-4') } id={ tableId }>
            <ChartDataTable caption={ typeof title === 'string' ? title : labels.dataTable } categoryLabel={ labels.category } format={ formatter } points={ points } visible={ tableVisible } />
          </div>
        ) : null}
      </figure>
    </ChartFrameContext.Provider>
  );
}

/** A point is drawn as active when the frame says so; others dim while one is active. */
export const activeOpacity = (activeIndex, index) => (activeIndex == null || activeIndex === index ? 1 : 0.45);
