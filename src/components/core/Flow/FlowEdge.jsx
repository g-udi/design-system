'use client';

import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { default as Button } from '../Button/index.js';
import { default as Icon } from '../Icon/index.js';
import { cn } from '../../../utilities/cn/index.js';
import { FLOW_EDGE_VARIANTS } from './flowModel.js';

const paths = {
  smoothstep: (props) => getSmoothStepPath({ ...props, borderRadius: 8 }),
  step: (props) => getSmoothStepPath({ ...props, borderRadius: 0 }),
  bezier: getBezierPath,
  straight: getStraightPath
};

/** Run states colour a connection: running flows in the accent, failures turn danger, and so on. */
const statusTones = { running: 'accent', failed: 'danger', waiting: 'warning', blocked: 'attention', success: 'success', done: 'success' };

/**
 * The default `flow` edge: a connector with an optional label pill, a line `variant`
 * (solid, dashed or dotted), an optional travelling flow in the edge's direction, a tone
 * or run `status` for the stroke, and an insert button that appears on hover or keyboard
 * focus when `data.onInsert` is set. A solid edge that flows keeps its line and carries
 * moving dots over it; dashed and dotted edges move their own pattern.
 */
export function FlowEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
  style,
  selected,
  animated: edgeAnimated,
  label: edgeLabel,
  data = {}
}) {
  const { label = edgeLabel, status, dashed, path = 'smoothstep', onInsert, insertLabel, emphasis } = data;
  const tone = data.tone || statusTones[status] || 'neutral';
  const animated = data.animated ?? (edgeAnimated || status === 'running');
  // `dashed` is the earlier flag; an animated edge without a variant keeps its moving dashes.
  const variant = FLOW_EDGE_VARIANTS.includes(data.variant) ? data.variant : dashed || (edgeAnimated && !data.variant) ? 'dashed' : 'solid';
  const [active, setActive] = useState(false);
  const [d, labelX, labelY] = (paths[path] || paths.smoothstep)({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const show = active || selected;
  return (
    <>
      <g onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
        <BaseEdge
          id={id}
          path={d}
          markerEnd={markerEnd}
          markerStart={markerStart}
          style={style}
          interactionWidth={24}
          className={cn('ds-flow-edge', animated && variant !== 'solid' && 'ds-flow-edge-animated')}
          data-tone={tone}
          data-variant={variant}
          data-status={status || undefined}
          data-emphasis={emphasis || undefined}
        />
        {animated && variant === 'solid' && (
          <path d={d} fill='none' aria-hidden='true' className='ds-flow-edge-flow' data-tone={tone} />
        )}
      </g>
      {(label || onInsert) && (
        <EdgeLabelRenderer>
          <div
            className='ds-flow-edge-labels nodrag nopan'
            data-active={show || undefined}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            onPointerEnter={() => setActive(true)}
            onPointerLeave={() => setActive(false)}
          >
            {label && <span className='ds-flow-edge-label' data-tone={tone}>{label}</span>}
            {onInsert && (
              <Button
                size='icon-xs'
                variant='outline'
                tone='neutral'
                className='ds-flow-edge-insert'
                aria-label={insertLabel || 'Add a step here'}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onClick={(event) => {
                  event.stopPropagation();
                  onInsert({ id, source, target });
                }}
              >
                <Icon name='Plus' decorative />
              </Button>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
