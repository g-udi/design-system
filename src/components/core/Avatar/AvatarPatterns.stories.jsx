import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'avatar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/avatar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/avatar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Avatar', id: 'core-avatar', tags: ['autodocs'], ...catalogueMeta('avatar') };

export const AvatarPattern3 = { name: 'Sizes, shapes and fallbacks', ...pattern(3, 'Built-in and custom sizes, corner radii, and initials or icon fallbacks when there is no image.') };
export const AvatarPattern16 = { name: 'User details and badge', ...pattern(16) };
export const AvatarPattern6 = { name: 'Status and icon badges', ...pattern(6, 'Status dots, icon badges, every corner position on circles and squares, a custom verified mark, and a count badge.') };
export const AvatarPattern11 = { name: 'Groups', ...pattern(11, 'Stacked groups with a presence badge, a numeric or icon overflow count, and an add action.') };
export const AvatarPattern20 = { name: 'Social proof', ...pattern(20, 'Avatar stacks with a short claim in a pill, a compact count pill, and a frame.') };
export const AvatarPattern24 = { name: 'Hover groups with tooltips', ...pattern(24, 'Groups that lift or spread on hover and name each person in a tooltip.') };
export const AvatarPattern19 = { name: 'Inside buttons', ...pattern(19, 'Profile handles in outline, pill outline, and pill solid buttons.') };
export const AvatarPattern35 = {
  name: 'Account dropdown menu',
  ...pattern(35),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', { name: /Liam Thompson/ });
    await userEvent.click(trigger);
    await expect(await body.findByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
export const AvatarPattern13 = { name: 'Rings and activity', ...pattern(13, 'Coloured rings, a pulsing live ring, an animated story ring, an upload spinner overlay, and grayscale for inactive people.') };
export const AvatarPattern28 = { name: 'Empty state', ...pattern(28) };
