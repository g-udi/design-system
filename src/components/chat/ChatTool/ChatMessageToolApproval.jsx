'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../../core/Button/index.js';
import { Checkbox } from '../../core/Checkbox/CheckboxPrimitives.jsx';
import { Loader } from '../../core/Loader/LoaderPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { ChatMessageStatus } from '../shared/message-status.jsx';
import { ChatMessageData } from './ChatMessageTool.jsx';

/*
 * Tool approval: a confirmation for a tool call that needs consent. States follow the request: requested → approved (running) → executed, or requested → denied.
 */

const approvalStates = Object.freeze(['requested', 'approved', 'denied', 'executed']);
const statusFor = { requested: 'awaiting', approved: 'running', denied: 'denied', executed: 'done' };

const defaultLabels = {
  title: (name) => `Allow ${name}?`,
  approve: 'Approve',
  deny: 'Deny',
  always: (name) => `Always allow ${name}`,
  input: 'It will run with',
  requested: 'Waiting for your approval',
  approved: 'Approved. Running…',
  denied: 'Denied. Nothing was run.',
  executed: 'Approved and done',
  status: { awaiting: 'Needs approval', running: 'Running', denied: 'Denied', done: 'Done' }
};

const resolve = (value, name) => (typeof value === 'function' ? value(name) : value);

/**
 * A tool call that waits for the person: what the tool wants to do (`name`, `description`, `input`),
 * Approve and Deny, and optionally "always allow". `state` is requested, approved, denied or executed;
 * leave it uncontrolled and the card follows the person's choice, or control it and move it to
 * `executed` with the result as children once the tool has run.
 */
function ChatMessageToolApproval({ name, description, input, state, defaultState = 'requested', onStateChange, onApprove, onDeny, allowAlways = false, reason, labels: labelOverrides, className, children }) {
  const labels = { ...defaultLabels, ...labelOverrides, status: { ...defaultLabels.status, ...labelOverrides?.status } };
  const [current, setCurrent] = useControllableState({ value: state, defaultValue: defaultState, onChange: onStateChange });
  const [always, setAlways] = useState(false);
  const decided = useRef(null);
  const resultRef = useRef(null);
  const titleId = useId();
  const alwaysId = useId();
  const phase = approvalStates.includes(current) ? current : 'requested';

  // The buttons leave once the person decides, so focus follows to the outcome instead of the page.
  useEffect(() => {
    if (decided.current && phase !== 'requested') {
      const previous = decided.current;
      decided.current = null;
      const document = previous.ownerDocument;
      if (document.hasFocus() && document.activeElement === document.body) resultRef.current?.focus();
    }
  }, [phase]);

  const decide = (approved, event) => {
    decided.current = event.currentTarget;
    if (approved) onApprove?.({ always });
    else onDeny?.();
    setCurrent(approved ? 'approved' : 'denied');
  };

  return (
    <div
      role='group'
      aria-labelledby={titleId}
      data-slot='message-tool-approval'
      data-state={phase}
      className={cn(
        'ds-part-message-tool-approval bg-surface grid gap-3 rounded-(--ds-radius-card) border p-3 text-sm',
        phase === 'requested' && 'border-warning-border',
        phase === 'denied' && 'bg-surface-muted',
        className
      )}
    >
      <header className='grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2'>
        <RegistryIcon lucide={phase === 'denied' ? 'ShieldAlert' : phase === 'requested' ? 'ShieldQuestionMark' : 'ShieldCheck'} className={cn('mt-0.5 size-4 shrink-0', phase === 'requested' ? 'text-warning' : phase === 'denied' ? 'text-text-muted' : 'text-success')} />
        <div className='grid min-w-0 gap-0.5'>
          <div className='flex flex-wrap items-center justify-between gap-x-2 gap-y-1'>
            <p id={titleId} className='m-0 min-w-0 text-sm font-medium break-words'>{resolve(labels.title, name)}</p>
            <ChatMessageStatus status={statusFor[phase]} labels={labels.status} />
          </div>
          {description ? <p className='text-text-muted m-0 text-xs'>{description}</p> : null}
        </div>
      </header>

      {input !== undefined && phase !== 'executed' ? <ChatMessageData label={labels.input} value={input} /> : null}

      {phase === 'requested' ? (
        <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
          {allowAlways ? (
            <label htmlFor={alwaysId} className='text-text-muted flex min-w-0 items-center gap-2 text-xs'>
              <Checkbox id={alwaysId} checked={always} onCheckedChange={(next) => setAlways(next === true)} />
              {resolve(labels.always, name)}
            </label>
          ) : <span />}
          <div className='ms-auto flex gap-2'>
            <Button size='sm' variant='outline' onClick={(event) => decide(false, event)}>
              <RegistryIcon lucide='X' />
              {labels.deny}
            </Button>
            <Button size='sm' onClick={(event) => decide(true, event)}>
              <RegistryIcon lucide='Check' />
              {labels.approve}
            </Button>
          </div>
        </div>
      ) : null}

      <div ref={resultRef} tabIndex={-1} className={cn('grid gap-2 rounded-(--ds-radius-control) focus-visible:outline-none', phase === 'requested' && 'sr-only')}>
        <p role='status' className='text-text-muted m-0 flex items-center gap-1.5 text-xs'>
          {phase === 'approved' ? <Loader aria-hidden='true' aria-label={undefined} role={undefined} className='size-3' /> : null}
          {labels[phase]}
          {phase === 'denied' && reason ? <span>{` ${reason}`}</span> : null}
        </p>
        {phase === 'executed' && children ? <div className='grid gap-2'>{children}</div> : null}
      </div>
    </div>
  );
}

export { ChatMessageToolApproval, approvalStates };
