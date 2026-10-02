import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageSuggestions } from '../../ChatPromptSuggestions/parts/message-suggestions.jsx';

/** The empty state of a new chat: a greeting, a short description and prompts to start from. */
function ChatWelcome({ title, description, suggestions = [], onSelect, icon = 'Sparkles', className, children }) {
  return (
    <div data-slot='chat-welcome' className={cn('ds-part-chat-welcome mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-8 text-center', className)}>
      <span className='bg-accent-subtle text-accent grid size-10 place-items-center rounded-(--ds-radius-card)'>
        <RegistryIcon lucide={icon} className='size-5' />
      </span>
      <div className='grid gap-1'>
        <h2 className='text-lg font-semibold text-balance'>{title}</h2>
        {description ? <p className='text-text-muted text-sm text-balance'>{description}</p> : null}
      </div>
      {suggestions.length ? <MessageSuggestions suggestions={suggestions} onSelect={onSelect} className='justify-center' /> : null}
      {children}
    </div>
  );
}

export { ChatWelcome };
