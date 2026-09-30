/**
 * Details/FAQ Component
 *
 * @description An interactive disclosure component for displaying expandable FAQ sections or details.
 * Built on the core Accordion, so the disclosure matches every other accordion. The title renders
 * once, as the disclosure button inside a heading at `headingLevel`.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../core/Accordion';

const Details = ({ title, children, headingLevel = 2, ...rest }) => (
  <Accordion variant='flush' className='my-8 rounded-none border-y border-border' headingLevel={ headingLevel } indicator='plus-minus'>
    <AccordionItem value='details'>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent { ...rest }>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default Details;
