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
      <div className='max-h-72 overflow-auto rounded border border-border'>
        <table className='w-full text-sm'>
          <caption className='sr-only'>Contrast ratios for every theme contract pair</caption>
          <thead className='sticky top-0 bg-surface-muted text-start text-text-muted'>
            <tr>
              <th scope='col' className='px-3 py-1.5 text-start font-medium'>Mode</th>
              <th scope='col' className='px-3 py-1.5 text-start font-medium'>Pair</th>
              <th scope='col' className='px-3 py-1.5 text-end font-medium'>Ratio</th>
              <th scope='col' className='px-3 py-1.5 text-start font-medium'>Result</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((result) => (
              <tr key={ `${result.mode}-${result.fg}-${result.bg}` } className='border-t border-border-muted'>
                <td className='px-3 py-1 text-text-muted'>{result.mode}</td>
                <td className='px-3 py-1 font-mono text-xs text-text'>{result.fg} on {result.bg}</td>
                <td className='px-3 py-1 text-end font-mono text-xs text-text'>{result.ratio.toFixed(2)}:1</td>
                <td className='px-3 py-1'>{result.pass ? <span className='text-success'>Pass</span> : <span className='font-medium text-danger'>Fail (min {result.min}:1)</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
