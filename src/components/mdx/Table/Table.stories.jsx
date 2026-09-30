import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Table from './Table';

const docs = getComponentDocs('MDX/Table');

export default {
  title: 'MDX/Table',
  id: 'mdx-table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  render: () => (
    <Table>
      <thead><tr><th>Component</th><th>Status</th></tr></thead>
      <tbody><tr><td>Callout</td><td>Documented</td></tr><tr><td>Table</td><td>Accessible</td></tr></tbody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Scrollable table' })).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByRole('table')).toHaveClass('w-full', 'table-auto');
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
    for (const name of ['Component', 'Status']) await expect(canvas.getByRole('columnheader', { name })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Accessible' })).toBeVisible();
  }
};
