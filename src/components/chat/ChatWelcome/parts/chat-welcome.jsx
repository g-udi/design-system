import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { MessageSuggestions } from '../../ChatPromptSuggestions/parts/message-suggestions.jsx';

/**
 * The empty state of a new chat: a greeting, a short description and prompts to start from. `icon` is a
 * registry icon name or an element (a product mark); `suggestionsVariant='cards'` shows the prompts as
 * a grid of rows instead of chips.
 */
function ChatWelcome({ title, description, suggestions = [], onSelect, icon = 'Sparkles', suggestionsVariant = 'chips', className, children }) {
  return (
    <div data-slot='chat-welcome' className={cn('ds-part-chat-welcome @container mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-8 text-center', className)}>
      {typeof icon === 'string' ? (
        <span className='bg-accent-subtle text-accent grid size-10 place-items-center rounded-(--ds-radius-card)'>
          <RegistryIcon lucide={icon} className='size-5' />
        </span>
      ) : (
        icon
      )}
      <div className='grid gap-1'>
        <h2 className='text-lg font-semibold text-balance'>{title}</h2>
        {description ? <p className='text-text-muted text-sm text-balance'>{description}</p> : null}
      </div>
      {suggestions.length ? <MessageSuggestions suggestions={suggestions} onSelect={onSelect} variant={suggestionsVariant} className='justify-center' /> : null}
      {children}
    </div>
  );
}

export { ChatWelcome };
