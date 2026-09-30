import { AccordionGroup } from '../../../../src/components/core/Accordion/index.js';
const items = [
  {
    value: 'plans',
    title: 'Which plan is right for my team?',
    content: 'A team workspace adds shared collections, review workflows, and member permissions.'
  },
  {
    value: 'billing',
    title: 'Can I change my billing schedule?',
    content: 'Your current access continues until the next renewal date.'
  }
];
const styles = [
  { label: 'Flush', props: { variant: 'flush' } },
  { label: 'Plus and minus', props: { variant: 'flush', indicator: 'plus-minus' } },
  { label: 'Leading arrow', props: { variant: 'flush', indicator: 'arrow', indicatorPosition: 'start' } },
  { label: 'Outline', props: { variant: 'outline' } },
  { label: 'Separated', props: { variant: 'separated' } },
  { label: 'Framed', props: { variant: 'framed' } }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-3xl gap-x-6 gap-y-4 sm:grid-cols-2'>
      {styles.map(({ label, props }) => (
        <section key={label} aria-label={label} className='grid content-start gap-2'>
          <span className='text-xs text-text-muted'>{label}</span>
          <AccordionGroup headingLevel={4} items={items.map((item) => ({ ...item, value: `${label}-${item.value}` }))} {...props} />
        </section>
      ))}
    </div>
  );
}
