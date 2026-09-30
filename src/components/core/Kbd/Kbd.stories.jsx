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

// A shortcut sheet: the first command follows `keys`; every key shares `size` and `variant`.
const commands = [
  ['Search documentation', 'command,k'],
  ['Toggle sidebar', 'command,b'],
  ['Next result', 'down'],
  ['Open in new tab', 'command,enter'],
  ['Close panel', 'escape']
];

export const Playground = {
  args: { keys: 'command,shift,p', size: 'md', variant: 'raised' },
  parameters: {
    docs: {
      description: { story: 'A shortcut sheet mixing combinations, arrows, and named keys. The first command follows `keys`; `size` and `variant` restyle every key.' },
      source: playgroundSource('Kbd', { imports: "import { Kbd } from '@gaudi/design-system';" })
    }
  },
  render: ({ keys, ...args }) => (
    <ul className='m-0 w-full max-w-sm list-none divide-y divide-border rounded-lg border border-border p-0'>
      {[['Open command palette', keys], ...commands].map(([action, shortcut], index) => (
        <li key={action} className='flex items-center justify-between gap-3 px-3 py-2 text-sm'>
          <span className={index ? 'text-text-muted' : 'font-medium'}>{action}</span>
          <Kbd {...args} keys={shortcut} />
        </li>
      ))}
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const [featured] = within(canvasElement).getAllByRole('listitem');
    const keys = featured.querySelectorAll('kbd');
    const sizes = { xs: 'px-1', sm: 'px-1.5', md: 'px-2', lg: 'px-2.5' };
    const variants = { raised: 'bg-gradient-to-t', outline: 'bg-transparent', flat: 'bg-gray-50' };
    await expect(keys).toHaveLength(args.keys.split(',').length);
    await expect(within(featured).getByLabelText(/\S/)).toBeVisible();
    if (keys.length > 1) for (const key of keys) await expect(key).toHaveAttribute('aria-hidden', 'true');
    for (const key of canvasElement.querySelectorAll('kbd')) await expect(key).toHaveClass(sizes[args.size], variants[args.variant]);
    await expect(within(canvasElement).getByRole('img', { name: 'Command plus K' })).toBeVisible();
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
