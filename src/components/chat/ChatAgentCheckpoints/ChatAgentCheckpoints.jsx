'use client';
import { useId } from 'react';
import { CardRoot, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../core/Card/index.js';
import Timeline from '../../core/Timeline/index.js';
import Button from '../../core/Button/index.js';
import { Badge } from '../../core/Pill/index.js';
import { ChatActivityIndicator } from '../ChatActivityIndicator/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

import { cn } from '../../../utilities/cn/index.js';

/** Prepared attempt history. Restoring and switching are requests to the host, never workspace mutations. */
export function ChatAgentCheckpoints({ title = 'Agent checkpoints', description, summary, attempts = [], currentAttemptId, currentId, activeIds = [], onSelectAttempt, onRestore, readOnly = false, emptyState, footer, className }) {
  const titleId = useId();
  return (
      <CardRoot variant='outline' aria-labelledby={titleId} data-panel='chat-agent-checkpoints' className={cn('ds-touch-controls w-full min-w-0', className)}>
        <CardHeader className='gap-2'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle as='h2' id={titleId}>{title}</CardTitle>
            <span className='text-xs text-text-muted tabular-nums'><bdi>{summary}</bdi></span>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {!attempts.length ? (emptyState || <p className='py-6 text-sm text-text-muted'>No saved checkpoints yet</p>          ) : (
            <div role='region' aria-label='Checkpoint history' tabIndex={0} className='max-h-[32rem] overflow-y-auto overscroll-contain pe-2 focus-visible:outline-2 focus-visible:outline-accent'>
              {attempts.map(attempt => {
                const items = attempt.checkpoints;
                const isCurrent = attempt.id === currentAttemptId;
                return (
                  <section key={attempt.id} aria-label={attempt.label} className='not-first:mt-5 not-first:border-t not-first:border-border not-first:pt-4'>
                    <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex flex-wrap items-center gap-2 text-xs'>
                        <RegistryIcon lucide={attempt.origin ? 'GitBranch' : 'Bookmark'} className='size-3.5 text-text-muted' />
                        <h3 className='font-medium'><bdi>{attempt.label}</bdi></h3>
                        <Badge variant={isCurrent ? 'primary-light' : 'secondary'}>{isCurrent ? 'Current' : 'Previous'}</Badge>
                      </div>
                      {onSelectAttempt && <Button size='xs' variant='ghost' disabled={readOnly || isCurrent || attempt.disabled} onClick={() => onSelectAttempt(attempt.id)} aria-label={`Switch to ${attempt.label.toLowerCase()}`}>Switch here</Button>}
                    </div>
                    {attempt.origin && <p className='mb-3 text-xs text-text-muted'><bdi>{attempt.origin}</bdi></p>}
                    <Timeline label={`${attempt.label} checkpoints`} items={items.map(item => ({
                      id: item.id,
                      icon: <RegistryIcon lucide={item.icon || 'Bookmark'} className={`size-4 ${activeIds.includes(item.id) ? 'text-accent' : 'text-text-muted'}`} />,
                      title: <span aria-current={item.id === currentId ? 'step' : undefined} className={activeIds.includes(item.id) ? 'text-text' : 'text-text-muted'}>{item.title}</span>,
                      children: <div className='grid min-w-0 gap-2 pt-1'>
                        {item.detail && <p className='text-xs leading-relaxed'>{item.detail}</p>}
                        <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
                          <div className='flex flex-wrap items-center gap-2 text-xs'>
                            {item.running ? <ChatActivityIndicator state='thinking' variant='compact' labels={{thinking: item.statusLabel || 'Running'}} /> : <Badge variant={item.tone || 'secondary'}>{item.statusLabel}</Badge>}
                            <bdi className='tabular-nums'>{item.time}</bdi>
                            <bdi>{item.meta}</bdi>
                            {item.id === currentId && <span className='text-accent'>Current checkpoint</span>}
                          </div>
                          {onRestore && <Button size='xs' variant='ghost' disabled={readOnly || item.restoreDisabled} onClick={() => onRestore(item.id)} aria-label={`Rewind to ${item.title}`}><RegistryIcon lucide='RotateCcw' />Rewind</Button>}
                        </div>
                      </div>
                    }))} />
                  </section>
                );
              })}
            </div>
          )}
        </CardContent>
        {footer && <CardFooter className='flex-wrap justify-between gap-3 border-t border-border pt-4'>{footer}</CardFooter>}
      </CardRoot>
  );
}
