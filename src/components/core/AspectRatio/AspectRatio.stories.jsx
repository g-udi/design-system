import { expect } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { AspectRatio } from './index.js';

const docs = getComponentDocs('Core/AspectRatio');
const image = "<img src='/static/images/og-card.jpg' alt='Gaudi design system cover' className='size-full object-cover' />";

export default {
  title: 'Core/AspectRatio',
  id: 'core-aspectratio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { ratio: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ratio: 16 / 9 },
  parameters: {
    docs: {
      source: playgroundSource('AspectRatio', {
        imports: "import { AspectRatio } from '@gaudi/design-system';",
        children: `  ${image}`
      })
    }
  },
  render: (args) => (
    <AspectRatio {...args} className='overflow-hidden rounded-xl border bg-ui-muted'>
      <img src='/static/images/og-card.jpg' alt='Gaudi design system cover' className='size-full object-cover' />
    </AspectRatio>
  ),
  play: async ({ args, canvasElement }) => {
    const { width, height } = canvasElement.querySelector('[data-slot="aspect-ratio"]').getBoundingClientRect();
    await expect(width / height).toBeCloseTo(args.ratio, 1);
  }
};
