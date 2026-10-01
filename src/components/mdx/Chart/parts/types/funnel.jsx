'use client';

import { cn } from '../../../../../utilities/cn';
import { ChartFrame, useChartFrame } from '../frame.jsx';
import { getChartColor } from '../runtime.js';
import { chartStatus, splitFrameProps } from '../shared.js';

const percent = (value) => `${Math.round(value * 1000) / 10}%`;

function FunnelPlot({ align, colors, conversionLabel, labelKey, monochrome, steps, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const first = steps[0]?.[valueKey] || 1;

  return (
    <ol aria-hidden='true' className='grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5'>
      {steps.map((step, index) => {
        const share = step[valueKey] / first;
        const previous = index ? steps[index - 1][valueKey] : null;

        return (
          <li key={ `${step[labelKey]}-${index}` } className={ cn('grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-md px-2 py-1.5 transition-colors', active === index && 'bg-surface-muted') } data-chart-index={ index }>
            <div className='flex items-baseline justify-between gap-3 text-sm'>
              <span className='min-w-0 truncate text-text'>{step[labelKey]}</span>
              <span className='flex shrink-0 items-baseline gap-2 tabular-nums'>
                <span className='font-medium text-text'>{format(step[valueKey])}</span>
                {previous ? <span className='text-xs text-text-muted'>{`${percent(step[valueKey] / previous)} ${conversionLabel}`}</span> : null}
              </span>
            </div>
            <div className={ cn('flex h-6', align === 'center' && 'justify-center') } data-slot='chart-mark'>
              <span
                className='h-full rounded-sm'
                style={{ 'background': monochrome ? getChartColor(colors, 0) : getChartColor(colors, index), 'opacity': monochrome ? Math.max(0.35, 1 - index * 0.14) : 1, 'width': `${Math.max(share * 100, 1.5)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Drop-off across ordered steps: each bar is its share of the first step, with the conversion
 * from the step before. Newsletter signups, checkout, onboarding.
 *
 * @param {object} props
 * @param {object[]} props.data - Steps in order `{ label, value }`.
 * @param {'start'|'center'} [props.align='start'] - Left-aligned bars or a centred funnel.
 * @param {boolean} [props.monochrome=true] - One hue that fades by step, instead of a colour per step.
 * @param {string} [props.conversionLabel='from previous'] - Suffix on each conversion rate.
 */
export function FunnelChart(props) {
  const [ frameProps, { align = 'start', colors, conversionLabel = 'from previous', data = [], labelKey = 'label', monochrome = true, state, valueKey = 'value' } ] = splitFrameProps(props);
  const steps = Array.isArray(data) ? data : [];
  const status = chartStatus({ 'data': steps, 'keys': [ valueKey ], state, 'usesRecharts': false });
  const first = steps[0]?.[valueKey] || 1;
  const points = status === 'ready' ? steps.map((step, index) => ({
    'label': String(step[labelKey]),
    'values': [
      { 'name': props.valueLabel || 'Count', 'value': step[valueKey] },
      { 'display': index ? percent(step[valueKey] / steps[index - 1][valueKey]) : '—', 'name': 'Conversion', 'value': index ? step[valueKey] / steps[index - 1][valueKey] : 1 },
      { 'display': percent(step[valueKey] / first), 'name': 'Of first step', 'value': step[valueKey] / first }
    ]
  })) : [];

  return (
    <ChartFrame height='auto' { ...frameProps } points={ points } status={ status }>
      <FunnelPlot align={ align } colors={ colors } conversionLabel={ conversionLabel } labelKey={ labelKey } monochrome={ monochrome } steps={ steps } valueKey={ valueKey } />
    </ChartFrame>
  );
}
