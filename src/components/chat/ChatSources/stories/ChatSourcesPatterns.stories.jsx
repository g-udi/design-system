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

export const LinkedAnswer = {
  name: 'Answer linked to evidence',
  ...pattern('linked-answer', 'Trace each claim to its source. Hover or focus a citation to highlight related passages; open it to inspect the prepared quote, copy it, or follow the source link.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    const citation = canvas.getAllByRole('button', { name: 'Source 1: What readers asked for in the September issue' })[0];
    await userEvent.click(citation);
    const preview = canvas.getByRole('region', { name: 'Source passage' });
    await expect(preview).toHaveTextContent('the practical example before the background');
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await waitFor(() => expect(canvas.queryByRole('region', { name: 'Source passage' })).not.toBeInTheDocument());
    await expect(canvas.getByRole('radio', { name: 'Source 1: What readers asked for in the September issue' })).toHaveFocus();
  }
};
