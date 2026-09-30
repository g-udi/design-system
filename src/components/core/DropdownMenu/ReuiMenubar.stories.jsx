// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'menubar',
  import.meta.glob('../../../../.storybook/fixtures/reui/menubar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/menubar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('menubar') };

export const ReuiMenubar1 = { name: 'Menubar: Basic menubar', ...pattern(1) };
export const ReuiMenubar2 = { name: 'Menubar: Menubar with dropdown submenus', ...pattern(2) };
export const ReuiMenubar3 = { name: 'Menubar: Menubar with checkbox & radio items', ...pattern(3) };
export const ReuiMenubar4 = { name: 'Menubar: Menubar with icons', ...pattern(4) };
export const ReuiMenubar5 = { name: 'Menubar: Menubar for formatting and media', ...pattern(5) };
