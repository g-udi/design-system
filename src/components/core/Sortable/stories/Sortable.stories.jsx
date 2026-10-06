import { PlaygroundDemo, byId, ids, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { Sortable } from '../index.js';

const docs = getComponentDocs('Core/Sortable');
// A publishing checklist: tasks with owners, due dates, and priorities; the launch step is pinned last.

const moveKeys = { vertical: '{ArrowDown}', horizontal: '{ArrowRight}', grid: '{ArrowRight}' };
const backKeys = { vertical: '{ArrowUp}', horizontal: '{ArrowLeft}', grid: '{ArrowLeft}' };
const order = (canvasElement) =>
  [...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value);
// Wait for the drop animation to restore every item before the accessibility scan.
const settled = (canvasElement) =>
  waitFor(() => {
    for (const item of canvasElement.querySelectorAll('[data-slot="sortable-item"]')) {
      expect(getComputedStyle(item).opacity).toBe('1');
    }
  });
const handleFor = (canvasElement, id) => within(canvasElement).getByRole('button', { name: `Reorder ${byId[id].title}` });

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Layout & Containers/Sortable',
  id: 'core-sortable',
  component: Sortable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { strategy: ['vertical', 'horizontal', 'grid'] }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onValueChange: fn(), onValueCommit: fn() },
  parameters: {
    docs: {
      description: { story: 'A publishing checklist with owners, due dates, and priorities. `strategy` switches between a list, a horizontal lane of cards, and a grid. The pinned launch step is `disabled`, so its handle dims and stays out of the drag interaction while the card text keeps full contrast. `SortableOverlay` lifts the dragged card with a shadow.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const pinned = handleFor(canvasElement, 'publish');
    await expect(pinned).toHaveAttribute('aria-disabled', 'true');
    // Only the disabled handle dims; the pinned card keeps full contrast.
    await expect(getComputedStyle(pinned).cursor).toBe('not-allowed');
    await expect(getComputedStyle(pinned.closest('[data-slot="sortable-item"]')).opacity).toBe('1');
    pinned.focus();
    await userEvent.keyboard(` ${backKeys[args.strategy]} `);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    handleFor(canvasElement, ids[0]).focus();
    await userEvent.keyboard(' ');
    // Sortable renders one drag overlay, filled by SortableOverlay: the card plus a single lifted copy.
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getAllByText(byId[ids[0]].title)).toHaveLength(2));
    await userEvent.keyboard(moveKeys[args.strategy]);
    // Caller styles must not replace the transform needed during a drag.
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sortable-item"]').style.transform).toContain('translate3d'));
    await expect(canvasElement.querySelector('[data-slot="sortable-item"]').style.borderTopWidth).toBe('2px');
    await userEvent.keyboard(' ');
    const moved = [ids[1], ids[0], ...ids.slice(2)];
    await waitFor(() => expect(order(canvasElement)).toEqual(moved));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(moved);
    await expect(args.onValueCommit).toHaveBeenCalledOnce();
    await settled(canvasElement);
    handleFor(canvasElement, ids[0]).blur();
  }
};
