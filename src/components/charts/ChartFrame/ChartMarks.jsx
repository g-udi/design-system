'use client';

/*
 * Recharts building blocks styled with Gaudi tokens. Render them inside any Recharts chart
 * (including the shadcn-style ChartContainer parts): axes and grid, a tooltip built from rows,
 * reference lines with labels, point annotations, an area gradient, and the marker that draws
 * the frame's active point.
 */
import { cn } from '../../../utilities/cn';
import { CartesianGrid, Legend, ReferenceDot, ReferenceLine, XAxis, YAxis } from './chartRuntime.js';
import { useChartFrame } from './ChartFrame.jsx';
import { chartAxisTick, chartTones } from './chartTokens.js';

export { ChartTooltipRows } from './chartTooltip.jsx';

/** Horizontal grid lines; pass `vertical` for a full grid. */
export function ChartGrid({ vertical = false, ...props }) {
  return <CartesianGrid stroke='var(--ds-color-chart-grid)' strokeDasharray='3 3' vertical={ vertical } { ...props } />;
}

/** The Recharts series legend: circle marks in supporting text below the plot. */
export function ChartSeriesLegend({ wrapperStyle, ...props }) {
  return <Legend iconType='circle' wrapperStyle={{ 'fontSize': 12, 'paddingTop': 12, ...wrapperStyle }} { ...props } />;
}

/** Dashed value grid lines with their tick labels, for charts that draw their own SVG. */
export function ChartValueGrid({ format, left, right, ticks, y }) {
  return ticks.map((tick) => (
    <g key={ tick }>
      <line stroke='var(--ds-color-chart-grid)' strokeDasharray='3 3' x1={ left } x2={ right } y1={ y(tick) } y2={ y(tick) } />
      <text dominantBaseline='middle' fill={ chartAxisTick.fill } fontSize={ chartAxisTick.fontSize } textAnchor='end' x={ left - 8 } y={ y(tick) }>{format(tick)}</text>
    </g>
  ));
}

