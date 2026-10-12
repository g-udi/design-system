import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { Board, initialItems, moveLabel } from './fixtures/EditorialBoardExample.jsx';
import boardSource from './fixtures/EditorialBoardExample.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import KanbanBoard from '../KanbanBoard';

const docs = getComponentDocs('Core/Kanban');
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
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('Board', args, { before: `${publicSource(boardSource, new URL('./fixtures/EditorialBoardExample.jsx', import.meta.url))}\n\n` }) }
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
