import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { AgentMark } from '../AgentMark/index.js';
import { Bubble, BubbleContent } from '../Bubble/index.js';
import { Message, MessageContent, MessageHeader } from '../Message/index.js';
import { MessageCheckpoint, MessageMarkdown } from '../MessageList/index.js';
import { MessageData, MessageToolApproval } from '../ChatTool/index.js';
import { MessageReasoning, MessageReasoningImage, MessageReasoningResults, MessageReasoningStep } from './index.js';

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
const PACE = 700;

// A stand-in cover image, inline so the example never waits on the network.
const cover = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1e3a5f'/><stop offset='1' stop-color='#f59e0b'/></linearGradient></defs><rect width='320' height='180' fill='url(#g)'/><rect x='40' y='40' width='240' height='100' rx='4' fill='none' stroke='#fff' stroke-opacity='.6' stroke-width='3'/><line x1='160' y1='40' x2='160' y2='140' stroke='#fff' stroke-opacity='.6' stroke-width='3'/></svg>")}`;

const results = [
  { title: 'Local-first drafts', url: 'https://example.com/posts/local-first-drafts', site: 'The blog' },
  { title: 'Comments on “Local-first drafts”', url: 'https://example.com/posts/local-first-drafts#comments', site: 'The blog' },
  { title: 'Thread: drafts that survive the train', url: 'https://news.example.org/item/4182', site: 'news.example.org' },
  { title: 'Sync conflicts in CRDT editors', url: 'https://docs.example.dev/crdt/conflicts', site: 'docs.example.dev' }
];

const runSteps = [
  { id: 'search', icon: 'Search', running: 'Searching the web…', done: 'Searched the web', meta: '4 results' },
  { id: 'read', icon: 'BookOpen', running: 'Reading 3 sources…', done: 'Read 3 sources' },
  { id: 'analyse', icon: 'ChartLine', running: 'Comparing reader replies…', done: 'Compared 38 reader replies', description: '29 liked it, 6 asked for an example repo, 3 hit a sync bug.' },
  { id: 'decide', icon: 'Lightbulb', running: 'Deciding what to publish…', done: 'Drafted a follow-up note' }
];

const statusAt = (index, progress) => (index < progress ? 'done' : index === progress ? 'running' : 'pending');

function StepDetails({ id }) {
  if (id === 'search') return <MessageReasoningResults results={results} />;
  if (id === 'read') {
    return (
      <>
        <p className='m-0'>The post, its comments and the discussion thread. The cover is reused for the social card.</p>
        <MessageReasoningImage src={cover} alt='The post cover: a train window at dusk' caption='Cover of “Local-first drafts”' />
      </>
    );
  }
  if (id === 'decide') return <p className='m-0'>A short note that links an example repo and explains the sync fix.</p>;
  return null;
}

function UserTurn({ children }) {
  return (
    <Message align='end'>
      <MessageContent>
        <span className='sr-only'>You said</span>
        <Bubble align='end'><BubbleContent>{children}</BubbleContent></Bubble>
      </MessageContent>
    </Message>
  );
}

function AssistantTurn({ children }) {
  return (
    <Message>
      <AgentMark size='sm' decorative className='mt-0.5' />
      <MessageContent className='min-w-0 flex-1'>
        <MessageHeader className='px-0'>Gaudi</MessageHeader>
        {children}
      </MessageContent>
    </Message>
  );
}

