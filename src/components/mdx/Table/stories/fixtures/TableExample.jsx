import Table, { TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@gaudi/design-system/mdx/Table';

// Field data from a performance post: text, numbers with units, and a status per row.
export const columns = ['Template', 'LCP', 'INP', 'CLS', 'Status'];
export const rows = [
  ['Home', '1.4 s', '96 ms', '0.02', 'Good'],
  ['Article', '2.1 s', '140 ms', '0.04', 'Good'],
  ['Tag archive', '2.9 s', '220 ms', '0.11', 'Needs work'],
  ['Search', '3.8 s', '410 ms', '0.19', 'Poor']
];
const statusClass = { Good: 'text-success', 'Needs work': 'text-warning', Poor: 'text-danger' };

export function TableExample() {
  return (
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
  );
}
