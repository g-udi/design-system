import {
  TableRoot, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow,
  TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption
} from '@gaudi/design-system/mdx/Table';
import Pill from '../../../components/core/Pill';

/** WCAG AA pairs for both modes: failures first, then the passing pairs. */
export function ContrastReport({ report }) {
  const ordered = [ ...report.failures, ...report.results.filter((result) => result.pass) ];
  return (
    <section aria-labelledby='theme-contrast-heading' className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <h3 id='theme-contrast-heading' className='text-base font-semibold text-text'>Contrast report</h3>
        <Pill size='sm' tone={ report.pass ? 'green' : 'red' }>{report.pass ? 'All pass' : `${report.failures.length} failing`}</Pill>
        <span className='text-sm text-text-muted'>{report.checked - report.failures.length}/{report.checked} WCAG AA pairs (4.5:1 text, 3:1 focus and charts)</span>
      </div>
      <TableRoot
        density='compact'
        containerProps={{ className: 'max-h-72 overflow-auto rounded border border-border', 'aria-label': 'Contrast ratios' }}
      >
        <TableCaption className='sr-only'>Contrast ratios for every theme contract pair</TableCaption>
        <TableHeader className='sticky top-0 bg-surface-muted text-start text-text-muted'>
          <TableRow>
            <TableHead scope='col' className='text-start'>Mode</TableHead>
            <TableHead scope='col' className='text-start'>Pair</TableHead>
            <TableHead scope='col' className='text-end'>Ratio</TableHead>
            <TableHead scope='col' className='text-start'>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordered.map((result) => (
            <TableRow key={ `${result.mode}-${result.fg}-${result.bg}` } className='border-t border-border-muted'>
              <TableCell className='text-text-muted'>{result.mode}</TableCell>
              <TableCell className='font-mono text-xs text-text'>{result.fg} on {result.bg}</TableCell>
              <TableCell className='text-end font-mono text-xs text-text'>{result.ratio.toFixed(2)}:1</TableCell>
              <TableCell>{result.pass ? <span className='text-success'>Pass</span> : <span className='font-medium text-danger'>Fail (min {result.min}:1)</span>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </section>
  );
}
