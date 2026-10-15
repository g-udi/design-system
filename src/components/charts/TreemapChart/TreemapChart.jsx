'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { createRowsTooltip } from '../ChartFrame/chartTooltip.jsx';
import { RechartsTooltip, RechartsTreemap, ResponsiveContainer, getChartColor } from '../ChartFrame/chartRuntime.js';
import { extent, formatShare, isChartNumber } from '../ChartFrame/chartScale.js';
import { heatmapStep } from '../HeatmapChart/heatmapModel.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';
import { treemapLeaves } from './treemapModel.js';

function TreemapPlot({ colorBy, colors, leaves, nameKey, tree, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const domain = useMemo(() => extent(leaves.map((leaf) => leaf.value)) || [ 0, 0 ], [ leaves ]);
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const item = payload[0]?.payload || {};

    return [{ 'label': item.__group ? `${item.__group} · ${item[nameKey]}` : item[nameKey], 'value': format(item[valueKey] ?? item.value) }];
  }), [ format, nameKey, valueKey ]);

  // A render function, not a component, so tiles redraw without remounting.
  const renderTile = (node) => {
    const { depth, height, width, x, y } = node;
    if (node.__chartIndex == null || !width || !height) return depth > 0 && node.children ? <g key={ `${node[nameKey]}-group` } /> : null;
    const index = node.__chartIndex;
    const color = getChartColor(colors, node.__groupIndex);
    const { fill, ink } = colorBy === 'value'
      ? heatmapStep(node.value, { domain })
      : { 'fill': `color-mix(in srgb, ${color} 22%, var(--ds-color-surface))`, 'ink': 'var(--ds-color-text)' };
    const isActive = active === index;

    return (
      <g key={ index } data-chart-index={ index }>
        <rect fill={ fill } height={ height } stroke='var(--ds-color-surface)' strokeWidth={ 2 } width={ width } x={ x } y={ y } />
        {colorBy === 'group' ? <rect fill={ color } height={ Math.min(3, height) } width={ width - 2 } x={ x + 1 } y={ y + 1 } /> : null}
        {isActive ? <rect fill='none' height={ height - 4 } stroke='var(--ds-color-text)' strokeWidth={ 2 } width={ width - 4 } x={ x + 2 } y={ y + 2 } /> : null}
        {width > 44 && height > 22 ? (
          <text fill={ ink } fontSize={ 12 } fontWeight={ 500 } x={ x + 8 } y={ y + 18 }>{String(node[nameKey]).slice(0, Math.max(3, Math.floor(width / 7.5)))}</text>
        ) : null}
        {width > 56 && height > 40 ? <text fill={ ink } fillOpacity={ 0.8 } fontSize={ 11 } x={ x + 8 } y={ y + 33 }>{format(node.value)}</text> : null}
      </g>
    );
  };

  return (
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsTreemap
        accessibilityLayer={ false }
        aspectRatio={ 4 / 3 }
        content={ renderTile }
        data={ tree }
        dataKey={ valueKey }
        isAnimationActive={ false }
        nameKey={ nameKey }
        onMouseEnter={ (node) => {
          if (Number.isInteger(node?.__chartIndex)) frame?.setActive(node.__chartIndex);
        } }
      >
        <RechartsTooltip content={ <Rows /> } />
      </RechartsTreemap>
    </ResponsiveContainer>
  );
}

/**
 * Nested rectangles sized by value: storage by folder, reading time by section, spend by team.
 *
 * @param {object} props
 * @param {object[]} props.data - Items `{ name, value }`, or groups `{ name, children: [...] }`.
 * @param {'group'|'value'} [props.colorBy='group'] - Tint by top-level group, or a heat ramp by value.
 */
export function TreemapChart(props) {
  const [ frameProps, { colorBy = 'group', colors, data = [], nameKey = 'name', state, valueKey = 'value' } ] = splitFrameProps(props);
  const { leaves, tree } = useMemo(() => treemapLeaves(Array.isArray(data) ? data : [], { nameKey, valueKey }), [ data, nameKey, valueKey ]);
  const status = chartStatus({ 'data': leaves, 'keys': [ 'value' ], state });
  const total = leaves.reduce((sum, leaf) => sum + (isChartNumber(leaf.value) ? leaf.value : 0), 0);
  const points = leaves.map((leaf) => ({
    'label': leaf.__group ? `${leaf.__group} · ${leaf[nameKey]}` : String(leaf[nameKey]),
    'values': [
      { 'name': props.valueLabel || 'Value', 'value': leaf.value },
      { 'display': total ? formatShare(leaf.value / total, 1) : '—', 'name': 'Share', 'value': total ? leaf.value / total : 0 }
    ]
  }));

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <TreemapPlot colorBy={ colorBy } colors={ colors } leaves={ leaves } nameKey={ nameKey } tree={ tree } valueKey={ valueKey } />
    </ChartFrame>
  );
}
