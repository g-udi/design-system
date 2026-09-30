// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { expect } from 'storybook/test';
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
// Sized fields share the system control heights (Button sm 28px, lg 36px).
const hasHeight = (px) => async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('[data-slot="number-field-group"]').getBoundingClientRect().height).toBe(px);
};
export const ReuiNumberField2 = { name: 'Small size', ...pattern(2), play: hasHeight(28) };
export const ReuiNumberField3 = { name: 'Large size', ...pattern(3), play: hasHeight(36) };
export const ReuiNumberField4 = { name: 'Buttons on the right', ...pattern(4) };
export const ReuiNumberField5 = { name: 'Spinner buttons', ...pattern(5) };
export const ReuiNumberField6 = { name: 'Form validation', ...pattern(6) };
