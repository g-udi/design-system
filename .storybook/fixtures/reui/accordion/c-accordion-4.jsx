// Gaudi accordion pattern; slot numbering follows the ReUI (MIT) catalogue. See THIRD_PARTY_NOTICES.md.
import { useState } from 'react';
import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { default as Card } from '../../../../src/components/core/Card/index.js';
const items = [
  {
    value: 'plans',
    title: 'Which plan is right for my team?',
    content:
      'Start with a personal workspace for individual projects. A team workspace adds shared collections, review workflows, and member permissions.'
  },
  {
    value: 'billing',
    title: 'Can I change my billing schedule?',
    content:
      'Review your next renewal in billing settings before changing schedules. Your current access continues until that date.'
  },
  {
    value: 'export',
    title: 'How do I export my content?',
    content:
      'Open workspace settings and choose Export. Your download includes articles, collections, and uploaded assets.'
  }
];

export function Pattern() {
  const [showPlans, setShowPlans] = useState(false);
  const [plans, ...rest] = items;
  return (
    <Card
      variant='outline'
      className='mx-auto h-auto w-full max-w-lg'
      title='Subscription & billing'
      titleLevel={3}
      subtitle='Plans, payments, and workspace access.'
    >
      <AccordionGroup
        variant='flush'
        headingLevel={4}
        className='mt-3'
        items={[
          {
            ...plans,
            content: (
              <div className='grid gap-3 [&>button]:justify-self-start'>
                <p>{plans.content}</p>
                <Button
                  size='sm'
                  variant='outline'
                  aria-expanded={showPlans}
                  onClick={() => setShowPlans(!showPlans)}
                >
                  {showPlans ? 'Hide plan details' : 'Compare plans'}
                </Button>
                {showPlans && (
                  <dl className='grid gap-1'>
                    <dt className='font-semibold text-text'>Personal</dt>
                    <dd>One owner, personal collections.</dd>
                    <dt className='mt-2 font-semibold text-text'>Team</dt>
                    <dd>Shared collections and member roles.</dd>
                  </dl>
                )}
              </div>
            )
          },
          ...rest
        ]}
      />
    </Card>
  );
}
