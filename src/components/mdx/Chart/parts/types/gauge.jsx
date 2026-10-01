'use client';

import { ChartFrame, useChartFrame } from '../frame.jsx';
import { chartTones } from '../primitives.jsx';
import { isChartNumber, resolveFormatter } from '../scale.js';
import { chartStatus, splitFrameProps } from '../shared.js';

const CX = 100;
const CY = 100;
const RADIUS = 80;

// Angles run from 180° (min, left) to 0° (max, right) over the top.
const polar = (radius, angle) => [ CX + radius * Math.cos((angle * Math.PI) / 180), CY - radius * Math.sin((angle * Math.PI) / 180) ];
const arc = (radius, from, to) => {
  const [ x0, y0 ] = polar(radius, from);
  const [ x1, y1 ] = polar(radius, to);

  return `M${x0},${y0} A${radius},${radius} 0 ${from - to > 180 ? 1 : 0} 1 ${x1},${y1}`;
};

function GaugePlot({ bands, label, max, min, target, unit, value }) {
  const frame = useChartFrame();
  const format = frame?.format || String;
  const clamp = (number) => Math.min(max, Math.max(min, number));
  const angle = (number) => 180 - ((clamp(number) - min) / (max - min || 1)) * 180;
  const band = bands.find((item, index) => value <= item.to || index === bands.length - 1);
  const color = band ? chartTones[band.tone] || band.tone : 'var(--ds-color-chart-1)';
  let from = min;

  return (
    <svg aria-hidden='true' className='mx-auto block h-full w-full max-w-80' data-chart-index={ 0 } viewBox='0 0 200 118'>
      <path d={ arc(RADIUS, 180, 0) } fill='none' stroke='var(--ds-color-chart-track)' strokeLinecap='round' strokeWidth={ 12 } />
      {bands.map((item) => {
        const segment = <path key={ `${item.to}-${item.tone}` } d={ arc(RADIUS + 11, angle(from), angle(item.to)) } fill='none' stroke={ chartTones[item.tone] || item.tone } strokeOpacity={ 0.55 } strokeWidth={ 3 } />;
        from = item.to;

        return segment;
      })}
      {value > min ? <path d={ arc(RADIUS, 180, angle(value)) } fill='none' stroke={ color } strokeLinecap='round' strokeWidth={ 12 } /> : null}
      {isChartNumber(target) ? (() => {
        const [ x0, y0 ] = polar(RADIUS - 10, angle(target));
        const [ x1, y1 ] = polar(RADIUS + 10, angle(target));

        return <line stroke='var(--ds-color-text)' strokeLinecap='round' strokeWidth={ 2.5 } x1={ x0 } x2={ x1 } y1={ y0 } y2={ y1 } />;
      })() : null}
      <text fill='var(--ds-color-text)' fontSize={ 24 } fontWeight={ 600 } textAnchor='middle' x={ CX } y={ CY - 8 }>{`${format(value)}${unit || ''}`}</text>
      {label ? <text fill='var(--ds-color-text-muted)' fontSize={ 11 } textAnchor='middle' x={ CX } y={ CY + 10 }>{label}</text> : null}
      <text fill='var(--ds-color-text-muted)' fontSize={ 10 } textAnchor='middle' x={ CX - RADIUS } y={ CY + 16 }>{format(min)}</text>
      <text fill='var(--ds-color-text-muted)' fontSize={ 10 } textAnchor='middle' x={ CX + RADIUS } y={ CY + 16 }>{format(max)}</text>
    </svg>
  );
}

/**
 * One reading against its range: a half-circle track, the value arc coloured by the band it
 * falls in, and an optional target tick. Core Web Vitals, uptime, plan usage.
 *
 * @param {object} props
 * @param {number} props.value
 * @param {number} [props.min=0] / [props.max=100]
 * @param {number} [props.target] - Goal marked on the track.
 * @param {Array<{ to: number, tone: 'success'|'warning'|'danger'|'accent'|'neutral' }>} [props.bands] - Threshold bands, ascending.
 * @param {string} [props.label] - Short caption under the value.
 * @param {string} [props.unit] - Suffix on the value, e.g. 'ms' or '%'.
 */
export function GaugeChart(props) {
  const [ frameProps, { bands = [], label, max = 100, min = 0, state, target, unit, value } ] = splitFrameProps(props);
  const valid = isChartNumber(value) && isChartNumber(min) && isChartNumber(max) && max > min;
  const status = chartStatus({ 'data': [ value ], 'keys': [], state, 'status': value == null ? 'empty' : valid ? 'ready' : 'invalid', 'usesRecharts': false });
  const toText = resolveFormatter(frameProps.formatValue, frameProps.locale);
  const format = (number) => `${toText(number)}${unit || ''}`;
  const points = status === 'ready' ? [{
    'label': label || props.valueLabel || 'Value',
    'values': [
      { 'name': 'Value', 'value': value },
      ...(isChartNumber(target) ? [{ 'name': 'Target', 'value': target }] : []),
      { 'display': `${format(min)} – ${format(max)}`, 'name': 'Range', 'value': max - min }
    ]
  }] : [];

  return (
    <ChartFrame height={ 200 } { ...frameProps } points={ points } status={ status }>
      <GaugePlot bands={ bands } label={ label } max={ max } min={ min } target={ target } unit={ unit } value={ value } />
    </ChartFrame>
  );
}
