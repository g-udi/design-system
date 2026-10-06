import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlock } from '@gaudi/design-system/core/CodeBlock';
import { DialogRoot as Dialog, DialogClosePrimitive as DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@gaudi/design-system/core/Dialog';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatSessionList } from '@gaudi/design-system/chat/ChatSessionList';
import { ChatWorkspace } from '@gaudi/design-system/chat/ChatWorkspace';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts, ChatMessageScroller, ChatMessageScrollerButton, ChatMessageScrollerContent, ChatMessageScrollerItem, ChatMessageScrollerProvider, ChatMessageScrollerViewport } from '@gaudi/design-system/chat/ChatMessageList';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import { ChatShell } from '@gaudi/design-system/blocks/Chat';
import briefText from './newsletter-brief.md?raw';
import briefUrl from './newsletter-brief.md?url';
import transcriptText from './reader-interviews.txt?raw';
import transcriptUrl from './reader-interviews.txt?url';
import findingsText from './research-findings.md?raw';
import findingsUrl from './research-findings.md?url';
import draftText from './newsletter-opening.md?raw';
import draftUrl from './newsletter-opening.md?url';

const fileContent = { brief: briefText, transcript: transcriptText, findings: findingsText, draft: draftText };
const fileUrls = { brief: briefUrl, transcript: transcriptUrl, findings: findingsUrl, draft: draftUrl };

const file = (id, name, metadata) => ({
  name,
  typeLabel: 'MD',
  sizeLabel: `${new TextEncoder().encode(fileContent[id]).length} B`,
  modifiedLabel: 'Updated just now',
  downloadUrl: fileUrls[id],
  ...metadata
});

const files = {
  root: { name: 'Newsletter workspace', children: ['shared', 'uploads', 'researcher', 'writer'] },
  shared: { name: 'Shared', children: ['brief'] },
  brief: file('brief', 'newsletter-brief.md'),
  uploads: { name: 'Your uploads', children: ['transcript'] },
  transcript: file('transcript', 'reader-interviews.txt', { typeLabel: 'TXT' }),
  researcher: { name: 'Researcher', agent: { name: 'Researcher', seed: 'researcher' }, children: ['findings'] },
  findings: file('findings', 'research-findings.md', { meta: '3 interviews' }),
  writer: { name: 'Writer', agent: { name: 'Writer', seed: 'writer' }, children: ['draft'] },
  draft: file('draft', 'newsletter-opening.md')
};

const agents = [
  { id: 'researcher', name: 'Researcher', state: 'done', description: 'Found three recurring needs in the reader interviews.', fileRootId: 'researcher' },
  { id: 'writer', name: 'Writer', state: 'thinking', description: 'Turning the findings into a practical opening.', fileRootId: 'writer' }
];

const sessions = [
  { id: 'newsletter', title: 'A smaller first draft', preview: 'Research is ready to review', group: 'Today' },
  { id: 'welcome', title: 'Welcome email', preview: 'One clear next step', group: 'Yesterday' }
];

/** The host owns data, file previews and shared panel state; ChatShell owns responsive placement. */
export function ChatWorkspaceDemo() {
  const [activeId, setActiveId] = useState('newsletter');
  const [view, setView] = useState('files');
  const [agentId, setAgentId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const previewTrigger = useRef(null);
  const active = sessions.find((session) => session.id === activeId);
  const preview = files[previewId];

  const workspace = (
    <ChatWorkspace
      agents={agents}
      description='Reader research and the draft it informed.'
      view={view}
      onViewChange={setView}
      agentId={agentId}
      onAgentChange={setAgentId}
      fileExplorerProps={{
        items: files,
        defaultExpanded: ['shared', 'researcher', 'writer'],
        selectedId,
        onSelect: setSelectedId,
        onPreview: (id) => {
          previewTrigger.current = document.activeElement;
          setPreviewId(id);
        }
      }}
    />
  );

  return (
    <>
      <div className='h-150 w-full min-w-0'>
        <ChatMessageScrollerProvider key={activeId}>
          <ChatShell
            title={active.title}
            subtitle='Newsletter collaboration'
            navigation={<ChatSessionList sessions={sessions} activeId={activeId} onSelect={(id) => { setActiveId(id); setPrompts([]); }} />}
            details={workspace}
            labels={{ details: 'Workspace', openDetails: 'Open workspace' }}
            composer={<ChatPromptComposer onSubmit={(text) => setPrompts((previous) => [...previous, text])} labels={{ placeholder: 'Ask the team to refine the draft' }} />}
          >
            <ChatMessageScroller>
              <ChatMessageScrollerViewport aria-label='Conversation messages'>
                <ChatMessageScrollerContent className='gap-4 p-4'>
                  <ChatMessageScrollerItem messageId='request' scrollAnchor>
                    <ChatMessage align='end'>
                      <ChatMessageContent>
                        <span className='sr-only'>You said</span>
                        <ChatBubble align='end'><ChatBubbleContent>{activeId === 'newsletter' ? 'Use the reader interviews to draft a practical newsletter opening.' : 'Give new subscribers one clear next step.'}</ChatBubbleContent></ChatBubble>
                      </ChatMessageContent>
                    </ChatMessage>
                  </ChatMessageScrollerItem>
                  <ChatMessageScrollerItem messageId='reply'>
                    <ChatMessage>
                      <ChatMessageContent className='gap-3'>
                        <ChatMessageHeader className='gap-2'><ChatAgentMark icon='Gaudi' tone='neutral' name='Gaudi' size='sm' decorative /><span className='font-medium'>Gaudi</span></ChatMessageHeader>
                        <ChatMessageParts parts={[
                          { type: 'text', text: 'The research is ready. Open **Workspace → Agents** to see who is working, or browse the files beside the conversation.' },
                          { type: 'delegation', agent: { name: 'Researcher' }, status: 'done', instructions: 'Reviewed the interviews and saved three findings for the writer.' },
                          { type: 'text', text: 'The opening starts with a two-minute writing exercise. Preview the findings to check the source material before revising it.' }
                        ]} />
                      </ChatMessageContent>
                    </ChatMessage>
                  </ChatMessageScrollerItem>
                  {prompts.map((text, index) => (
                    <ChatMessageScrollerItem key={index} messageId={`follow-up-${index}`} scrollAnchor>
                      <ChatMessage align='end'><ChatMessageContent><span className='sr-only'>You said</span><ChatBubble align='end'><ChatBubbleContent>{text}</ChatBubbleContent></ChatBubble></ChatMessageContent></ChatMessage>
                    </ChatMessageScrollerItem>
                  ))}
                </ChatMessageScrollerContent>
              </ChatMessageScrollerViewport>
              <ChatMessageScrollerButton />
            </ChatMessageScroller>
          </ChatShell>
        </ChatMessageScrollerProvider>
      </div>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreviewId(null); }}>
        <DialogContent
          showCloseButton={false}
          className='max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto'
          onCloseAutoFocus={(event) => { event.preventDefault(); previewTrigger.current?.focus(); }}
        >
          <DialogHeader>
            <DialogTitle className='break-words'>{preview?.name || 'File preview'}</DialogTitle>
            <DialogDescription>Review the file without leaving the conversation.</DialogDescription>
          </DialogHeader>
          {preview ? <CodeBlock code={fileContent[previewId]} language={preview.typeLabel === 'TXT' ? 'text' : 'markdown'} defaultWrap /> : null}
          <DialogFooter><DialogClose asChild><Button variant='outline'>Back to workspace</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
