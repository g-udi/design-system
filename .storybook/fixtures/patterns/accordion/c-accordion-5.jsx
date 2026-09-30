import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
import { default as Pill } from '../../../../src/components/core/Pill/index.js';

export function Pattern() {
  return (
    <AccordionGroup
      className='mx-auto w-full max-w-lg'
      highlight
      items={[
        {
          value: 'history',
          title: 'Account history',
          content: 'Your account history includes plan changes and workspace activity.'
        },
        {
          value: 'audit',
          title: 'Advanced audit logs',
          disabled: true,
          badge: (
            <Pill size='xs' tone='gray' variant='soft'>
              Requires admin
            </Pill>
          ),
          content: 'Detailed audit logs.'
        },
        {
          value: 'email',
          title: 'Email preferences',
          content: 'Choose which project updates and weekly summaries you receive.'
        }
      ]}
    />
  );
}
