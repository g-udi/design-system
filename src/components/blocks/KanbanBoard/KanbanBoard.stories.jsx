import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { EditorialBoard } from '../../../../.storybook/fixtures/application/Workspace';
import KanbanBoard from './KanbanBoard';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/KanbanBoard',
  component: KanbanBoard,
  ...applicationDocs(
    'A controlled board for editorial workflows. Supply columns, items, renderItem and onMove. Moves are explicit menu actions accessible by keyboard and touch; this version does not implement drag-and-drop.',
    '<KanbanBoard columns={columns} items={items} onMove={(id, columnId) => setItems(items.map(item => item.id === id ? {...item, columnId} : item))} />',
    'Columns are named sections. Each move button names its item and successful move requests are announced. Horizontal scrolling is contained inside the board.'
  )
};
export const EditorialWorkflow = {
  render: () => (
    <ExampleFrame wide>
      <EditorialBoard />
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move Notes on local-first software' })
    );
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'In review' })
    );
    await expect(
      within(canvas.getByRole('region', { name: 'In review' })).getByText(
        'Notes on local-first software'
      )
    ).toBeVisible();
  }
};
export const EmptyColumns = {
  render: () => (
    <ExampleFrame wide>
      <KanbanBoard
        columns={[
          { id: 'ideas', label: 'Ideas' },
          { id: 'review', label: 'In review' },
          { id: 'ready', label: 'Ready' }
        ]}
        items={[]}
      />
    </ExampleFrame>
  )
};
