import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'scroll-area', import.meta.url,
  import.meta.glob('./fixtures/scroll-area/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/scroll-area/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/ScrollArea', id: 'core-scrollarea', tags: ['autodocs'], ...catalogueMeta('scroll-area') };

export const HorizontalGallery = { name: 'Horizontal gallery', ...pattern('horizontal-gallery', 'A horizontal `ScrollBar` for a strip wider than the frame. Masks fade the edges that still have content, and gutter padding appears only on an axis that overflows.') };
export const WideTable = {
  name: 'Wide table',
  ...pattern('wide-table', 'A table that overflows both axes keeps its scrollbars inside the frame.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByRole('region', { name: 'Scrollable content' });
    const table = canvas.getByRole('table', { name: 'Plan comparison' });
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(8);
    await expect(within(table).getAllByRole('rowheader')).toHaveLength(8);
    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await expect(getComputedStyle(table.parentElement).overflowX).toBe('visible');
    try {
      await userEvent.tab();
      await expect(viewport).toHaveFocus();
      viewport.scrollTo({ left: viewport.scrollWidth, top: viewport.scrollHeight, behavior: 'instant' });
      await waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0));
      await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
    } finally {
      viewport.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      viewport.blur();
    }
  }
};
