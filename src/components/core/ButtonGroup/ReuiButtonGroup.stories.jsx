// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'button-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/button-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/button-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ButtonGroup', tags: ['autodocs'], ...catalogueMeta('button-group') };

export const ReuiButtonGroup1 = { name: 'Two buttons', ...pattern(1) };
export const ReuiButtonGroup2 = { name: 'Button and input', ...pattern(2) };
export const ReuiButtonGroup3 = { name: 'Icons and a badge', ...pattern(3) };
export const ReuiButtonGroup4 = { name: 'Action with an options menu', ...pattern(4) };
export const ReuiButtonGroup5 = { name: 'Team activity toolbar', ...pattern(5) };
export const ReuiButtonGroup6 = { name: 'Icon-only actions', ...pattern(6) };
export const ReuiButtonGroup7 = { name: 'Branch menu with status', ...pattern(7) };
export const ReuiButtonGroup8 = { name: 'Like with a counter', ...pattern(8) };
export const ReuiButtonGroup9 = { name: 'Nested groups', ...pattern(9) };
export const ReuiButtonGroup10 = { name: 'Pagination with previous and next', ...pattern(10) };
export const ReuiButtonGroup11 = { name: 'Split pagination', ...pattern(11) };
export const ReuiButtonGroup12 = { name: 'Text alignment toolbar', ...pattern(12) };
export const ReuiButtonGroup13 = { name: 'Vertical orientation', ...pattern(13) };
export const ReuiButtonGroup14 = { name: 'Nested vertical tool palette', ...pattern(14) };
export const ReuiButtonGroup15 = { name: 'Star with count and menu', ...pattern(15) };
export const ReuiButtonGroup16 = { name: 'Search with filter menu and clear', ...pattern(16) };
export const ReuiButtonGroup17 = { name: 'Overflow action menu', ...pattern(17) };
export const ReuiButtonGroup18 = { name: 'Git toolbar with split commit', ...pattern(18) };
export const ReuiButtonGroup19 = { name: 'Filter input with options menu', ...pattern(19) };
export const ReuiButtonGroup20 = { name: 'Search input with menu button', ...pattern(20) };
export const ReuiButtonGroup21 = { name: 'File name input with create menu', ...pattern(21) };
export const ReuiButtonGroup22 = {
  name: 'Disabled button',
  ...pattern(22),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Folder' })).toBeDisabled();
  }
};
export const ReuiButtonGroup23 = { name: 'Separators', ...pattern(23) };
export const ReuiButtonGroup24 = { name: 'View switcher', ...pattern(24) };
export const ReuiButtonGroup25 = { name: 'Numeric rating scale', ...pattern(25) };
export const ReuiButtonGroup26 = { name: 'User select with actions', ...pattern(26) };
export const ReuiButtonGroup27 = { name: 'Status select with search', ...pattern(27) };
export const ReuiButtonGroup28 = {
  name: 'Volume stepper',
  ...pattern(28),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Volume' }));
    await userEvent.click(canvas.getByRole('button', { name: '55%' }));
    await expect(canvas.getByRole('button', { name: 'Muted' })).toBeVisible();
  }
};
export const ReuiButtonGroup29 = { name: 'Follower count', ...pattern(29) };
export const ReuiButtonGroup30 = { name: 'Active star with count', ...pattern(30) };
export const ReuiButtonGroup31 = { name: 'Share with a count label', ...pattern(31) };
export const ReuiButtonGroup32 = { name: 'Sort menu with view toggle', ...pattern(32) };
export const ReuiButtonGroup33 = { name: 'Environment and range selects', ...pattern(33) };
export const ReuiButtonGroup34 = { name: 'Segmented control with menu', ...pattern(34) };
export const ReuiButtonGroup35 = { name: 'Icon pagination with current page', ...pattern(35) };
export const ReuiButtonGroup36 = { name: 'View switcher with active view', ...pattern(36) };
export const ReuiButtonGroup37 = { name: 'Zoom controls', ...pattern(37) };
export const ReuiButtonGroup38 = { name: 'Media player controls', ...pattern(38) };
export const ReuiButtonGroup39 = { name: 'Split button', ...pattern(39) };
export const ReuiButtonGroup40 = { name: 'Vertical text buttons', ...pattern(40) };
export const ReuiButtonGroup41 = { name: 'Model selector with tier badges', ...pattern(41) };
export const ReuiButtonGroup42 = { name: 'Order type selector', ...pattern(42) };
export const ReuiButtonGroup43 = { name: 'Buy, sell, and hold toggle', ...pattern(43) };
export const ReuiButtonGroup44 = { name: 'Pipeline stage mover', ...pattern(44) };
export const ReuiButtonGroup45 = { name: 'Environment switcher', ...pattern(45) };
export const ReuiButtonGroup46 = { name: 'Time interval selector', ...pattern(46) };
export const ReuiButtonGroup47 = { name: 'Review split button', ...pattern(47) };
export const ReuiButtonGroup48 = { name: 'Filter, export, and view toggle', ...pattern(48) };
export const ReuiButtonGroup49 = { name: 'Vertical nav links with icons', ...pattern(49) };
export const ReuiButtonGroup50 = { name: 'Filter, sort, and more', ...pattern(50) };
export const ReuiButtonGroup51 = { name: 'New with create menu', ...pattern(51) };
export const ReuiButtonGroup52 = { name: 'Refresh, share, and export', ...pattern(52) };
export const ReuiButtonGroup53 = { name: 'Publish controls with overflow', ...pattern(53) };
export const ReuiButtonGroup54 = { name: 'API environment and version', ...pattern(54) };
export const ReuiButtonGroup55 = { name: 'Payout release controls', ...pattern(55) };
export const ReuiButtonGroup56 = { name: 'Attachment with download', ...pattern(56) };
export const ReuiButtonGroup57 = { name: 'Agent mode with credit cap', ...pattern(57) };
