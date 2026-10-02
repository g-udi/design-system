import { useState } from 'react';
import KanbanBoard from '../../../src/components/core/KanbanBoard';
import Pill from '../../../src/components/core/Pill';
import { articles } from './data';
import './examples.css';

export const articleColumns = [
  {
    key: 'title',
    header: 'Article',
    render: (row) => <span className='font-medium'>{row.title}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Pill
        tone={
          row.status === 'Published'
            ? 'success'
            : row.status === 'In review'
              ? 'info'
              : 'neutral'
        }
        variant='soft'
      >
        {row.status}
      </Pill>
    )
  },
  { key: 'category', header: 'Category' },
  {
    key: 'words',
    header: 'Words',
    render: (row) => (
      <span className='ds-table-number'>
        {new Intl.NumberFormat('en-GB').format(row.words)}
      </span>
    )
  },
  { key: 'updated', header: 'Updated', sortable: false }
];

export function EditorialBoard() {
  const [items, setItems] = useState(
    articles
      .slice(0, 5)
      .map((article) => ({ ...article, columnId: article.status }))
  );
  return (
    <KanbanBoard
      label='Editorial workflow'
      columns={['Draft', 'In review', 'Published'].map((id) => ({
        id,
        label: id
      }))}
      items={items}
      onMove={(id, columnId) =>
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, columnId } : item))
        )
      }
      renderItem={(item) => (
        <div className='ds-stack'>
          <p className='ds-label'>{item.title}</p>
          <span className='ds-description'>{item.author}</span>
        </div>
      )}
    />
  );
}
