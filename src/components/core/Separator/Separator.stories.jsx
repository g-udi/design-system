import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { Separator } from './index.js';

const docs = getComponentDocs('Core/Separator');
const layouts = {
  horizontal: 'mx-auto grid w-full max-w-xs gap-3 text-sm',
  vertical: 'flex h-5 items-center justify-center gap-4 text-sm'
};

export default {
  title: 'Core/Separator',
  id: 'core-separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'], decorative: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { orientation: 'horizontal', decorative: true },
  parameters: {
    docs: { source: playgroundSource('Separator', { imports: "import { Separator } from '@gaudi/design-system';" }) }
  },
  render: (args) => (
    <div className={layouts[args.orientation]}>
      <span>Articles</span>
      <Separator {...args} />
      <span>Projects</span>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const rule = canvasElement.querySelector('[data-slot="separator"]');
    await expect(rule).toHaveAttribute('data-orientation', args.orientation);
    if (args.decorative) {
      await expect(canvas.queryByRole('separator')).not.toBeInTheDocument();
    } else {
      await expect(canvas.getByRole('separator')).toBe(rule);
    }
  }
};
