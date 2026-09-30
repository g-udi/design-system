import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import Tabs, { TabsContent, TabsList, TabsTrigger } from './Tabs';

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
const children = [
  `  <TabsList aria-label='${listLabel}'>`,
  ...panels.map(({ value, label, disabled }) => `    <TabsTrigger value='${value}'${disabled ? ' disabled' : ''}>${label}</TabsTrigger>`),
  '  </TabsList>',
  ...panels.filter((panel) => panel.summary).map(({ value, summary }) => `  <TabsContent value='${value}'>${summary}</TabsContent>`)
].join('\n');

function ArticleTabs(props) {
  return (
    <Tabs defaultValue='overview' {...props}>
      <TabsList aria-label={listLabel}>
        {panels.map(({ value, label, icon, count, disabled }) => (
          <TabsTrigger key={value} value={value} disabled={disabled} className='gap-1.5'>
            <RegistryIcon lucide={icon} className='size-4' />
            {label}
            {count ? <> <span className='rounded-full bg-surface-muted px-1.5 text-xs text-text-muted'>{count}</span></> : null}
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
  title: 'Core/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultValue: panels.filter((panel) => !panel.disabled).map((panel) => panel.value), orientation: ['horizontal', 'vertical'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultValue: 'overview', orientation: 'horizontal', onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'An article dashboard with icon triggers, counts, a locked Analytics tab, and panels holding stats, references and revisions. `defaultValue` picks the open panel and `orientation` moves the list to the side.' },
      source: playgroundSource('Tabs', {
        imports: "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system';",
        children
      })
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
