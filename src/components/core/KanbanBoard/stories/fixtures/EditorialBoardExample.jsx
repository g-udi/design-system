import { useState } from 'react';
import Avatar from '@gaudi/design-system/core/Avatar';
import Icon from '@gaudi/design-system/core/Icon';
import Pill from '@gaudi/design-system/core/Pill';
import KanbanBoard from '@gaudi/design-system/core/KanbanBoard';

const label = 'Editorial workflow';
export const moveLabel = 'Move';
// "Scheduled" starts empty so the board shows `emptyLabel` beside busy columns.
const columns = ['Draft', 'In review', 'Scheduled', 'Published'].map((id) => ({ id, label: id }));
// Soft red misses AA contrast at xs, so High uses the solid treatment.
const priorities = { High: { tone: 'red', variant: 'solid' }, Medium: { tone: 'amber', variant: 'soft' }, Low: { tone: 'gray', variant: 'soft' } };
export const initialItems = [
  { id: 'k1', title: 'Notes on local-first software', columnId: 'Draft', priority: 'High', category: 'Engineering', assignee: 'Anouk Brennan', tone: 'teal', due: 'Due Fri' },
  { id: 'k2', title: 'Small tools, long lifetimes', columnId: 'Draft', priority: 'Low', category: 'Design', assignee: 'Sam Rivera', tone: 'amber', due: 'No date' },
  { id: 'k3', title: 'Designing interfaces that survive real data', columnId: 'In review', priority: 'Medium', category: 'Design', assignee: 'Sam Rivera', tone: 'amber', due: '2 comments' },
  { id: 'k4', title: 'Making technical writing easier to navigate', columnId: 'In review', priority: 'High', category: 'Research', assignee: 'Mei Castellanos', tone: 'indigo', due: 'Due today' },
  { id: 'k5', title: 'A practical guide to knowledge graphs', columnId: 'Published', priority: 'Medium', category: 'Engineering', assignee: 'Mei Castellanos', tone: 'indigo', due: '4.2k reads' }
];
const renderItem = (item) => (
  <div className='grid min-w-0 gap-1.5'>
    <div className='flex flex-wrap gap-1'>
      <Pill size='xs' {...priorities[item.priority]}>{item.priority}</Pill>
      <Pill size='xs' variant='outline' tone='gray'>{item.category}</Pill>
    </div>
    <p className='ds-label'>{item.title}</p>
    <div className='flex items-center gap-2'>
      <Avatar name={item.assignee} size='2xs' tone={item.tone} />
      <span className='ds-description text-xs'>{item.assignee} · {item.due}</span>
    </div>
  </div>
);

export function Board({ onMove, disabled, reviewLimit, ...args }) {
  const [items, setItems] = useState(initialItems);
  // A column may carry a work-in-progress limit; the count shows it and warns once it runs over.
  const boardColumns = columns.map((column) => (column.id === 'In review' && reviewLimit > 0 ? { ...column, limit: reviewLimit } : column));
  const move = (id, columnId) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, columnId } : item)));
    onMove?.(id, columnId);
  };
  return (
    <div className='grid gap-3'>
      {disabled ? (
        <Pill size='sm' variant='soft' tone='gray' icon={<Icon name='Lock' decorative size='xs' />} className='justify-self-start'>
          Read-only: moves are locked
        </Pill>
      ) : null}
      <KanbanBoard label={label} moveLabel={moveLabel} columns={boardColumns} items={items} renderItem={renderItem} onMove={move} disabled={disabled} {...args} />
    </div>
  );
}
