import { expect } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'number-field',
  import.meta.glob('../../../../.storybook/fixtures/patterns/number-field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/number-field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/NumberField', tags: ['autodocs'], ...catalogueMeta('number-field') };

export const NumberFieldPattern1 = {
  name: 'Basic number field',
  ...pattern(1),
  play: catalogueInteractions['number-field-1']
};
// Sized fields share the system control heights (Button sm 28px, lg 36px).
const hasHeight = (px) => async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('[data-slot="number-field-group"]').getBoundingClientRect().height).toBe(px);
};
export const NumberFieldPattern2 = { name: 'Small size', ...pattern(2), play: hasHeight(28) };
export const NumberFieldPattern3 = { name: 'Large size', ...pattern(3), play: hasHeight(36) };
export const NumberFieldPattern4 = { name: 'Buttons on the right', ...pattern(4) };
export const NumberFieldPattern5 = { name: 'Spinner buttons', ...pattern(5) };
export const NumberFieldPattern6 = { name: 'Form validation', ...pattern(6) };
