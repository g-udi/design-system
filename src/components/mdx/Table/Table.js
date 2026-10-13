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

import { useRef } from 'react';

import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';
import { cn } from '../../../utilities/cn';

import styles from './Table.module.css';
import { Table as TableRoot, TableHead as HeaderCell, TableCell as Cell, TableHeader as TableHead, TableBody, TableRow } from './TablePrimitives.jsx';

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
const Table = ({ children, className, density = 'normal', ...rest }) => {
  const tableRef = useRef(null);

  // Highlight the hovered cell's column across every row.
  const handleCellHover = (event) => {
    const table = tableRef.current;
    const cell = event.target.closest?.('td, th');

    if (!table || !cell || !table.contains(cell)) return;

    const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);

    table.querySelectorAll('tr').forEach((row) => row.children[cellIndex]?.classList.toggle(styles.columnHover, event.type === 'mouseover'));
  };

  useEventListener('mouseover', handleCellHover, tableRef);
  useEventListener('mouseout', handleCellHover, tableRef);

  return (
    <TableRoot
      ref={ tableRef }
      density={ density }
      className={ cn('table-auto', className) }
      { ...rest }
      containerProps={{
        className: cn('not-prose', styles.root, styles.scroll, styles.frame)
      }}
    >
      {children}
    </TableRoot>
  );
};

const TableCell = ({ children, className, ...rest }) => (
  <Cell className={ cn('align-top whitespace-normal text-text', className) } { ...rest }>
    <div className='overflow-hidden'>{children}</div>
  </Cell>
);

export default Table;

export { TableBody, TableCell, TableHead, HeaderCell as TableHeaderCell, TableRow };
