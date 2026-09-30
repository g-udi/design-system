import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kbd',
  import.meta.glob('../../../../.storybook/fixtures/patterns/kbd/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', id: 'core-kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const KbdPattern1 = { name: 'Keys, groups and icons', ...pattern(1, 'Single keys, grouped combinations and keys with an icon, built from the Kbd and KbdGroup parts.') };
export const KbdPattern4 = { name: 'Shortcuts in controls', ...pattern(4, 'A shortcut hint inside a search input, a tooltip and a button.') };
