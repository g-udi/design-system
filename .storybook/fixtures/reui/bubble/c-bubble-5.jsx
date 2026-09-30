// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
const lead =
  'Checkout slowed down at 21:40 because the connection pool hit its ceiling and every new request queued behind one that was already running.';
const rest = [
  'The payments worker had retried a batch of 1,200 webhook deliveries after a processor timeout, and each retry opened a connection of its own.',
  'We raised the pool to 60 and capped the worker at 8 concurrent deliveries. The p95 was back under 400ms four minutes later.',
  'The follow up is a backoff on that worker, so a single processor timeout cannot turn into a retry storm again.'
];
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-4'>
      <Bubble variant='default' align='end'>
        <BubbleContent>Why did checkout slow down last night?</BubbleContent>
      </Bubble>
      <Bubble variant='muted'>
        <BubbleContent>
          <Collapsible open={open} onOpenChange={setOpen}>
            <div className='flex flex-col gap-2'>
              <p>{lead}</p>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  {rest.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </CollapsibleContent>
              {/* asChild hands the trigger to a real Button in its link form
       rather than a styled span, so the fold keeps keyboard
       activation and a visible focus ring. */}
              <CollapsibleTrigger asChild>
                <Button
                  aria-label='Show options'
                  variant='link'
                  size='sm'
                  className='w-fit px-0'
                >
                  {open ? 'Show less' : 'Show more'}
                  {/* The chevron turns on a data attribute set from our own
       state. The trigger writes its open state under a different
       attribute name in each twin, and RegistryIcon can only
       take static literals, so the span carries it. */}
                  <span
                    data-open={open}
                    className='inline-flex transition-transform data-[open=true]:rotate-180'
                  >
                    <RegistryIcon
                      lucide='ChevronDownIcon'
                      aria-hidden='true'
                      className='size-4'
                    />
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
