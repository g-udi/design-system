// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'stepper',
  import.meta.glob('../../../../.storybook/fixtures/reui/stepper/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/stepper/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Stepper', tags: ['autodocs'], ...catalogueMeta('stepper') };

export const ReuiStepper1 = { name: 'Basic stepper', ...pattern(1), play: catalogueInteractions['stepper-1'] };
export const ReuiStepper2 = { name: 'Completed state', ...pattern(2) };
export const ReuiStepper3 = { name: 'Loading state', ...pattern(3) };
export const ReuiStepper4 = { name: 'Controlled', ...pattern(4) };
export const ReuiStepper5 = { name: 'Title and indicator', ...pattern(5) };
export const ReuiStepper6 = { name: 'Progress bar indicator', ...pattern(6) };
export const ReuiStepper7 = { name: 'Icons and badges', ...pattern(7) };
export const ReuiStepper8 = { name: 'Descriptions', ...pattern(8) };
export const ReuiStepper9 = { name: 'Inline titles', ...pattern(9) };
export const ReuiStepper10 = { name: 'Content for each step', ...pattern(10) };
export const ReuiStepper11 = { name: 'Progress bar and titles', ...pattern(11) };
export const ReuiStepper12 = { name: 'Segmented progress bar', ...pattern(12) };
export const ReuiStepper13 = { name: 'Vertical with descriptions', ...pattern(13) };
export const ReuiStepper14 = { name: 'Vertical orientation', ...pattern(14) };
export const ReuiStepper15 = { name: 'Vertical with titles', ...pattern(15) };
