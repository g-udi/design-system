import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'filters', import.meta.url,
  import.meta.glob('./fixtures/filters/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/filters/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/FilterBar', id: 'core-filterbar', tags: ['autodocs'], ...catalogueMeta('filters') };

export const AllInOne = { name: 'One bar, every filter kind', ...pattern('all-in-one', 'Multi-select with pinned picks, badges or stacked values in the chip, nested fields, async paged options, a restored saved view, and the query it produces.') };
export const TableGroups = { name: 'Filtering a table with nested groups', ...pattern('table-groups', 'A popover builder with nested groups, compiled to a row predicate over a data grid that pages, sorts and totals the matches.') };
export const CustomEditors = { name: 'Custom value editors', ...pattern('custom-editors', 'Consumer-owned editors on one bar: date and date range pickers, sliders, choice controls, and typed inputs with validation.') };
export const NestedAttributes = { name: 'Deep attribute menus for large libraries', ...pattern('nested-attributes', 'Drill-down groups, a filterable branch and deep search.') };
export const InlineGroups = {
  name: 'Nested groups edited in place',
  ...pattern('inline-groups', 'The builder inline, beside its own tree read back as an expression. Narrow tracks stack each rule’s controls so nested labels remain readable.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Nest two levels' }));
    await expect(canvas.getByDisplayValue('release/')).toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      const { page } = await import('vitest/browser');
      const original = { width: window.innerWidth, height: window.innerHeight };
      try {
        for (const width of [320, 390, 1440]) {
          await page.viewport(width, 900);
          await waitFor(() => {
            const cells = canvasElement.querySelectorAll('.ds-filter-rule-content > div');
            expect(cells.length).toBeGreaterThan(0);
            for (const cell of cells) {
              expect(cell.getBoundingClientRect().width).toBeGreaterThan(110);
              expect(cell.getBoundingClientRect().height).toBeLessThan(60);
            }
          });
        }
        await auditStoryLayout({ ...context, id: `${context.id}--nested` });
      } finally {
        await page.viewport(original.width, original.height);
      }
    }
    const branch = canvas.getByDisplayValue('release/');
    await userEvent.clear(branch);
    await userEvent.type(branch, 'hotfix/');
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText(/repository_branch starts with 'hotfix\//)).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByDisplayValue('migration')).toBeVisible();
  }
};
export const ControlledTranslated = {
  name: 'Controlled state, sizes and locales',
  ...pattern('controlled-translated', 'One controlled query, three locales, dynamic option availability and every change reported.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const valueButton = () => within(canvasElement.querySelector('[data-rule-id="seed-1"]')).getByRole('button', { name: '2 selected' });
    await userEvent.click(valueButton());
    await expect(await page.findByRole('option', { name: 'Done' })).not.toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('switch', { name: 'Done unavailable' }));
    await userEvent.click(valueButton());
    const done = await page.findByRole('option', { name: 'Done' });
    await expect(done).toHaveAttribute('aria-disabled', 'true');
    await fireEvent.click(done);
    await expect(valueButton()).toHaveAttribute('aria-label', '2 selected');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--unavailable-option` });
    }
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('switch', { name: 'Done unavailable' }));
    await userEvent.click(valueButton());
    await expect(await page.findByRole('option', { name: 'Done' })).not.toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(page.getByRole('option', { name: 'Done' }));
    await waitFor(() => expect(within(canvasElement.querySelector('[data-rule-id="seed-1"]')).getByRole('button', { name: '3 selected' })).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
  }
};
