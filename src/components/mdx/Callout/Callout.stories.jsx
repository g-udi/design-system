import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Callout from './Callout';

const docs = getComponentDocs('MDX/Callout');
const tokenByType = { info: 'info', warning: 'warning', error: 'danger' };
// A migration guide: a settled tip introduces the note driven by the controls.
// The error tone is left to the control: its text is 4.41:1 on the subtle danger surface, below the 4.5:1 the a11y test enforces.
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
        before: `<Callout type='info'>\n  ${tip}\n</Callout>\n\n`
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7'>
      <p className='mb-4 text-gray-700 dark:text-gray-300'>Upgrading the blog to the latest Gaudi takes two changes.</p>
      <Callout type='info'>{tip}</Callout>
      <Callout {...args} className='mb-0' />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const token = tokenByType[args.type];
    const body = canvas.getByText(args.children);
    await expect(body).toHaveClass(`text-${token}`);
    await expect(body.closest('aside')).toHaveClass(`border-${token}-border`, `bg-${token}-subtle`);
    // The neighbouring tip keeps its own tone whatever the control is set to.
    await expect(canvas.getByText(tip).closest('aside')).toHaveClass('bg-info-subtle');
  }
};
