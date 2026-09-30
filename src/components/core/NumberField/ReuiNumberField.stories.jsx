// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'number-field',
  import.meta.glob('../../../../.storybook/fixtures/reui/number-field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/number-field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/NumberField', tags: ['autodocs'], ...catalogueMeta('number-field') };

export const ReuiNumberField1 = {
  name: 'Basic number field',
  ...pattern(1),
  play: catalogueInteractions['number-field-1']
};
export const ReuiNumberField2 = { name: 'Small size', ...pattern(2) };
export const ReuiNumberField3 = { name: 'Large size', ...pattern(3) };
export const ReuiNumberField4 = { name: 'Buttons on the right', ...pattern(4) };
export const ReuiNumberField5 = { name: 'Spinner buttons', ...pattern(5) };
export const ReuiNumberField6 = { name: 'Form validation', ...pattern(6) };
