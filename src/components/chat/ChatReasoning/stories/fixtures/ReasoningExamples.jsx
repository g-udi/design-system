import { useEffect, useState } from 'react';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageCheckpoint, ChatMessageMarkdown } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatMessageData, ChatMessageToolApproval } from '@gaudi/design-system/chat/ChatTool';
import { ChatMessageReasoning, ChatMessageReasoningImage, ChatMessageReasoningResults, ChatMessageReasoningStep } from '@gaudi/design-system/chat/ChatReasoning';

export const PACE = 700;

export const cover = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1e3a5f'/><stop offset='1' stop-color='#f59e0b'/></linearGradient></defs><rect width='320' height='180' fill='url(#g)'/><rect x='40' y='40' width='240' height='100' rx='4' fill='none' stroke='#fff' stroke-opacity='.6' stroke-width='3'/><line x1='160' y1='40' x2='160' y2='140' stroke='#fff' stroke-opacity='.6' stroke-width='3'/></svg>")}`;

export const results = [
  { title: 'Local-first drafts', url: 'https://example.com/posts/local-first-drafts', site: 'The blog' },
  { title: 'Comments on “Local-first drafts”', url: 'https://example.com/posts/local-first-drafts#comments', site: 'The blog' },
  { title: 'Thread: drafts that survive the train', url: 'https://news.example.org/item/4182', site: 'news.example.org' },
  { title: 'Sync conflicts in CRDT editors', url: 'https://docs.example.dev/crdt/conflicts', site: 'docs.example.dev' }
];

export const runSteps = [
  { id: 'search', icon: 'Search', running: 'Searching the web…', done: 'Searched the web', meta: '4 results' },
  { id: 'read', icon: 'BookOpen', running: 'Reading 3 sources…', done: 'Read 3 sources' },
  { id: 'analyse', icon: 'ChartLine', running: 'Comparing reader replies…', done: 'Compared 38 reader replies', description: '29 liked it, 6 asked for an example repo, 3 hit a sync bug.' },
  { id: 'decide', icon: 'Lightbulb', running: 'Deciding what to publish…', done: 'Drafted a follow-up note' }
];

export const statusAt = (index, progress) => (index < progress ? 'done' : index === progress ? 'running' : 'pending');

export function StepDetails({ id }) {
  if (id === 'search') return <ChatMessageReasoningResults results={results} />;
  if (id === 'read') {
    return (
      <>
        <p className='m-0'>The post, its comments and the discussion thread. The cover is reused for the social card.</p>
        <ChatMessageReasoningImage src={cover} alt='The post cover: a train window at dusk' caption='Cover of “Local-first drafts”' />
      </>
    );
  }
  if (id === 'decide') return <p className='m-0'>A short note that links an example repo and explains the sync fix.</p>;
  return null;
}

export function UserTurn({ children }) {
  return (
    <ChatMessage align='end'>
      <ChatMessageContent>
        <span className='sr-only'>You said</span>
        <ChatBubble align='end'><ChatBubbleContent>{children}</ChatBubbleContent></ChatBubble>
      </ChatMessageContent>
    </ChatMessage>
  );
}

export function AssistantTurn({ children }) {
  return (
    <ChatMessage>
      <ChatAgentMark icon='Gaudi' tone='neutral' size='sm' decorative className='mt-0.5' />
      <ChatMessageContent className='min-w-0 flex-1'>
        <ChatMessageHeader className='px-0'>Gaudi</ChatMessageHeader>
        {children}
      </ChatMessageContent>
    </ChatMessage>
  );
}

