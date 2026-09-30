// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../../src/components/core/Accordion/Accordion.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const items = [
  {
    value: 'security',
    trigger: 'Data Security',
    content:
      'We use industry-standard AES-256 encryption to protect your sensitive information at rest and in transit.'
  },
  {
    value: 'integration',
    trigger: 'API Integration',
    content:
      'Seamlessly connect with your favorite tools using our robust REST API and pre-built connectors.'
  },
  {
    value: 'collaboration',
    trigger: 'Team Collaboration',
    content:
      'Invite team members, assign roles, and work together in real-time on shared projects and documents.'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Accordion type='multiple' defaultValue={['security']}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className='hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden'>
              <span>{item.trigger}</span>
              <RegistryIcon
                lucide='PlusIcon'
                className='text-ui-muted-foreground ml-auto size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:hidden'
              />
              <RegistryIcon
                lucide='MinusIcon'
                className='text-ui-muted-foreground ml-auto hidden size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:inline'
              />
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
