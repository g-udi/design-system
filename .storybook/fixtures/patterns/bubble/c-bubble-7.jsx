'use client';
import { useState } from 'react';
import {
  Bubble,
  BubbleContent
} from '../../../../src/components/core/Message/parts/bubble.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const code = 'bg-ui-muted rounded-sm px-1 py-0.5 font-mono text-[0.85em]';

export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-4'>
      <Bubble variant='muted' align='end'>
        <BubbleContent>Summarise what changed in 3.4 for the release note.</BubbleContent>
      </Bubble>
      {/* ghost is the only variant with no frame and no 80% cap, so a structured answer uses the whole row. */}
      <Bubble variant='ghost'>
        <BubbleContent>
          {/*
           * Real elements, not a markdown renderer, so nothing sets raw HTML from
           * a string. The block layout sits on this wrapper because BubbleContent
           * owns its own padding, radius and font size.
           */}
          <Collapsible open={open} onOpenChange={setOpen}>
            <div className='flex flex-col gap-3'>
              <p>
                3.4 is a reliability release. Nothing in it changes an API, and three fixes are worth naming in the note.
              </p>
              <h4 className='font-semibold'>What changed</h4>
              <ul className='marker:text-ui-muted-foreground ms-4 list-disc space-y-1'>
                <li>
                  <strong className='font-medium'>Refund webhooks</strong> retry for up to a minute, so a{' '}
                  <code className={code}>charge.refunded</code> event no longer drops when the processor is slow.
                </li>
                <li>
                  <strong className='font-medium'>Group membership</strong> stays in step with the identity provider,
                  including removals that used to need a manual resync.
                </li>
                <li>
                  <strong className='font-medium'>CSV exports</strong> finish at every accepted size.
                </li>
              </ul>
              {/* The long tail folds away so the answer reads at a glance. */}
              <CollapsibleContent>
                <div className='flex flex-col gap-3'>
                  <h4 className='font-semibold'>Why the webhooks dropped</h4>
                  <p>
                    The payments worker retried a batch of 1,200 deliveries after a processor timeout, and each retry
                    opened a connection of its own until the pool hit its ceiling.
                  </p>
                  <p>
                    We raised the pool to 60 and capped the worker at 8 concurrent deliveries. A backoff follows in 3.5.
                  </p>
                  <p className='text-ui-muted-foreground'>
                    Everything else is unchanged.{' '}
                    <a href='#' className='underline underline-offset-4'>Open the full diff</a>
                  </p>
                </div>
              </CollapsibleContent>
              {/* asChild hands the trigger to a real Button, so the fold keeps keyboard activation and a focus ring. */}
              <CollapsibleTrigger asChild>
                <Button variant='link' size='sm' className='w-fit px-0'>
                  {open ? 'Show less' : 'Show more'}
                  <span data-open={open} className='inline-flex transition-transform data-[open=true]:rotate-180'>
                    <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className='size-4' />
                  </span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
