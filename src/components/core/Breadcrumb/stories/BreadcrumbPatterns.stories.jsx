import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'breadcrumb', import.meta.url,
  import.meta.glob('./fixtures/breadcrumb/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/breadcrumb/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Breadcrumb', id: 'core-breadcrumb', tags: ['autodocs'], ...catalogueMeta('breadcrumb') };

export const Separators = { name: 'Separators', ...pattern('separators', 'Chevron, slash, double chevron and dash separators. The middle link uses asChild, the hook for a router link.') };
export const IconsAvatars = { name: 'Icons, badges and avatars', ...pattern('icons-avatars', 'Leading icons, an icon-only home button, a count badge and avatars in the item slots.') };
export const CollapsedPath = {
  name: 'Collapsed path with menu',
  ...pattern('collapsed-path', 'Middle levels fold into an ellipsis that opens a menu of the hidden pages.'),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Toggle menu' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Documentation' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  }
};
export const ContainedButtons = { name: 'Contained and button styles', ...pattern('contained-buttons', 'A trail inside a card, inside a frame, and built from ghost buttons.') };
export const WorkspacePath = { name: 'Workspace, user and document', ...pattern('workspace-path', 'A rich header trail with avatars, secondary lines and a file glyph.') };
