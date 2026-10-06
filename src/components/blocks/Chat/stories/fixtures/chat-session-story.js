import chatSessionsSource from './ChatSessionsDemo.jsx?raw';
import chatModelsSource from '../../../../chat/ChatInput/stories/fixtures/chatModels.js?raw';
import { publicSource } from '../../../../../docs/components/PatternStoryHelpers.jsx';
import { previewSource } from '../../../../../docs/components/previewSource.js';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

export const sessionParameters = {
  docs: {
    description: { story: 'A complete chat with a persistent header, session history, conversation and composer. The compact panel opens history below its header; the page layout keeps history beside the conversation and uses the existing navigation Sheet on phones. Search, select, rename, delete and new chat all work with local demo data. Each session keeps its own messages and draft. History focuses its search on user-open, returns focus on close, and supports Escape. The model picker configures the demo composer; no model request is made.' },
    source: { type: 'dynamic', language: 'jsx', transform: (_source, { args }) => previewSource('ChatSessionsDemo', args, { imports: [
        publicSource(chatModelsSource, new URL('../../../../chat/ChatInput/stories/fixtures/chatModels.js', import.meta.url)),
        publicSource(chatSessionsSource.replace(/^import .*chatModels\.js';\n/m, ''), new URL('./ChatSessionsDemo.jsx', import.meta.url))
      ].join('\n\n') }) }
  }
};

export async function exerciseSessions({ args, canvasElement }) {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  const isPanel = args.variant !== 'page';
  const openHistory = async () => {
    const opener = canvas.queryByRole('button', { name: 'Chat history', exact: true });
    if (opener) await userEvent.click(opener);
    const container = isPanel
      ? canvas.getByRole('region', { name: 'Chat history', exact: true })
      : opener ? await body.findByRole('dialog', { name: 'Chat history', exact: true }) : canvas.getByRole('navigation', { name: 'Chat history', exact: true });
    const history = within(container);
    const search = history.queryByRole('searchbox');
    if (search) await userEvent.clear(search);
    return history;
  };
  await expect(canvas.getByRole('heading', { name: 'Local-first drafts post' })).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Model: GPT-4o', exact: true })).toBeVisible();
  await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Keep this draft');
  let history = await openHistory();
  if (isPanel) {
    const focusTarget = history.queryByRole('searchbox') || canvas.getByRole('region', { name: 'Chat history', exact: true });
    await fireEvent.keyDown(focusTarget, { key: 'Escape', isComposing: true });
    await expect(canvas.getByRole('button', { name: 'Back to conversation' })).toHaveAttribute('aria-expanded', 'true');
  }
  if (args.searchable) {
    await userEvent.type(history.getByRole('searchbox'), 'rss');
    await expect(history.queryByRole('button', { name: /Tag cleanup/ })).not.toBeInTheDocument();
  }
  await userEvent.click(history.getByRole('button', { name: 'Chat options: Fix the RSS feed dates' }));
  await userEvent.click(await body.findByRole('menuitem', { name: 'Rename', exact: true }));
  const cancelRename = within(await body.findByRole('dialog', { name: 'Rename chat' }));
  await userEvent.click(cancelRename.getByRole('button', { name: 'Cancel' }));
  await waitFor(() => expect(history.getByRole('button', { name: 'Chat options: Fix the RSS feed dates' })).toHaveFocus());
  await userEvent.click(history.getByRole('button', { name: 'Chat options: Fix the RSS feed dates' }));
  await userEvent.click(await body.findByRole('menuitem', { name: 'Rename', exact: true }));
  const rename = within(await body.findByRole('dialog', { name: 'Rename chat' }));
  await userEvent.clear(rename.getByRole('textbox', { name: 'Name' }));
  await userEvent.type(rename.getByRole('textbox', { name: 'Name' }), 'RSS timezone review');
  await userEvent.click(rename.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(body.queryByRole('dialog', { name: 'Rename chat' })).not.toBeInTheDocument());
  await waitFor(() => expect(history.getByRole('button', { name: 'Chat options: RSS timezone review' })).toHaveFocus());
  await userEvent.click(history.getByRole('button', { name: /^RSS timezone review/ }));
  await expect(canvas.getByRole('heading', { name: 'RSS timezone review' })).toBeVisible();
  await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Message' })).toBeVisible());
  await expect(canvas.getByRole('combobox', { name: 'Message' })).toHaveValue('');
  await waitFor(() => expect(canvas.getByText('Why are the feed dates a day early?')).toBeVisible());
  await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Check the offset.{Enter}');
  await waitFor(() => expect(within(canvasElement.querySelector('[data-slot="message-scroller-viewport"]')).getByText('Check the offset.')).toBeVisible());

  history = await openHistory();
  await userEvent.click(history.getByRole('button', { name: /^Local-first drafts post/ }));
  await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Message' })).toHaveValue('Keep this draft'));
  await expect(within(canvasElement.querySelector('[data-slot="message-scroller-viewport"]')).queryByText('Check the offset.')).not.toBeInTheDocument();

  history = await openHistory();
  await userEvent.click(history.getByRole('button', { name: 'Chat options: RSS timezone review' }));
  await userEvent.click(await body.findByRole('menuitem', { name: 'Delete', exact: true }));
  const cancelDelete = within(await body.findByRole('alertdialog', { name: 'Delete this chat?' }));
  await userEvent.click(cancelDelete.getByRole('button', { name: 'Cancel', exact: true }));
  await waitFor(() => expect(history.getByRole('button', { name: 'Chat options: RSS timezone review' })).toHaveFocus());
  await userEvent.click(history.getByRole('button', { name: 'Chat options: RSS timezone review' }));
  await userEvent.click(await body.findByRole('menuitem', { name: 'Delete', exact: true }));
  const confirmation = within(await body.findByRole('alertdialog', { name: 'Delete this chat?' }));
  await userEvent.click(confirmation.getByRole('button', { name: 'Delete', exact: true }));
  await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
  await expect(history.queryByRole('button', { name: /^RSS timezone review/ })).not.toBeInTheDocument();
  if (args.searchable) await waitFor(() => expect(history.getByRole('searchbox')).toHaveFocus());
  else await waitFor(() => expect(history.getByRole('button', { name: /^Local-first drafts post/ })).toHaveFocus());
  await userEvent.click(history.getByRole('button', { name: 'New chat', exact: true }));
  await waitFor(() => expect(body.queryByRole('dialog', { name: 'Chat history', exact: true })).not.toBeInTheDocument());
  await expect(canvas.getByRole('heading', { name: 'What are we writing today?' })).toBeVisible();
  await expect(canvas.getByRole('combobox', { name: 'Message' })).toHaveValue('');
  await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Draft a welcome email.{Enter}');
  await expect(canvas.getByRole('heading', { name: 'Draft a welcome email.' })).toBeVisible();
  await openHistory();
  if (isPanel) {
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Chat history', exact: true })).toHaveFocus();
  } else if (body.queryByRole('dialog', { name: 'Chat history', exact: true })) {
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Chat history', exact: true })).toHaveFocus());
  }
}
