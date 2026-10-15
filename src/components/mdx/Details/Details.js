/**
 * Details Component
 *
 * @description An article disclosure built on the core Accordion, so it matches every other accordion.
 * The title renders once, as the disclosure button inside a heading at `headingLevel`. Trigger and panel
 * keep the article reading scale instead of the compact application size.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../core/Accordion';
import { cn } from '../../../utilities/cn';
import { articleAccordion } from './articleAccordion.js';

const Details = ({ title, children, headingLevel = 2, className, ...rest }) => (
  <Accordion variant='flush' className={ cn('my-8', articleAccordion.root) } headingLevel={ headingLevel } indicator='plus-minus'>
    <AccordionItem value='details'>
      <AccordionTrigger className={ articleAccordion.trigger }>{title}</AccordionTrigger>
      <AccordionContent className={ cn(articleAccordion.content, className) } { ...rest }>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default Details;
