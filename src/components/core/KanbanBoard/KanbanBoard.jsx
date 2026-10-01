'use client';

import { useState } from 'react';
import Button from '../Button';
import DropdownMenu, { DropdownMenuItem } from '../DropdownMenu';
import Icon from '../Icon';
import { KanbanColumnCount } from './parts/kanban-extended.jsx';

/** All moves have a keyboard and touch action. Hosts own ordering and persistence. */
export default function KanbanBoard({
  columns = [],
  items = [],
  renderItem,
  onMove,
  label = 'Board',
  moveLabel = 'Move',
  emptyLabel = 'No items',
  disabled = false
}) {
  const [announcement, setAnnouncement] = useState('');
  return (
    <div className='ds-board-wrap'>
      <div className='ds-board' role='region' aria-label={label} tabIndex={0}>
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.columnId === column.id);
          const targets = columns.filter((target) => target.id !== column.id);
          return (
            <section key={column.id} className='ds-board-column' aria-label={column.label}>
              <header>
                <h3 className='ds-label'>{column.label}</h3>
                {Number.isFinite(column.limit) ? (
                  <KanbanColumnCount count={columnItems.length} limit={column.limit} />
                ) : (
                  <span className='ds-description'>{columnItems.length}</span>
                )}
              </header>
              <ul>
                {columnItems.map((item) => (
                  <li key={item.id} className='ds-board-item'>
                    {renderItem ? renderItem(item) : <p className='ds-label'>{item.title}</p>}
                    {onMove && (
                      <DropdownMenu
                        trigger={
                          <Button size='xs' tone='neutral' variant='ghost' disabled={disabled} aria-label={`${moveLabel} ${item.title}`}>
                            <Icon name='MoreHorizontal' decorative size='xs' />
                          </Button>
                        }
                      >
                        {targets.map((target) => (
                          <DropdownMenuItem
                            key={target.id}
                            onSelect={() => {
                              onMove(item.id, target.id);
                              setAnnouncement(`${item.title}: ${target.label}`);
                            }}
                          >
                            {target.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenu>
                    )}
                  </li>
                ))}
              </ul>
              {!columnItems.length && <p className='ds-description'>{emptyLabel}</p>}
            </section>
          );
        })}
      </div>
      <span role='status' className='sr-only'>
        {announcement}
      </span>
    </div>
  );
}
