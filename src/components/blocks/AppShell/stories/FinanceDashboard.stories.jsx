import { expect, userEvent, waitFor, within } from 'storybook/test';
import { patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { desktopSidebar, expectFramed, expectHeaderToggle, openNavigation } from './AppShell.story-steps.js';
import { checkFinanceLayout } from '../../../../../tests/components/blocks/AppShell/checkFinanceLayout.js';

const pattern = patternStories(
  'app-shell', import.meta.url,
  import.meta.glob('./fixtures/app-shell/app-shell-finance-dashboard.jsx', { eager: true }),
  import.meta.glob('./fixtures/app-shell/app-shell-finance-dashboard.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], parameters: { layout: 'padded' } };

export const FinanceDashboard = {
  name: 'Finance dashboard · grouped sidebar, search and reports',
  ...pattern('finance-dashboard', 'A complete finance workspace with a flush grouped sidebar, a compact search header, stacked revenue bars and report totals, visitor distribution, product sales and a filterable customer table. Navigation opens cash flow, net worth, payments, invoices and reports; search finds pages and record details. On phones the sidebar opens as a sheet and the panels stack. All figures are illustrative local data.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    await expectHeaderToggle(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Finance', exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'View report', exact: true }));
    await expect(canvas.getByRole('table', { name: 'Monthly finance report', exact: true })).toBeVisible();
    await expect(canvas.getByText('Total profit: $114,500')).toBeVisible();

    const nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('link', { name: 'Customers', exact: true }));
    await userEvent.click(canvas.getByRole('button', { name: 'Select role' }));
    await userEvent.click(await body.findByRole('option', { name: 'Editor', exact: true }));
    await expect(canvas.getByText('2 of 5 customers')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Select plan' }));
    await userEvent.click(await body.findByRole('option', { name: 'Enterprise', exact: true }));
    await expect(canvas.getByText('No matching customers')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByText('5 of 5 customers')).toBeVisible();

    const search = canvas.getByRole('button', { name: 'Search finance workspace' });
    await userEvent.click(search);
    let dialog = await body.findByRole('dialog', { name: 'Search finance workspace' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'Galaxy');
    await userEvent.click(await within(dialog).findByRole('option', { name: 'Samsung Galaxy S25' }));
    dialog = await body.findByRole('dialog', { name: 'Samsung Galaxy S25' });
    await expect(within(dialog).getByText('$32,200')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(search).toHaveFocus());

    await userEvent.keyboard(/mac|iphone|ipad/i.test(navigator.platform) ? '{Meta>}k{/Meta}' : '{Control>}k{/Control}');
    dialog = await body.findByRole('dialog', { name: 'Search finance workspace' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'no matching record');
    await expect(within(dialog).getByText('No results. Try a page or customer name.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(search).toHaveFocus());

    for (const name of ['Cash flow', 'Net worth', 'Transactions', 'Invoices', 'Products', 'Visitors']) {
      const navigation = await openNavigation(canvasElement);
      await userEvent.click(navigation.getByRole('link', { name, exact: true }));
      await expect(canvas.getByRole('heading', { name, exact: true, level: 1 })).toBeVisible();
    }

    const finalNav = await openNavigation(canvasElement);
    await userEvent.click(finalNav.getByRole('link', { name: 'Finance', exact: true }));
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const toggle = await expectHeaderToggle(canvasElement);
      await userEvent.click(toggle);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(toggle);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    }
    await expect(canvas.getByRole('heading', { name: 'Finance', exact: true })).toBeVisible();
    await checkFinanceLayout(canvasElement);
  }
};
