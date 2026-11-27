import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'pagination', import.meta.url,
  import.meta.glob('./fixtures/pagination/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/pagination/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Pagination', id: 'core-pagination', tags: ['autodocs'], ...catalogueMeta('pagination') };

export const Numbered = { name: 'Numbered page styles', ...pattern('numbered', 'Text and icon arrows, circle, hover-border, joined and filled pages, each with an ellipsis before the last page.'),
  play: async ({ canvasElement }) => {
    const list = within(within(canvasElement).getByRole('navigation', { name: 'Default pagination' }));
    await userEvent.click(list.getByRole('button', { name: 'Go to next page' }));
    await expect(list.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(list.getByRole('button', { name: '10' }));
    await expect(list.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  }
 };
export const PreviousNext = { name: 'Previous and next with page info', ...pattern('previous-next', 'Compact pagers for small screens: page info centred or leading, or arrows alone.'),
  play: async ({ canvasElement }) => {
    const pager = within(within(canvasElement).getByRole('navigation', { name: 'Info centred pagination' }));
    await expect(pager.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    await userEvent.click(pager.getByRole('button', { name: 'Go to next page' }));
    await expect(pager.getByRole('status')).toHaveTextContent('Page 2 of 10');
  }
 };
export const RowsPerPage = { name: 'Rows per page and range', ...pattern('rows-per-page', 'A table footer with a page-size select, the visible range and first, previous, next and last.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Rows per page' }), '10');
    await userEvent.click(canvas.getByRole('button', { name: 'Go to last page' }));
    await expect(canvas.getByText('91–100 of 100')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Rows per page' }), '50');
    await expect(canvas.getByText('1–50 of 100')).toBeVisible();
  }
 };
export const JumpToPage = { name: 'Jump to a page', ...pattern('jump-to-page', 'Long result sets: a go-to-page input beside numbered pages, or a page select between first and last.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const numbered = within(canvas.getByRole('navigation', { name: 'Numbered pages with page input' }));
    await userEvent.click(numbered.getByRole('button', { name: 'Go to next page' }));
    await expect(numbered.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    const select = within(canvas.getByRole('navigation', { name: 'First, last and page select' }));
    await userEvent.selectOptions(select.getByRole('combobox', { name: 'Page' }), '10');
    await expect(select.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  }
 };
