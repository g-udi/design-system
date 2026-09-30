// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'marker',
  import.meta.glob('../../../../.storybook/fixtures/reui/marker/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/marker/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Marker', tags: ['autodocs'], ...catalogueMeta('marker') };

export const ReuiMarker1 = { name: 'Default, separator, and border markers', ...pattern(1) };
export const ReuiMarker2 = { name: 'Tool call log with icon markers', ...pattern(2) };
export const ReuiMarker3 = { name: 'Run status markers with a live step', ...pattern(3) };
export const ReuiMarker4 = { name: 'Agent run log grouped by phase separators', ...pattern(4) };
export const ReuiMarker5 = { name: 'Changed files summary with border markers', ...pattern(5) };
export const ReuiMarker6 = { name: 'Markers as links and as an action button', ...pattern(6) };
