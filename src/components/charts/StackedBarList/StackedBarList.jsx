'use client';

import { cn } from '../../../utilities/cn';
import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { getChartColor } from '../ChartFrame/chartRuntime.js';
import { isChartNumber } from '../ChartFrame/chartScale.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';

function BarListPlot({ colors, labelKey, normalize, rows, series, showLegend }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const max = Math.max(...rows.map((row) => row.total), 0) || 1;

  return (
    <div className='flex h-full flex-col gap-3'>
      {showLegend && series.length > 1 ? (
        <ul aria-hidden='true' className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted'>
          {series.map((item, index) => (
            <li key={ item.key } className='flex min-w-0 items-center gap-1.5'>
              <span className='size-2 shrink-0 rounded-sm' data-slot='chart-mark' style={{ 'background': getChartColor(colors, index) }} />
              <span className='min-w-0 wrap-anywhere'>{item.label || item.key}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <ol aria-hidden='true' className='grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-2'>
        {rows.map((row, index) => (
          <li
            key={ `${row.record[labelKey]}-${index}` }
            className={ cn('grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-md px-2 py-1.5 transition-colors', active === index && 'bg-surface-muted') }
            data-chart-index={ index }
          >
            <div className='flex items-baseline justify-between gap-3 text-sm'>
              <span className='min-w-0 truncate text-text'>{row.record[labelKey]}</span>
              <span className='shrink-0 font-medium tabular-nums text-text'>{normalize ? (row.total ? '100%' : '0%') : format(row.total)}</span>
            </div>
            <div className='flex h-2 overflow-hidden rounded-sm bg-[var(--ds-color-chart-track)]' data-slot='chart-mark'>
              <div className='flex h-full' style={{ 'width': normalize ? '100%' : `${(row.total / max) * 100}%` }}>
                {series.map((item, seriesIndex) => {
                  const value = row.record[item.key];
                  if (!isChartNumber(value) || value <= 0 || !row.total) return null;

                  return <span key={ item.key } className='h-full' style={{ 'background': getChartColor(colors, seriesIndex), 'width': `${(value / row.total) * 100}%` }} />;
                })}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Ranked rows of horizontal bars, each split into segments: traffic sources per post, tickets
 * by status per team. The chart grows with its rows.
 *
 * @param {object} props
 * @param {object[]} props.data - Rows; read through `labelKey` and the `series` keys (or `valueKey`).
 * @param {Array<{ key: string, label?: string }>} [props.series] - Segments, in order.
 * @param {boolean} [props.normalize=false] - Draw each row as 100% to compare mixes.
 * @param {boolean} [props.sort=true] - Largest row first.
 */
export function StackedBarList(props) {
  const [ frameProps, { colors, data = [], labelKey = 'label', normalize = false, series, showLegend = true, sort = true, state, valueKey = 'value' } ] = splitFrameProps(props);
  const segments = series?.length ? series : [{ 'key': valueKey, 'label': 'Value' }];
  const records = Array.isArray(data) ? data : [];
  const status = chartStatus({ 'data': records, 'keys': segments.map((item) => item.key), state, 'usesRecharts': false });
  const rows = (status === 'ready' ? records : []).map((record) => ({
    record,
    'total': segments.reduce((sum, item) => sum + (isChartNumber(record[item.key]) ? record[item.key] : 0), 0)
  }));
  if (sort) rows.sort((a, b) => b.total - a.total);
  const points = rows.map((row) => ({
    'label': String(row.record[labelKey]),
    'values': [
      ...segments.map((item) => ({
        'display': normalize && row.total ? `${Math.round((row.record[item.key] / row.total) * 100)}%` : undefined,
        'name': item.label || item.key,
        'value': row.record[item.key]
      })),
      ...(segments.length > 1 && !normalize ? [{ 'name': 'Total', 'value': row.total }] : [])
    ]
  }));

  return (
    <ChartFrame height='auto' { ...frameProps } points={ points } status={ status }>
      <BarListPlot colors={ colors } labelKey={ labelKey } normalize={ normalize } rows={ rows } series={ segments } showLegend={ showLegend } />
    </ChartFrame>
  );
}
