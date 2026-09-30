import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Badge } from '../Pill/index.js';
import { ScrollArea } from './index.js';

const docs = getComponentDocs('Core/ScrollArea');
// A changelog feed: a sticky header over releases that mix features, fixes, and breaking changes.
const kinds = {
  Feature: { icon: 'SparklesIcon', variant: 'primary-light' },
  Fix: { icon: 'WrenchIcon', variant: 'success-light' },
  Breaking: { icon: 'TriangleAlertIcon', variant: 'destructive-light' }
};
const notes = [
  ['Feature', 'Scrollspy follows nested scroll areas'],
  ['Fix', 'Tree keeps focus after collapsing a folder'],
  ['Feature', 'Attachment gains an upload queue'],
  ['Breaking', 'Rating drops the legacy value prop'],
  ['Fix', 'Resizable handles respect RTL'],
  ['Feature', 'Sortable supports pinned items'],
  ['Fix', 'Accordion badges wrap on narrow screens'],
  ['Feature', 'Separator documents semantic rules'],
  ['Breaking', 'Tokens rename surface-2 to surface-muted'],
  ['Fix', 'Scroll area thumbs meet contrast']
];
const releases = notes.map(([kind, title], index) => ({
  version: `v2.${notes.length - index}.0`,
  date: `${String(28 - index * 2).padStart(2, '0')} Sep`,
  kind,
  title
}));

export default {
  title: 'Core/ScrollArea',
  id: 'core-scrollarea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: ['hover', 'auto', 'always', 'scroll'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { type: 'always', 'aria-label': 'Changelog', className: 'mx-auto h-72 w-full max-w-sm rounded-2xl border border-ui-border' },
  parameters: {
    docs: {
      description: { story: 'A changelog feed with a sticky header. `always` keeps the scrollbar visible, `auto` shows it while content overflows, and `hover` and `scroll` reveal it on pointer or scroll activity.' },
      source: playgroundSource('ScrollArea', {
        imports: "import { Badge, ScrollArea } from '@gaudi/design-system';",
        children: [
          "  <header className='sticky top-0 border-b border-ui-border bg-ui-background px-4 py-3'>Changelog</header>",
          "  <ol className='divide-y'>",
          '    {releases.map((release) => (',
          "      <li key={release.version} className='grid gap-1 px-4 py-3'>",
          '        <span>{release.version} · {release.date}</span>',
          '        <Badge variant={release.variant}>{release.kind}</Badge>',
          '        <p>{release.title}</p>',
          '      </li>',
          '    ))}',
          '  </ol>'
        ].join('\n')
      })
    }
  },
  render: (args) => (
    <ScrollArea {...args}>
      <header className='sticky top-0 z-10 flex items-center justify-between border-b border-ui-border bg-ui-background px-4 py-3'>
        <span className='text-sm font-semibold'>Changelog</span>
        <span className='text-xs text-ui-muted-foreground'>{releases.length} releases</span>
      </header>
      <ol className='divide-y divide-ui-border text-sm'>
        {releases.map(({ version, date, kind, title }) => (
          <li key={version} className='flex gap-3 px-4 py-3'>
            <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-ui-muted text-ui-muted-foreground'>
              <RegistryIcon lucide={kinds[kind].icon} aria-hidden='true' className='size-3.5' />
            </span>
            <div className='grid min-w-0 flex-1 gap-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium tabular-nums'>{version}</span>
                <Badge variant={kinds[kind].variant} size='sm'>{kind}</Badge>
                <span className='ms-auto text-xs text-ui-muted-foreground'>{date}</span>
              </div>
              <p className='text-ui-muted-foreground'>{title}</p>
            </div>
          </li>
        ))}
      </ol>
    </ScrollArea>
  ),
  play: async ({ args, canvasElement }) => {
    const viewport = within(canvasElement).getByRole('region', { name: args['aria-label'] });
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    const scrollbar = canvasElement.querySelector('[data-slot="scroll-area-scrollbar"]');
    if (args.type === 'always') await expect(scrollbar).toBeVisible();
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    viewport.scrollTo({ top: viewport.scrollHeight });
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
    await expect(within(viewport).getByText('Changelog')).toBeVisible();
    // Leave the preview at the newest release.
    viewport.scrollTo({ top: 0 });
    viewport.blur();
  }
};
