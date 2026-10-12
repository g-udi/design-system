import { checkFlowLayoutLifecycle } from '../../../../../tests/components/core/Flow/checkFlowLayoutLifecycle.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { Preview } from './fixtures/PublishingFlowExample.jsx';
import flowSource from './fixtures/PublishingFlowExample.jsx?raw';
import { Flow } from '../index.js';

const docs = getComponentDocs('Core/Planning/Flow');

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
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('Preview', args, { imports: "import '@gaudi/design-system/flow.css';", before: `${publicSource(flowSource, new URL('./fixtures/PublishingFlowExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  render: (args) => <Preview {...args} />,
  play: async ({ args, canvasElement }) => {
    await checkFlowLayoutLifecycle(canvasElement);
    const canvas = within(canvasElement);
    const region = await canvas.findByRole('region', { name: args.label });
    await expect(region).toHaveAccessibleDescription('6 steps and 5 connections.');
    await waitFor(() => expect(canvas.getByText('Editor review')).toBeVisible());
    await expect(canvas.getByText('Send back')).toBeInTheDocument();
    if (args.controls) await expect(canvas.getByRole('button', { name: 'Fit to view' })).toBeInTheDocument();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1' && args.controls) {
      const { page } = await import('vitest/browser');
      const original = { width: window.innerWidth, height: window.innerHeight };
      const centered = () => {
        const bounds = region.getBoundingClientRect();
        const nodes = [...region.querySelectorAll('.react-flow__node')].map((node) => node.getBoundingClientRect());
        expect(nodes.some((node) => node.right > bounds.left && node.left < bounds.right)).toBe(true);
      };
      try {
        await page.viewport(1440, original.height);
        await userEvent.click(canvas.getByRole('button', { name: 'Fit to view' }));
        for (const width of [390, 1440, 320]) {
          await page.viewport(width, original.height);
          await waitFor(centered);
        }
      } finally {
        await page.viewport(original.width, original.height);
      }
    }
    // The text alternative lists each step and where it leads.
    await expect(region).toHaveTextContent('Editor review (Running): leads to Schedule post (Approve), Revise draft (Send back)');
  }
};
