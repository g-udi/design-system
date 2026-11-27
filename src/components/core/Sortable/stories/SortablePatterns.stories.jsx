import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'sortable', import.meta.url,
  import.meta.glob('./fixtures/sortable/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Sortable', id: 'core-sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const RowControls = { name: 'List with row controls', ...pattern('row-controls', 'Drag a row or use its position picker to choose the cover. Each visibility switch operates independently.'), play: catalogueInteractions['sortable-row-controls'] };
export const MediaGrid = {
  name: 'Media grid',
  ...pattern('media-grid', 'A featured tile spans two cells. Each image has a visible drag handle and a position picker.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = () => [...canvasElement.querySelectorAll('[data-slot="sortable"] > [data-slot="sortable-item"]')];
    const before = items().map(item => item.dataset.value);
    const images = new Map(items().map(item => [item.dataset.value, item.querySelector('img').getAttribute('src')]));
    const handle = canvas.getByRole('button', { name: 'Drag product-shot.png' });
    handle.focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(items().map(item => item.dataset.value)).not.toEqual(before));
    for (const item of items()) await expect(item.querySelector('img')).toHaveAttribute('src', images.get(item.dataset.value));
    // Cancelling a keyboard drag must preserve the committed order.
    const committed = items().map(item => item.dataset.value);
    canvas.getByRole('button', { name: 'Drag hero-banner.jpg' }).focus();
    await userEvent.keyboard(' {ArrowRight}{Escape}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sortable"]')).toHaveAttribute('data-dragging', 'false'));
    await expect(items().map(item => item.dataset.value)).toEqual(committed);
  }
};
export const Nested = {
  name: 'Nested lists',
  ...pattern('nested', 'Groups and the values inside each group reorder independently.'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const parent = canvasElement.querySelector('[data-slot="sortable"]');
    const values = root => [...root.querySelectorAll(':scope > [data-slot="sortable-item"]')].map(item => item.dataset.value);
    const colors = parent.querySelector('[data-value="1"]');
    const child = colors.querySelector('[data-slot="sortable"]');
    within(child).getByRole('button', { name: 'Drag White' }).focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(values(child)).toEqual(['1-2', '1-1', '1-3', '1-4']));
    await expect(values(parent)).toEqual(['1', '2', '3']);
    within(colors).getByRole('button', { name: 'Drag group Colors' }).focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(values(parent)).toEqual(['2', '1', '3']));
    await expect(values(child)).toEqual(['1-2', '1-1', '1-3', '1-4']);
    for (const button of body.queryAllByRole('button', { name: /close toast/i })) await userEvent.click(button);
    // The drop overlay temporarily fades its source item; run axe after it settles.
    await waitFor(() => {
      for (const item of canvasElement.querySelectorAll('[data-slot="sortable-item"]')) {
        expect(getComputedStyle(item).opacity).toBe('1');
        expect(item).toHaveAttribute('data-dragging', 'false');
      }
    });
  }
};
export const Persisted = { name: 'Persisted order', ...pattern('persisted', 'Persist the new order with `onValueCommit`, update optimistically, and roll back with a toast on failure.'), play: async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  for (const fail of [false, true]) {
    if (fail) await userEvent.click(canvas.getByRole('switch', {name: 'Simulate a failed save'}));
    const before = [...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value);
    const failureSwitch = canvas.getByRole('switch', { name: 'Simulate a failed save' });
    canvas.getAllByRole('button', { name: /^Drag / })[0].focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sortable"]')).toHaveAttribute('data-dragging', 'true'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent(`droppable area ${before[1]}.`));
    // Observe the transient saving state as the drop happens, even on a busy browser.
    await Promise.all([
      waitFor(() => {
        expect(body.getByText('Saving order...')).toBeVisible();
        expect(failureSwitch).toBeDisabled();
      }),
      userEvent.keyboard(' ')
    ]);
    if (fail) {
      await expect(await body.findByText('Could not save the new order. Restored.')).toBeVisible();
      await waitFor(() => expect([...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value)).toEqual(before));
    } else {
      await expect(await body.findByText('Saved "Outline the essay" at position 2')).toBeVisible();
    }
    await userEvent.click(body.getByRole('button', {name: /close toast/i}));
    await waitFor(() => expect(body.queryByRole('button', {name: /close toast/i})).not.toBeInTheDocument());
  }
  await userEvent.click(canvas.getByRole('switch', {name: 'Simulate a failed save'}));
} };
