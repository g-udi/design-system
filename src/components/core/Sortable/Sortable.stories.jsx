import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Sortable, SortableItem, SortableItemHandle } from './index.js';

const docs = getComponentDocs('Core/Sortable');
const steps = ['Research', 'Outline', 'Draft', 'Review', 'Edit', 'Publish'];
const layouts = { vertical: 'grid gap-2', horizontal: 'flex gap-2', grid: 'grid grid-cols-3 gap-2' };
const moveKeys = { vertical: '{ArrowDown}', horizontal: '{ArrowRight}', grid: '{ArrowRight}' };
const order = (canvasElement) =>
  [...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value);
// Wait for the drop animation to restore every item before the accessibility scan.
const settled = (canvasElement) =>
  waitFor(() => {
    for (const item of canvasElement.querySelectorAll('[data-slot="sortable-item"]')) {
      expect(getComputedStyle(item).opacity).toBe('1');
    }
  });
const handles = (canvasElement) => within(canvasElement).getAllByRole('button', { name: 'Reorder item' });

function SortableExample({ onValueChange, pinned, ...args }) {
  const [items, setItems] = useState(steps);
  const update = (next) => {
    setItems(next);
    onValueChange(next);
  };
  return (
    <Sortable value={items} onValueChange={update} getItemValue={(item) => item} className={layouts[args.strategy]} {...args}>
      {items.map((item) => (
        <SortableItem
          key={item}
          value={item}
          disabled={item === pinned}
          // The built-in disabled opacity fails contrast, so the pinned label carries the state.
          className='flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-ui-background p-2 text-sm data-disabled:opacity-100'
        >
          <SortableItemHandle className='text-ui-muted-foreground'>
            <RegistryIcon lucide='GripVerticalIcon' className='size-4' />
          </SortableItemHandle>
          <span className='truncate'>{item}</span>
          {item === pinned && <span className='ms-auto text-xs text-ui-muted-foreground'>Pinned</span>}
        </SortableItem>
      ))}
    </Sortable>
  );
}

export default {
  title: 'Core/Sortable',
  id: 'core-sortable',
  component: Sortable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { strategy: ['vertical', 'horizontal', 'grid'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { strategy: 'vertical', onValueChange: fn(), onValueCommit: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Sortable', {
        imports: "import { useState } from 'react';\nimport { Sortable, SortableItem, SortableItemHandle } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
        before: 'const [items, setItems] = useState(steps);\n\n',
        attributes: ['value={items}', 'onValueChange={setItems}', 'getItemValue={(item) => item}'],
        children: "  {items.map((item) => (\n    <SortableItem key={item} value={item}>\n      <SortableItemHandle>\n        <RegistryIcon lucide='GripVerticalIcon' />\n      </SortableItemHandle>\n      {item}\n    </SortableItem>\n  ))}"
      })
    }
  },
  render: (args) => <SortableExample key={args.strategy} {...args} />,
  play: async ({ args, canvasElement }) => {
    handles(canvasElement)[0].focus();
    await userEvent.keyboard(` ${moveKeys[args.strategy]} `);
    const moved = [steps[1], steps[0], ...steps.slice(2)];
    await waitFor(() => expect(order(canvasElement)).toEqual(moved));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(moved);
    await expect(args.onValueCommit).toHaveBeenCalledOnce();
    await settled(canvasElement);
  }
};

export const PinnedItem = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'A `disabled` item keeps its handle out of the drag interaction and stays in place.' } } },
  render: (args) => <SortableExample strategy='vertical' pinned={steps[0]} {...args} />,
  play: async ({ args, canvasElement }) => {
    const [pinned, next] = handles(canvasElement);
    await expect(pinned).toHaveAttribute('aria-disabled', 'true');
    pinned.focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await expect(args.onValueChange).not.toHaveBeenCalled();
    next.focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith([steps[0], steps[2], steps[1], ...steps.slice(3)]));
    await settled(canvasElement);
  }
};
