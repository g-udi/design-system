import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ContentWorkspace } from '../../../../.storybook/fixtures/application/Workspace';
import AppShell from './AppShell';

const docs = getComponentDocs('Blocks/Application/AppShell');

export default {
  title: 'Blocks/Application/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { navigationLabel: 'text', menuLabel: 'text', skipLabel: 'text' }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { navigationLabel: 'Workspace navigation', menuLabel: 'Open navigation', skipLabel: 'Skip to content' },
  parameters: {
    docs: {
      source: playgroundSource('AppShell', {
        imports: "import { AppShell } from '@gaudi/design-system';",
        children: '  <h1>Research notes</h1>'
      })
    }
  },
  render: (args) => (
    <AppShell brand='Notebook' navigation={<a href='#notes'>Notes</a>} header={<span className='ds-label'>Notes</span>} {...args}>
      <h1 className='ds-title'>Research notes</h1>
      <p className='ds-description'>A small workspace with room to grow.</p>
    </AppShell>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole('main');
    await expect(canvas.getAllByRole('navigation', { name: args.navigationLabel }).length).toBeGreaterThan(0);
    await expect(canvas.getByRole('link', { name: args.skipLabel })).toHaveAttribute('href', `#${main.id}`);
    await expect(main).toHaveTextContent('Research notes');
  }
};

export const ContentWorkspaceExample = {
  name: 'Content workspace',
  parameters: { docs: { description: { story: 'A complete editorial workspace composed inside the shell: search, sort, select, draft, review, board moves, and preferences all run on local data.' } } },
  render: () => <ContentWorkspace />,
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