/** A legend outside Recharts: a colour swatch and a label per item. */
export function ChartLegendList({ className, items, ...props }) {
  return (
    <ul className={ cn('flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted', className) } { ...props }>
      {items.map((item) => (
        <li key={ item.key } className='flex min-w-0 items-center gap-1.5'>
          <span aria-hidden='true' className='size-2 shrink-0 rounded-sm' data-slot='chart-mark' style={{ 'background': item.color }} />
          <span className='min-w-0 wrap-anywhere'>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** One row of a list chart (funnel steps, bar lists); the frame highlights the active row. */
export function ChartListRow({ active, children, index }) {
  return (
    <li className={ cn('grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-(--ds-radius-control) px-2 py-1.5 transition-colors', active && 'bg-surface-muted') } data-chart-index={ index }>
      {children}
    </li>
  );
}

/** Category or number axis along the bottom, without axis or tick lines. */
export function ChartXAxis(props) {
  return <XAxis axisLine={ false } minTickGap={ 12 } tick={ chartAxisTick } tickLine={ false } { ...props } />;
}

/** Value axis on the left, sized to its longest label; pass `ticks` from niceTicks for round values. */
export function ChartYAxis(props) {
  return <YAxis axisLine={ false } tick={ chartAxisTick } tickLine={ false } width='auto' { ...props } />;
}

/** The SVG label Recharts places on a reference line or dot. */
export function ChartReferenceLabel({ fill = 'var(--ds-color-text-muted)', position = 'insideTopRight', value, viewBox }) {
  if (!viewBox || value == null) return null;
  const { height = 0, width = 0, x = 0, y = 0 } = viewBox;
  const isVertical = width === 0 || width == null;
  const atStart = String(position).includes('Left');
  const tx = isVertical ? x + 4 : atStart ? x + 4 : x + width - 4;
  const ty = isVertical ? y + 12 : y - 6;

  return (
    // A halo in the surface colour keeps the label readable where it crosses a line or an area.
    <text dominantBaseline='auto' fill={ fill } fontSize={ 11 } fontWeight={ 500 } paintOrder='stroke' stroke='var(--ds-color-surface)' strokeLinejoin='round' strokeWidth={ 3 } textAnchor={ isVertical || atStart ? 'start' : 'end' } x={ tx } y={ ty + (isVertical ? 0 : height) }>
      {value}
    </text>
  );
}

/**
 * A labelled reference line at a value (`y`) or category (`x`): targets, averages, launches.
 *
 * @param {{ x?: unknown, y?: number, label?: string, tone?: keyof chartTones, dashed?: boolean }} props
 */
export function ChartReferenceLine({ dashed = true, label, tone = 'neutral', ...props }) {
  const color = chartTones[tone] || tone;

  return (
    <ReferenceLine
      ifOverflow='extendDomain'
      label={ label ? <ChartReferenceLabel fill={ color } value={ label } /> : undefined }
      stroke={ color }
      strokeDasharray={ dashed ? '4 4' : undefined }
      strokeWidth={ 1.5 }
      { ...props }
    />
  );
}

/**
 * Point annotations: a ringed dot and a short note at data coordinates.
 *
 * @param {{ annotations?: Array<{ x: unknown, y: number, label: string, tone?: keyof chartTones }> }} props
 */
export function ChartAnnotations({ annotations = [] }) {
  return annotations.map((note) => (
    <ReferenceDot
      key={ `${note.x}-${note.y}-${note.label}` }
      fill='var(--ds-color-surface)'
      ifOverflow='extendDomain'
      label={ <ChartReferenceLabel fill={ chartTones[note.tone] || chartTones.neutral } position='insideTopLeft' value={ note.label } /> }
      r={ 5 }
      stroke={ chartTones[note.tone] || chartTones.neutral }
      strokeWidth={ 2 }
      x={ note.x }
      y={ note.y }
    />
  ));
}

/** Vertical gradient for an area fill; reference it as `fill='url(#id)'`. */
export function ChartAreaGradient({ color, from = 0.28, id, to = 0 }) {
  return (
    <defs>
      <linearGradient id={ id } x1='0' x2='0' y1='0' y2='1'>
        <stop offset='5%' stopColor={ color } stopOpacity={ from } />
        <stop offset='95%' stopColor={ color } stopOpacity={ to } />
      </linearGradient>
    </defs>
  );
}

/**
 * Draws the frame's active point on a category chart: a guide at its x and a dot per series.
 *
 * @param {{ data: object[], xKey: string, series: Array<{ key: string, color: string, yAxisId?: string }> }} props
 */
export function ChartActiveMarker({ data, series, xKey }) {
  const frame = useChartFrame();
  const index = frame?.activeIndex;
  if (index == null || !data[index]) return null;
  const point = data[index];

  return (
    <>
      <ReferenceLine stroke='var(--ds-color-chart-baseline)' strokeDasharray='3 3' x={ point[xKey] } />
      {series.map((item) => (typeof point[item.key] === 'number' ? (
        <ReferenceDot key={ item.key } fill={ item.color } r={ 5 } stroke='var(--ds-color-surface)' strokeWidth={ 2 } x={ point[xKey] } y={ point[item.key] } yAxisId={ item.yAxisId } />
      ) : null))}
    </>
  );
}

/** Recharts mouse handlers that keep the frame's active point in sync with the pointer. */
export function useRechartsActive() {
  const frame = useChartFrame();

  return {
    'onMouseLeave': () => {
      if (!frame?.keyboard) frame?.setActive(null);
    },
    'onMouseMove': (state) => {
      const index = state?.activeTooltipIndex;
      if (index == null || index === '') return;
      const number = Number(index);
      if (Number.isInteger(number)) frame?.setActive(number);
    }
  };
}
