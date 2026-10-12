import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'filters', import.meta.url,
  import.meta.glob('./fixtures/filters/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/filters/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/FilterBar', id: 'core-filterbar', tags: ['autodocs'], ...catalogueMeta('filters') };

export const AllInOne = {
  name: 'One bar, every filter kind', ...pattern('all-in-one', 'Multi-select with pinned picks, badges or stacked values in the chip, nested fields, async paged options, a restored saved view, and the query it produces.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    const query = () => JSON.parse(canvas.getByRole('region', { name: 'Filter query' }).textContent);
    const initial = query();
    await userEvent.click(canvas.getByRole('button', { name: 'Restore saved view' }));
    await expect(query().rules.map(rule => rule.id)).toEqual(['saved-1', 'saved-2']);
    const contact = within(context.canvasElement.querySelector('[data-rule-id="saved-2"]'));
    await userEvent.click(contact.getByRole('button', { name: '3 selected' }));
    await expect(await page.findByRole('option', { name: 'Contact 1', exact: true })).toBeVisible();
    await userEvent.click(page.getByRole('button', { name: 'Load more' }));
    await expect(await page.findByRole('option', { name: 'Contact 26', exact: true })).toBeInTheDocument();
    const search = page.getByRole('combobox');
    await userEvent.type(search, 'Contact 4000');
    await userEvent.click(await page.findByRole('option', { name: 'Contact 4000', exact: true }));
    await expect(query().rules.find(rule => rule.id === 'saved-2').value).toEqual(['u-41', 'u-1200', 'u-3311', 'u-3999']);
    await auditState(context, 'async-contact-selected');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset', exact: true }));
    await expect(query()).toEqual(initial);
  }
};
export const TableGroups = {
  name: 'Filtering a table with nested groups', ...pattern('table-groups', 'A popover builder with nested groups, compiled to a row predicate over a data grid that pages, sorts and totals the matches.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    const accounts = () => [...context.canvasElement.querySelectorAll('tbody tr')].map(row => row.querySelector('td')?.textContent);
    const initial = accounts();
    await expect(canvas.getByText('7 of 14 deals')).toBeVisible();
    await expect(canvas.getByRole('cell', { name: '$198,000', exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to next page' }));
    await expect(canvas.getByText('Northwind', { exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /^Advanced filter/ }));
    await auditState(context, 'nested-table-query');
    await userEvent.click(await page.findByRole('button', { name: 'Clear all', exact: true }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByText('14 of 14 deals')).toBeVisible();
    await expect(canvas.getByText('Arden Cellars', { exact: true })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    await expect(canvas.getByRole('cell', { name: '$521,000', exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset', exact: true }));
    await expect(canvas.getByText('7 of 14 deals')).toBeVisible();
    await expect(accounts()).toEqual(initial);
    await expect(canvas.getByRole('button', { name: 'Reset', exact: true })).toBeDisabled();
  }
};
async function auditState(context, state) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
}

export const CustomEditors = {
  name: 'Custom value editors', ...pattern('custom-editors', 'Consumer-owned editors on one bar: date and date range pickers, sliders, choice controls, and typed inputs with validation.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    const rule = id => within(context.canvasElement.querySelector(`[data-rule-id="${id}"]`));
    await userEvent.click(rule('seed-9-1').getByRole('button', { name: /500.*2500/ }));
    const from = await page.findByRole('textbox', { name: 'Monthly spend from' });
    const to = page.getByRole('textbox', { name: 'Monthly spend to' });
    await userEvent.clear(from);
    await userEvent.type(from, '750');
    await userEvent.clear(to);
    await userEvent.type(to, '3000');
    await auditState(context, 'amount-editor');
    await userEvent.click(page.getByRole('button', { name: 'Apply', exact: true }));
    await userEvent.click(rule('seed-9-1').getByRole('button', { name: /750.*3000/ }));
    await expect(await page.findByRole('textbox', { name: 'Monthly spend from' })).toHaveValue('750');
    await userEvent.clear(page.getByRole('textbox', { name: 'Monthly spend from' }));
    await userEvent.type(page.getByRole('textbox', { name: 'Monthly spend from' }), '999');
    await userEvent.keyboard('{Escape}');
    await expect(rule('seed-9-1').getByRole('button', { name: /750.*3000/ })).toBeVisible();

    await userEvent.click(rule('seed-9-3').getByRole('button', { name: 'acme.com' }));
    const domain = await page.findByRole('textbox', { name: 'Domain' });
    const domainEditor = within(domain.closest('[data-slot="popover-content"]'));
    await userEvent.clear(domain);
    await userEvent.type(domain, 'invalid');
    await expect(domain).toHaveAttribute('aria-invalid', 'true');
    await expect(domainEditor.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
    await expect(domainEditor.getByText('Include a dot, as in studio.example')).toBeVisible();
    await auditState(context, 'invalid-domain');
    await userEvent.clear(domain);
    await userEvent.type(domain, 'STUDIO.EXAMPLE');
    await userEvent.click(domainEditor.getByRole('button', { name: 'Apply', exact: true }));
    await expect(rule('seed-9-3').getByRole('button', { name: 'studio.example' })).toBeVisible();

    await userEvent.click(rule('seed-9-2').getByRole('button', { name: 'R7K2QX' }));
    const code = await page.findByRole('textbox', { name: 'Access code' });
    await userEvent.clear(code);
    await userEvent.type(code, 'a1b');
    await expect(code).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(rule('seed-9-2').getByRole('button', { name: 'R7K2QX' })).toBeVisible();
    await userEvent.click(rule('seed-9-2').getByRole('button', { name: 'R7K2QX' }));
    const completeCode = await page.findByRole('textbox', { name: 'Access code' });
    await userEvent.clear(completeCode);
    await userEvent.type(completeCode, 'a1b2c3');
    await waitFor(() => expect(page.queryByRole('textbox', { name: 'Access code' })).not.toBeInTheDocument());
    await expect(rule('seed-9-2').getByRole('button', { name: 'A1B2C3' })).toBeVisible();

    await userEvent.click(rule('seed-8-2').getByRole('button', { name: 'Pro' }));
    await userEvent.click(await page.findByRole('radio', { name: /Ultimate/ }));
    await expect(rule('seed-8-2').getByRole('button', { name: 'Ultimate' })).toBeVisible();
    await userEvent.click(rule('seed-8-2').getByRole('button', { name: 'Ultimate' }));
    await expect(await page.findByRole('radio', { name: /Ultimate/ })).toBeChecked();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Clear', exact: true })).toBeEnabled();
  }
};
export const NestedAttributes = {
  name: 'Deep attribute menus for large libraries', ...pattern('nested-attributes', 'Drill-down groups, a filterable branch and deep search.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Add filter' }));
    for (const name of [/^Custom fields/, /^Workspace/, /^Plan$/]) {
      await userEvent.click(await page.findByRole('option', { name }));
    }
    await userEvent.click(await page.findByRole('option', { name: 'is', exact: true }));
    await userEvent.click(await page.findByRole('option', { name: 'Enterprise' }));
    const plan = [...context.canvasElement.querySelectorAll('[data-slot="filter-chip"]')].find(element => element.textContent.includes('Enterprise'));
    await expect(plan).toHaveTextContent('Workspace');
    await expect(plan).toHaveTextContent('Plan');
    await userEvent.click(canvas.getByRole('button', { name: 'Add filter' }));
    await userEvent.type(await page.findByRole('combobox'), 'SSO enforced');
    await userEvent.click(await page.findByRole('option', { name: /SSO enforced/ }));
    await userEvent.click(await page.findByRole('option', { name: 'is', exact: true }));
    await userEvent.click(await page.findByRole('option', { name: 'True' }));
    await expect(context.canvasElement.querySelectorAll('[data-slot="filter-chip"]')).toHaveLength(3);
    const seeded = within(context.canvasElement.querySelector('[data-rule-id="seed-1"]'));
    await userEvent.click(seeded.getByRole('button', { name: 'Customer' }));
    await userEvent.click(await page.findByRole('option', { name: 'Lead' }));
    await expect(seeded.getByRole('button', { name: 'Lead' })).toBeVisible();
    await auditState(context, 'selected-paths');
    await userEvent.click(within(plan).getByRole('button', { name: /filter options/ }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Remove' }));
    await expect(context.canvasElement.querySelectorAll('[data-slot="filter-chip"]')).toHaveLength(2);
    await expect(seeded.getByRole('button', { name: 'Lead' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear', exact: true }));
    await expect(context.canvasElement.querySelectorAll('[data-slot="filter-chip"]')).toHaveLength(0);
    await auditState(context, 'cleared');
  }
};
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
