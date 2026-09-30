import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'message',
  import.meta.glob('../../../../.storybook/fixtures/patterns/message/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/message/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Message', tags: ['autodocs'], ...catalogueMeta('message') };

export const MessagePattern2 = { name: 'Team conversation', ...pattern(2, 'align picks the side, avatars flip with the row and show presence, a MessageGroup runs messages under one avatar, headers carry name and time, footers carry read and edited status, and files stack with the bubble.') };
export const MessagePattern7 = { name: 'Assistant reply', ...pattern(7, 'An unframed reply moving from thinking, to typing, to settled, with copy, regenerate and rating controls in the footer.') };
