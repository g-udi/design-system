import { AgentRunExample, StepsMessageExample } from './fixtures/ReasoningExamples.jsx';
import ReasoningExamplesSource from './fixtures/ReasoningExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

/*
 * Combined examples for the reasoning and agent-run parts. They extend the ChatReasoning page and are
 * listed in the ChatTool and MessageList docs, since the run also shows a tool approval and checkpoints.
 */

export default {
  title: 'Chat/ChatReasoning',
  id: 'chat-chatreasoning',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

// One step every PACE ms keeps the run readable in the docs and quick in the interaction tests.

// A stand-in cover image, inline so the example never waits on the network.

/** Thinks through four steps, asks before publishing, and keeps a checkpoint to roll back to. */

export const AgentRun = {
  name: 'Agent run',
  parameters: {
    docs: {
      description: {
        story:
          'A whole agent run in one reply. The reasoning trail shimmers “Thinking…” while a chain of thought searches (result chips), reads (an image thumbnail), analyses and decides, then folds into “Thought for Ns”. Publishing needs the person: ChatMessageToolApproval (Chat/ChatTool) shows what will run, with Approve, Deny and “always allow”, then approved and executed with the result. ChatMessageCheckpoint (Chat/ChatMessageList) marks restore points; restoring asks first in an alert dialog and replays the run. Accessibility: every step is a disclosure whose status is spoken after its label; after a decision focus moves to the outcome, which is a status message; the checkpoint’s restore button is described by its label and time.'
      },
      source: { language: 'jsx', code: publicSource(ReasoningExamplesSource, new URL('./fixtures/ReasoningExamples.jsx', import.meta.url)) + '\n<AgentRunExample />' }
    }
  },
  render: () => <AgentRunExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await step('reasoning shimmers while it streams, then folds into its duration', async () => {
      await expect(canvas.getByRole('button', { name: 'Thinking…' })).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(canvas.getByRole('button', { name: /^Thought for \d+s$/ })).toHaveAttribute('aria-expanded', 'false'), { timeout: 10000 });
    });

    await step('approving runs the tool and shows its result', async () => {
      const approval = await canvas.findByRole('group', { name: 'Allow publish_note?' });
      await userEvent.click(within(approval).getByRole('button', { name: 'Approve' }));
      await waitFor(() => expect(within(approval).getByRole('status')).toHaveTextContent(/Approved/));
      await waitFor(() => expect(canvas.getByText(/Published the follow-up note/)).toBeVisible(), { timeout: 5000 });
      await expect(canvas.getByText('Follow-up published')).toBeVisible();
    });

    await step('restoring the checkpoint asks first, then replays the run', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Restore checkpoint' }));
      const dialog = await page.findByRole('alertdialog', { name: 'Restore this checkpoint?' });
      await userEvent.click(within(dialog).getByRole('button', { name: 'Restore' }));
      await waitFor(() => expect(canvas.queryByText(/Published the follow-up note/)).toBeNull());
      await expect(canvas.getByText(/Restored “Before the agent run”/)).toBeVisible();
      // The dialog hides the page from assistive technology until it has fully closed.
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Thinking…' })).toBeVisible());
    });

    await step('denying leaves the note as a draft', async () => {
      const approval = await canvas.findByRole('group', { name: 'Allow publish_note?' }, { timeout: 10000 });
      await userEvent.click(within(approval).getByRole('button', { name: 'Deny' }));
      await waitFor(() => expect(within(approval).getByText(/Denied\. Nothing was run\./)).toBeVisible());
      await expect(canvas.getByText(/the note stays a draft/)).toBeVisible();
    });
  }
};

/** A finished answer that shows its work, then a second turn still in progress. */

export const AiMessageWithSteps = {
  name: 'AI message with steps',
  parameters: {
    docs: {
      description: {
        story:
          'An assistant message that shows its work as a step list above the answer: each step has an icon for its kind, a status (done, in progress or pending), short details that open from the step, and the final answer below. The second turn is still running, so its trail shimmers and the step in progress starts open. It is ChatMessageReasoning with `variant="steps"` and detailed MessageReasoningSteps, not a separate component. Accessibility: steps are disclosure buttons; their status is spoken after the label and also shown by the icon on the right, never by colour alone.'
      },
      source: { language: 'jsx', code: publicSource(ReasoningExamplesSource, new URL('./fixtures/ReasoningExamples.jsx', import.meta.url)) + '\n<StepsMessageExample />' }
    }
  },
  render: () => <StepsMessageExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const read = canvas.getByRole('button', { name: /Read 3 sources/ });
    await expect(read).toHaveAccessibleName(/, Done$/);
    await expect(read).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(read);
    await waitFor(() => expect(canvas.getByText(/Analytics for the last 90 days/)).toBeVisible());
    await expect(canvas.getByRole('img', { name: /Reading-time chart/ })).toBeVisible();
    await userEvent.click(read);
    await waitFor(() => expect(read).toHaveAttribute('aria-expanded', 'false'));
    // The step in progress starts open and says so.
    await expect(canvas.getByRole('button', { name: /Drafting the new section…/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: /Drafting the new section…/ })).toHaveAccessibleName(/In progress$/);
  }
};
