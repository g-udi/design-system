import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'ai-message',
  import.meta.glob('../../../../.storybook/fixtures/patterns/ai-message/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/ai-message/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Messaging/Message', id: 'core-message', tags: ['autodocs'], ...catalogueMeta('ai-message') };

export const AiMessagePattern1 = {
  name: 'Assistant reply: Drafting a post',
  ...pattern(1, 'A streamed markdown reply: the thinking trail folds away when the answer lands, the open code fence keeps streaming in CodeBlock, and the feedback bar appears once it finishes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible(), { timeout: 8000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Good reply' }));
    await expect(canvas.getByRole('button', { name: 'Good reply' })).toHaveAttribute('aria-pressed', 'true');
  }
};
export const AiMessagePattern2 = {
  name: 'Assistant reply: Research with citations',
  ...pattern(2, 'Numbered citations open a popover with the source; the sources list under the reply uses the same numbers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /3 sources/ }));
    await waitFor(() => expect(canvas.getByRole('link', { name: /Where readers leave an article/ })).toBeVisible());
  }
};
export const AiMessagePattern3 = {
  name: 'Assistant reply: Running tools',
  ...pattern(3, 'Tool calls with queued, running, done and failed states, nested calls, structured output as data or JSON, and a retry on the failed call.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = await canvas.findByRole('button', { name: 'Retry' });
    await userEvent.click(retry);
    await waitFor(() => expect(canvas.getByText(/Scheduled for/)).toBeVisible(), { timeout: 4000 });
  }
};
export const AiMessagePattern4 = {
  name: 'Assistant reply: Handing work to another agent',
  ...pattern(4, 'A delegation card shows who took the work, the brief and its own tool calls; step through to see it finish.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Next step/ }));
    await userEvent.click(canvas.getByRole('button', { name: /Next step/ }));
    await waitFor(() => expect(canvas.getByText(/found/)).toBeVisible());
  }
};
export const AiMessagePattern5 = { name: 'Assistant reply: Delivered files and data', ...pattern(5, 'Structured values read as a list with a JSON view, and delivered files offer preview and download.') };
export const AiMessagePattern6 = {
  name: 'Assistant reply: Error, retry and suggestions',
  ...pattern(6, 'A failed turn explains what happened and retries; the answer ends with follow-up prompts.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Write a subtitle for it' }));
    await waitFor(() => expect(canvas.getAllByText('Write a subtitle for it').length).toBeGreaterThan(1));
  }
};
