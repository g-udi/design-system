import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'breadcrumb',
  import.meta.glob('../../../../.storybook/fixtures/patterns/breadcrumb/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/breadcrumb/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Breadcrumb', id: 'core-breadcrumb', tags: ['autodocs'], ...catalogueMeta('breadcrumb') };

export const BreadcrumbPattern1 = { name: 'Separators', ...pattern(1, 'Chevron, slash, double chevron and dash separators. The middle link uses asChild, the hook for a router link.') };
export const BreadcrumbPattern5 = { name: 'Icons, badges and avatars', ...pattern(5, 'Leading icons, an icon-only home button, a count badge and avatars in the item slots.') };
export const BreadcrumbPattern2 = {
  name: 'Collapsed path with menu',
  ...pattern(2, 'Middle levels fold into an ellipsis that opens a menu of the hidden pages.'),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Toggle menu' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Documentation' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  }
};
export const BreadcrumbPattern14 = { name: 'Contained and button styles', ...pattern(14, 'A trail inside a card, inside a frame, and built from ghost buttons.') };
export const BreadcrumbPattern15 = { name: 'Workspace, user and document', ...pattern(15, 'A rich header trail with avatars, secondary lines and a file glyph.') };
