'use client';

/**
 * Table Component for MDX
 *
 * @description A responsive article table component that stays within the reading column.
 * Features horizontal scrolling for wide data, subtle framing, and proper styling for both
 * light and dark themes.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useRef } from 'react';

import { cn } from '../../../utilities/cn';

import styles from './Table.module.css';

/**
 * Enhanced table component for article content
 *
 * @description Creates a responsive table that belongs to the article flow. Wide tables
 * scroll inside their frame instead of escaping the post layout.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Table content (thead, tbody, etc.)
 * @param {string} [props.className] - Additional CSS classes
 * @param {...Object} props.rest - Additional props passed to the table element
 *
 * @returns {JSX.Element} Enhanced responsive table component
 *
 * @example
 * <Table>
 *   <thead>
 *     <tr>
 *       <th>Column 1</th>
 *       <th>Column 2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Data 1</td>
 *       <td>Data 2</td>
 *     </tr>
 *   </tbody>
 * </Table>
 */
const Table = ({ children, className, ...rest }) => {
  const tableRef = useRef(null);

  // Highlight the hovered cell's column across every row.
  useEffect(() => {
    const table = tableRef.current;

    if (!table) return undefined;

    const handleCellHover = (event) => {
      const cell = event.target.closest?.('td, th');

      if (!cell || !table.contains(cell)) return;

      const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);

      table.querySelectorAll('tr').forEach((row) => row.children[cellIndex]?.classList.toggle(styles.columnHover, event.type === 'mouseover'));
    };

    table.addEventListener('mouseover', handleCellHover);
    table.addEventListener('mouseout', handleCellHover);

    return () => {
      table.removeEventListener('mouseover', handleCellHover);
      table.removeEventListener('mouseout', handleCellHover);
    };
  }, []);

  return (
    <div className={ cn('not-prose', styles.root) }>
      <div className={ styles.breakout }>
        <div
          className={ cn(styles.scroll, styles.frame) }
          role='region'
          tabIndex={ 0 }
          aria-label='Scrollable table'
        >
          <div className='inline-block min-w-full align-middle'>
            <table ref={ tableRef } className={ cn('w-full table-auto', className) } { ...rest }>
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header, row-hover and column-hover colours come from Table.module.css tokens, so the parts only set type.
const TableHead = ({ className, ...rest }) => <thead className={ className } { ...rest } />;

const TableBody = ({ className, ...rest }) => <tbody className={ className } { ...rest } />;

const TableRow = ({ className, ...rest }) => <tr className={ cn('transition-colors duration-150', className) } { ...rest } />;

const TableHeaderCell = ({ className, ...rest }) => (
  <th className={ cn(styles.cellPadding, 'text-left text-xs font-semibold uppercase text-text', className) } { ...rest } />
);

const TableCell = ({ children, className, ...rest }) => (
  <td className={ cn(styles.cellPadding, 'align-top text-sm text-text', className) } { ...rest }>
    <div className='overflow-hidden'>{children}</div>
  </td>
);

export default Table;

export { TableBody, TableCell, TableHead, TableHeaderCell, TableRow };
