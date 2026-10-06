import { useMemo } from 'react';
import { Flow, layoutFlow } from '@gaudi/design-system/core/Flow';

// A publishing pipeline: a draft moves through review to a scheduled post, with a send-back branch.
const steps = [
  { id: 'draft', type: 'pill', data: { title: 'Draft ready', icon: 'FileText', tone: 'accent', target: false } },
  { id: 'edit', type: 'step', data: { title: 'Copy edit', description: 'Grammar, links and tone', icon: 'Pencil', tone: 'info', status: 'success', meta: ['12 min', '2 comments'], owner: { name: 'Mei Castellanos', src: '/avatars/person-20.svg' } } },
  { id: 'review', type: 'step', data: { title: 'Editor review', description: 'Approve or send back', icon: 'Split', tone: 'discovery', status: 'running', meta: ['Due today'], outputs: [{ id: 'approve' }, { id: 'revise' }] } },
  { id: 'revise', type: 'step', data: { title: 'Revise draft', icon: 'RotateCcw', tone: 'warning', status: 'idle', meta: ['Back to author'] } },
  { id: 'schedule', type: 'step', data: { title: 'Schedule post', description: 'Tuesday 09:00', icon: 'Calendar', tone: 'success', status: 'queued', progress: 0, progressLabel: 'Assets ready' } },
  { id: 'live', type: 'pill', data: { title: 'Published', icon: 'Send', tone: 'success', source: false } }
];
const links = [
  { id: 'draft-edit', source: 'draft', target: 'edit' },
  { id: 'edit-review', source: 'edit', target: 'review' },
  { id: 'review-schedule', source: 'review', sourceHandle: 'approve', target: 'schedule', data: { label: 'Approve', tone: 'success' } },
  { id: 'review-revise', source: 'review', sourceHandle: 'revise', target: 'revise', data: { label: 'Send back', tone: 'warning' } },
  { id: 'schedule-live', source: 'schedule', target: 'live' }
];

export function Preview({ direction, path, variant, animated, background, controls, minimap, interactive, ...args }) {
  const nodes = useMemo(() => layoutFlow(steps.map((node) => ({ ...node, position: { x: 0, y: 0 } })), links, { direction }), [direction]);
  const edges = useMemo(() => links.map((edge) => ({ ...edge, data: { ...edge.data, path, variant, animated } })), [animated, path, variant]);
  return (
    <Flow
      key={direction}
      {...args}
      nodes={nodes}
      edges={edges}
      background={background}
      controls={controls}
      minimap={minimap}
      nodesDraggable={interactive}
      nodesConnectable={interactive}
      elementsSelectable={interactive}
      className='h-[32rem]'
    />
  );
}
