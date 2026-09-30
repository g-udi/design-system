import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'stepper',
  import.meta.glob('../../../../.storybook/fixtures/patterns/stepper/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/stepper/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Stepper', tags: ['autodocs'], ...catalogueMeta('stepper') };

export const StepperPattern1 = { name: 'Basic stepper', ...pattern(1), play: catalogueInteractions['stepper-1'] };
export const StepperPattern2 = { name: 'Completed state', ...pattern(2) };
export const StepperPattern3 = { name: 'Loading state', ...pattern(3) };
export const StepperPattern4 = { name: 'Controlled', ...pattern(4) };
export const StepperPattern5 = { name: 'Title and indicator', ...pattern(5) };
export const StepperPattern6 = { name: 'Progress bar indicator', ...pattern(6) };
export const StepperPattern7 = { name: 'Icons and badges', ...pattern(7) };
export const StepperPattern8 = { name: 'Descriptions', ...pattern(8) };
export const StepperPattern9 = { name: 'Inline titles', ...pattern(9) };
export const StepperPattern10 = { name: 'Content for each step', ...pattern(10) };
export const StepperPattern11 = { name: 'Progress bar and titles', ...pattern(11) };
export const StepperPattern12 = { name: 'Segmented progress bar', ...pattern(12) };
export const StepperPattern13 = { name: 'Vertical with descriptions', ...pattern(13) };
export const StepperPattern14 = { name: 'Vertical orientation', ...pattern(14) };
export const StepperPattern15 = { name: 'Vertical with titles', ...pattern(15) };
