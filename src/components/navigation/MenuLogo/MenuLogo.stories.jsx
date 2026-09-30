import { expect } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import MenuLogo from './MenuLogo';

const docs = getComponentDocs('Navigation/MenuLogo');

export default {
  title: 'Navigation/MenuLogo',
  id: 'navigation-menulogo',
  component: MenuLogo,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { className: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

// Where the mark ships: a header lockup, a favicon tile, an accent tile, and an inverted badge. The featured mark follows `className`.
const placements = [
  { label: 'Favicon', tile: 'bg-gray-100 dark:bg-gray-900', className: 'h-6 w-6' },
  { label: 'Accent', tile: 'bg-blue-600', className: 'h-8 w-8 text-white dark:text-white' },
  { label: 'Inverted', tile: 'bg-gray-950 dark:bg-white', className: 'h-8 w-8 text-white dark:text-gray-950' }
];

export const Playground = {
  args: { className: 'h-14 w-14 text-blue-600 dark:text-blue-400' },
  parameters: {
    docs: {
      description: { story: 'The mark in a header lockup, a favicon tile, an accent tile, and an inverted badge. `className` restyles the featured lockup mark: it inherits `currentColor`, so text colour and size classes change it directly.' },
      source: playgroundSource('MenuLogo', { imports: "import { MenuLogo } from '@gaudi/design-system';" })
    }
  },
  render: (args) => (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <figure className='flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800' data-testid='featured'>
        <MenuLogo {...args} />
        <figcaption>
          <span className='block text-base font-semibold text-gray-950 dark:text-white'>Ahmad Assaf</span>
          <span className='block text-xs text-gray-500 dark:text-gray-400'>Header lockup</span>
        </figcaption>
      </figure>
      {placements.map((placement) => (
        <figure key={placement.label} className='flex flex-col items-center gap-1.5'>
          <span className={`flex size-14 items-center justify-center rounded-xl ${placement.tile}`}>
            <MenuLogo className={placement.className} />
          </span>
          <figcaption className='text-xs text-gray-500 dark:text-gray-400'>{placement.label}</figcaption>
        </figure>
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const marks = canvasElement.querySelectorAll('svg');
    await expect(marks).toHaveLength(placements.length + 1);
    const svg = canvasElement.querySelector('[data-testid="featured"] svg');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg.querySelector('g')).toHaveAttribute('fill', 'currentColor');
    for (const name of args.className.split(' ').filter(Boolean)) await expect(svg).toHaveClass(name);
  }
};
