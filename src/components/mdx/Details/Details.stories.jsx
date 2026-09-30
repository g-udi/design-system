import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Details from './Details';

const docs = getComponentDocs('MDX/Details');
const lead = 'The deploy gate only needs the lockfile re-pinned. The steps below matter only if the build still fails.';
// Rich panel content: a short explanation and an ordered checklist, as a real article would include.
const steps = ['Delete node_modules and the pnpm store cache.', 'Run pnpm install --frozen-lockfile.', 'Re-run the build with NEXT_TELEMETRY_DISABLED=1.'];

export default {
  title: 'MDX/Details',
  id: 'mdx-details',
  component: Details,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { title: 'Troubleshooting a failed build' },
  parameters: {
    docs: {
      description: { story: 'An optional troubleshooting section after the main instruction. Open the disclosure to reveal an explanation and an ordered checklist.' },
      source: playgroundSource('Details', {
        imports: "import { Details } from '@gaudi/design-system/mdx';",
        children: [
          '  <p>A stale pnpm store can keep the old package after the lockfile changes.</p>',
          '  <ol>',
          ...steps.map((step) => `    <li>${step}</li>`),
          '  </ol>'
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7 text-gray-700 dark:text-gray-300'>
      <p>{lead}</p>
      <Details {...args}>
        <p>A stale pnpm store can keep the old package after the lockfile changes.</p>
        <ol className='mt-2 list-decimal space-y-1 pl-5'>
          {steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </Details>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.title });
    await expect(trigger.parentElement.tagName).toBe('H2');
    // The title renders once: the heading wraps the disclosure button.
    await expect(canvas.getAllByText(args.title)).toHaveLength(1);
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveAccessibleName(args.title);
    await expect(canvas.queryByText(steps[0])).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(steps.length);
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.queryByText(steps[0])).not.toBeInTheDocument());
  }
};
