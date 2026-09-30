// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'native-select',
  import.meta.glob('../../../../.storybook/fixtures/reui/native-select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/native-select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('native-select') };

export const ReuiNativeSelect1 = { name: 'Basic native select', ...pattern(1) };
export const ReuiNativeSelect2 = { name: 'Grouped native select', ...pattern(2) };
export const ReuiNativeSelect3 = { name: 'Small native select', ...pattern(3) };
export const ReuiNativeSelect4 = { name: 'Native select in a field', ...pattern(4) };
export const ReuiNativeSelect5 = { name: 'Disabled native select', ...pattern(5) };
export const ReuiNativeSelect6 = { name: 'Invalid native select', ...pattern(6) };
