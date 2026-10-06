'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { ChartGrid, ChartReferenceLine, ChartXAxis, ChartYAxis, createRowsTooltip } from '../ChartFrame/ChartMarks.jsx';
import { Cell, RechartsScatterChart, RechartsTooltip, ResponsiveContainer, Scatter, ZAxis, chartColors } from '../ChartFrame/chartRuntime.js';
import { defaultMargins } from '../ChartFrame/ChartSeries.jsx';
import { normalizeRecords, chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';

function ScatterPlot({ color, data, references, showGrid, showTooltip, xKey, xLabel, yKey, yLabel, zKey, zLabel, zRange }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const point = payload[0]?.payload || {};

    return [
      { 'label': xLabel || xKey, 'value': format(point[xKey]) },
      { 'label': yLabel || yKey, 'value': format(point[yKey]) },
      zKey ? { 'label': zLabel || zKey, 'value': format(point[zKey]) } : null
    ];
  }, { 'title': (_, payload) => payload[0]?.payload?.label }), [ format, xKey, xLabel, yKey, yLabel, zKey, zLabel ]);
  const fill = color || chartColors[0];

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsScatterChart accessibilityLayer={ false } margin={ defaultMargins }>
        {showGrid ? <ChartGrid vertical /> : null}
        <ChartXAxis dataKey={ xKey } name={ xLabel || xKey } tickFormatter={ format } type='number' />
        <ChartYAxis dataKey={ yKey } name={ yLabel || yKey } tickFormatter={ format } type='number' />
        {zKey ? <ZAxis dataKey={ zKey } name={ zLabel || zKey } range={ zRange } type='number' /> : null}
        {references?.map((reference) => <ChartReferenceLine key={ `${reference.x ?? ''}-${reference.y ?? ''}` } { ...reference } />)}
        {showTooltip ? <RechartsTooltip content={ <Rows /> } cursor={{ 'strokeDasharray': '3 3' }} /> : null}
        <Scatter
          data={ data }
          fill={ fill }
          fillOpacity={ zKey ? 0.55 : 0.9 }
          isAnimationActive={ false }
          name={ yLabel || yKey }
          onMouseEnter={ (_, index) => frame?.setActive(index) }
        >
          {data.map((entry, index) => (
            <Cell
              key={ entry.label ?? `${entry[xKey]}-${entry[yKey]}-${index}` }
              fill={ entry.color || fill }
              fillOpacity={ active === index ? 1 : active == null ? (zKey ? 0.55 : 0.9) : 0.3 }
              stroke={ active === index ? 'var(--ds-color-text)' : 'var(--ds-color-surface)' }
              strokeWidth={ active === index ? 2 : 1 }
            />
          ))}
        </Scatter>
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

/** Correlation between two numbers; add `zKey` for bubble sizes. Points may carry a `label`. */
export function ScatterChart(props) {
  const [ frameProps, { color, data = [], references, showGrid = true, showTooltip = true, state, xKey = 'x', xLabel, yKey = 'y', yLabel, zKey, zLabel, zRange = [ 60, 900 ] } ] = splitFrameProps(props);
  const records = normalizeRecords(data, xKey, yKey, true);
  const keys = [ xKey, yKey, ...(zKey ? [ zKey ] : []) ];
  const status = chartStatus({ data: records, keys, state });
  const points = (status === 'ready' ? records : []).map((item, index) => ({
    'label': String(item.label ?? `${index + 1}`),
    'values': [
      { 'name': xLabel || xKey, 'value': item[xKey] },
      { 'name': yLabel || yKey, 'value': item[yKey] },
      ...(zKey ? [{ 'name': zLabel || zKey, 'value': item[zKey] }] : [])
    ]
  }));

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <ScatterPlot color={ color } data={ records } references={ references } showGrid={ showGrid } showTooltip={ showTooltip } xKey={ xKey } xLabel={ xLabel } yKey={ yKey } yLabel={ yLabel } zKey={ zKey } zLabel={ zLabel } zRange={ zRange } />
    </ChartFrame>
  );
}

/** A scatter whose third value sets each bubble's area. */
export const BubbleChart = ({ zKey = 'z', ...props }) => <ScatterChart zKey={ zKey } { ...props } />;
