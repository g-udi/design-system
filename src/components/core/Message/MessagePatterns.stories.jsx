import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'message',
  import.meta.glob('../../../../.storybook/fixtures/patterns/message/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/message/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Message', tags: ['autodocs'], ...catalogueMeta('message') };

export const MessagePattern1 = { name: 'Two-sided conversation', ...pattern(1, 'Incoming and outgoing rows separated by nothing but the align prop.') };
export const MessagePattern2 = { name: 'Avatars on both sides', ...pattern(2, 'Bottom-anchored avatars that flip with the row, plus a presence dot.') };
export const MessagePattern3 = { name: 'Sender name and delivery status', ...pattern(3, 'Header for identity, footer for status, and how each one picks its side.') };
export const MessagePattern4 = { name: 'Reply actions in the footer', ...pattern(4, 'Copy, regenerate and rating controls under an unframed assistant reply.') };
export const MessagePattern5 = { name: 'Files shared in a thread', ...pattern(5, 'Image and document attachments stacked with the bubble in one message.') };
export const MessagePattern6 = { name: 'Consecutive messages from one sender', ...pattern(6, 'A run of three messages under a single avatar, using MessageGroup.') };
export const MessagePattern7 = { name: 'Streaming reply with a pending state', ...pattern(7, 'One assistant row moving from thinking, to typing, to settled.') };
