import { AccordionGroup } from '@gaudi/design-system/core/Accordion';

export function Pattern() {
  return (
    <AccordionGroup
      className='mx-auto w-full max-w-lg'
      variant='separated'
      defaultValue='details'
      items={[
        {
          value: 'overview',
          title: 'Product overview',
          content: 'A shared reading and publishing workspace for editorial teams.'
        },
        {
          value: 'details',
          title: 'Additional details',
          content: (
            <AccordionGroup
              variant='flush'
              headingLevel={4}
              items={[
                {
                  value: 'specifications',
                  title: 'Technical specifications',
                  content: 'Access your workspace from a current browser on desktop, tablet, or phone.'
                },
                {
                  value: 'compatibility',
                  title: 'Compatibility',
                  content: 'Import Markdown content and export articles as portable files.'
                }
              ]}
            />
          )
        },
        {
          value: 'support',
          title: 'Support options',
          content: 'Your workspace owner can help with invitations and access.'
        }
      ]}
    />
  );
}
