import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'item', import.meta.url,
  import.meta.glob('./fixtures/item/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/item/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Item', id: 'core-item', tags: ['autodocs'], ...catalogueMeta('item') };

export const Variants = { name: 'Variants and sizes', ...pattern('variants', 'Default, outline and muted rows at the default, sm and xs sizes, side by side.') };
export const SettingsIntegrations = {
  name: 'Settings and integrations', ...pattern('settings-integrations', 'Icon rows whose trailing slot carries a status badge, an action button, or both. Enable actions update this demo only.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Configure' })).toHaveAttribute('href', '/settings/integrations/database');
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeDisabled();
    await expect(canvas.getByText('Enabled in demo')).toBeVisible();
  }
};
export const TeamRoles = {
  name: 'Team members and roles', ...pattern('team-roles', 'Avatars with presence, role badges and a row menu, plus a pending invite with its own action. Membership changes stay local to this demo.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Resend' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Invitation resent to Ottilie Nakamura in this demo.');
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Sabine Okafor' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Change role' }));
    const row = canvas.getByText('Sabine Okafor').closest('[data-slot="item"]');
    await expect(within(row).getByText('Viewer')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Sabine Okafor' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Remove' }));
    await expect(canvas.queryByRole('button', { name: 'Actions for Sabine Okafor' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Restore members' }));
    await expect(canvas.getByRole('button', { name: 'Actions for Sabine Okafor' })).toBeVisible();
  }
};
export const Navigation = { name: 'Navigation rows', ...pattern('navigation', 'Link rows with descriptions, chevrons and separators.') };
export const MenuCounts = { name: 'Menu with counts and shortcuts', ...pattern('menu-counts', 'Compact link rows ending in a count badge or a keyboard shortcut.') };
export const ActivityFeed = { name: 'Activity feed', ...pattern('activity-feed') };
export const HeaderFooter = { name: 'Header and footer', ...pattern('header-footer', 'ItemHeader and ItemFooter frame a project card with a status, members and progress.') };


export const LiveRun = { name: 'Run status with a live step', ...pattern('live-run', 'Settled, failed and in-progress steps reuse Item, Badge and Loader.') };
export const RunLog = { name: 'Run log grouped by phase', ...pattern('run-log', 'Separator labels group compact Item rows by phase.') };
export const ChangedFiles = { name: 'Changed files summary', ...pattern('changed-files', 'Compact Item rows carry change badges and counts.') };
export const LinksAction = {
  name: 'Log links and a reversible action',
  ...pattern('links-action', 'Link and Button compose the same Item row layout.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Review draft #412: Colour in long-form layouts' })).toHaveAttribute('data-slot', 'item');
    await expect(canvas.getByRole('link', { name: 'Review draft #412: Colour in long-form layouts' })).toHaveAttribute('href', '/pull-requests/412');
    await userEvent.click(canvas.getByRole('button', { name: 'Undo this edit' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Edit undone');
    await expect(canvas.getByRole('button', { name: 'Restore the edit' })).toBeVisible();
  }
};
