import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Kbd from './Kbd';

const docs = getComponentDocs('Core/Kbd');
const sizes = ['xs', 'sm', 'md', 'lg'];
const variants = ['raised', 'outline', 'flat'];
const shortcut = 'command,k';
const shortcuts = (canvasElement) => within(canvasElement).getAllByRole('img', { name: 'Command plus K' });

export default {
  title: 'Core/Kbd',
  id: 'core-kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { keys: 'text', size: sizes, variant: variants }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <div className='flex flex-wrap items-center gap-3'><Story /></div>]
};

export const Playground = {
  args: { keys: 'command,shift,k', size: 'md', variant: 'raised' },
  parameters: { docs: { source: playgroundSource('Kbd', { imports: "import { Kbd } from '@gaudi/design-system';" }) } },
  render: (args) => <Kbd {...args} />,
  play: async ({ args, canvasElement }) => {
    const keys = canvasElement.querySelectorAll('kbd');
    await expect(keys).toHaveLength(args.keys.split(',').length);
    await expect(within(canvasElement).getByLabelText(/\S/)).toBeVisible();
    if (keys.length > 1) for (const key of keys) await expect(key).toHaveAttribute('aria-hidden', 'true');
  }
};

export const KeySet = {
  parameters: { docs: { description: { story: 'Named keys render as compact symbols with a spoken label. Plain `children` render one literal key with no label.' } } },
  render: () => (
    <>
      <Kbd>K</Kbd>
      {['escape', 'enter', 'shift,tab', 'option'].map((keys) => <Kbd key={keys} keys={keys} />)}
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('K').tagName).toBe('KBD');
    await expect(canvas.getByText('K')).not.toHaveAttribute('aria-label');
    await expect(canvas.getByLabelText('Escape')).toHaveTextContent('esc');
    await expect(canvas.getByLabelText('Enter')).toHaveTextContent('↵');
    await expect(canvas.getByRole('img', { name: 'Shift plus Tab' })).toBeVisible();
    await expect(canvas.getByLabelText('Option')).toHaveTextContent('⌥');
  }
};

export const Variants = {
  parameters: { docs: { description: { story: '`raised` keeps the keycap shadow; `outline` and `flat` sit quieter in dense UI.' } } },
  render: () => variants.map((variant) => <Kbd key={variant} keys={shortcut} variant={variant} />),
  play: async ({ canvasElement }) => {
    const [raised, outline, flat] = shortcuts(canvasElement).map((item) => within(item).getByText('⌘'));
    await expect(raised).toHaveClass('bg-gradient-to-t');
    await expect(outline).toHaveClass('bg-transparent', 'shadow-none');
    await expect(flat).toHaveClass('bg-gray-50', 'shadow-none');
  }
};

export const Sizes = {
  parameters: { docs: { description: { story: 'Match the key size to the surrounding text or control.' } } },
  render: () => sizes.map((size) => <Kbd key={size} keys={shortcut} size={size} />),
  play: async ({ canvasElement }) => {
    const keys = shortcuts(canvasElement).map((item) => within(item).getByText('K'));
    await expect(keys.map((key) => key.className.match(/\bpx-[\d.]+/)[0])).toEqual(['px-1', 'px-1.5', 'px-2', 'px-2.5']);
  }
};
