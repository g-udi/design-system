'use client';

import { useState } from 'react';
import Button from '../../core/Button';
import DropdownMenu, { DropdownMenuItem } from '../../core/DropdownMenu';
import Icon from '../../core/Icon';

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
        {columns.map((column) => (
          <section
            key={column.id}
            className='ds-board-column'
            aria-label={column.label}
          >
            <header>
              <h3 className='ds-label'>{column.label}</h3>
              <span className='ds-description'>
                {items.filter((item) => item.columnId === column.id).length}
              </span>
            </header>
            <ul>
              {items
                .filter((item) => item.columnId === column.id)
                .map((item) => (
                  <li key={item.id} className='ds-board-item'>
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <p className='ds-label'>{item.title}</p>
                    )}
                    {onMove && (
                      <DropdownMenu
                        trigger={
                          <Button
                            size='xs'
                            tone='neutral'
                            variant='ghost'
                            disabled={disabled}
                            aria-label={`${moveLabel} ${item.title}`}
                          >
                            <Icon name='MoreHorizontal' decorative size='xs' />
                          </Button>
                        }
                      >
                        {columns
                          .filter((target) => target.id !== column.id)
                          .map((target) => (
                            <DropdownMenuItem
                              key={target.id}
                              onSelect={() => {
                                onMove(item.id, target.id);
                                setAnnouncement(
                                  `${item.title}: ${target.label}`
                                );
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
            {!items.some((item) => item.columnId === column.id) && (
              <p className='ds-description'>{emptyLabel}</p>
            )}
          </section>
        ))}
      </div>
      <span role='status' className='sr-only'>
        {announcement}
      </span>
    </div>
  );
}
