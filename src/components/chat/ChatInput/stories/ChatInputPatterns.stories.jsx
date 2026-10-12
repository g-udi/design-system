import { actInteraction } from '../../../../../tests/support/actInteraction.js';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories, publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { chatModels, chatModelProviders } from './fixtures/chatModels.js';
import chatModelsSource from './fixtures/chatModels.js?raw';
import { Pattern as ModelEffortExample } from './fixtures/prompt-composer/prompt-composer-model-effort.jsx';
import modelEffortSource from './fixtures/prompt-composer/prompt-composer-model-effort.jsx?raw';

const pattern = patternStories(
  'prompt-composer', import.meta.url,
  import.meta.glob('./fixtures/prompt-composer/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/prompt-composer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatInput', id: 'chat-chatinput', tags: ['autodocs'], ...catalogueMeta('prompt-composer') };

export const MentionsAttachments = {
  name: 'Chat composer: Mentions, commands and attachments',
  ...pattern('mentions-attachments', 'Type @ for people, agents and folders or / at the start for commands; arrow keys pick, Enter or Tab inserts, Escape closes. Files sit in a tray above the prompt.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Ask @em');
    await waitFor(() => expect(body.getByRole('option', { name: /Ilse Valtonen/ })).toBeVisible());
    fireEvent.keyDown(prompt, { key: 'Escape', isComposing: true });
    await expect(body.getByRole('listbox', { name: 'Mentions' })).toBeVisible();
    // The textarea keeps focus and points screen readers at the highlighted option.
    await expect(prompt).toHaveAttribute('aria-activedescendant', body.getByRole('option', { name: /Ilse Valtonen/ }).id);
    await userEvent.keyboard('{Enter}');
    await expect(prompt).toHaveValue('Ask @IlseValtonen ');
    await userEvent.type(prompt, 'to review it');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('@Ilse Valtonen')).toBeVisible());
  }
};
export const QueuedFollowUps = {
  name: 'Chat composer: Queue follow-ups while a reply streams',
  ...pattern('queued-follow-ups', 'While Gaudi works, new messages wait in a queue you can edit, reorder with Alt+Arrow, send now or remove; Stop ends the current reply.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Add a closing line{Enter}');
    await waitFor(() => expect(canvas.getByText('Add a closing line')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Edit: Add a closing line' }));
    const editor = canvas.getByRole('textbox', { name: /Edit queued message/ });
    fireEvent.keyDown(editor, { key: 'Enter', isComposing: true });
    await expect(editor).toBeInTheDocument();
    fireEvent.keyDown(editor, { key: 'Escape', isComposing: true });
    await expect(editor).toBeInTheDocument();
    await actInteraction(() => userEvent.type(editor, ' in Japanese{Enter}'));
    await waitFor(() => expect(canvas.getByText('Add a closing line in Japanese')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: /^Remove: Suggest a title/ }));
    await expect(canvas.queryByText('Suggest a title that fits in 60 characters.')).not.toBeInTheDocument();
  }
};
export const ModelEffort = {
  name: 'Chat composer: Model and effort',
  render: () => <ModelEffortExample models={chatModels} providers={chatModelProviders} />,
  parameters: { docs: {
    description: { story: 'The shared searchable model selector, an effort level and a web search toggle beside attach and send. Model metadata is illustrative and supplied by the host.' },
    source: { language: 'jsx', code: [
      publicSource(chatModelsSource, new URL('./fixtures/chatModels.js', import.meta.url)),
      publicSource(modelEffortSource, new URL('./fixtures/prompt-composer/prompt-composer-model-effort.jsx', import.meta.url)),
      '<Pattern models={chatModels} providers={chatModelProviders} />'
    ].join('\n\n') }
  } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const model = canvas.getByRole('button', { name: 'Model: Claude Opus 5' });
    await userEvent.click(model);
    const search = await body.findByRole('combobox', { name: 'Search models' });
    await userEvent.type(search, 'Claude Sonnet 5');
    await userEvent.click(await body.findByRole('option', { name: /Claude Sonnet 5/ }));
    await waitFor(() => expect(model).toHaveAccessibleName('Model: Claude Sonnet 5'));
    await waitFor(() => expect(model).toHaveFocus());
    await userEvent.click(canvas.getByRole('radio', { name: 'High' }));
    const web = canvas.getByRole('button', { name: 'Search the web' });
    await userEvent.click(web);
    await expect(web).toHaveAttribute('aria-pressed', 'false');
    const prompt = canvas.getByRole('combobox', { name: 'Message' });
    await userEvent.type(prompt, 'Summarize the archive{Enter}');
    const submitted = await canvas.findByText(/^Sent: Summarize the archive/);
    await expect(submitted).toHaveAttribute('role', 'status');
    await expect(submitted).toHaveTextContent('Sent: Summarize the archive · Claude Sonnet 5 model, high effort');
    await expect(submitted).not.toHaveTextContent('web search on');
    await expect(prompt).toHaveValue('');
    await userEvent.click(web);
    await userEvent.click(canvas.getByRole('radio', { name: 'Low' }));
    await userEvent.type(prompt, 'Check sources{Enter}');
    await waitFor(() => expect(submitted).toHaveTextContent('Sent: Check sources · Claude Sonnet 5 model, low effort, web search on'));
  }
};
