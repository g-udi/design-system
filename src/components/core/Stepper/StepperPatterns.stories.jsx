import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'stepper',
  import.meta.glob('../../../../.storybook/fixtures/patterns/stepper/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/stepper/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Stepper', id: 'core-stepper', tags: ['autodocs'], ...catalogueMeta('stepper') };

export const StepperPattern1 = { name: 'Basic stepper', ...pattern(1), play: catalogueInteractions['stepper-1'] };
export const StepperPattern8 = { name: 'Titles and descriptions', ...pattern(8, 'Labels centred under the indicator, start-aligned without a rail, or inline beside it, with optional descriptions.') };
export const StepperPattern7 = { name: 'Controlled with icons and badges', ...pattern(7, 'Previous and Next drive a controlled stepper; icon indicators turn to checks and a badge names each step status.') };
export const StepperPattern3 = { name: 'Loading state', ...pattern(3) };
export const StepperPattern12 = { name: 'Progress bar', ...pattern(12, 'A segmented bar with a step counter and Back and Next; switch on titles to label each segment.') };
export const StepperPattern13 = { name: 'Vertical orientation', ...pattern(13, 'Vertical steps with titles and optional descriptions.') };
