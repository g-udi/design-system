import Card from '../../src/components/core/Card';
import Icon from '../../src/components/core/Icon';
import Link from '../../src/components/core/Link';
import Faq from '../../src/components/mdx/Faq';
import Pill from '../../src/components/core/Pill';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const questions = [
  {
    'answer': 'Reusable UI belongs in the Gaudi package with colocated styles, stories, and contract tests. Route-only composition can stay app-specific.',
    'question': 'What belongs in the design system?'
  },
  {
    'answer': 'Use the package exports first. Add root className or documented classNames slots only when a consuming surface needs layout-specific adjustment.',
    'question': 'How should blog pages customize components?'
  },
  {
    'answer': 'Every public component should have a realistic story, concise docs, keyboard-accessible behavior, and no hidden dependency on global override CSS.',
    'question': 'What makes a component ready for use?'
  },
  {
    'answer': 'Foundations define colors, typography, icons, indicators, and accessibility expectations. Components should consume those contracts rather than inventing local values.',
    'question': 'Where do tokens and accessibility rules live?'
  }
];

const columns = [
  [ 'Component ownership', 'Move reusable UI into package folders with stories and tests.' ],
  [ 'Styling contract', 'Prefer variants, className, and documented classNames slots.' ],
  [ 'Docs quality', 'Examples must match the component being documented.' ],
  [ 'Accessibility', 'Native elements, visible focus, readable contrast, and useful labels.' ]
];

const AccordionFaq = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950'>
    <Faq questions={ questions } />
  </div>
);

const GridFaq = () => (
  <div className='grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800 md:grid-cols-2'>
    {questions.map((item) => (
      <article key={ item.question } className='bg-white p-6 dark:bg-gray-950'>
        <Typography variant='heading-sm'>{item.question}</Typography>
        <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>{item.answer}</p>
      </article>
    ))}
  </div>
);

const SidebarFaq = () => (
  <div className='grid gap-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-[18rem_1fr]'>
    <aside>
      <Pill tone='blue' variant='soft'>help</Pill>
      <Typography variant='heading-lg' className='mt-4'>Design-system questions</Typography>
      <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>Use this layout when the FAQ needs supporting context or a contact path.</p>
      <Link href='' className='mt-4 inline-flex items-center gap-2' variant='inline'>
        Ask a question
        <Icon name='ArrowRight' decorative size='sm' />
      </Link>
    </aside>
    <div className='divide-y divide-gray-100 dark:divide-gray-800'>
      {questions.map((item) => (
        <details key={ item.question } className='group py-4 first:pt-0 last:pb-0'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-950 dark:text-white'>
            {item.question}
            <Icon name='ChevronDown' decorative className='transition-transform group-open:rotate-180' />
          </summary>
          <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>{item.answer}</p>
        </details>
      ))}
    </div>
  </div>
);

const CardsFaq = () => (
  <div className='grid gap-4 md:grid-cols-4'>
    {columns.map(([ title, body ]) => (
      <Card key={ title } variant='outline'>
        <Icon name='Info' decorative className='text-blue-600 dark:text-blue-400' />
        <Typography variant='heading-sm' className='mt-4'>{title}</Typography>
        <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>{body}</p>
      </Card>
    ))}
  </div>
);

const usageCode = `import { Faq } from '@gaudi/design-system/mdx';

const questions = [
  {
    question: 'What belongs in the design system?',
    answer: 'Reusable UI with stories, docs, and tests.',
  },
];

<Faq questions={questions} />`;

const variantRows = [
  [ 'Accordion FAQ', 'Long answer lists.', 'Answers are hidden until requested.' ],
  [ 'Grid FAQ', 'Short answers that should all be visible.', 'Every answer renders in the page flow.' ],
  [ 'FAQ With Sidebar', 'Support or docs pages with framing copy.', 'Side context and expandable answers share one section.' ],
  [ 'FAQ Cards', 'Brief principles or policies.', 'Each answer is a short card, not an accordion.' ]
];

const variantCode = {
  'accordion': `<div className='rounded-lg border border-gray-200 bg-white p-6'>
  <Faq questions={questions} />
</div>`,
  'cards': `<div className='grid gap-4 md:grid-cols-4'>
  {columns.map(([title, body]) => (
    <Card key={title} variant='outline'>
      <Icon name='Info' decorative />
      <Typography variant='heading-sm'>{title}</Typography>
      <p>{body}</p>
    </Card>
  ))}
</div>`,
  'grid': `<div className='grid gap-px rounded-lg border md:grid-cols-2'>
  {questions.map((item) => (
    <article key={item.question} className='bg-white p-6'>
      <Typography variant='heading-sm'>{item.question}</Typography>
      <p>{item.answer}</p>
    </article>
  ))}
</div>`,
  'sidebar': `<div className='grid gap-8 rounded-lg border p-6 lg:grid-cols-[18rem_1fr]'>
  <aside>
    <Pill tone='blue' variant='soft'>help</Pill>
    <Typography variant='heading-lg'>Design-system questions</Typography>
  </aside>
  <div>
    {questions.map((item) => (
      <details key={item.question}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </div>
</div>`
};

const VariantTable = () => (
  <Table>
    <thead>
      <tr><Th>Variant</Th><Th>Use</Th><Th>Behavior</Th></tr>
    </thead>
    <tbody>
      {variantRows.map(([ variant, use, behavior ]) => (
        <tr key={ variant }><Td>{variant}</Td><Td>{use}</Td><Td>{behavior}</Td></tr>
      ))}
    </tbody>
  </Table>
);

export default {
  parameters: pageParameters,
  title: 'Blocks/FAQs'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='FAQ Recipes'
      intro='Reference FAQ compositions for docs, content pages, and support sections. The examples use Gaudi typography, cards, icons, and the exported MDX Faq component.'
    >
      <Section title='Usage' description='The canonical package export is the MDX Faq component. The other examples are reference recipes that compose the same question data into different reading layouts.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Use disclosure when answers are long; use visible layouts when answers are short.'>
        <VariantTable />
      </Section>
      <Section title='Accordion FAQ' description='Use when users are scanning a compact list of questions.'>
        <div data-docs-example><AccordionFaq /></div>
        <CodeBlock code={ variantCode.accordion } />
      </Section>
      <Section title='Grid FAQ' description='Use when all answers should be visible at once.'>
        <div data-docs-example><GridFaq /></div>
        <CodeBlock code={ variantCode.grid } />
      </Section>
      <Section title='FAQ With Sidebar' description='Use when an FAQ needs a contact path or framing copy.'>
        <div data-docs-example><SidebarFaq /></div>
        <CodeBlock code={ variantCode.sidebar } />
      </Section>
      <Section title='FAQ Cards' description='Use for short policy or component-author guidance.'>
        <div data-docs-example><CardsFaq /></div>
        <CodeBlock code={ variantCode.cards } />
      </Section>
      <Section title='Implementation Notes' description='FAQ recipes must keep the exported component semantics and keyboard behavior intact.'>
        <ul className='grid gap-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>
          <li>Use <InlineCode>Faq</InlineCode> for article/MDX disclosure behavior.</li>
          <li>Use native <InlineCode>details</InlineCode> and <InlineCode>summary</InlineCode> only when composing a custom block.</li>
          <li>Keep questions as readable headings or summaries; color should never be the only state cue.</li>
        </ul>
      </Section>
    </Page>
  )
};
