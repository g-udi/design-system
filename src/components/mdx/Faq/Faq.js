/**
 * FAQ Component
 *
 * @description A titled list of questions built on the core Accordion. Each answer opens on its own,
 * so readers can compare several; questions render as headings one level below the section heading.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../core/Accordion';
import { cn } from '../../../utilities/cn';
import { articleAccordion } from '../Details/articleAccordion.js';

const headingTags = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

/**
 * @param {Object} props - Component props
 * @param {string} [props.heading='FAQ'] - Section heading
 * @param {number} [props.headingLevel=2] - Section heading level; questions use the next level
 * @param {Array<{ question: string, answer: React.ReactNode }>} props.questions - Questions and answers
 * @returns {JSX.Element} The FAQ section
 *
 * @example
 * <Faq questions={[
 *   { question: "What is React?", answer: "A JavaScript library for building user interfaces." }
 * ]} />
 */
const Faq = ({ heading = 'FAQ', headingLevel = 2, questions = [] }) => {
  const Heading = headingTags[headingLevel] || 'h2';

  return (
    <section className='my-8'>
      <Heading className='mt-0 text-2xl font-bold leading-10 text-text'>{heading}</Heading>
      <Accordion type='multiple' variant='flush' className={ cn('mt-3', articleAccordion.root) } headingLevel={ Math.min(6, headingLevel + 1) } indicator='plus-minus'>
        {questions.map(({ question, answer }) => (
          <AccordionItem key={ question } value={ question }>
            <AccordionTrigger className={ articleAccordion.trigger }>{question}</AccordionTrigger>
            <AccordionContent className={ articleAccordion.content }>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;
