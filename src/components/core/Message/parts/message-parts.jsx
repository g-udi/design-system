'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { MessageDelegation, MessageError, MessageFile, MessageSuggestions } from './message-actions.jsx';
import { MessageMarkdown } from './message-markdown.jsx';
import { MessageReasoning, MessageReasoningStep } from './message-reasoning.jsx';
import { MessageSources } from './message-sources.jsx';
import { MessageData, MessageTool } from './message-tool.jsx';

/*
 * An assistant turn is an ordered list of parts, shaped like the parts of common AI SDK messages but with
 * no dependency on one:
 *
 *   { type: 'text', text }
 *   { type: 'reasoning', text?, steps?: [{ status, text }], streaming?, duration? }
 *   { type: 'tool', id?, name, status, description?, input?, output?, error?, duration?, parts? }
 *   { type: 'delegation', agent: { name }, status, instructions?, error?, parts? }
 *   { type: 'source', title, url?, kind?, site?, excerpt? }   // gathered into one list, cited as [n]
 *   { type: 'file', name, type?, size?, description?, href? }
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
        return <MessageMarkdown key={key} streaming={streaming && last} sources={sources}>{part.text}</MessageMarkdown>;
      case 'reasoning':
        return (
          // Thinking lasts until the answer after it starts to arrive.
          <MessageReasoning key={key} streaming={part.streaming ?? (streaming && !parts.slice(index + 1).some((next) => next.type === 'text' && next.text?.trim()))} duration={part.duration}>
            {part.steps?.length
              ? part.steps.map((step, stepIndex) => <MessageReasoningStep key={stepIndex} status={step.status}>{step.text}</MessageReasoningStep>)
              : part.text}
          </MessageReasoning>
        );
      case 'tool':
        return (
          <MessageTool
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
          </MessageTool>
        );
      case 'delegation':
        return (
          <MessageDelegation key={key} agent={part.agent} status={part.status} instructions={part.instructions} error={part.error}>
            {part.parts?.length ? <PartList parts={part.parts} sources={sources} streaming={false} handlers={handlers} nested /> : null}
          </MessageDelegation>
        );
      case 'file':
        return (
          <MessageFile
            key={key}
            name={part.name}
            type={part.mediaType || part.fileType}
            size={part.size}
            description={part.description}
            href={part.href}
            onPreview={handlers.onFileAction ? () => handlers.onFileAction('preview', part) : undefined}
            onDownload={handlers.onFileAction && !part.href ? () => handlers.onFileAction('download', part) : undefined}
          />
        );
      case 'data':
        return <MessageData key={key} label={part.label} value={part.value} />;
      case 'error':
        return <MessageError key={key} title={part.title} onRetry={nested ? undefined : handlers.onRetry}>{part.text}</MessageError>;
      case 'suggestions':
        return nested ? null : <MessageSuggestions key={key} suggestions={part.items} onSelect={handlers.onSuggestion} />;
      default:
        return null;
    }
  });
}

/**
 * Renders an assistant turn from its parts. `streaming` marks the turn as still arriving (the last text
 * part keeps an open code fence live, and a trailing reasoning part stays open). Source parts gather into
 * one MessageSources list after the reply; text cites them as [1], [2]…
 */
function MessageParts({ parts = [], streaming = false, onRetry, onToolRetry, onFileAction, onSuggestion, sourcesLabel, className }) {
  const sources = parts.filter((part) => part.type === 'source');
  const body = parts.filter((part) => part.type !== 'source');
  return (
    <div data-slot='message-parts' aria-busy={streaming || undefined} className={cn('ds-part-message-parts flex min-w-0 flex-col gap-3', className)}>
      <PartList parts={body} sources={sources} streaming={streaming} handlers={{ onRetry, onToolRetry, onFileAction, onSuggestion }} />
      {sources.length ? <MessageSources sources={sources} label={sourcesLabel} /> : null}
    </div>
  );
}

export { MessageParts };
