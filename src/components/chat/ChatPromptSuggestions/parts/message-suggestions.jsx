'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/**
 * Follow-up prompts as chips; `suggestions` are strings or `{ id, label, prompt?, icon? }`.
 * `variant='cards'` lays them out as a two-column grid of full-width rows with a trailing arrow,
 * the starter prompts of a new chat (one column in narrow containers).
 */
function MessageSuggestions({ suggestions = [], onSelect, label = 'Suggested prompts', variant = 'chips', className }) {
  if (!suggestions.length) return null;
  if (variant === 'cards') {
    return (
      <ul data-slot='message-suggestions' data-variant='cards' aria-label={label} className={cn('ds-part-message-suggestions grid w-full grid-cols-1 gap-2 @lg:grid-cols-2', className)}>
        {suggestions.map((suggestion) => {
          const item = typeof suggestion === 'string' ? { id: suggestion, label: suggestion } : suggestion;
          return (
            <li key={item.id} className='min-w-0'>
              <Button variant='outline' className='h-auto w-full justify-start gap-2 py-2.5 text-start font-medium whitespace-normal' onClick={() => onSelect?.(item.prompt || item.label, item)}>
                {item.icon ? <RegistryIcon lucide={item.icon} className='text-text-muted' /> : null}
                <span className='min-w-0 flex-1 truncate'>{item.label}</span>
                <RegistryIcon lucide='ArrowUpRight' aria-hidden='true' className='ds-part-rtl-flip text-text-muted' />
              </Button>
            </li>
          );
        })}
      </ul>
    );
  }
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
