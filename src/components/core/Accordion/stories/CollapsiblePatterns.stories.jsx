import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'collapsible', import.meta.url,
  import.meta.glob('./fixtures/collapsible/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/collapsible/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Accordion', id: 'core-accordion', tags: ['autodocs'], ...catalogueMeta('collapsible') };

export const CollapsibleShowMore = { name: 'Collapsible: Show more details', ...pattern('show-more', 'An icon button reveals the rest of an order summary under the always-visible status.') };
export const CollapsibleFramedSections = {
  name: 'Collapsible: Framed sections',
  ...pattern('framed-sections', 'Stacked frames whose headers toggle a release note, a key list with row actions, and a profile. With an action in the header, only the title is the trigger.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const keys = canvas.getByRole('button', { name: 'API keys' });
    await expect(keys).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(keys);
    await expect(keys).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', { name: 'Add key' })).toBeVisible();
    await userEvent.click(keys);
    await userEvent.click(canvas.getByRole('button', { name: 'Add key' }));
    await expect(canvas.getByText('DEMO-NOT-A-REAL-KEY-1')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Demo 1 key actions' }));
    await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('menuitem', { name: 'Delete' }));
    await waitFor(() => expect(canvas.queryByText('DEMO-NOT-A-REAL-KEY-1')).not.toBeInTheDocument());
    const profile = canvas.getByRole('button', { name: /@alexjohnson/ });
    await userEvent.click(profile);
    await expect(canvas.getByText('Toronto, Canada')).toBeVisible();
  }
};
export const CollapsibleBottomTrigger = { name: 'Collapsible: Card that opens from its footer', ...pattern('bottom-trigger', 'A usage card whose breakdown opens from a button on the bottom edge.') };
export const CollapsibleAdvancedFields = {
  name: 'Collapsible: Advanced form fields',
  ...pattern('advanced-fields', 'A controlled collapsible that hides optional pricing fields behind a settings button.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Base Price' })).toHaveValue('19');
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await userEvent.click(await canvas.findByText('Tax Rate (%)'));
    await expect(canvas.getByRole('textbox', { name: 'Tax Rate (%)' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Discount (%)' })).toHaveValue('0');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--pricing-fields` });
    }
  }
};
export const CollapsibleFileTree = {
  name: 'Collapsible: Tree view with file actions',
  ...pattern('file-tree', 'Compact file explorer with expandable folders, selection, and keyboard-accessible actions. Downloads contain illustrative file content; deleting and restoring files affects only this demo.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    canvas.getByRole('button', { name: 'components', exact: true }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: 'ui', exact: true }));
    const file = canvas.getByRole('button', { name: 'button.tsx', exact: true });
    await userEvent.click(file);
    await expect(file).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('link', { name: 'Download button.tsx' })).toHaveAttribute('download', 'button.tsx');
    await userEvent.click(canvas.getByRole('tab', { name: 'Outline' }));
    await expect(canvas.getByText('button.tsx has no symbols in this demo.')).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Explorer' }));
    for (const name of ['components', 'ui']) {
      const folder = canvas.getByRole('button', { name, exact: true });
      if (folder.getAttribute('aria-expanded') !== 'true') await userEvent.click(folder);
    }
    const remove = canvas.getByRole('button', { name: 'Delete button.tsx' });
    remove.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('button', { name: 'button.tsx', exact: true })).not.toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('button.tsx removed.');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Explorer' })).toHaveFocus());
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--file-removed` });
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Restore files' }));
    await expect(canvas.getByRole('button', { name: 'button.tsx', exact: true })).toBeVisible();
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Explorer' })).toHaveFocus());
  },
};
