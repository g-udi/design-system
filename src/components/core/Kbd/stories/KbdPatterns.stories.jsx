import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kbd', import.meta.url,
  import.meta.glob('./fixtures/kbd/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', id: 'core-kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const KeysGroups = { name: 'Keys, groups and icons', ...pattern('keys-groups', 'Single keys, grouped combinations and keys with an icon, built from the Kbd and KbdGroup parts.') };
export const InControls = { name: 'Shortcuts in controls', ...pattern('in-controls', 'A shortcut hint inside a search input, a tooltip and a button.') };