export function AgentRunExample() {
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
      <ChatMessageCheckpoint label='Before the agent run' time='10:42' onRestore={restore} />
      {restored ? <p role='status' className='text-text-muted m-0 text-center text-xs'>Restored “Before the agent run”. Running again.</p> : null}
      <AssistantTurn key={run}>
        <ChatMessageReasoning variant='steps' streaming={thinking} autoCloseDelay={PACE}>
          {runSteps.map((step, index) => {
            const status = statusAt(index, progress);
            return (
              <ChatMessageReasoningStep key={step.id} status={status} icon={step.icon} label={status === 'done' ? step.done : step.running} meta={status === 'done' ? step.meta : undefined} description={status === 'done' ? step.description : undefined}>
                {status === 'pending' ? null : <StepDetails id={step.id} />}
              </ChatMessageReasoningStep>
            );
          })}
        </ChatMessageReasoning>
        {thinking ? null : (
          <>
            <ChatMessageToolApproval
              name='publish_note'
              description='Publish a follow-up note on the blog and email subscribers.'
              input={{ post: 'local-first-drafts', title: 'Follow-up: an example repo and the sync fix', notify: '4,180 subscribers' }}
              allowAlways
              state={approval}
              onStateChange={setApproval}
            >
              <ChatMessageData label='Result' value={{ url: '/notes/local-first-follow-up', published: '10:44', emailed: 4180 }} />
            </ChatMessageToolApproval>
            {approval === 'executed' ? <ChatMessageMarkdown>Published the follow-up note and emailed **4,180 subscribers**. It links the example repo six readers asked for and explains the sync fix.</ChatMessageMarkdown> : null}
            {approval === 'denied' ? <ChatMessageMarkdown>Okay, the note stays a draft. Say the word when you want it published.</ChatMessageMarkdown> : null}
          </>
        )}
      </AssistantTurn>
      {approval === 'executed' ? <ChatMessageCheckpoint label='Follow-up published' time='10:44' /> : null}
    </div>
  );
}

export function StepsMessageExample() {
  return (
    <div className='grid w-full max-w-2xl gap-5'>
      <UserTurn>Which of my posts should I update first?</UserTurn>
      <AssistantTurn>
        <ChatMessageReasoning variant='steps' label='Worked through 4 steps'>
          <ChatMessageReasoningStep status='done' icon='Search' label='Searched your archive' meta='42 posts'>
            <ChatMessageReasoningResults max={3} results={[...results.slice(0, 1), { title: 'Writing on the train', url: 'https://example.com/posts/writing-on-the-train', site: 'The blog' }, { title: 'A year of drafts', url: 'https://example.com/posts/a-year-of-drafts', site: 'The blog' }, { title: 'Offline first', url: 'https://example.com/posts/offline-first', site: 'The blog' }]} />
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='done' icon='BookOpen' label='Read 3 sources' meta='2 min'>
            <p className='m-0'>Analytics for the last 90 days, the comment threads, and the newsletter replies.</p>
            <ChatMessageReasoningImage src={cover} alt='Reading-time chart: Local-first drafts holds readers longest' caption='Reading time, last 90 days' />
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='done' icon='ChartLine' label='Analysed traffic and replies' description='Local-first drafts gets the most search traffic and the most open questions.' />
          <ChatMessageReasoningStep status='done' icon='SquarePen' label='Wrote the answer' />
        </ChatMessageReasoning>
        <ChatMessageMarkdown>{'Update **Local-first drafts** first. It brings in the most search traffic, and six readers asked for an example repo. Add the repo link and a short section on the sync fix.'}</ChatMessageMarkdown>
      </AssistantTurn>
      <UserTurn>Draft the update.</UserTurn>
      <AssistantTurn>
        <ChatMessageReasoning variant='steps' streaming>
          <ChatMessageReasoningStep status='done' icon='BookOpen' label='Read the post' meta='1,840 words' />
          <ChatMessageReasoningStep status='running' icon='SquarePen' label='Drafting the new section…'>
            <p className='m-0'>The sync fix, in three short paragraphs, after “Where drafts live”.</p>
          </ChatMessageReasoningStep>
          <ChatMessageReasoningStep status='pending' icon='Check' label='Check links and headings' />
        </ChatMessageReasoning>
      </AssistantTurn>
    </div>
  );
}
