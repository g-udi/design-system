'use client';

import { useMemo, useState } from 'react';

import { ChartFrame, activeOpacity, useChartFrame } from '../../ChartFrame/parts/frame.jsx';
import { createRowsTooltip } from '../../ChartFrame/parts/primitives.jsx';
import { Cell, Legend, Pie, RechartsPieChart, RechartsTooltip, ResponsiveContainer, getChartColor } from '../../ChartFrame/parts/runtime.js';
import { groupSmallSlices, isChartNumber } from '../../ChartFrame/parts/scale.js';
import { chartStatus, normalizeRecords, splitFrameProps } from '../../ChartFrame/parts/shared.js';

function PiePlot({ centerLabel, colors, data, innerRadius, nameKey, selectedIndex, showLegend, showTooltip, total, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => payload.map((item) => ({
    'color': item.payload?.fill,
    'label': item.name,
    'value': `${format(item.value)} · ${Math.round((item.value / total) * 100)}%`
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
        </RechartsPieChart>
      </ResponsiveContainer>
      {innerRadius ? (
        // Centre summary: the total, or the selected (or active) slice and its share.
        <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 top-[48%] flex -translate-y-1/2 flex-col items-center text-center' data-slot='chart-center'>
          <span className='text-xl font-semibold tabular-nums text-text'>{format(focused ? focused[valueKey] : total)}</span>
          <span className='max-w-28 truncate text-xs text-text-muted'>
            {focused ? `${focused[nameKey]} · ${Math.round((focused[valueKey] / total) * 100)}%` : centerLabel}
          </span>
        </div>
      ) : null}
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
  const [ uncontrolledSelected, setSelected ] = useState(defaultSelectedIndex);
  const selectedIndex = controlledSelected === undefined ? uncontrolledSelected : controlledSelected;
  const labels = { 'other': 'Other', 'total': 'Total', ...frameProps.labels };
  const records = normalizeRecords(data, nameKey, valueKey);
  const status = chartStatus({ data: records, 'keys': [ valueKey ], state });
  const slices = status === 'ready' ? groupSmallSlices(records, { maxSlices, nameKey, 'otherLabel': otherLabel || labels.other, 'threshold': otherThreshold, valueKey }) : [];
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
