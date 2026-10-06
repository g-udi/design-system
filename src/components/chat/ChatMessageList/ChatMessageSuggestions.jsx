'use client';
import { default as Button } from '../../core/Button/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

/** Private renderer for ChatMessageParts follow-up suggestions. */
function ChatMessageSuggestions({ suggestions = [], onSelect }) {
  if (!suggestions.length) return null;
  return (
    <ul data-slot='message-suggestions' aria-label='Suggested prompts' className='ds-part-message-suggestions flex flex-wrap gap-2'>
      {suggestions.map((suggestion) => {
        const item = typeof suggestion === 'string' ? { id: suggestion, label: suggestion } : suggestion;
        return (
          <li key={item.id} className='max-w-full min-w-0'>
            <Button size='sm' variant='outline' className='h-auto max-w-full py-1.5 text-start whitespace-normal break-words' onClick={() => onSelect?.(item.prompt || item.label, item)}>
              {item.icon ? <RegistryIcon lucide={item.icon} /> : null}
              {item.label}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export { ChatMessageSuggestions };
