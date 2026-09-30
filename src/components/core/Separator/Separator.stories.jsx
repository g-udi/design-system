import { Fragment } from 'react';
import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Separator } from './index.js';

const docs = getComponentDocs('Core/Separator');
// A project card: a semantic rule splits the header from the stats, whose decorative rules follow `orientation`.
const stats = [
  { icon: 'LayersIcon', label: 'Components', value: '64' },
  { icon: 'LayoutTemplateIcon', label: 'Patterns', value: '180' },
  { icon: 'PaletteIcon', label: 'Tokens', value: '420' }
];
const layouts = {
  horizontal: 'grid gap-3',
  vertical: 'flex items-stretch justify-between gap-4'
};
const statRules = (canvasElement) => canvasElement.querySelectorAll('[data-slot="separator"][data-stat]');

export default {
  title: 'Core/Separator',
  id: 'core-separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { orientation: 'vertical' },
  parameters: {
    docs: {
      description: { story: 'A project card. The rule under the header is semantic (`decorative={false}`); the rules between stats are decorative and follow `orientation`, stacking the stats as rows or laying them out as columns.' },
      source: playgroundSource('Separator', {
        imports: "import { Fragment } from 'react';\nimport { Separator } from '@gaudi/design-system';",
        before: "<h3>Gaudi Design System</h3>\n<Separator decorative={false} />\n<div className='flex gap-4'>\n  {stats.map((stat, index) => (\n    <Fragment key={stat.label}>\n      {index > 0 && (\n",
        after: "\n      )}\n      <span>{stat.value} {stat.label}</span>\n    </Fragment>\n  ))}\n</div>"
      })
    }
  },
  render: ({ orientation }) => (
    <div className='mx-auto grid w-full max-w-sm gap-4 text-sm'>
      <div className='grid gap-1'>
        <h3 className='text-base font-semibold'>Gaudi Design System</h3>
        <p className='text-ui-muted-foreground'>Tokens, components, and patterns behind the blog.</p>
      </div>
      <Separator decorative={false} />
      <div className={layouts[orientation]}>
        {stats.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && <Separator orientation={orientation} data-stat='' />}
            <div className={orientation === 'vertical' ? 'grid flex-1 justify-items-center gap-1 text-center' : 'flex items-center gap-2'}>
              <RegistryIcon lucide={stat.icon} aria-hidden='true' className='size-4 text-ui-muted-foreground' />
              <span className='text-ui-muted-foreground'>{stat.label}</span>
              <span className={orientation === 'vertical' ? 'text-lg font-semibold tabular-nums' : 'ms-auto font-semibold tabular-nums'}>{stat.value}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const rules = [...statRules(canvasElement)];
    await expect(rules).toHaveLength(stats.length - 1);
    for (const rule of rules) {
      await expect(rule).toHaveAttribute('data-orientation', args.orientation);
    }
    const semantic = canvas.getByRole('separator');
    await expect(semantic).toHaveAttribute('data-orientation', 'horizontal');
    await expect(semantic).not.toHaveAttribute('data-stat');
  }
};
