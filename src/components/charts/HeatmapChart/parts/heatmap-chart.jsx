'use client';

import { cn } from '../../../../utilities/cn';
import { ChartFrame, useChartFrame } from '../../ChartFrame/parts/frame.jsx';
import { chartScales } from '../../ChartFrame/parts/runtime.js';
import { extent, isChartNumber, resolveFormatter } from '../../ChartFrame/parts/scale.js';
import { chartStatus, splitFrameProps } from '../../ChartFrame/parts/shared.js';

const unique = (values) => [ ...new Set(values) ];

/**
 * The ramp step and ink for a value: sequential maps min…max onto steps 1–5 (0 is "no data");
 * diverging centres on `midpoint`, with the outer steps for the extremes.
 */
export function heatmapStep(value, { domain, midpoint = 0, scale }) {
  if (!isChartNumber(value)) return { 'fill': chartScales.heatmap[0], 'ink': chartScales.heatmapInk[0] };
  const [ min, max ] = domain;
  if (scale === 'diverging') {
    const reach = Math.max(Math.abs(min - midpoint), Math.abs(max - midpoint)) || 1;
    const ratio = (value - midpoint) / reach;
    const step = ratio <= -0.6 ? 0 : ratio <= -0.2 ? 1 : ratio < 0.2 ? 2 : ratio < 0.6 ? 3 : 4;

    return { 'fill': chartScales.diverging[step], 'ink': step === 0 || step === 4 ? 'var(--ds-color-chart-div-ink)' : 'var(--ds-color-text)' };
  }
  const step = max === min ? 3 : 1 + Math.min(4, Math.floor(((value - min) / (max - min)) * 5));

  return { 'fill': chartScales.heatmap[step], 'ink': chartScales.heatmapInk[step] };
}

function HeatmapPlot({ cells, columns, domain, legendLabels, midpoint, scale, showValues, xLabels, yLabels }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const every = Math.max(1, Math.ceil(columns / 12));
  const legend = scale === 'diverging' ? chartScales.diverging : chartScales.heatmap.slice(1);

  return (
    <div aria-hidden='true' className='grid gap-3'>
      <div className='grid gap-1' style={{ 'gridTemplateColumns': `max-content repeat(${columns}, minmax(0, 1fr))` }}>
        <span />
        {xLabels.map((label, index) => (
          <span key={ label } className='truncate text-center text-xs text-text-muted'>{index % every === 0 ? label : ''}</span>
        ))}
        {yLabels.map((rowLabel, row) => [
          <span key={ `${rowLabel}-label` } className='self-center pe-2 text-end text-xs text-text-muted'>{rowLabel}</span>,
          ...xLabels.map((columnLabel, column) => {
            const index = row * columns + column;
            const cell = cells[index];
            const { fill, ink } = heatmapStep(cell.value, { domain, midpoint, scale });

            return (
              <span
                key={ `${rowLabel}-${columnLabel}` }
                className={ cn('flex min-h-7 items-center justify-center rounded-sm text-xs font-medium tabular-nums outline-offset-1', active === index && 'outline-2 outline-solid outline-[var(--ds-color-text)]') }
                data-chart-index={ index }
                style={{ 'background': fill, 'color': ink }}
              >
                {showValues && isChartNumber(cell.value) ? format(cell.value) : ''}
              </span>
            );
          })
        ])}
      </div>
      <div className='flex items-center justify-end gap-2 text-xs text-text-muted'>
        <span>{legendLabels[0]}</span>
        <span className='flex'>
          {legend.map((color) => <span key={ color } className='h-2.5 w-6 first:rounded-s-sm last:rounded-e-sm' data-slot='chart-mark' style={{ 'background': color }} />)}
        </span>
        <span>{legendLabels[1]}</span>
      </div>
    </div>
  );
}

/**
 * Values over two categories as a grid of shaded cells: publishing activity by weekday and hour,
 * errors by service and day. Arrow keys move across a row; Up and Down move between rows.
 *
 * @param {object} props
 * @param {object[]} props.data - Cells `{ x, y, value }` (keys configurable).
 * @param {string[]} [props.xLabels] / [props.yLabels] - Column and row order; defaults to first appearance.
 * @param {'sequential'|'diverging'} [props.scale='sequential'] - Diverging centres on `midpoint`.
 * @param {boolean} [props.showValues] - Print values in cells; on by default up to 12 columns.
 */
export function HeatmapChart(props) {
  const [ frameProps, { data = [], midpoint = 0, scale = 'sequential', showValues, state, valueKey = 'value', valueLabel = 'Value', xKey = 'x', xLabels: xOrder, yKey = 'y', yLabels: yOrder } ] = splitFrameProps(props);
  const records = Array.isArray(data) ? data : [];
  const xLabels = xOrder || unique(records.map((item) => String(item[xKey])));
  const yLabels = yOrder || unique(records.map((item) => String(item[yKey])));
  const lookup = new Map(records.map((item) => [ `${item[yKey]}\u0000${item[xKey]}`, item[valueKey] ]));
  const cells = yLabels.flatMap((y) => xLabels.map((x) => ({ 'value': lookup.get(`${y}\u0000${x}`), x, y })));
  const domain = extent(cells.map((cell) => cell.value)) || [ 0, 1 ];
  const status = chartStatus({ 'data': records, 'keys': [ valueKey ], state, 'usesRecharts': false });
  const format = resolveFormatter(frameProps.formatValue, frameProps.locale);
  const points = status === 'ready' ? cells.map((cell) => ({ 'label': `${cell.y} · ${cell.x}`, 'values': [{ 'display': isChartNumber(cell.value) ? undefined : '—', 'name': valueLabel, 'value': cell.value }] })) : [];

  return (
    <ChartFrame height='auto' { ...frameProps } columns={ xLabels.length } points={ points } status={ status }>
      <HeatmapPlot
        cells={ cells }
        columns={ xLabels.length }
        domain={ domain }
        legendLabels={ scale === 'diverging' ? [ format(-Math.max(Math.abs(domain[0] - midpoint), Math.abs(domain[1] - midpoint)) + midpoint), format(Math.max(Math.abs(domain[0] - midpoint), Math.abs(domain[1] - midpoint)) + midpoint) ] : [ format(domain[0]), format(domain[1]) ] }
        midpoint={ midpoint }
        scale={ scale }
        showValues={ showValues ?? xLabels.length <= 12 }
        xLabels={ xLabels }
        yLabels={ yLabels }
      />
    </ChartFrame>
  );
}
