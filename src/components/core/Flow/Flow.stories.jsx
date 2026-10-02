import { useMemo } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { Flow, layoutFlow } from './index.js';

const docs = getComponentDocs('Core/Planning/Flow');

// A publishing pipeline: a draft moves through review to a scheduled post, with a send-back branch.
const steps = [
  { id: 'draft', type: 'pill', data: { title: 'Draft ready', icon: 'FileText', tone: 'accent', target: false } },
  { id: 'edit', type: 'step', data: { title: 'Copy edit', description: 'Grammar, links and tone', icon: 'Pencil', tone: 'info', status: 'success', meta: ['12 min', '2 comments'], owner: { name: 'Maya Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg' } } },
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

function Preview({ direction, path, variant, animated, background, controls, minimap, interactive, ...args }) {
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

export default {
  title: 'Core/Planning/Flow',
  id: 'core-flow',
  component: Flow,
  tags: ['autodocs'],
  argTypes: {
    ...docsArgTypes(docs, { label: 'text', background: ['dots', 'lines', 'cross', 'none'], controls: 'boolean', minimap: 'boolean' }),
    direction: { control: 'inline-radio', options: ['TB', 'LR'], description: 'Layout direction passed to layoutFlow.' },
    path: { control: 'select', options: ['smoothstep', 'bezier', 'step', 'straight'], description: 'Edge path drawn by FlowEdge (`edge.data.path`).' },
    variant: { control: 'inline-radio', options: ['solid', 'dashed', 'dotted'], description: 'Line style drawn by FlowEdge (`edge.data.variant`).' },
    animated: { control: 'boolean', description: 'Dots or dashes travel toward each target (`edge.data.animated`); motion stops under reduced motion.' },
    interactive: { control: 'boolean', description: 'Drag, connect and select (`nodesDraggable`, `nodesConnectable`, `elementsSelectable`).' }
  },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label: 'Publishing pipeline', direction: 'TB', path: 'smoothstep', variant: 'solid', background: 'dots', animated: false, controls: true, minimap: false, interactive: true },
  parameters: {
    docs: {
      description: { story: 'A publishing pipeline from draft to published, with a review step that approves or sends the draft back. The layout comes from `layoutFlow`; switch the direction, edge path, line style (solid, dashed or dotted), the flowing animation, background and controls.' },
      source: playgroundSource('Flow', {
        imports: "import '@gaudi/design-system/flow.css';\nimport { Flow, layoutFlow } from '@gaudi/design-system/core/Flow';",
        attributes: ['nodes={layoutFlow(steps, links)}', 'edges={links}']
      })
    }
  },
  render: (args) => <Preview {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const region = await canvas.findByRole('region', { name: args.label });
    await expect(region).toHaveAccessibleDescription('6 steps and 5 connections.');
    await waitFor(() => expect(canvas.getByText('Editor review')).toBeVisible());
    await expect(canvas.getByText('Send back')).toBeInTheDocument();
    if (args.controls) await expect(canvas.getByRole('button', { name: 'Fit to view' })).toBeInTheDocument();
    // The text alternative lists each step and where it leads.
    await expect(region).toHaveTextContent('Editor review (Running): leads to Schedule post (Approve), Revise draft (Send back)');
  }
};
