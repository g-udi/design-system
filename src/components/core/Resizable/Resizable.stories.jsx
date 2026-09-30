import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Avatar from '../Avatar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './index.js';

const docs = getComponentDocs('Core/Resizable');
const groupClass = 'mx-auto min-h-48 w-full max-w-lg rounded-2xl border';
const Pane = ({ children }) => (
  <div className='flex h-full items-center justify-center p-6 text-sm font-semibold'>{children}</div>
);
const handle = (canvasElement) => within(canvasElement).getByRole('separator');
const size = (separator) => Number(separator.getAttribute('aria-valuenow'));
const flip = { horizontal: 'vertical', vertical: 'horizontal' };
// A mail client: folders beside a nested group that splits the message list from the reading pane.
const folders = [
  { name: 'Inbox', icon: 'InboxIcon', count: 12 },
  { name: 'Starred', icon: 'StarIcon' },
  { name: 'Sent', icon: 'SendIcon' },
  { name: 'Archive', icon: 'ArchiveIcon' }
];
const messages = [
  { from: 'Amira Haddad', subject: 'Design review notes', time: '09:42', unread: true },
  { from: 'Jonas Weber', subject: 'Release 2.10 is live', time: 'Tue' },
  { from: 'Lina Sato', subject: 'Token audit results', time: 'Mon' }
];
const [selected] = messages;

function MailClient({ orientation, withHandle }) {
  const stacked = orientation === 'vertical';
  return (
    <>
      <ResizablePanel defaultSize='30%' minSize='20%'>
        <nav aria-label='Folders' className={stacked ? '@container flex h-full flex-wrap content-start gap-1 overflow-hidden p-2 text-sm' : '@container grid h-full content-start gap-0.5 overflow-hidden p-2 text-sm'}>
          {folders.map(({ name, icon, count }, index) => (
            <span key={name} className={index === 0 ? 'flex min-w-0 items-center gap-2 rounded-md bg-ui-accent px-2 py-1.5 font-medium' : 'flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-ui-muted-foreground'}>
              <RegistryIcon lucide={icon} aria-hidden='true' className='size-4 shrink-0' />
              {/* Narrow panels keep only the icons; the label stays for assistive tech. */}
              <span className='sr-only truncate @[7.5rem]:not-sr-only'>{name}</span>
              {count ? <span className='ms-auto hidden text-xs tabular-nums @[7.5rem]:inline'>{count}</span> : null}
            </span>
          ))}
        </nav>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize='70%' minSize='40%'>
        <ResizablePanelGroup orientation={flip[orientation]}>
          <ResizablePanel defaultSize='50%' minSize='25%'>
            <ul aria-label='Messages' className='h-full divide-y divide-ui-border overflow-hidden text-sm'>
              {messages.map(({ from, subject, time, unread }) => (
                <li key={from} className={from === selected.from ? 'flex items-center gap-2 bg-ui-muted px-3 py-2' : 'flex items-center gap-2 px-3 py-2'}>
                  <Avatar name={from} size='xs' />
                  <span className='grid min-w-0 flex-1'>
                    <span className={unread ? 'truncate font-semibold' : 'truncate'}>{from}</span>
                    <span className='truncate text-xs text-ui-muted-foreground'>{subject}</span>
                  </span>
                  <span className='shrink-0 text-xs text-ui-muted-foreground'>{time}</span>
                </li>
              ))}
            </ul>
          </ResizablePanel>
          <ResizableHandle withHandle={withHandle} />
          <ResizablePanel defaultSize='50%' minSize='25%'>
            <article className='flex h-full flex-col gap-2 overflow-hidden p-4 text-sm'>
              <h3 className='shrink-0 text-base font-semibold'>{selected.subject}</h3>
              <span className='text-xs text-ui-muted-foreground'>{selected.from} · {selected.time}</span>
              <p className='text-ui-muted-foreground'>The spacing tokens look right. Two open questions on the accordion badges, and the rest is ready to ship.</p>
            </article>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </>
  );
}

export default {
  title: 'Core/Layout & Containers/Resizable',
  id: 'core-resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'], withHandle: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { orientation: 'horizontal', withHandle: true, onLayoutChanged: fn() },
  parameters: {
    docs: {
      description: { story: 'A mail client. `orientation` sets the outer split between folders and mail, and the nested group runs the other way. `withHandle` adds the grip to every handle.' },
      source: playgroundSource('ResizablePanelGroup', {
        imports: "import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gaudi/design-system';",
        children: [
          "  <ResizablePanel defaultSize='30%' minSize='20%'>Folders</ResizablePanel>",
          '  <ResizableHandle withHandle />',
          "  <ResizablePanel defaultSize='70%' minSize='40%'>",
          "    <ResizablePanelGroup orientation='vertical'>",
          "      <ResizablePanel defaultSize='50%' minSize='25%'>Messages</ResizablePanel>",
          '      <ResizableHandle withHandle />',
          "      <ResizablePanel defaultSize='50%' minSize='25%'>Reading pane</ResizablePanel>",
          '    </ResizablePanelGroup>',
          '  </ResizablePanel>'
        ].join('\n')
      })
    }
  },
  render: ({ withHandle, ...args }) => (
    <ResizablePanelGroup key={args.orientation} className='mx-auto min-h-80 w-full max-w-2xl overflow-hidden rounded-2xl border border-ui-border' {...args}>
      <MailClient orientation={args.orientation} withHandle={withHandle} />
    </ResizablePanelGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const [separator, ...nested] = within(canvasElement).getAllByRole('separator');
    await expect(separator).toHaveAttribute('aria-orientation', flip[args.orientation]);
    await expect(nested).toHaveLength(1);
    await expect(canvasElement.querySelectorAll('.ds-part-resizable-handle-icon')).toHaveLength(args.withHandle ? 2 : 0);
    await waitFor(() => expect(size(separator)).toBe(30));
    separator.focus();
    await userEvent.keyboard(args.orientation === 'vertical' ? '{ArrowDown}' : '{ArrowRight}');
    await waitFor(() => expect(size(separator)).toBeGreaterThan(30));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(size(separator)).toBe(20));
    await waitFor(() => expect(args.onLayoutChanged).toHaveBeenCalled());
    // Step back to the default split so the preview settles where it started.
    await userEvent.keyboard(args.orientation === 'vertical' ? '{ArrowDown}{ArrowDown}' : '{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(size(separator)).toBe(30));
    separator.blur();
  }
};

export const Collapsible = {
  parameters: {
    docs: { description: { story: '`collapsible` lets a panel close below its `minSize`. Enter on the focused handle collapses and restores it.' } }
  },
  render: () => (
    <ResizablePanelGroup orientation='horizontal' className={groupClass}>
      <ResizablePanel defaultSize='30%' minSize='20%' collapsible>
        <Pane>Filters</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize='70%'>
        <Pane>Results</Pane>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvasElement }) => {
    const separator = handle(canvasElement);
    separator.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(size(separator)).toBe(0));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(size(separator)).toBe(30));
  }
};
