import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Spinner from './Spinner';

const docs = getComponentDocs('Core/Spinner');
const sizes = ['xs', 'sm', 'md', 'lg'];
const statuses = (canvasElement, name) => within(canvasElement).getAllByRole('status', { name });

export default {
  title: 'Core/Spinner',
  id: 'core-spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { size: sizes, label: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { size: 'md', label: 'Loading articles' },
  parameters: {
    docs: {
      source: playgroundSource('Spinner', { imports: "import { Spinner } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <Spinner {...args} />,
  play: async ({ args, canvasElement }) => {
    const [spinner] = statuses(canvasElement, args.label);
    await expect(getComputedStyle(spinner).animationName).not.toBe('none');
    await expect(getComputedStyle(spinner).borderRightColor).toBe('rgba(0, 0, 0, 0)');
  }
};

export const Sizes = {
  parameters: { docs: { description: { story: '`size` steps from `xs` for inline text to `lg` for empty and page-level states.' } } },
  render: () => (
    <div className='flex items-center gap-4'>
      {sizes.map((size) => <Spinner key={size} size={size} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const widths = statuses(canvasElement, 'Loading').map((spinner) => spinner.getBoundingClientRect().width);
    await expect(widths).toHaveLength(sizes.length);
    await expect(widths).toEqual([...widths].sort((first, second) => first - second));
    await expect(new Set(widths).size).toBe(sizes.length);
  }
};
