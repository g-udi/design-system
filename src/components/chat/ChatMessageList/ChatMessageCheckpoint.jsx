'use client';
import { useId } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Separator } from '../../core/Separator/Separator.jsx';
import { DialogConfirmation, DialogConfirmationAction, DialogConfirmationCancel, DialogConfirmationContent, DialogConfirmationDescription, DialogConfirmationFooter, DialogConfirmationHeader, DialogConfirmationTitle, DialogConfirmationTrigger } from '../../core/Dialog/DialogConfirmationPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

/*
 * Checkpoint: a restore point drawn as a labelled divider between turns, with a confirmed "Restore checkpoint" action.
 */

const defaultLabels = {
  restore: 'Restore checkpoint',
  restored: 'Restored',
  confirmTitle: 'Restore this checkpoint?',
  confirmDescription: (label) => `The conversation goes back to “${label}”. Messages and changes after it are removed.`,
  confirm: 'Restore',
  cancel: 'Cancel'
};

const formatTime = (time) => {
  if (!(time instanceof Date)) return { text: time, dateTime: undefined };
  return { text: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), dateTime: time.toISOString() };
};

/**
 * A restore point in the thread. `label` names it and `time` (a string or Date) says when it was made.
 * `onRestore` adds the action; it asks first unless `confirm={false}`. `restored` marks the checkpoint
 * the thread was rolled back to.
 */
function ChatMessageCheckpoint({ label = 'Checkpoint', time, onRestore, confirm = true, restored = false, labels: labelOverrides, className }) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const labelId = useId();
  const stamp = time == null ? null : formatTime(time);
  const action = (
    <Button size='xs' variant='ghost' disabled={restored} aria-describedby={labelId} onClick={confirm ? undefined : onRestore} className='text-text-muted hover:text-text'>
      <RegistryIcon lucide={restored ? 'BookmarkCheck' : 'RotateCcw'} />
      {restored ? labels.restored : labels.restore}
    </Button>
  );
  return (
    <div role='group' aria-labelledby={labelId} data-slot='message-checkpoint' data-restored={restored || undefined} className={cn('ds-part-message-checkpoint w-full', className)}>
      <div className='text-text-muted flex items-center gap-3 text-xs'>
        <Separator className='min-w-3 flex-1' />
        <div className='flex max-w-[calc(100%-3rem)] min-w-0 shrink flex-wrap items-center justify-center gap-x-2 gap-y-1'>
          <span id={labelId} className='inline-flex min-w-0 items-center gap-1.5'>
            <RegistryIcon lucide='Bookmark' className='text-text-muted size-3.5 shrink-0' />
            <span className='text-text font-medium'>{label}</span>
            {stamp ? (
              <>
                <span aria-hidden='true'>·</span>
                <time dateTime={stamp.dateTime} className='tabular-nums'>{stamp.text}</time>
              </>
            ) : null}
          </span>
          {onRestore ? (
            confirm && !restored ? (
              <DialogConfirmation>
                <DialogConfirmationTrigger asChild>{action}</DialogConfirmationTrigger>
                <DialogConfirmationContent size='sm'>
                  <DialogConfirmationHeader>
                    <DialogConfirmationTitle>{labels.confirmTitle}</DialogConfirmationTitle>
                    <DialogConfirmationDescription>{typeof labels.confirmDescription === 'function' ? labels.confirmDescription(label) : labels.confirmDescription}</DialogConfirmationDescription>
                  </DialogConfirmationHeader>
                  <DialogConfirmationFooter>
                    <DialogConfirmationCancel>{labels.cancel}</DialogConfirmationCancel>
                    <DialogConfirmationAction onClick={onRestore}>{labels.confirm}</DialogConfirmationAction>
                  </DialogConfirmationFooter>
                </DialogConfirmationContent>
              </DialogConfirmation>
            ) : action
          ) : null}
        </div>
        <Separator className='min-w-3 flex-1' />
      </div>
    </div>
  );
}

export { ChatMessageCheckpoint };
