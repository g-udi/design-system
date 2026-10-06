'use client';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../core/DropdownMenu/DropdownMenuPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

/**
 * Steps through the prompts in a long thread: previous and next, plus a menu of every prompt.
 * `turns` are `{ id, label }` in thread order; `current` is the id in view; `onNavigate(id)` scrolls to it.
 */
function ChatThreadNav({ turns = [], current, onNavigate, labels, className }) {
  const index = Math.max(0, turns.findIndex((turn) => turn.id === current));
  if (!turns.length) return null;
  const go = (next) => onNavigate?.(turns[Math.min(turns.length - 1, Math.max(0, next))].id);
  return (
    <div data-slot='chat-thread-nav' role='group' aria-label={labels?.group || 'Prompts in this chat'} className={cn('ds-part-chat-thread-nav flex items-center gap-0.5', className)}>
      <Button size='icon-sm' variant='ghost' aria-label={labels?.previous || 'Previous prompt'} disabled={index === 0} onClick={() => go(index - 1)}>
        <RegistryIcon lucide='ChevronUp' />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='xs' variant='ghost' className='tabular-nums' aria-label={`${labels?.jump || 'Jump to a prompt'}, ${index + 1} of ${turns.length}`}>
            {index + 1} / {turns.length}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='max-w-72'>
          <DropdownMenuLabel>{labels?.jump || 'Jump to a prompt'}</DropdownMenuLabel>
          {turns.map((turn, turnIndex) => (
            <DropdownMenuItem key={turn.id} onSelect={() => onNavigate?.(turn.id)} aria-current={turn.id === current ? 'true' : undefined}>
              <span className='text-text-muted w-4 shrink-0 text-xs tabular-nums'>{turnIndex + 1}</span>
              <span className='truncate'>{turn.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size='icon-sm' variant='ghost' aria-label={labels?.next || 'Next prompt'} disabled={index === turns.length - 1} onClick={() => go(index + 1)}>
        <RegistryIcon lucide='ChevronDown' />
      </Button>
    </div>
  );
}

export { ChatThreadNav };
