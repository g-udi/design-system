import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'resizable', import.meta.url,
  import.meta.glob('./fixtures/resizable/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Resizable', id: 'core-resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const EditorWorkspace = {
  name: 'Editor workspace', ...pattern('editor-workspace', 'Three columns with a nested vertical split. `onLayoutChange` reports each panel size by `id` while dragging; string sizes are percentages.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [outer, inner, right] = canvas.getAllByRole('separator');
    const size = handle => Number(handle.getAttribute('aria-valuenow'));
    await waitFor(() => expect(size(outer)).toBe(25));
    await expect(inner).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(right).toHaveAttribute('aria-orientation', 'vertical');
    outer.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(size(outer)).toBe(30));
    await expect(canvas.getByText('Files').parentElement).toHaveTextContent('30%');
    await expect(canvas.getByText('Editor').parentElement).toHaveTextContent('70%');
    inner.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(size(inner)).toBe(75));
    await expect(canvas.getByText('Editor').parentElement).toHaveTextContent('75%');
    await expect(canvas.getByText('Terminal').parentElement).toHaveTextContent('25%');
    await expect(size(outer)).toBe(30);
    await userEvent.keyboard('{ArrowUp}');
    outer.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(size(outer)).toBe(25));
    await expect(size(inner)).toBe(70);
  }
};
export const Handles = {
  name: 'Handle styles', ...pattern('handles', 'The default line, the `withHandle` grip, and pill handles styled with `className` that grow on hover, tint while dragging and rotate with each handle orientation.'),
  play: async ({ canvasElement }) => {
    for (const handle of within(canvasElement).getAllByRole('separator')) {
      const initial = Number(handle.getAttribute('aria-valuenow'));
      const vertical = handle.getAttribute('aria-orientation') === 'vertical';
      handle.focus();
      await userEvent.keyboard(vertical ? '{ArrowRight}' : '{ArrowDown}');
      await waitFor(() => expect(Number(handle.getAttribute('aria-valuenow'))).toBeGreaterThan(initial));
      await userEvent.keyboard(vertical ? '{ArrowLeft}' : '{ArrowUp}');
      await waitFor(() => expect(Number(handle.getAttribute('aria-valuenow'))).toBe(initial));
    }
  }
};
