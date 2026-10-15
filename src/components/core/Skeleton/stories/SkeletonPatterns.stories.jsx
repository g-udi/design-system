import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'skeleton', import.meta.url,
  import.meta.glob('./fixtures/skeleton/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Feedback & States/Skeleton', id: 'core-skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const AvatarList = { name: 'List with avatars and actions', ...pattern('avatar-list') };
export const MediaCard = { name: 'Media card', ...pattern('media-card') };
export const Dashboard = { name: 'Dashboard stats and table', ...pattern('dashboard') };
export const Form = { name: 'Form', ...pattern('form') };
export const Profile = { name: 'Profile page', ...pattern('profile') };
export const Chat = { name: 'Chat messages', ...pattern('chat') };
export const Morph = {
  name: 'Skeleton morph',
  ...pattern('morph', 'Placeholders that grow into the loaded content block by block instead of swapping: a profile card and a payouts list. Each region is busy with a status message while it loads; Reload runs the request again. Reduced motion swaps without animating.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const payouts = () => canvasElement.querySelectorAll('[data-slot="skeleton-morph"]')[1];
    await waitFor(() => expect(canvas.getByText('Mara Lindqvist')).toBeVisible(), { timeout: 4000 });
    await waitFor(() => expect(canvas.getByText('€860.00')).toBeVisible());
    for (const region of canvasElement.querySelectorAll('[data-slot="skeleton-morph"]')) await expect(region).not.toHaveAttribute('aria-busy');
    // Placeholders fade out behind the content, then leave the DOM.
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(0), { timeout: 3000 });
    // Reload shows the placeholders and a status message, then morphs back into the content.
    await userEvent.click(canvas.getByRole('button', { name: 'Reload' }));
    await expect(payouts()).toHaveAttribute('aria-busy', 'true');
    await expect(within(payouts()).getByRole('status')).toHaveTextContent('Loading payouts');
    await waitFor(() => expect(canvas.queryByText('€860.00')).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText('€860.00')).toBeVisible(), { timeout: 4000 });
    await expect(within(payouts()).getByRole('status')).toHaveTextContent('');
  }
};
