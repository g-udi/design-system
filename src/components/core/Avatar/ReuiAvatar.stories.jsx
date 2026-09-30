// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = reuiPatterns(
  'avatar',
  import.meta.glob('../../../../.storybook/fixtures/reui/avatar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/avatar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Avatar', tags: ['autodocs'], ...catalogueMeta('avatar') };

export const ReuiAvatar1 = { name: 'Image', ...pattern(1) };
export const ReuiAvatar2 = { name: 'Initials fallback', ...pattern(2) };
export const ReuiAvatar3 = { name: 'Sizes', ...pattern(3) };
export const ReuiAvatar4 = { name: 'Square and circular avatars', ...pattern(4) };
export const ReuiAvatar5 = { name: 'Custom sizes', ...pattern(5) };
export const ReuiAvatar6 = { name: 'Online status badge', ...pattern(6) };
export const ReuiAvatar7 = { name: 'Badge icon', ...pattern(7) };
export const ReuiAvatar8 = { name: 'Badge positions', ...pattern(8) };
export const ReuiAvatar9 = { name: 'Offset badge positions on squares', ...pattern(9) };
export const ReuiAvatar10 = { name: 'Group', ...pattern(10) };
export const ReuiAvatar11 = { name: 'Group with count', ...pattern(11) };
export const ReuiAvatar12 = { name: 'Group with icon count', ...pattern(12) };
export const ReuiAvatar13 = { name: 'Border ring', ...pattern(13) };
export const ReuiAvatar14 = { name: 'Light fallback', ...pattern(14) };
export const ReuiAvatar15 = { name: 'Solid fallback', ...pattern(15) };
export const ReuiAvatar16 = { name: 'User details and badge', ...pattern(16) };
export const ReuiAvatar17 = { name: 'Grayscale image', ...pattern(17) };
export const ReuiAvatar18 = { name: 'Group with one online status', ...pattern(18) };
export const ReuiAvatar19 = { name: 'Inside an outline button', ...pattern(19) };
export const ReuiAvatar20 = { name: 'Social proof with label', ...pattern(20) };
export const ReuiAvatar21 = { name: 'Compact social proof', ...pattern(21) };
export const ReuiAvatar22 = { name: 'Group with tooltips and lift', ...pattern(22) };
export const ReuiAvatar23 = { name: 'Group that spreads on hover', ...pattern(23) };
export const ReuiAvatar24 = { name: 'Spreading group with tooltips', ...pattern(24) };
export const ReuiAvatar25 = { name: 'Pill group with count', ...pattern(25) };
export const ReuiAvatar26 = { name: 'Pill outline button', ...pattern(26) };
export const ReuiAvatar27 = { name: 'Pill solid button', ...pattern(27) };
export const ReuiAvatar28 = { name: 'Empty state', ...pattern(28) };
export const ReuiAvatar29 = { name: 'Group with count and add button', ...pattern(29) };
export const ReuiAvatar30 = { name: 'Loading overlay', ...pattern(30) };
export const ReuiAvatar31 = { name: 'Custom badge', ...pattern(31) };
export const ReuiAvatar32 = { name: 'Animated ring', ...pattern(32) };
export const ReuiAvatar33 = { name: 'Animated gradient ring', ...pattern(33) };
export const ReuiAvatar34 = { name: 'Status and count badges', ...pattern(34) };
export const ReuiAvatar35 = {
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
