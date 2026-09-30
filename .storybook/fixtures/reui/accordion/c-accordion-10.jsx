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
    value: 'item-1',
    trigger: 'Can I use this for my project?',
    content:
      'Use Gaudi components in your blog or application. Import the package and its global stylesheet at the application root.'
  },
  {
    value: 'item-2',
    trigger: 'Where can I explore components?',
    content:
      'Browse Storybook for component APIs, interactive previews, and practical examples with copyable code.'
  },
  {
    value: 'item-3',
    trigger: 'How do I contribute to Gaudi?',
    content:
      'You can contribute by reporting bugs, suggesting features, or submitting pull requests on our GitHub repository.'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Accordion type='single' collapsible defaultValue='item-1'>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className='flex-row-reverse items-center justify-end gap-3 py-3 hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden'>
              <span className='text-ui-foreground font-medium'>
                {item.trigger}
              </span>
              <RegistryIcon
                lucide='ChevronRightIcon'
                className='text-ui-muted-foreground size-4 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-90'
              />
            </AccordionTrigger>
            <AccordionContent className='text-ui-muted-foreground ps-7 leading-relaxed'>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
