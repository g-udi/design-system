'use client';
import { cn } from '../../../utilities/cn/index.js';
import { ChatMessageDelegation } from '../ChatDelegation/ChatMessageDelegation.jsx';
import Button from '../../core/Button/index.js';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '../../core/Banner/Alert.jsx';
import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions, AttachmentAction } from '../../core/Attachment/Attachment.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatMessageSuggestions } from './ChatMessageSuggestions.jsx';
import { ChatMessageMarkdown } from './ChatMessageMarkdown.jsx';
import { ChatMessageReasoning, ChatMessageReasoningImage, ChatMessageReasoningResults, ChatMessageReasoningStep } from '../ChatReasoning/ChatMessageReasoning.jsx';
import { ChatMessageSources } from '../ChatSources/ChatMessageSources.jsx';
import { ChatMessageData, ChatMessageTool } from '../ChatTool/ChatMessageTool.jsx';
import { ChatMessageToolApproval } from '../ChatTool/ChatMessageToolApproval.jsx';

/*
 * An assistant turn is an ordered list of parts, shaped like the parts of common AI SDK messages but with
 * no dependency on one:
 *
 *   { type: 'text', text }
 *   { type: 'reasoning', text?, steps?: [{ status, text } | { status, label, icon?, description?, text?, results?, images? }], streaming?, duration? }
 *   { type: 'tool', id?, name, status, description?, input?, output?, error?, duration?, parts? }
 *   { type: 'approval', id?, name, description?, input?, state?, allowAlways?, output? }   // a tool waiting on the person
 *   { type: 'delegation', agent: { name }, status, instructions?, error?, parts? }
 *   { type: 'source', title, url?, kind?, site?, excerpt? }   // gathered into one list, cited as [n]
 *   { type: 'file', name, mediaType?, fileType?, previewUrl?, kind?, size?, description?, href? }
 *   { type: 'data', label?, value }
 *   { type: 'error', title?, text? }
 *   { type: 'suggestions', items }
 *
 * Unknown types are skipped so a host can carry its own parts alongside and render them itself.
 */

