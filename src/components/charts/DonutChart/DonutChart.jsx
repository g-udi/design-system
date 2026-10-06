'use client';

import { useMemo } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';

import { ChartFrame, activeOpacity, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { createRowsTooltip } from '../ChartFrame/ChartMarks.jsx';
import { Cell, Legend, Pie, RechartsPieChart, RechartsTooltip, ResponsiveContainer, getChartColor, usePlotArea } from '../ChartFrame/chartRuntime.js';
import { groupSmallSlices, isChartNumber } from '../ChartFrame/chartScale.js';
import { chartStatus, normalizeRecords, splitFrameProps } from '../ChartFrame/chartData.js';

// The plot area excludes the measured legend, including wrapped rows.
function PieCenter({ innerRadius, label, value }) {
  const area = usePlotArea();
  if (!area) return null;
  const diameter = typeof innerRadius === 'string' && innerRadius.endsWith('%')
    ? Math.min(area.width, area.height) * parseFloat(innerRadius) / 100
    : Number(innerRadius) * 2;
  const size = Math.max(1, diameter - 8);
  return (
    <foreignObject x={area.x + area.width / 2 - size / 2} y={area.y + area.height * 0.48 - size / 2} width={size} height={size}>
      <div aria-hidden='true' className='pointer-events-none flex h-full flex-col items-center justify-center text-center' data-slot='chart-center'>
        <span className='max-w-full truncate text-xl font-semibold tabular-nums text-text'>{value}</span>
        <span className='max-w-full truncate text-xs text-text-muted'>{label}</span>
      </div>
    </foreignObject>
  );
}

function PiePlot({ centerLabel, colors, data, innerRadius, nameKey, selectedIndex, showLegend, showTooltip, total, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({
    'color': item.payload?.fill,
    'label': item.name,
    'value': `${format(item.value)} · ${Math.round(total ? (item.value / total) * 100 : 0)}%`
  }))), [ format, total ]);
  const focus = selectedIndex ?? active;
  const focused = focus == null ? null : data[focus];

  return (
    <div className='relative h-full w-full'>
      <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
        <RechartsPieChart accessibilityLayer={ false }>
          {showTooltip ? <RechartsTooltip content={ <Rows /> } /> : null}
          {showLegend ? <Legend iconType='circle' wrapperStyle={{ 'fontSize': 12, 'paddingTop': 12 }} /> : null}
          <Pie
            cx='50%'
            cy='48%'
            data={ data }
            dataKey={ valueKey }
            innerRadius={ innerRadius }
            isAnimationActive={ false }
            nameKey={ nameKey }
            onMouseEnter={ (_, index) => frame?.setActive(index) }
            outerRadius='78%'
            paddingAngle={ 2 }
          >
            {data.map((entry, index) => (
              <Cell
                key={ entry[nameKey] ?? index }
                fill={ entry.isOther ? 'var(--ds-color-chart-muted)' : getChartColor(colors, index) }
                fillOpacity={ activeOpacity(focus, index) }
                stroke={ selectedIndex === index ? 'var(--ds-color-text)' : 'var(--ds-color-surface)' }
                strokeWidth={ selectedIndex === index ? 2 : 1 }
              />
            ))}
          </Pie>
          {innerRadius ? <PieCenter innerRadius={innerRadius} value={format(focused ? focused[valueKey] : total)} label={focused ? `${focused[nameKey]} · ${Math.round(total ? (focused[valueKey] / total) * 100 : 0)}%` : centerLabel} /> : null}
        </RechartsPieChart>
      </ResponsiveContainer>

    </div>
  );
}

/**
 * Parts of a whole. Donuts show a centre summary; selection (click, Enter or Space) pins a
 * slice. `otherThreshold` (share) or `maxSlices` folds small slices into "Other".
 */
export function PieChart(props) {
  const [ frameProps, {
    centerLabel,
    colors,
    data = [],
    defaultSelectedIndex = null,
    innerRadius = 0,
    maxSlices,
    nameKey = 'label',
    onSelect,
    otherLabel,
    otherThreshold,
    selectable = Boolean(innerRadius),
    selectedIndex: controlledSelected,
    showLegend = true,
    showTooltip = true,
    state,
    valueKey = 'value'
  } ] = splitFrameProps(props);
  const [ storedSelected, setSelected ] = useControllableState({ value: controlledSelected, defaultValue: defaultSelectedIndex });
  const labels = { 'other': 'Other', 'total': 'Total', ...frameProps.labels };
  const records = normalizeRecords(data, nameKey, valueKey);
  const status = chartStatus({ data: records, 'keys': [ valueKey ], state });
  const slices = status === 'ready' ? groupSmallSlices(records, { maxSlices, nameKey, 'otherLabel': otherLabel || labels.other, 'threshold': otherThreshold, valueKey }) : [];
  const selectedIndex = Number.isInteger(storedSelected) && storedSelected >= 0 && storedSelected < slices.length ? storedSelected : null;
  useIsomorphicLayoutEffect(() => {
    // A removed slice cannot remain pinned; controlled hosts keep ownership of their value.
    if (controlledSelected === undefined && storedSelected != null && selectedIndex == null) {
      setSelected(null);
      onSelect?.(null, null);
    }
  }, [controlledSelected, storedSelected, selectedIndex, setSelected, onSelect]);
  const total = slices.reduce((sum, item) => sum + (isChartNumber(item[valueKey]) ? item[valueKey] : 0), 0);
  const points = slices.map((item) => ({
    'label': String(item[nameKey]),
    'values': [
      { 'name': props.valueLabel || 'Value', 'value': item[valueKey] },
      { 'display': `${total ? Math.round((item[valueKey] / total) * 100) : 0}%`, 'name': 'Share', 'value': total ? item[valueKey] / total : 0 },
      ...(item.isOther ? [{ 'display': item.members.join(', '), 'name': 'Includes', 'value': item.members.length }] : [])
    ]
  }));

  const select = (point, index) => {
    if (selectable) {
      const next = selectedIndex === index ? null : index;
      setSelected(next);
      onSelect?.(next == null ? null : slices[next], next);
    }
    frameProps.onActivate?.(point, index);
  };

  return (
    <ChartFrame { ...frameProps } height={ frameProps.height ?? 320 } onActivate={ selectable || frameProps.onActivate ? select : undefined } points={ points } status={ status }>
      <PiePlot centerLabel={ centerLabel || labels.total } colors={ colors } data={ slices } innerRadius={ innerRadius } nameKey={ nameKey } selectedIndex={ selectable ? selectedIndex : null } showLegend={ showLegend } showTooltip={ showTooltip } total={ total } valueKey={ valueKey } />
    </ChartFrame>
  );
}

/** A pie with a hole and a centre summary; selectable by default. */
export const DonutChart = (props) => <PieChart innerRadius='56%' { ...props } />;
