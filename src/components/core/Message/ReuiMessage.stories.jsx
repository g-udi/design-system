// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'message',
  import.meta.glob('../../../../.storybook/fixtures/reui/message/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/message/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Message', tags: ['autodocs'], ...catalogueMeta('message') };

export const ReuiMessage1 = { name: 'Two-sided conversation', ...pattern(1, 'Incoming and outgoing rows separated by nothing but the align prop.') };
export const ReuiMessage2 = { name: 'Avatars on both sides', ...pattern(2, 'Bottom-anchored avatars that flip with the row, plus a presence dot.') };
export const ReuiMessage3 = { name: 'Sender name and delivery status', ...pattern(3, 'Header for identity, footer for status, and how each one picks its side.') };
export const ReuiMessage4 = { name: 'Reply actions in the footer', ...pattern(4, 'Copy, regenerate and rating controls under an unframed assistant reply.') };
export const ReuiMessage5 = { name: 'Files shared in a thread', ...pattern(5, 'Image and document attachments stacked with the bubble in one message.') };
export const ReuiMessage6 = { name: 'Consecutive messages from one sender', ...pattern(6, 'A run of three messages under a single avatar, using MessageGroup.') };
export const ReuiMessage7 = { name: 'Streaming reply with a pending state', ...pattern(7, 'One assistant row moving from thinking, to typing, to settled.') };
