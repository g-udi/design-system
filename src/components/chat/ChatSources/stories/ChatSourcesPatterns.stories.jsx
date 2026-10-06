import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-sources', import.meta.url,
  import.meta.glob('./fixtures/chat-sources/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-sources/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatSources', id: 'chat-chatsources', tags: ['autodocs'], ...catalogueMeta('chat-sources') };

export const ResearchCitations = {
  name: 'Research with citations',
  ...pattern('research-citations', 'Numbered citations open a popover with the source; the sources list under the reply uses the same numbers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /3 sources/ }));
    await waitFor(() => expect(canvas.getByRole('link', { name: /Where readers leave an article/ })).toBeVisible());
  }
};
