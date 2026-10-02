import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ContentWorkspace } from '../../../../.storybook/fixtures/application/Workspace';
import Avatar from '../../core/Avatar';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Input from '../../core/Input';
import Pill from '../../core/Pill';
import StatGroup from '../StatGroup';
import AppShell from './AppShell';
import { AppShellFrame } from './parts/frame.jsx';

const docs = getComponentDocs('Blocks/App Shell');
const views = [
  { id: 'Overview', icon: 'LayoutDashboard', title: 'Good morning, Maya', description: 'Three drafts need attention before Friday.' },
  { id: 'Articles', icon: 'FileText', count: 24, title: 'Articles', description: 'Everything you have published, newest first.' },
  { id: 'Drafts', icon: 'SquarePen', count: 6, title: 'Drafts', description: 'Work in progress, including two pieces in review.' },
  { id: 'Settings', icon: 'Settings', title: 'Settings', description: 'Profile, reading preferences, and publishing defaults.' }
];
const stats = [
  { id: 'readers', label: 'Monthly readers', value: '48.2k', detail: '▲ 12.4% vs August', tone: 'success' },
  { id: 'bounce', label: 'Bounce rate', value: '38.6%', detail: '▲ 4.1 pts vs August', tone: 'danger' },
  { id: 'drafts', label: 'Open drafts', value: '6', detail: '2 awaiting review' }
];

// A working shell: brand, counted navigation with an active page, a header with search and profile, and a rail footer.
function WorkspaceShell({ layout = 'sidebar', showAside = false, showStatusBar = false }) {
  const [active, setActive] = useState('Overview');
  const view = views.find((entry) => entry.id === active);
  return (
    <AppShell
      layout={layout}
      aside={showAside ? (
        <div className='grid gap-2 text-sm'>
          <p className='ds-label'>Publishing checklist</p>
          <p className='ds-description'>Cover image, summary and two tags before Friday.</p>
        </div>
      ) : undefined}
      asideLabel='Publishing checklist'
      statusBar={showStatusBar ? <><span>All changes saved</span><span className='ms-auto'>3 readers online</span></> : undefined}
      brand={
        <span className='example-brand'>
          <Icon name='BookOpen' decorative size='sm' />
          Notebook
        </span>
      }
      navigation={
        <div className='example-navigation'>
          {views.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id.toLowerCase()}`}
              aria-current={entry.id === active ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                setActive(entry.id);
              }}
            >
              <Icon name={entry.icon} decorative size='sm' />
              <span className='flex-1'>{entry.id}</span>
              {entry.count ? <Pill size='xs' variant='soft' tone='gray'>{entry.count}</Pill> : null}
            </a>
          ))}
        </div>
      }
      header={
        <>
          <span className='ds-label'>{active}</span>
          <span className='example-header-spacer' />
          <Input type='search' aria-label='Search workspace' placeholder='Search…' className='hidden w-48 sm:block' />
          <Avatar name='Maya Chen' size='sm' tone='indigo' indicator={{ label: 'Online', tone: 'success' }} />
        </>
      }
      footer={
        <div className='flex items-center gap-2'>
          <Avatar name='Maya Chen' size='sm' tone='indigo' />
          <div className='min-w-0'>
            <p className='ds-label truncate'>Maya Chen</p>
            <p className='ds-description truncate'>Pro plan</p>
          </div>
        </div>
      }
    >
      <div className='ds-stack'>
        <div className='example-page-heading'>
          <div>
            <h1>{view.title}</h1>
            <p className='ds-description'>{view.description}</p>
          </div>
          <Button size='sm'>
            <Icon name='Plus' decorative size='xs' />
            New article
          </Button>
        </div>
        <StatGroup label='September performance' items={stats} />
      </div>
    </AppShell>
  );
}

export default {
  title: 'Blocks/App Shell', id: 'blocks-application-appshell',
  component: AppShell,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'inline-radio', options: ['sidebar', 'topbar'], description: 'A navigation rail, or brand and navigation in the header.' },
    showAside: { control: 'boolean', name: 'aside', description: 'Show a complementary detail rail beside the content.' },
    showStatusBar: { control: 'boolean', name: 'statusBar', description: 'Show a status strip under the content.' }
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { layout: 'sidebar', showAside: false, showStatusBar: false },
  parameters: {
    docs: {
      description: { story: 'A writing workspace in the shell, presented as an app window with `AppShellFrame`: brand, navigation with counts and an active page, a header with search and profile, a rail footer, and a dashboard in the content area that scrolls inside the frame. Pick a page to move the active state; below the laptop breakpoint the rail collapses into a menu sheet that opens inside the frame.' },
      source: playgroundSource('AppShell', {
        imports: "import { AppShell, AppShellFrame, Avatar, Input, StatGroup } from '@gaudi/design-system';",
        before: '<AppShellFrame>\n',
        after: '\n</AppShellFrame>',
        attributes: [
          "brand='Notebook'",
          'navigation={<WorkspaceNavigation active={active} onSelect={setActive} />}',
          "header={<><span className='ds-label'>{active}</span><Input type='search' aria-label='Search workspace' /><Avatar name='Maya Chen' size='sm' /></>}",
          "footer={<Avatar name='Maya Chen' size='sm' />}"
        ],
        children: "  <h1>Good morning, Maya</h1>\n  <StatGroup label='September performance' items={stats} />"
      })
    }
  },
  render: (args) => (
    <AppShellFrame>
      <WorkspaceShell {...args} />
    </AppShellFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole('main');
    const [navigation] = canvas.getAllByRole('navigation', { name: 'Workspace navigation' });
    await expect(canvas.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', `#${main.id}`);
    await expect(within(navigation).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(within(navigation).getByRole('link', { name: /Drafts/ }));
    await expect(within(navigation).getByRole('link', { name: /Drafts/ })).toHaveAttribute('aria-current', 'page');
    await expect(within(main).getByRole('heading', { level: 1, name: 'Drafts' })).toBeVisible();
    await userEvent.click(within(navigation).getByRole('link', { name: 'Overview' }));
    await expect(within(main).getByRole('heading', { level: 1, name: 'Good morning, Maya' })).toBeVisible();
  }
};

export const ContentWorkspaceExample = {
  name: 'Content workspace',
  parameters: { docs: { description: { story: 'A complete editorial workspace composed inside the framed shell: search, sort, select, draft, review, board moves, and preferences all run on local data.' } } },
  render: () => (
    <AppShellFrame height='50rem'>
      <ContentWorkspace />
    </AppShellFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search table' });
    await expect(canvas.getByRole('heading', { name: 'Your writing, in one place.' })).toBeVisible();
    await userEvent.type(search, 'knowledge');
    await expect(canvas.getByRole('table')).toHaveTextContent('A practical guide to knowledge graphs');
    await expect(canvas.queryByRole('cell', { name: 'Notes on local-first software' })).not.toBeInTheDocument();
    await userEvent.clear(search);
  }
};
