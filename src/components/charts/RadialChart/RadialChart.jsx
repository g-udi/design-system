'use client';

import { useMemo } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { createRowsTooltip } from '../ChartFrame/ChartMarks.jsx';
import { Cell, PolarAngleAxis, RadialBar, RechartsRadialBarChart, RechartsTooltip, ResponsiveContainer, chartColors, getChartColor } from '../ChartFrame/chartRuntime.js';
import { chartStatus, normalizeRecords, splitFrameProps } from '../ChartFrame/chartData.js';
import { createChartFormatter, resolveFormatter } from '../ChartFrame/chartScale.js';

function RadialPlot({ color, colors, data, nameKey, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame.format;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({ 'label': item.payload?.[nameKey], 'value': format(item.value) }))), [ format, nameKey ]);

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsRadialBarChart accessibilityLayer={ false } barSize={ 18 } cx='50%' cy='50%' data={ data } endAngle={ -270 } innerRadius='42%' outerRadius='88%' startAngle={ 90 }>
        {/* Values are percentages: the track is the full 0–100 range. */}
        <PolarAngleAxis domain={ [ 0, 100 ] } tick={ false } type='number' />
        <RadialBar background={{ 'fill': 'var(--ds-color-chart-track)' }} cornerRadius={ 16 } dataKey={ valueKey } fill={ color || chartColors[0] } isAnimationActive={ false } nameKey={ nameKey } onMouseEnter={ (_, index) => frame?.setActive(index) }>
          {data.map((entry, index) => <Cell key={ entry[nameKey] ?? index } fill={ data.length > 1 ? getChartColor(colors, index) : color || chartColors[0] } fillOpacity={ activeOpacity(active, index) } />)}
        </RadialBar>
        <RechartsTooltip content={ <Rows /> } />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
}

/** Progress against a full 0–100 track, one ring per record. */
export function RadialBarChart(props) {
  const [ frameProps, { color, colors, data = [], nameKey = 'label', state, valueKey = 'value' } ] = splitFrameProps(props);
  const format = useMemo(() => {
    if (frameProps.formatValue != null) return resolveFormatter(frameProps.formatValue, frameProps.locale);
    const percent = createChartFormatter(frameProps.locale, { style: 'percent', maximumFractionDigits: 3 });
    return value => percent(value / 100);
  }, [ frameProps.formatValue, frameProps.locale ]);
  const records = normalizeRecords(data, nameKey, valueKey);
  const status = chartStatus({ data: records, 'keys': [ valueKey ], state });
  const points = (status === 'ready' ? records : []).map((item) => ({ 'label': String(item[nameKey]), 'values': [{ 'name': props.valueLabel || 'Value', 'value': item[valueKey] }] }));

  return (
    <ChartFrame { ...frameProps } formatValue={ format } height={ frameProps.height ?? 300 } points={ status === 'ready' ? points : [] } status={ status }>
      <RadialPlot color={ color } colors={ colors } data={ records } nameKey={ nameKey } valueKey={ valueKey } />
    </ChartFrame>
  );
}
