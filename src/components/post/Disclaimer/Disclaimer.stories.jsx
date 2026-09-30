import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Disclaimer from './index';

const docs = getComponentDocs('Post/Disclaimer');
const warningCopy = 'This post includes forward-looking implementation notes.';
const expectTone = async (copy, tone) => {
  const callout = copy.closest('aside');
  await expect(copy).toBeVisible();
  await expect(callout).toHaveClass(`border-${tone}-border`, `bg-${tone}-subtle`);
  await expect(callout.querySelector('div')).toHaveClass(`text-${tone}`);
};

export default {
  title: 'Post/Disclaimer',
  component: Disclaimer,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['info', 'warning', 'error'], children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'info' },
  parameters: {
    docs: { source: playgroundSource('Disclaimer', { imports: "import { Disclaimer } from '@gaudi/design-system';" }) }
  },
  render: (args) => <Disclaimer {...args} />,
  play: async ({ args, canvasElement }) => {
    const copy = within(canvasElement).getByText(/opinions and views expressed on this blog are solely my own/u);
    await expectTone(copy, args.type);
  }
};

export const Warning = {
  name: 'Custom copy and tone',
  parameters: { docs: { description: { story: 'Children replace the default copy, and `type` sets the callout tone.' } } },
  render: () => <Disclaimer type='warning'>{warningCopy}</Disclaimer>,
  play: async ({ canvasElement }) => {
    await expectTone(within(canvasElement).getByText(warningCopy), 'warning');
  }
};
