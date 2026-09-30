import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'avatar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/avatar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/avatar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Avatar', tags: ['autodocs'], ...catalogueMeta('avatar') };

export const AvatarPattern1 = { name: 'Image', ...pattern(1) };
export const AvatarPattern2 = { name: 'Initials fallback', ...pattern(2) };
export const AvatarPattern3 = { name: 'Sizes', ...pattern(3) };
export const AvatarPattern4 = { name: 'Square and circular avatars', ...pattern(4) };
export const AvatarPattern5 = { name: 'Custom sizes', ...pattern(5) };
export const AvatarPattern6 = { name: 'Online status badge', ...pattern(6) };
export const AvatarPattern7 = { name: 'Badge icon', ...pattern(7) };
export const AvatarPattern8 = { name: 'Badge positions', ...pattern(8) };
export const AvatarPattern9 = { name: 'Offset badge positions on squares', ...pattern(9) };
export const AvatarPattern10 = { name: 'Group', ...pattern(10) };
export const AvatarPattern11 = { name: 'Group with count', ...pattern(11) };
export const AvatarPattern12 = { name: 'Group with icon count', ...pattern(12) };
export const AvatarPattern13 = { name: 'Border ring', ...pattern(13) };
export const AvatarPattern14 = { name: 'Light fallback', ...pattern(14) };
export const AvatarPattern15 = { name: 'Solid fallback', ...pattern(15) };
export const AvatarPattern16 = { name: 'User details and badge', ...pattern(16) };
export const AvatarPattern17 = { name: 'Grayscale image', ...pattern(17) };
export const AvatarPattern18 = { name: 'Group with one online status', ...pattern(18) };
export const AvatarPattern19 = { name: 'Inside an outline button', ...pattern(19) };
export const AvatarPattern20 = { name: 'Social proof with label', ...pattern(20) };
export const AvatarPattern21 = { name: 'Compact social proof', ...pattern(21) };
export const AvatarPattern22 = { name: 'Group with tooltips and lift', ...pattern(22) };
export const AvatarPattern23 = { name: 'Group that spreads on hover', ...pattern(23) };
export const AvatarPattern24 = { name: 'Spreading group with tooltips', ...pattern(24) };
export const AvatarPattern25 = { name: 'Pill group with count', ...pattern(25) };
export const AvatarPattern26 = { name: 'Pill outline button', ...pattern(26) };
export const AvatarPattern27 = { name: 'Pill solid button', ...pattern(27) };
export const AvatarPattern28 = { name: 'Empty state', ...pattern(28) };
export const AvatarPattern29 = { name: 'Group with count and add button', ...pattern(29) };
export const AvatarPattern30 = { name: 'Loading overlay', ...pattern(30) };
export const AvatarPattern31 = { name: 'Custom badge', ...pattern(31) };
export const AvatarPattern32 = { name: 'Animated ring', ...pattern(32) };
export const AvatarPattern33 = { name: 'Animated gradient ring', ...pattern(33) };
export const AvatarPattern34 = { name: 'Status and count badges', ...pattern(34) };
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
