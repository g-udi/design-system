import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import DataTable from './DataTable';

const componentDocs = getComponentDocs('Core/DataTable');

export default {
  component: DataTable,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-datatable',
  title: 'Core/DataTable'
};

export const Example = {
  render: () => (
    <div className='p-6'>
      <DataTable
        columns={ [
          { header: 'Component', key: 'component' },
          { header: 'Layer', key: 'layer' },
          { header: 'Status', key: 'status' }
        ] }
        rows={ [
          { component: 'Button', layer: 'Core', status: 'Ready' },
          { component: 'DataTable', layer: 'Core', status: 'Ready' }
        ] }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table');
    const scrollRegion = canvas.getByRole('region', { name: 'Scrollable data table' });
    const headers = canvas.getAllByRole('columnheader');
    const rows = canvas.getAllByRole('row');

    expect(table).toBeVisible();
    expect(scrollRegion).toHaveAttribute('tabindex', '0');
    expect(scrollRegion).toHaveAccessibleDescription('Scroll horizontally to see all columns.');
    expect(headers.map((header) => header.textContent)).toEqual([ 'Component', 'Layer', 'Status' ]);
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
    expect(rows).toHaveLength(3);
    expect(canvas.getByRole('cell', { name: 'Button' })).toBeVisible();
    expect(canvas.getAllByRole('cell', { name: 'Core' })).toHaveLength(2);
    expect(canvas.getAllByRole('cell', { name: 'Ready' })).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('ButtonCoreReady');
    expect(rows[2]).toHaveTextContent('DataTableCoreReady');
  }
};

export const WithCaptionAndCustomCells = {
  render: () => (
    <div className='p-6'>
      <DataTable
        caption='Core component status'
        columns={ [
          { header: 'Component', key: 'component' },
          { header: 'Owner', key: 'owner' },
          {
            header: 'Status',
            key: 'status',
            render: (row) => <span className='rounded-sm bg-green-50 px-2 py-1 text-xs font-semibold text-green-700'>{row.status}</span>
          }
        ] }
        rows={ [
          { component: 'Button', id: 'button', owner: 'Core', status: 'Ready' },
          { component: 'DataTable', id: 'data-table', owner: 'Core', status: 'Ready' }
        ] }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Core component status' });
    const scrollRegion = canvas.getByRole('region', { name: 'Core component status scrollable table' });
    const caption = canvas.getByText('Core component status');
    const statusBadges = canvas.getAllByText('Ready');

    expect(table).toBeVisible();
    expect(scrollRegion).toHaveAttribute('tabindex', '0');
    expect(caption.tagName).toBe('CAPTION');
    expect(statusBadges).toHaveLength(2);
    statusBadges.forEach((badge) => {
      expect(badge.tagName).toBe('SPAN');
      expect(badge).toHaveClass('rounded-sm', 'bg-green-50', 'font-semibold', 'text-green-700');
    });
    expect(canvas.getByRole('cell', { name: 'Button' })).toBeVisible();
    expect(canvas.getByRole('cell', { name: 'DataTable' })).toBeVisible();
  }
};

export const ContentManagement = {
  play: async ({canvasElement}) => {
    const canvas=within(canvasElement), body=within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button',{name:'Next'}));
    await expect(canvas.getByRole('table')).toHaveTextContent('Research methods');
    await userEvent.type(canvas.getByRole('searchbox'), 'Knowledge');
    await expect(canvas.getByRole('status')).toHaveTextContent('Page 1 / 1');
    await userEvent.clear(canvas.getByRole('searchbox'));
    await userEvent.click(canvas.getByRole('button',{name:'Words'}));
    await expect(canvas.getByRole('columnheader',{name:'Words'})).toHaveAttribute('aria-sort','descending');
    await userEvent.click(canvas.getByRole('checkbox',{name:'Select this page'}));
    await expect(canvas.getByText('2 selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('button',{name:'Columns'}));
    await userEvent.click(await body.findByRole('menuitemcheckbox',{name:'Status'}));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('columnheader',{name:'Status'})).not.toBeInTheDocument();
  },
  parameters: { docs: { description: { story: 'A client collection with search, typed sorting, page-scoped selection and column visibility. Supply stable row IDs; callbacks own bulk actions and persistence.' }, source: { code: "<DataTable caption='Article library' columns={columns} rows={articles} searchable sortable selectable columnVisibility pagination pageSize={5} />" } } },
  render: () => <div className='p-2 sm:p-4'><DataTable caption='Article library' columns={[{key:'title',header:'Title'},{key:'status',header:'Status'},{key:'words',header:'Words'}]} rows={[{id:'1',title:'Knowledge graphs',status:'Published',words:2480},{id:'2',title:'Local-first software',status:'Draft',words:940},{id:'3',title:'Design for real data',status:'In review',words:1860},{id:'4',title:'Research methods',status:'Published',words:3120}]} searchable sortable selectable columnVisibility pagination pageSize={2} /></div>
};
export const Loading = { render: () => <DataTable caption='Article library' columns={[{key:'title',header:'Title'}]} loading /> };
export const EmptyCollection = { render: () => <DataTable caption='Article library' columns={[{key:'title',header:'Title'}]} emptyTitle='No articles yet' emptyDescription='Start a draft to build your collection.' /> };
export const FailedRequest = { render: () => <DataTable caption='Article library' columns={[{key:'title',header:'Title'}]} error='Your connection was interrupted. Check your network and try again.' /> };
