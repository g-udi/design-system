'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../frame.jsx';
import { createRowsTooltip } from '../primitives.jsx';
import { RechartsTooltip, RechartsTreemap, ResponsiveContainer, chartScales, getChartColor } from '../runtime.js';
import { isChartNumber } from '../scale.js';
import { chartStatus, splitFrameProps } from '../shared.js';

/** Flatten a one- or two-level tree into indexed leaves, keeping each leaf's group. */
export function treemapLeaves(data, { nameKey = 'name', valueKey = 'value' } = {}) {
  const leaves = [];
  const tree = data.map((item, groupIndex) => {
    if (Array.isArray(item.children)) {
      return {
        ...item,
        'children': item.children.map((child) => {
          const leaf = { ...child, '__chartIndex': leaves.length, '__group': item[nameKey], '__groupIndex': groupIndex };
          leaves.push(leaf);

          return leaf;
        })
      };
    }
    const leaf = { ...item, '__chartIndex': leaves.length, '__group': null, '__groupIndex': groupIndex };
    leaves.push(leaf);

    return leaf;
  });

  return { 'leaves': leaves.map((leaf) => ({ ...leaf, 'value': leaf[valueKey] })), tree };
}

const heatStep = (value, [ min, max ]) => (max === min ? 3 : 1 + Math.min(4, Math.floor(((value - min) / (max - min)) * 5)));

function TreemapPlot({ colorBy, colors, leaves, nameKey, tree, valueKey }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const range = useMemo(() => {
    const values = leaves.map((leaf) => leaf.value).filter(isChartNumber);

    return [ Math.min(...values), Math.max(...values) ];
  }, [ leaves ]);
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const item = payload[0]?.payload || {};

    return [{ 'label': item.__group ? `${item.__group} · ${item[nameKey]}` : item[nameKey], 'value': format(item[valueKey] ?? item.value) }];
  }), [ format, nameKey, valueKey ]);

  // A render function, not a component, so tiles redraw without remounting.
  const renderTile = (node) => {
    const { depth, height, width, x, y } = node;
    if (node.__chartIndex == null || !width || !height) return depth > 0 && node.children ? <g key={ `${node[nameKey]}-group` } /> : null;
    const index = node.__chartIndex;
    const step = heatStep(node.value, range);
    const color = getChartColor(colors, node.__groupIndex);
    const fill = colorBy === 'value' ? chartScales.heatmap[step] : `color-mix(in srgb, ${color} 22%, var(--ds-color-surface))`;
    const ink = colorBy === 'value' ? chartScales.heatmapInk[step] : 'var(--ds-color-text)';
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
      { 'display': total ? `${Math.round((leaf.value / total) * 1000) / 10}%` : '—', 'name': 'Share', 'value': total ? leaf.value / total : 0 }
    ]
  }));

  return (
    <ChartFrame { ...frameProps } points={ status === 'ready' ? points : [] } status={ status }>
      <TreemapPlot colorBy={ colorBy } colors={ colors } leaves={ leaves } nameKey={ nameKey } tree={ tree } valueKey={ valueKey } />
    </ChartFrame>
  );
}
