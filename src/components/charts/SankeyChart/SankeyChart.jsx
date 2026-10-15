'use client';

import { useMemo } from 'react';

import { ChartFrame, useChartFrame } from '../ChartFrame/ChartFrame.jsx';
import { createRowsTooltip } from '../ChartFrame/chartTooltip.jsx';
import { RechartsSankey, RechartsTooltip, ResponsiveContainer, getChartColor } from '../ChartFrame/chartRuntime.js';
import { isChartNumber } from '../ChartFrame/chartScale.js';
import { chartStatus, splitFrameProps } from '../ChartFrame/chartData.js';
import { sankeyGraph } from './sankeyModel.js';

function SankeyPlot({ colors, graph, nodeWidth }) {
  const frame = useChartFrame();
  const active = frame?.activeIndex;
  const format = frame?.format || String;
  const activeLink = active == null ? null : graph.links[active];
  const nodeColor = (index) => graph.nodes[index]?.color || getChartColor(colors, index);
  const Rows = useMemo(() => createRowsTooltip(({ payload }) => {
    const item = payload[0]?.payload?.payload || payload[0]?.payload || {};
    if (item.source && item.target) return [{ 'label': `${item.source.name} → ${item.target.name}`, 'value': format(item.value) }];

    return [{ 'label': item.name, 'value': format(item.value) }];
  }), [ format ]);

  // Plain render functions (not components), so Recharts redraws links without remounting them.
  const renderLink = ({ index, linkWidth, sourceControlX, sourceX, sourceY, targetControlX, targetX, targetY }) => {
    const touchesActive = activeLink && index === active;
    const dim = activeLink && !touchesActive;

    return (
      <path
        d={ `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}` }
        data-chart-index={ index }
        fill='none'
        key={ index }
        stroke={ nodeColor(graph.links[index]?.source) }
        strokeOpacity={ touchesActive ? 0.6 : dim ? 0.12 : 0.32 }
        strokeWidth={ Math.max(1, linkWidth) }
      />
    );
  };

  const renderNode = ({ height, index, payload, width, x, y }) => {
    // Recharts lists a node's incoming links as sourceLinks: first-column sources (none incoming)
    // label to their left, every later stage to its right.
    const labelRight = Boolean(payload.sourceLinks?.length);
    const connected = activeLink && (activeLink.source === index || activeLink.target === index);

    return (
      <g key={ index }>
        <rect fill={ nodeColor(index) } fillOpacity={ activeLink && !connected ? 0.45 : 1 } height={ Math.max(1, height) } rx={ 1 } width={ width } x={ x } y={ y } />
        <text
          dominantBaseline='middle'
          fill='var(--ds-color-text)'
          fontSize={ 12 }
          textAnchor={ labelRight ? 'start' : 'end' }
          x={ labelRight ? x + width + 6 : x - 6 }
          y={ y + height / 2 }
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className='h-full w-full overflow-x-auto' tabIndex={0} role='region' aria-label={ frame?.labels.scrollRegion }>
      <div className='h-full min-w-xl'>
    <ResponsiveContainer height='100%' minWidth={ 0 } width='100%'>
      <RechartsSankey
        accessibilityLayer={ false }
        data={ graph }
        link={ renderLink }
        margin={{ 'bottom': 8, 'left': 96, 'right': 96, 'top': 8 }}
        node={ renderNode }
        nodePadding={ 18 }
        nodeWidth={ nodeWidth }
        onMouseEnter={ (item, type) => {
          if (type === 'link' && Number.isInteger(item?.index)) frame?.setActive(item.index);
        } }
      >
        <RechartsTooltip content={ <Rows /> } />
      </RechartsSankey>
    </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Flows between stages, with widths proportional to volume: where readers come from and where
 * they go, how tickets move between queues.
 *
 * @param {object} props
 * @param {Array<string|{ name: string, color?: string }>} [props.nodes] - Stages; optional when links name them.
 * @param {Array<{ source: string|number, target: string|number, value: number }>} props.links
 * @param {number} [props.nodeWidth=10]
 */
export function SankeyChart(props) {
  const [ frameProps, { colors, data, links, nodeWidth = 10, nodes, state } ] = splitFrameProps(props);
  const graph = useMemo(() => sankeyGraph(data || { links, nodes }), [ data, links, nodes ]);
  const status = chartStatus({ 'data': graph.links, 'keys': [ 'value' ], state, 'status': graph.links.length && graph.links.some((link) => !isChartNumber(link.value) || link.value < 0) ? 'invalid' : undefined });
  const points = graph.links.map((link) => ({
    'label': `${graph.nodes[link.source]?.name} → ${graph.nodes[link.target]?.name}`,
    'values': [{ 'name': props.valueLabel || 'Value', 'value': link.value }]
  }));

  return (
    <ChartFrame { ...frameProps } labels={{ 'category': 'Flow', ...frameProps.labels }} points={ status === 'ready' ? points : [] } status={ status }>
      <SankeyPlot colors={ colors } graph={ graph } nodeWidth={ nodeWidth } />
    </ChartFrame>
  );
}
