import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'prompt-composer',
  import.meta.glob('../../../../.storybook/fixtures/patterns/prompt-composer/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/prompt-composer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatInput', id: 'chat-chatinput', tags: ['autodocs'], ...catalogueMeta('prompt-composer') };

export const PromptComposerPattern1 = {
  name: 'Chat composer: Mentions, commands and attachments',
  ...pattern(1, 'Type @ for people, agents and folders or / at the start for commands; arrow keys pick, Enter or Tab inserts, Escape closes. Files sit in a tray above the prompt.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Ask @em');
    await waitFor(() => expect(canvas.getByRole('option', { name: /Emma Wilson/ })).toBeVisible());
    // The textarea keeps focus and points screen readers at the highlighted option.
    await expect(prompt).toHaveAttribute('aria-activedescendant', canvas.getByRole('option', { name: /Emma Wilson/ }).id);
    await userEvent.keyboard('{Enter}');
    await expect(prompt).toHaveValue('Ask @EmmaWilson ');
    await userEvent.type(prompt, 'to review it');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('@Emma Wilson')).toBeVisible());
  }
};
export const PromptComposerPattern2 = {
  name: 'Chat composer: Queue follow-ups while a reply streams',
  ...pattern(2, 'While Gaudi works, new messages wait in a queue you can edit, reorder with Alt+Arrow, send now or remove; Stop ends the current reply.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Add a closing line{Enter}');
    await waitFor(() => expect(canvas.getByText('Add a closing line')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: /^Remove: Suggest a title/ }));
    await expect(canvas.queryByText('Suggest a title that fits in 60 characters.')).not.toBeInTheDocument();
  }
};
export const PromptComposerPattern3 = {
  name: 'Chat composer: Model and effort',
  ...pattern(3, 'The toolbar holds a model picker, an effort level and a web search toggle beside attach and send.')
};
