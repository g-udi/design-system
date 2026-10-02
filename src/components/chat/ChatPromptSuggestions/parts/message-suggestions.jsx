'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/** Follow-up prompts as chips; `suggestions` are strings or `{ id, label, prompt?, icon? }`. */
function MessageSuggestions({ suggestions = [], onSelect, label = 'Suggested prompts', className }) {
  if (!suggestions.length) return null;
  return (
    <ul data-slot='message-suggestions' aria-label={label} className={cn('ds-part-message-suggestions flex flex-wrap gap-2', className)}>
      {suggestions.map((suggestion) => {
        const item = typeof suggestion === 'string' ? { id: suggestion, label: suggestion } : suggestion;
        return (
          <li key={item.id}>
            <Button size='sm' variant='outline' className='h-auto py-1.5 text-start whitespace-normal' onClick={() => onSelect?.(item.prompt || item.label, item)}>
              {item.icon ? <RegistryIcon lucide={item.icon} /> : null}
              {item.label}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export { MessageSuggestions };
