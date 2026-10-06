import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'loader', import.meta.url,
  import.meta.glob('./fixtures/loader/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/loader/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Loader', id: 'core-loader', tags: ['autodocs'], ...catalogueMeta('loader') };

export const InlineControls = { name: 'In buttons, badges and inputs', ...pattern('inline-controls', 'Busy buttons, syncing badges and a searching input addon.') };
export const InlineStatus = { name: 'Inline status', ...pattern('inline-status', 'Loaders beside status text take the tone of the message; three dots mark a typing indicator.') };
export const Overlays = {
  name: 'Overlays and empty states',
  ...pattern('overlays', 'A refresh overlay on a card, toggled by the switch, and a loading empty state.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status', { name: 'Refreshing data' })).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Refreshing' }));
    await expect(canvas.queryByRole('status', { name: 'Refreshing data' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('Setup cancelled')).toBeVisible();
    await expect(canvas.queryByRole('status', { name: 'Setting up workspace' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Restart setup' }));
    await expect(canvas.getByRole('status', { name: 'Setting up workspace' })).toBeVisible();
  }
};