/** Thinks through four steps, asks before publishing, and keeps a checkpoint to roll back to. */
function AgentRunExample() {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const [approval, setApproval] = useState('requested');
  const [restored, setRestored] = useState(false);
  const thinking = progress < runSteps.length;

  useEffect(() => {
    if (!thinking) return undefined;
    const timer = setTimeout(() => setProgress((value) => value + 1), PACE);
    return () => clearTimeout(timer);
  }, [thinking, progress, run]);

  useEffect(() => {
    if (approval !== 'approved') return undefined;
    const timer = setTimeout(() => setApproval('executed'), PACE);
    return () => clearTimeout(timer);
  }, [approval]);

  const restore = () => {
    setProgress(0);
    setApproval('requested');
    setRestored(true);
    setRun((value) => value + 1);
  };

  return (
    <div className='grid w-full max-w-2xl gap-5'>
      <UserTurn>Find what readers said about “Local-first drafts” and publish a short follow-up note.</UserTurn>
      <MessageCheckpoint label='Before the agent run' time='10:42' onRestore={restore} />
      {restored ? <p role='status' className='text-text-muted m-0 text-center text-xs'>Restored “Before the agent run”. Running again.</p> : null}
      <AssistantTurn key={run}>
        <MessageReasoning variant='steps' streaming={thinking} autoCloseDelay={PACE}>
          {runSteps.map((step, index) => {
            const status = statusAt(index, progress);
            return (
              <MessageReasoningStep key={step.id} status={status} icon={step.icon} label={status === 'done' ? step.done : step.running} meta={status === 'done' ? step.meta : undefined} description={status === 'done' ? step.description : undefined}>
                {status === 'pending' ? null : <StepDetails id={step.id} />}
              </MessageReasoningStep>
            );
          })}
        </MessageReasoning>
        {thinking ? null : (
          <>
            <MessageToolApproval
              name='publish_note'
              description='Publish a follow-up note on the blog and email subscribers.'
              input={{ post: 'local-first-drafts', title: 'Follow-up: an example repo and the sync fix', notify: '4,180 subscribers' }}
              allowAlways
              state={approval}
              onStateChange={setApproval}
            >
              <MessageData label='Result' value={{ url: '/notes/local-first-follow-up', published: '10:44', emailed: 4180 }} />
            </MessageToolApproval>
            {approval === 'executed' ? <MessageMarkdown>Published the follow-up note and emailed **4,180 subscribers**. It links the example repo six readers asked for and explains the sync fix.</MessageMarkdown> : null}
            {approval === 'denied' ? <MessageMarkdown>Okay, the note stays a draft. Say the word when you want it published.</MessageMarkdown> : null}
          </>
        )}
      </AssistantTurn>
      {approval === 'executed' ? <MessageCheckpoint label='Follow-up published' time='10:44' /> : null}
    </div>
  );
}

