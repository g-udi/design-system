// Gaudi accordion pattern; slot numbering follows the ReUI (MIT) catalogue. See THIRD_PARTY_NOTICES.md.
import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
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
  return <AccordionGroup className='mx-auto w-full max-w-lg' variant='flush' items={items} />;
}
