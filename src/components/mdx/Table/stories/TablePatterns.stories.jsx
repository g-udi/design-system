import { spaceScales } from '@gaudi/design-system/tokens';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'table', import.meta.url,
  import.meta.glob('./fixtures/table/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const Basic = { name: 'Simple data table', ...pattern('basic', 'A caption, a header row, right-aligned amounts and a footer total.') };
export const Records = {
  name: 'Records with avatars, status and actions',
  ...pattern('records', 'Rich cells in one table: a mono ID, an avatar with a secondary line, an icon tile with a SKU, a status badge with its date, a numeric column and a row menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(6);
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for order #3209' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Refund' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  }
};
export const TeamProjects = { name: 'Projects with team avatars', ...pattern('team-projects', 'Stacked avatars with an overflow count, beside a status badge and due date.') };
export const ApiKeys = {
  name: 'API keys and permissions',
  ...pattern('api-keys', 'Mock keys with working copy and local regeneration, permission badges and expired-key recovery.'),
  play: async ({ canvasElement, id }) => {
    const canvas = within(canvasElement);
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = fn().mockResolvedValue(undefined);
    const production = canvas.getByText('Production API').closest('tr');
    const expired = canvas.getByRole('button', { name: 'Copy Legacy Integration key' });
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      await expect(expired).toBeDisabled();
      await userEvent.click(canvas.getByRole('button', { name: 'Copy Production API key' }));
      await waitFor(() => expect(writeText).toHaveBeenLastCalledWith('demo_live_example_4f3a'));
      await expect(canvas.getByRole('status')).toHaveTextContent('Demo key copied.');
      const oldToken = production.querySelector('code').textContent;
      await userEvent.click(canvas.getByRole('button', { name: 'Regenerate Production API key' }));
      await expect(production.querySelector('code').textContent).not.toBe(oldToken);
      await expect(production).toHaveTextContent('Last used: Never');
      await userEvent.click(canvas.getByRole('button', { name: 'Copy Production API key' }));
      await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
      const copied = writeText.mock.calls.at(-1)[0];
      await expect(copied).toMatch(/^demo_[a-f0-9]{32}$/);
      await expect(production.querySelector('code')).toHaveTextContent(copied.slice(-4));
      await userEvent.click(canvas.getByRole('button', { name: 'Regenerate Legacy Integration key' }));
      await expect(expired).toBeEnabled();
      await expect(expired.closest('tr')).toHaveTextContent('Active');
    } finally {
      if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      else delete navigator.clipboard;
    }
    if (import.meta.env.MODE === 'test' && import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      const scale = canvasElement.style.getPropertyValue('--ds-space-scale');
      try {
        for (const [name, value] of Object.entries(spaceScales)) {
          canvasElement.style.setProperty('--ds-space-scale', value);
          await auditStoryLayout({ canvasElement, id: `${id}--${name}` });
        }
      } finally {
        if (scale) canvasElement.style.setProperty('--ds-space-scale', scale);
        else canvasElement.style.removeProperty('--ds-space-scale');
      }
    }
  }
};
export const Leaderboard = { name: 'Leaderboard', ...pattern('leaderboard', 'A ranked list with scores and up or down trend indicators.') };
export const Editable = { name: 'Editable cells', ...pattern('editable', 'Inputs inside cells for quick quantity edits.') };
export const VerticalDetails = { name: 'Vertical details', ...pattern('vertical-details', 'A two-column key and value table under a frame header, with status, meters and mono values.') };