export const AgentRun = {
  name: 'Agent run',
  parameters: {
    docs: {
      description: {
        story:
          'A whole agent run in one reply. The reasoning trail shimmers “Thinking…” while a chain of thought searches (result chips), reads (an image thumbnail), analyses and decides, then folds into “Thought for Ns”. Publishing needs the person: MessageToolApproval (Chat/ChatTool) shows what will run, with Approve, Deny and “always allow”, then approved and executed with the result. MessageCheckpoint (Chat/MessageList) marks restore points; restoring asks first in an alert dialog and replays the run. Accessibility: every step is a disclosure whose status is spoken after its label; after a decision focus moves to the outcome, which is a status message; the checkpoint’s restore button is described by its label and time.'
      },
      source: {
        language: 'jsx',
        code: `import { MessageCheckpoint, MessageData, MessageReasoning, MessageReasoningResults, MessageReasoningStep, MessageToolApproval } from '@gaudi/design-system/chat';

<MessageCheckpoint label='Before the agent run' time='10:42' onRestore={restore} />

<MessageReasoning variant='steps' streaming={thinking}>
  <MessageReasoningStep status='done' icon='Search' label='Searched the web' meta='4 results'>
    <MessageReasoningResults results={results} />
  </MessageReasoningStep>
  <MessageReasoningStep status='running' icon='BookOpen' label='Reading 3 sources…' />
  <MessageReasoningStep status='pending' icon='Lightbulb' label='Deciding what to publish…' />
</MessageReasoning>

<MessageToolApproval
  name='publish_note'
  description='Publish a follow-up note on the blog and email subscribers.'
  input={{ post: 'local-first-drafts', notify: '4,180 subscribers' }}
  allowAlways
  state={approval}
  onStateChange={setApproval}
>
  <MessageData label='Result' value={result} />
</MessageToolApproval>`
      }
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
function StepsMessageExample() {
  return (
    <div className='grid w-full max-w-2xl gap-5'>
      <UserTurn>Which of my posts should I update first?</UserTurn>
      <AssistantTurn>
        <MessageReasoning variant='steps' label='Worked through 4 steps'>
          <MessageReasoningStep status='done' icon='Search' label='Searched your archive' meta='42 posts'>
            <MessageReasoningResults max={3} results={[...results.slice(0, 1), { title: 'Writing on the train', url: 'https://example.com/posts/writing-on-the-train', site: 'The blog' }, { title: 'A year of drafts', url: 'https://example.com/posts/a-year-of-drafts', site: 'The blog' }, { title: 'Offline first', url: 'https://example.com/posts/offline-first', site: 'The blog' }]} />
          </MessageReasoningStep>
          <MessageReasoningStep status='done' icon='BookOpen' label='Read 3 sources' meta='2 min'>
            <p className='m-0'>Analytics for the last 90 days, the comment threads, and the newsletter replies.</p>
            <MessageReasoningImage src={cover} alt='Reading-time chart: Local-first drafts holds readers longest' caption='Reading time, last 90 days' />
          </MessageReasoningStep>
          <MessageReasoningStep status='done' icon='ChartLine' label='Analysed traffic and replies' description='Local-first drafts gets the most search traffic and the most open questions.' />
          <MessageReasoningStep status='done' icon='SquarePen' label='Wrote the answer' />
        </MessageReasoning>
        <MessageMarkdown>{'Update **Local-first drafts** first. It brings in the most search traffic, and six readers asked for an example repo. Add the repo link and a short section on the sync fix.'}</MessageMarkdown>
      </AssistantTurn>
      <UserTurn>Draft the update.</UserTurn>
      <AssistantTurn>
        <MessageReasoning variant='steps' streaming>
          <MessageReasoningStep status='done' icon='BookOpen' label='Read the post' meta='1,840 words' />
          <MessageReasoningStep status='running' icon='SquarePen' label='Drafting the new section…'>
            <p className='m-0'>The sync fix, in three short paragraphs, after “Where drafts live”.</p>
          </MessageReasoningStep>
          <MessageReasoningStep status='pending' icon='Check' label='Check links and headings' />
        </MessageReasoning>
      </AssistantTurn>
    </div>
  );
}

export const AiMessageWithSteps = {
  name: 'AI message with steps',
  parameters: {
    docs: {
      description: {
        story:
          'An assistant message that shows its work as a step list above the answer: each step has an icon for its kind, a status (done, in progress or pending), short details that open from the step, and the final answer below. The second turn is still running, so its trail shimmers and the step in progress starts open. It is MessageReasoning with `variant="steps"` and detailed MessageReasoningSteps, not a separate component. Accessibility: steps are disclosure buttons; their status is spoken after the label and also shown by the icon on the right, never by colour alone.'
      },
      source: {
        language: 'jsx',
        code: `import { MessageMarkdown, MessageReasoning, MessageReasoningImage, MessageReasoningResults, MessageReasoningStep } from '@gaudi/design-system/chat';

<MessageReasoning variant='steps' label='Worked through 4 steps'>
  <MessageReasoningStep status='done' icon='Search' label='Searched your archive' meta='42 posts'>
    <MessageReasoningResults max={3} results={posts} />
  </MessageReasoningStep>
  <MessageReasoningStep status='done' icon='BookOpen' label='Read 3 sources' meta='2 min'>
    <MessageReasoningImage src={chart} alt='Reading-time chart' caption='Reading time, last 90 days' />
  </MessageReasoningStep>
  <MessageReasoningStep status='done' icon='ChartLine' label='Analysed traffic and replies' description='…' />
  <MessageReasoningStep status='done' icon='SquarePen' label='Wrote the answer' />
</MessageReasoning>
<MessageMarkdown>{answer}</MessageMarkdown>`
      }
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
