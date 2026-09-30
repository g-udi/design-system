import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { articles } from '../../../../.storybook/fixtures/application/data';
import KanbanBoard from './KanbanBoard';

const docs = getComponentDocs('Blocks/Application/KanbanBoard');
const columns = ['Draft', 'In review', 'Published'].map((id) => ({ id, label: id }));
const initialItems = articles.slice(0, 5).map((article) => ({ ...article, columnId: article.status }));
const renderItem = (item) => (
  <div className='ds-stack'>
    <p className='ds-label'>{item.title}</p>
    <span className='ds-description'>{item.author}</span>
  </div>
);

function Board({ onMove, ...args }) {
  const [items, setItems] = useState(initialItems);
  const move = (id, columnId) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, columnId } : item)));
    onMove(id, columnId);
  };
  return <KanbanBoard columns={columns} items={items} renderItem={renderItem} onMove={move} {...args} />;
}

export default {
  title: 'Blocks/Application/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', moveLabel: 'text', emptyLabel: 'text', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Editorial workflow', moveLabel: 'Move', emptyLabel: 'No items', disabled: false, onMove: fn() },
  parameters: {
    docs: {
      source: playgroundSource('KanbanBoard', {
        imports: "import { KanbanBoard } from '@gaudi/design-system';",
        before: '// columns, items, renderItem and onMove come from the host.\n'
      })
    }
  },
  render: (args) => <Board {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const item = initialItems.find((entry) => entry.columnId === 'Draft');
    await userEvent.click(canvas.getByRole('button', { name: `${args.moveLabel} ${item.title}` }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'In review' }));
    await expect(args.onMove).toHaveBeenCalledWith(item.id, 'In review');
    await expect(within(canvas.getByRole('region', { name: 'In review' })).getByText(item.title)).toBeVisible();
  }
};

export const EmptyColumns = {
  parameters: { docs: { description: { story: 'Columns without items show `emptyLabel` so the board keeps its structure before work arrives.' } } },
  render: () => <KanbanBoard columns={columns} items={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText('No items')).toHaveLength(columns.length);
  }
};
