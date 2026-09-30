'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle
} from '../../../../src/components/mdx/CodeGroupTabs/parts/code-block-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardFooter
} from '../../../../src/components/core/Card/parts/card.jsx';
const patch = `export async function retryPayment(orderId: string) {
  const order = await orders.find(orderId)
  await payments.charge(order)
  const receipt = await payments.charge(order, { idempotencyKey: orderId })
  await notify.customer(order, receipt)
  return receipt
}`;
export function Pattern() {
  const [decision, setDecision] = useState(null);
  return (
    <Card className='w-full max-w-2xl gap-0 py-0'>
      <CardContent className='p-0'>
        <CodeBlock
          code={patch}
          language='typescript'
          showLineNumbers
          variant='ghost'
          diff={{ added: [4, 5, 6], removed: [3] }}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>billing/retry-payment.ts</CodeBlockTitle>
            <div className='ml-auto flex items-center gap-1.5'>
              <Badge variant='success-light'>+3</Badge>
              <Badge variant='destructive-light'>-1</Badge>
            </div>
          </CodeBlockHeader>
        </CodeBlock>
      </CardContent>

      <CardFooter className='border-ui-border bg-ui-muted/40 border-t px-3 py-2!'>
        <span className='text-ui-muted-foreground text-xs'>
          {decision === null && 'Agent proposed this change'}
          {decision === 'accepted' && 'Change applied to the branch'}
          {decision === 'rejected' && 'Change discarded'}
        </span>
        <div className='ml-auto flex items-center gap-1.5'>
          {decision === null ? (
            <>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setDecision('rejected')}
              >
                Reject
              </Button>
              <Button size='sm' onClick={() => setDecision('accepted')}>
                Accept
              </Button>
            </>
          ) : (
            <Button size='sm' variant='ghost' onClick={() => setDecision(null)}>
              Undo
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
