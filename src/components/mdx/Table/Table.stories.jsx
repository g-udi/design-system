import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Table, { TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';

const docs = getComponentDocs('MDX/Table');
// Field data from a performance post: text, numbers with units, and a status per row.
const columns = ['Template', 'LCP', 'INP', 'CLS', 'Status'];
const rows = [
  ['Home', '1.4 s', '96 ms', '0.02', 'Good'],
  ['Article', '2.1 s', '140 ms', '0.04', 'Good'],
  ['Tag archive', '2.9 s', '220 ms', '0.11', 'Needs work'],
  ['Search', '3.8 s', '410 ms', '0.19', 'Poor']
];
const statusClass = { Good: 'text-success', 'Needs work': 'text-warning', Poor: 'text-danger' };

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
  parameters: { docs: { description: { story: 'Core Web Vitals per page template from a performance post: a caption, the row and cell parts, numeric metrics, and a status that uses words as well as colour. On narrow screens the table scrolls inside its frame.' } } },
  render: () => (
    <Table>
      <caption className='caption-bottom px-3 py-2 text-left text-xs text-text-muted'>75th-percentile field data, last 28 days.</caption>
      <TableHead><TableRow>{columns.map((column) => <TableHeaderCell key={column} scope='col'>{column}</TableHeaderCell>)}</TableRow></TableHead>
      <TableBody>
        {rows.map(([template, ...metrics]) => (
          <TableRow key={template}>
            <TableCell className='font-medium'>{template}</TableCell>
            {metrics.slice(0, 3).map((metric, index) => <TableCell key={columns[index + 1]} className='whitespace-nowrap tabular-nums'>{metric}</TableCell>)}
            <TableCell className='whitespace-nowrap font-medium'><span className={statusClass[metrics[3]]}>{metrics[3]}</span></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Scrollable table' })).toHaveAttribute('tabindex', '0');
    const table = canvas.getByRole('table', { name: /75th-percentile field data/ });
    await expect(table).toHaveClass('w-full', 'table-auto');
    await expect(canvas.getAllByRole('row')).toHaveLength(rows.length + 1);
    for (const name of columns) await expect(canvas.getByRole('columnheader', { name })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Search' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Needs work' })).toBeVisible();
  }
};
