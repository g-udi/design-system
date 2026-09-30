import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'sonner',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sonner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sonner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Toast', tags: ['autodocs'], ...catalogueMeta('sonner') };

export const SonnerPattern1 = { name: 'Basic toast', ...pattern(1) };
export const SonnerPattern2 = { name: 'With description', ...pattern(2) };
export const SonnerPattern3 = { name: 'Positions', ...pattern(3) };
export const SonnerPattern4 = { name: 'Variants with colored icons', ...pattern(4) };
export const SonnerPattern5 = { name: 'Duration options', ...pattern(5) };
export const SonnerPattern6 = { name: 'Action button', ...pattern(6) };
export const SonnerPattern7 = { name: 'Promise with loading state', ...pattern(7) };
export const SonnerPattern8 = { name: 'Custom close and cancel buttons', ...pattern(8) };
export const SonnerPattern9 = { name: 'Custom rich content', ...pattern(9) };
export const SonnerPattern10 = { name: 'Upload progress', ...pattern(10) };
export const SonnerPattern11 = { name: 'Status alert markup', ...pattern(11) };
export const SonnerPattern12 = { name: 'Accent border', ...pattern(12) };
export const SonnerPattern13 = { name: 'Inverted success', ...pattern(13) };
export const SonnerPattern14 = { name: 'Inverted error with details', ...pattern(14) };
export const SonnerPattern15 = { name: 'Inverted info with avatar', ...pattern(15) };
export const SonnerPattern16 = { name: 'Inverted warning with countdown', ...pattern(16) };
export const SonnerPattern17 = { name: 'Inverted multi-action with avatar group', ...pattern(17) };
export const SonnerPattern18 = { name: 'Close button on top-right', ...pattern(18) };
export const SonnerPattern19 = { name: 'Custom icon', ...pattern(19) };
export const SonnerPattern20 = { name: 'Integration toast', ...pattern(20) };
export const SonnerPattern21 = { name: 'Updatable toast with ID', ...pattern(21) };
