import { expect, userEvent, within } from 'storybook/test';
import { applicationDocs } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { ContentWorkspace } from '../../../../.storybook/fixtures/application/Workspace';
import AppShell from './AppShell';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/AppShell',
  component: AppShell,
  ...applicationDocs(
    'Responsive workspace with desktop navigation, a mobile navigation sheet, header, content landmark and skip link. Pass brand, navigation, header and footer as slots. It stays in document flow.',
    "<AppShell brand='Gaudi' navigation={navigation} header={<h1>Articles</h1>}><DataTable columns={columns} rows={articles} searchable sortable pagination /></AppShell>",
    'One main landmark, labelled navigation and a keyboard skip link. The mobile sheet traps focus and closes after following a link.'
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete editorial workspace using Gaudi primitives. Search, sort, select, create a draft, request a review, move board items, and edit preferences. All data is illustrative and local to this story.'
      }
    }
  }
};
export const ContentWorkspaceExample = {
  name: 'Content workspace',
  render: () => <ContentWorkspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Your writing, in one place.' })
    ).toBeVisible();
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Search table' }),
      'knowledge'
    );
    await expect(canvas.getByRole('table')).toHaveTextContent(
      'A practical guide to knowledge graphs'
    );
    await expect(
      canvas.queryByRole('cell', { name: 'Notes on local-first software' })
    ).not.toBeInTheDocument();
    await userEvent.clear(
      canvas.getByRole('searchbox', { name: 'Search table' })
    );
  }
};
export const Minimal = {
  parameters: {
    docs: {
      source: {
        code: "<AppShell brand='Notebook' navigation={<a href='#notes'>Notes</a>} header={<span>Notes</span>}><h1>Research notes</h1></AppShell>"
      }
    }
  },
  render: () => (
    <AppShell
      brand='Notebook'
      navigation={<a href='#notes'>Notes</a>}
      header={<span className='ds-label'>Notes</span>}
    >
      <h1 id='notes' className='ds-title'>
        Research notes
      </h1>
      <p className='ds-description'>A small workspace with room to grow.</p>
    </AppShell>
  )
};
