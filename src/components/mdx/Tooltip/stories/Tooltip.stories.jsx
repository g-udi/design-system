import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Tooltip from '../Tooltip';

const docs = getComponentDocs('MDX/Tooltip');
const neighbour = { message: 'Resource Description Framework: the W3C model for describing data as subject, predicate, object triples.', children: 'RDF' };

export default {
  title: 'MDX/Tooltip',
  id: 'mdx-tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { message: 'text', children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { message: 'A query language for RDF graphs, standardised by the W3C in 2008.', children: 'SPARQL' },
  parameters: {
    docs: {
      description: { story: 'Two technical terms in one sentence, each with its own explanation. Hover, focus, or tap the info icon after a term; the second term follows the controls.' },
      source: playgroundSource('Tooltip', {
        imports: "import { Tooltip } from '@gaudi/design-system/mdx';",
        before: `<p>\n  Linked data is published as <Tooltip message='${neighbour.message}'>${neighbour.children}</Tooltip> and queried with\n  `,
        after: ', so any client can join datasets it has never seen before.\n</p>'
      })
    }
  },
  render: (args) => (
    <p className='text-base leading-7 text-text'>
      Linked data is published as <Tooltip {...neighbour} /> and queried with <Tooltip {...args} />, so any client can join
      datasets it has never seen before.
    </p>
  ),
  play: async ({ args, canvasElement, id }) => {
    const canvas = within(canvasElement);
    const [first, trigger] = canvas.getAllByRole('button', { name: 'More information' });
    const tooltip = () => screen.queryByRole('tooltip');
    const expectOpen = (open) => waitFor(() => {
      if (!open) return expect(tooltip()).not.toBeInTheDocument();
      expect(tooltip()).toHaveTextContent(args.message);
      expect(tooltip().scrollWidth).toBeLessThanOrEqual(tooltip().clientWidth + 1);
    });

    await expect(trigger.parentElement).toHaveTextContent(args.children);
    // Screen readers get the explanation as the button's description, open or not.
    await expect(trigger).toHaveAccessibleDescription(args.message);
    await expect(first).toHaveAccessibleDescription(neighbour.message);
    await expectOpen(false);
    await userEvent.hover(trigger);
    await expectOpen(true);
    await userEvent.keyboard('{Escape}');
    await expectOpen(false);
    await userEvent.unhover(trigger);
    trigger.focus();
    await expectOpen(true);
    await userEvent.hover(trigger);
    await userEvent.unhover(trigger);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await expectOpen(true);
    trigger.blur();
    await expectOpen(false);
    // A tap opens the explanation (touch has no hover), and a tap elsewhere closes it.
    await userEvent.pointer({ keys: '[TouchA]', target: trigger });
    await expectOpen(true);
    await userEvent.click(canvasElement);
    await expectOpen(false);
    if (import.meta.env.VITE_GAUDI_AUDIT) {
      const term = trigger.parentElement.firstChild;
      const text = term.textContent;
      try {
        term.textContent = 'LongTechnicalTerm'.repeat(20);
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ canvasElement, id: id + '--long-term' });
      } finally { term.textContent = text; }
    }
  }
};
