import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Callout from '../Callout';

const docs = getComponentDocs('MDX/Callout');
const tokenByType = { info: 'info', warning: 'warning', error: 'danger' };
// A migration guide: a settled tip introduces the note driven by the controls.
const tip = 'Gaudi now reads site metadata from SiteConfigProvider, so layouts no longer import the config file directly.';

export default {
  title: 'MDX/Callout',
  id: 'mdx-callout',
  component: Callout,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: Object.keys(tokenByType), children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'warning', children: 'MDX runtime components now come from @gaudi/design-system/mdx/runtime. Update the import before you upgrade.' },
  parameters: {
    docs: {
      description: { story: 'A migration guide: an info tip followed by a note driven by the controls. Switch `type` to see the warning and error tones next to the tip.' },
      source: playgroundSource('Callout', {
        imports: "import { Callout } from '@gaudi/design-system/mdx';",
        attributes: ["className='mb-0'"],
        before: `<div className='text-base leading-7'>\n<p className='mb-4 text-text'>Upgrading the blog to the latest Gaudi takes two changes.</p>\n<Callout type='info'>\n  ${tip}\n</Callout>\n\n`,
        after: '\n</div>'
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7'>
      <p className='mb-4 text-text'>Upgrading the blog to the latest Gaudi takes two changes.</p>
      <Callout type='info'>{tip}</Callout>
      <Callout {...args} className='mb-0' />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvas.getByText(args.children);
    await expect(body).toBeVisible();
    await expect(body.closest('[data-slot="alert"]')).toHaveAttribute('role', 'note');
    await expect(canvas.getAllByRole('note')).toHaveLength(2);
    // Static article notes must not interrupt readers with a live alert.
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  }
};
