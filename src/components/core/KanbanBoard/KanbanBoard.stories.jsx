import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Avatar from '../Avatar';
import Icon from '../Icon';
import Pill from '../Pill';
import KanbanBoard from './KanbanBoard';

const docs = getComponentDocs('Core/Kanban');
const label = 'Editorial workflow';
const moveLabel = 'Move';
// "Scheduled" starts empty so the board shows `emptyLabel` beside busy columns.
const columns = ['Draft', 'In review', 'Scheduled', 'Published'].map((id) => ({ id, label: id }));
// Soft red misses AA contrast at xs, so High uses the solid treatment.
const priorities = { High: { tone: 'red', variant: 'solid' }, Medium: { tone: 'amber', variant: 'soft' }, Low: { tone: 'gray', variant: 'soft' } };
const initialItems = [
  { id: 'k1', title: 'Notes on local-first software', columnId: 'Draft', priority: 'High', category: 'Engineering', assignee: 'Alex Morgan', tone: 'teal', due: 'Due Fri' },
  { id: 'k2', title: 'Small tools, long lifetimes', columnId: 'Draft', priority: 'Low', category: 'Design', assignee: 'Sam Rivera', tone: 'amber', due: 'No date' },
  { id: 'k3', title: 'Designing interfaces that survive real data', columnId: 'In review', priority: 'Medium', category: 'Design', assignee: 'Sam Rivera', tone: 'amber', due: '2 comments' },
  { id: 'k4', title: 'Making technical writing easier to navigate', columnId: 'In review', priority: 'High', category: 'Research', assignee: 'Maya Chen', tone: 'indigo', due: 'Due today' },
  { id: 'k5', title: 'A practical guide to knowledge graphs', columnId: 'Published', priority: 'Medium', category: 'Engineering', assignee: 'Maya Chen', tone: 'indigo', due: '4.2k reads' }
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

function Board({ onMove, disabled, reviewLimit, ...args }) {
  const [items, setItems] = useState(initialItems);
  // A column may carry a work-in-progress limit; the count shows it and warns once it runs over.
  const boardColumns = columns.map((column) => (column.id === 'In review' && reviewLimit > 0 ? { ...column, limit: reviewLimit } : column));
  const move = (id, columnId) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, columnId } : item)));
    onMove(id, columnId);
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

export default {
  title: 'Core/Planning/Kanban', id: 'core-kanban',
  component: KanbanBoard,
  tags: ['autodocs'],
  argTypes: {
    ...docsArgTypes(docs, { emptyLabel: 'text', disabled: 'boolean' }),
    reviewLimit: { control: { type: 'number', min: 0, max: 5, step: 1 }, description: 'Work-in-progress limit on the In review column (`columns[i].limit`); 0 removes it.' }
  },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { emptyLabel: 'Nothing scheduled yet', disabled: false, reviewLimit: 2, onMove: fn() },
  parameters: {
    docs: {
      description: { story: 'An editorial board with cards at different priorities, categories, and assignees, plus an empty column. Move a card from its menu; `disabled` locks every move, and a column `limit` shows its work-in-progress count, warning once a move takes it over.' },
      source: playgroundSource('KanbanBoard', {
        imports: "import { KanbanBoard } from '@gaudi/design-system';",
        before: '// columns, items and renderItem come from the host; onMove updates items.\n',
        attributes: [`label='${label}'`, 'columns={columns}', 'items={items}', 'renderItem={renderItem}', 'onMove={(id, columnId) => moveItem(id, columnId)}']
      })
    }
  },
  render: (args) => <Board {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const item = initialItems.find((entry) => entry.columnId === 'Draft');
    await expect(within(canvas.getByRole('region', { name: 'Scheduled' })).getByText(args.emptyLabel)).toBeVisible();
    const trigger = canvas.getByRole('button', { name: `${moveLabel} ${item.title}` });
    if (args.disabled) {
      await expect(trigger).toBeDisabled();
      return;
    }
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('menuitem', { name: 'In review' }));
    await expect(args.onMove).toHaveBeenCalledWith(item.id, 'In review');
    await expect(within(canvas.getByRole('region', { name: 'In review' })).getByText(item.title)).toBeVisible();
    if (args.reviewLimit > 0 && args.reviewLimit < 3) {
      await expect(within(canvas.getByRole('region', { name: 'In review' })).getByText(`3 of ${args.reviewLimit} cards, over the limit`)).toBeInTheDocument();
    }
  }
};
