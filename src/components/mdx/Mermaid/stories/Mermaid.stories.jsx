import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Mermaid from '../Mermaid';

const docs = getComponentDocs('MDX/Mermaid');
const description = 'A draft goes to review. Approved drafts are scheduled and published; rejected drafts return for revision.';
const lead = 'Every post follows the same path from draft to publication, and a rejected review sends it back for another pass.';
// A real editorial workflow: a decision, a loop back, and a labelled branch.
const chart = [
  'flowchart LR',
  '  A[Draft] --> B[Review]',
  '  B --> C{Approved?}',
  '  C -- No --> D[Revise]',
  '  D --> B',
  '  C -- Yes --> E[Schedule]',
  '  E --> F([Publish])'
].join('\n');

function DiagramExample({ chart: source, ...args }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => setVisible(true), [source]);
  return (
    <div className='text-base leading-7 text-text'>
      <p>{lead}</p>
      <Mermaid id='publishing-flow' description={description} {...args} chart={visible ? source : ''} />
      <Button size='sm' variant='outline' onClick={() => setVisible((current) => !current)}>
        {visible ? 'Clear diagram' : 'Restore diagram'}
      </Button>
    </div>
  );
}

export default {
  title: 'MDX/Mermaid',
  id: 'mdx-mermaid',
  component: Mermaid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { chart: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { chart },
  parameters: {
    layoutAudit: { readySelector: '.mermaid-diagram svg' },
    docs: {
      description: { story: 'An editorial workflow in article context, with a decision, a revision loop, and labelled branches. Edit `chart` to redraw it.' },
      source: playgroundSource('Mermaid', {
        imports: "import { Mermaid } from '@gaudi/design-system/mdx';",
        attributes: ["id='publishing-flow'", `description='${description}'`]
      })
    }
  },
  render: (args) => <DiagramExample {...args} />,
  play: async ({ args, canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument(), { timeout: 10000 });
    const diagram = canvasElement.querySelector('.mermaid-diagram');
    await expect(canvasElement.querySelector('.mermaid-error')).not.toBeInTheDocument();
    await expect(diagram).toHaveAccessibleName(description);
    await expect(diagram).toHaveAttribute('tabindex', '0');
    const svg = diagram.querySelector('svg');
    await expect(parseFloat(svg.style.minWidth)).toBeCloseTo(svg.viewBox.baseVal.width, 2);
    // Every node label in the chart source is drawn.
    for (const [, label] of args.chart.matchAll(/[[{(]+([^\]})]+)[\]})]+/g)) await expect(diagram).toHaveTextContent(label);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear diagram' }));
    await expect(canvasElement.querySelector('.mermaid-diagram')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('.mermaid-loading')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Restore diagram' }));
    await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument(), { timeout: 10000 });
    const scope = canvasElement;
    const originalScopedColor = scope.style.getPropertyValue('--ds-color-mermaid-primary');
    const scopedPriority = scope.style.getPropertyPriority('--ds-color-mermaid-primary');
    try {
      scope.style.setProperty('--ds-color-mermaid-primary', '#fef3c7');
      await waitFor(() => expect(scope.querySelector('.mermaid-diagram svg style')?.textContent).toContain('#fef3c7'), { timeout: 10000 });
    } finally {
      if (originalScopedColor) scope.style.setProperty('--ds-color-mermaid-primary', originalScopedColor, scopedPriority);
      else scope.style.removeProperty('--ds-color-mermaid-primary');
    }
    // Custom ThemeProvider attributes must redraw baked SVG colors too.
    const themeRule = document.createElement('style');
    themeRule.textContent = '[data-mermaid-palette="test"] { --ds-color-mermaid-primary: #dcfce7; }';
    document.head.append(themeRule);
    try {
      scope.setAttribute('data-mermaid-palette', 'test');
      await waitFor(() => expect(scope.querySelector('.mermaid-diagram svg style')?.textContent).toContain('#dcfce7'), { timeout: 10000 });
    } finally {
      scope.removeAttribute('data-mermaid-palette');
      themeRule.remove();
    }
    const root = document.documentElement;
    const original = root.style.getPropertyValue('--ds-color-mermaid-primary');
    const priority = root.style.getPropertyPriority('--ds-color-mermaid-primary');
    try {
      // SVG styles must follow a live token update without changing the chart source.
      root.style.setProperty('--ds-color-mermaid-primary', '#dbeafe');
      await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg style')?.textContent).toContain('#dbeafe'), { timeout: 10000 });
    } finally {
      if (original) root.style.setProperty('--ds-color-mermaid-primary', original, priority);
      else root.style.removeProperty('--ds-color-mermaid-primary');
      await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument(), { timeout: 10000 });
    }
  }
};

export const InvalidDiagram = {
  args: { chart: 'not-a-diagram: A --> B' },
  parameters: {
    docs: {
      description: { story: 'Invalid source uses Gaudi’s Alert and CodeBlock so the failure stays readable within the article.' },
      source: playgroundSource('Mermaid', { imports: "import { Mermaid } from '@gaudi/design-system/mdx';" })
    }
  },
  render: (args) => <Mermaid {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.findByRole('alert', {}, { timeout: 10000 });
    await expect(alert).toHaveTextContent('Failed to render diagram');
    await expect(within(alert).getByRole('region', { name: 'Diagram source' })).toHaveTextContent(args.chart);
  }
};