function PartList({ parts, sources, streaming, handlers, nested = false }) {
  return parts.map((part, index) => {
    const key = part.id || `${part.type}-${index}`;
    const last = index === parts.length - 1;
    switch (part.type) {
      case 'text':
        return <ChatMessageMarkdown key={key} streaming={streaming && last} sources={sources}>{part.text}</ChatMessageMarkdown>;
      case 'reasoning':
        return (
          // Thinking lasts until the answer after it starts to arrive.
          <ChatMessageReasoning key={key} variant={part.steps?.some((step) => step.label) ? 'steps' : undefined} streaming={part.streaming ?? (streaming && !parts.slice(index + 1).some((next) => next.type === 'text' && next.text?.trim()))} duration={part.duration}>
            {part.steps?.length
              ? part.steps.map((step, stepIndex) => (step.label ? (
                <ChatMessageReasoningStep key={stepIndex} status={step.status} label={step.label} icon={step.icon} description={step.description} meta={step.meta}>
                  {step.text || step.results?.length || step.images?.length ? (
                    <>
                      {step.text ? <p className='m-0'>{step.text}</p> : null}
                      {step.results?.length ? <ChatMessageReasoningResults results={step.results} /> : null}
                      {step.images?.map((image) => <ChatMessageReasoningImage key={image.src} {...image} />)}
                    </>
                  ) : null}
                </ChatMessageReasoningStep>
              ) : <ChatMessageReasoningStep key={stepIndex} status={step.status}>{step.text}</ChatMessageReasoningStep>))
              : part.text}
          </ChatMessageReasoning>
        );
      case 'tool':
        return (
          <ChatMessageTool
            key={key}
            name={part.name}
            description={part.description}
            status={part.status}
            input={part.input}
            output={part.output}
            error={part.error}
            duration={part.duration}
            onRetry={handlers.onToolRetry ? () => handlers.onToolRetry(part, index) : undefined}
          >
            {part.parts?.length ? <PartList parts={part.parts} sources={sources} streaming={false} handlers={handlers} nested /> : null}
          </ChatMessageTool>
        );
      case 'approval':
        return (
          <ChatMessageToolApproval
            key={key}
            name={part.name}
            description={part.description}
            input={part.input}
            state={part.state}
            allowAlways={part.allowAlways}
            onApprove={handlers.onToolApproval ? ({ always }) => handlers.onToolApproval(part, { approved: true, always }) : undefined}
            onDeny={handlers.onToolApproval ? () => handlers.onToolApproval(part, { approved: false }) : undefined}
          >
            {part.output !== undefined ? <ChatMessageData value={part.output} /> : null}
          </ChatMessageToolApproval>
        );
      case 'delegation':
        return (
          <ChatMessageDelegation key={key} agent={part.agent} status={part.status} instructions={part.instructions} error={part.error}>
            {part.parts?.length ? <PartList parts={part.parts} sources={sources} streaming={false} handlers={handlers} nested /> : null}
          </ChatMessageDelegation>
        );
      case 'file':
        return (
          <Attachment key={key} size='sm' className='max-w-sm'>
            <AttachmentMedia file={part} />
            <AttachmentContent>
              <AttachmentTitle>{part.name}</AttachmentTitle>
              <AttachmentDescription>{[part.description, part.size].filter(Boolean).join(' · ')}</AttachmentDescription>
            </AttachmentContent>
            {handlers.onFileAction || part.href ? (
              <AttachmentActions>
                {handlers.onFileAction ? <AttachmentAction aria-label={`Preview ${part.name}`} onClick={() => handlers.onFileAction('preview', part)}><RegistryIcon lucide='Eye' /></AttachmentAction> : null}
                <AttachmentAction aria-label={`Download ${part.name}`} asChild={Boolean(part.href)} onClick={part.href ? undefined : () => handlers.onFileAction('download', part)}>
                  {part.href ? <a href={part.href} download={part.name}><RegistryIcon lucide='Download' /></a> : <RegistryIcon lucide='Download' />}
                </AttachmentAction>
              </AttachmentActions>
            ) : null}
          </Attachment>
        );
      case 'data':
        return <ChatMessageData key={key} label={part.label} value={part.value} />;
      case 'error':
        return (
          <Alert key={key} variant='destructive'>
            <RegistryIcon lucide='TriangleAlert' />
            <AlertTitle className='line-clamp-none'>{part.title || 'The reply stopped before it finished.'}</AlertTitle>
            {part.text ? <AlertDescription>{part.text}</AlertDescription> : null}
            {!nested && handlers.onRetry ? <AlertAction><Button size='xs' variant='outline' onClick={handlers.onRetry}><RegistryIcon lucide='RotateCcw' />Try again</Button></AlertAction> : null}
          </Alert>
        );
      case 'suggestions':
        return nested ? null : <ChatMessageSuggestions key={key} suggestions={part.items} onSelect={handlers.onSuggestion} />;
      default:
        return null;
    }
  });
}

/**
 * Renders an assistant turn from its parts. `streaming` marks the turn as still arriving (the last text
 * part keeps an open code fence live, and a trailing reasoning part stays open). Source parts gather into
 * one ChatMessageSources list after the reply; text cites them as [1], [2]…
 */
function ChatMessageParts({ parts = [], streaming = false, onRetry, onToolRetry, onToolApproval, onFileAction, onSuggestion, sourcesLabel, className }) {
  const sources = parts.filter((part) => part.type === 'source');
  const body = parts.filter((part) => part.type !== 'source');
  return (
    <div data-slot='message-parts' aria-busy={streaming || undefined} className={cn('ds-part-message-parts flex min-w-0 flex-col gap-3', className)}>
      <PartList parts={body} sources={sources} streaming={streaming} handlers={{ onRetry, onToolRetry, onToolApproval, onFileAction, onSuggestion }} />
      {sources.length ? <ChatMessageSources sources={sources} label={sourcesLabel} /> : null}
    </div>
  );
}

export { ChatMessageParts };
