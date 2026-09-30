import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Callout from './Callout';

const docs = getComponentDocs('MDX/Callout');
const tokenByType = { info: 'info', warning: 'warning', error: 'danger' };

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
  args: { type: 'info', children: 'Use callouts for important editorial context, warnings, and implementation notes.' },
  parameters: { docs: { source: playgroundSource('Callout', { imports: "import { Callout } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Callout {...args} />,
  play: async ({ args, canvasElement }) => {
    const token = tokenByType[args.type];
    const body = within(canvasElement).getByText(args.children);
    await expect(body).toHaveClass(`text-${token}`);
    await expect(body.closest('aside')).toHaveClass(`border-${token}-border`, `bg-${token}-subtle`);
  }
};
