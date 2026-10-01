'use client';

import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';
import { default as Button } from '../../Button/index.js';
import { default as Icon } from '../../Icon/index.js';
import { cn } from '../../../../utilities/cn/index.js';

const paths = {
  smoothstep: (props) => getSmoothStepPath({ ...props, borderRadius: 8 }),
  step: (props) => getSmoothStepPath({ ...props, borderRadius: 0 }),
  bezier: getBezierPath,
  straight: getStraightPath
};

/**
 * The default `flow` edge: a smooth-step connector with an optional label pill, a tone
 * for the stroke, a dashed style for soft links such as attachments, and an insert
 * button that appears on hover or keyboard focus when `data.onInsert` is set.
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
  animated,
  label: edgeLabel,
  data = {}
}) {
  const { label = edgeLabel, tone = 'neutral', dashed, path = 'smoothstep', onInsert, insertLabel, emphasis } = data;
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
          className={cn('ds-flow-edge', animated && 'ds-flow-edge-animated')}
          data-tone={tone}
          data-dashed={dashed || undefined}
          data-emphasis={emphasis || undefined}
        />
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
