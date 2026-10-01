import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { previewSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import { Badge } from '../Pill/index.js';
import Tabs, { TabsContent, TabsList, TabsTrigger, tabsVariants } from './Tabs';

const docs = getComponentDocs('Core/Tabs');
const listLabel = 'Article details';
// An article dashboard: icon triggers with counts, a locked tab, and panels with real content.
const panels = [
  { value: 'overview', label: 'Overview', icon: 'LayoutDashboard', summary: 'A practical guide to knowledge graphs.' },
  { value: 'references', label: 'References', icon: 'BookOpen', count: 3, summary: 'Three references support this article.' },
  { value: 'history', label: 'History', icon: 'History', count: 2, summary: 'The latest revision was saved yesterday.' },
  { value: 'analytics', label: 'Analytics', icon: 'Lock', disabled: true }
];
const stats = [['Views', '12.4k'], ['Read time', '6 min'], ['Reactions', '318']];
const references = [
  { title: 'Knowledge graphs in practice', source: 'acm.org', icon: 'FileText' },
  { title: 'Linked data design issues', source: 'w3.org', icon: 'Globe' },
  { title: 'Graph databases, 2nd edition', source: 'oreilly.com', icon: 'Book' }
];
const revisions = [
  { who: 'Sam Rivera', what: 'Tightened the introduction', when: 'Yesterday' },
  { who: 'Lee Chen', what: 'Added the schema diagram', when: '3 days ago' }
];
const tab = (canvas, index) => canvas.getByRole('tab', { name: new RegExp(`^${panels[index].label}`) });
const bodies = {
  overview: (
    <div className='grid grid-cols-3 gap-2'>
      {stats.map(([name, value]) => (
        <div key={name} className='rounded-md border border-border px-3 py-2'>
          <p className='text-xs text-text-muted'>{name}</p>
          <p className='text-lg font-semibold'>{value}</p>
        </div>
      ))}
    </div>
  ),
  references: (
    <ul className='grid gap-2'>
      {references.map(({ title, source, icon }) => (
        <li key={title} className='flex items-center gap-2 text-sm'>
          <RegistryIcon lucide={icon} className='size-4 shrink-0 text-text-muted' />
          <span className='min-w-0 flex-1 truncate font-medium'>{title}</span>
          <span className='text-xs text-text-muted'>{source}</span>
        </li>
      ))}
    </ul>
  ),
  history: (
    <ul className='grid gap-3'>
      {revisions.map(({ who, what, when }) => (
        <li key={what} className='flex items-center gap-2 text-sm'>
          <Avatar name={who} size='xs' />
          <span className='min-w-0 flex-1'><span className='font-medium'>{who}</span> <span className='text-text-muted'>{what}</span></span>
          <span className='shrink-0 text-xs text-text-muted'>{when}</span>
        </li>
      ))}
    </ul>
  )
};
const children = (variant, tone) => [
  `  <TabsList aria-label='${listLabel}'${variant && variant !== 'underline' ? ` variant='${variant}'` : ''}${tone && tone !== 'neutral' ? ` tone='${tone}'` : ''}>`,
  ...panels.map(({ value, label, disabled }) => `    <TabsTrigger value='${value}'${disabled ? ' disabled' : ''}>${label}</TabsTrigger>`),
  '  </TabsList>',
  ...panels.filter((panel) => panel.summary).map(({ value, summary }) => `  <TabsContent value='${value}'>${summary}</TabsContent>`)
].join('\n');

function ArticleTabs({ variant, tone, ...props }) {
  return (
    <Tabs defaultValue='overview' {...props}>
      <TabsList aria-label={listLabel} variant={variant} tone={tone}>
        {panels.map(({ value, label, icon, count, disabled }) => (
          <TabsTrigger key={value} value={value} disabled={disabled} className='gap-1.5'>
            <RegistryIcon lucide={icon} className='size-4' />
            {label}
            {count ? <Badge variant='secondary' size='sm'>{count}</Badge> : null}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.filter((panel) => panel.summary).map(({ value, summary }) => (
        <TabsContent key={value} value={value} className='grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] content-start gap-3'>
          <p className='text-sm text-text-muted'>{summary}</p>
          {bodies[value]}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default {
  title: 'Core/Tabs', id: 'core-tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultValue: panels.filter((panel) => !panel.disabled).map((panel) => panel.value), orientation: ['horizontal', 'vertical'], variant: ['underline', 'outline', 'type'], tone: ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'discovery', 'attention'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultValue: 'overview', orientation: 'horizontal', variant: 'underline', tone: 'neutral', onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'An article dashboard with icon triggers, counts, a locked Analytics tab, and panels holding stats, references and revisions. `defaultValue` picks the open panel, `orientation` moves the list to the side, and `variant` (on `TabsList`) chooses how the active tab is marked: a short underline, a fine outline, or weight alone; `tone` colours that underline or outline.' },
      // `variant` belongs to TabsList, so it prints there rather than on the root.
      source: {
        type: 'dynamic',
        language: 'jsx',
        transform: (_code, { args: { variant, tone, ...args } }) => previewSource('Tabs', args, {
          imports: "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system';",
          children: children(variant, tone)
        })
      }
    }
  },
  render: (args) => <ArticleTabs key={`${args.orientation}-${args.defaultValue}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const start = panels.findIndex((panel) => panel.value === args.defaultValue);
    const nextIndex = (start + 1) % 3;
    const next = args.orientation === 'vertical' ? '{ArrowDown}' : '{ArrowRight}';
    await expect(tab(canvas, start)).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[start].summary);
    await userEvent.click(tab(canvas, start));
    await userEvent.keyboard(next);
    await expect(tab(canvas, nextIndex)).toHaveFocus();
    await expect(tab(canvas, nextIndex)).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(panels[nextIndex].value);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[nextIndex].summary);
    await expect(tab(canvas, 3)).toBeDisabled();
  }
};

export const ManualActivation = {
  parameters: { docs: { description: { story: '`activationMode="manual"` moves focus with the arrow keys and waits for Enter or Space to switch panels.' } } },
  render: () => <ArticleTabs activationMode='manual' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(tab(canvas, 0));
    await userEvent.keyboard('{ArrowRight}');
    await expect(tab(canvas, 1)).toHaveFocus();
    await expect(tab(canvas, 0)).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard(' ');
    await expect(tab(canvas, 1)).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(panels[1].summary);
  }
};

const sections = [
  ['articles', 'Articles', 'FileText', '42 published, 3 drafts'],
  ['series', 'Series', 'BookOpen', '4 series in progress'],
  ['tags', 'Tags', 'Tag', '28 tags, 6 unused'],
  ['media', 'Media', 'Image', '312 images and diagrams'],
  ['sources', 'Sources', 'Database', '87 cited references']
];
const variantNotes = {
  underline: 'A short bar under the active label. Familiar, clear and light; the default.',
  outline: 'A fine border gives the selected tab a clear boundary.',
  type: 'Selection lives in text weight and icon contrast. The quietest option.'
};

export const Variants = {
  parameters: { docs: { description: { story: 'The three ways to mark the active tab, on the same transparent triggers with no rule under the list.' } } },
  render: () => (
    <div className='grid gap-6'>
      {tabsVariants.map((variant) => (
        <div key={variant} className='grid min-w-0 gap-2'>
          <div>
            <p className='text-sm font-medium text-text'>{variant[0].toUpperCase() + variant.slice(1)}</p>
            <p className='text-xs text-text-muted'>{variantNotes[variant]}</p>
          </div>
          <Tabs defaultValue='articles'>
            <TabsList variant={variant} aria-label={`${variant} sections`}>
              {sections.map(([value, label, icon]) => (
                <TabsTrigger key={value} value={value}>
                  <RegistryIcon lucide={icon} aria-hidden='true' />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map(([value, , , summary]) => (
              <TabsContent key={value} value={value} className='text-xs text-text-muted'>{summary}</TabsContent>
            ))}
          </Tabs>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of tabsVariants) {
      const list = canvas.getByRole('tablist', { name: `${variant} sections` });
      await expect(list).toHaveAttribute('data-variant', variant);
      await userEvent.click(within(list).getByRole('tab', { name: 'Tags' }));
      await expect(within(list).getByRole('tab', { name: 'Tags' })).toHaveAttribute('aria-selected', 'true');
    }
  }
};
