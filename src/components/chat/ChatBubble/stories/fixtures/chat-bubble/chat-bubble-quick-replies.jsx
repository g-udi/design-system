'use client';
import { useState } from 'react';
import { ChatBubble, ChatBubbleContent, ChatBubbleGroup } from '@gaudi/design-system/chat/ChatBubble';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const deliveryLog = 'Issue,Delivery,Link check\n41,Bounced,Archive link unavailable\n42,Bounced,Passed';
const options = [
  {
    id: 'retry',
    label: 'Resend both issues now',
    reply: 'Queued again. Issues 41 and 42 go out with the next send.'
  },
  {
    id: 'hold',
    label: 'Hold them until I fix the links',
    reply: 'Held. Neither issue goes out until you confirm the links.'
  },
  { id: 'log', label: 'Download the bounced delivery log', href: `data:text/csv;charset=utf-8,${encodeURIComponent(deliveryLog)}` }
];
export function Pattern() {
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [drafted, setDrafted] = useState(false);
  const chosen = options.find((option) => option.id === picked);
  return (
    <Card className='w-full max-w-sm'>
      <CardContent className='flex flex-col gap-4'>
        <ChatBubble variant='muted'>
          <ChatBubbleContent>
            Two newsletter issues bounced last night. What do you want to do?
          </ChatBubbleContent>
        </ChatBubble>
        {chosen ? (
          <>
            <ChatBubble align='end'>
              <ChatBubbleContent>{chosen.label}</ChatBubbleContent>
            </ChatBubble>
            {/* max-w-full lifts the 80% cap for the one bubble that carries
       controls, and it needs no `!` because a plain utility already
       outranks the style sheet. */}
            <ChatBubble variant='outline' className='max-w-full'>
              <ChatBubbleContent>
                {chosen.reply}
                {/* Both actions move the thread forward. Repeating the pick or
       the link option still on offer would give the reader a row
       of choices they have already made. */}
                <div className='mt-3 flex flex-wrap gap-2'>
                  <Button size='sm' onClick={() => setChecked(true)} disabled={checked}>{checked ? 'Checks shown' : 'Review link checks'}</Button>
                  <Button variant='outline' size='sm' onClick={() => setDrafted(true)} disabled={drafted}>
                    {drafted ? 'Note drafted' : 'Draft owner note'}
                  </Button>
                </div>
                <div role='status' className='mt-2 space-y-1 text-xs'>
                  {checked && <p>Issue 41 has an unavailable archive link. Issue 42 passed its link check.</p>}
                  {drafted && <p>Draft to the newsletter owner: issues 41 and 42 bounced. Please review the delivery log before the next send.</p>}
                </div>
              </ChatBubbleContent>
            </ChatBubble>
          </>
        ) : (
          <ChatBubbleGroup>
            {options.map((option) =>
              option.href ? (
                <ChatBubble key={option.id} variant='tinted' align='end'>
                  <ChatBubbleContent asChild>
                    <a href={option.href} download='bounced-deliveries.csv'>
                      {option.label}
                      <RegistryIcon
                        lucide='DownloadIcon'
                        aria-hidden='true'
                        className='ms-1 inline size-4 align-text-bottom'
                      />
                    </a>
                  </ChatBubbleContent>
                </ChatBubble>
              ) : (
                <ChatBubble key={option.id} variant='tinted' align='end'>
                  {/* asChild turns the content element itself into the button,
         which earns the focus ring and the hover the variant
         already ships; a button nested inside it would get
         neither. The visible text is the accessible name. */}
                  <ChatBubbleContent asChild>
                    <button type='button' onClick={() => setPicked(option.id)}>
                      {option.label}
                    </button>
                  </ChatBubbleContent>
                </ChatBubble>
              )
            )}
          </ChatBubbleGroup>
        )}
      </CardContent>
    </Card>
  );
}
