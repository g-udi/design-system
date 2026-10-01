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

const AccordionFaq = () => (
  <Card variant='outline' padding='lg'>
    <Faq heading='Design-system questions' headingLevel={ 3 } questions={ questions } />
  </Card>
);

const SidebarFaq = () => (
  <Card variant='outline' padding='lg' classNames={{ 'body': 'grid gap-8 lg:grid-cols-[16rem_1fr]' }}>
    <aside>
      <Pill tone='blue' variant='soft' className='m-0'>Help</Pill>
      <Typography as='h3' variant='heading-md' className='mt-4'>Still have questions?</Typography>
      <p className='mt-3 text-sm leading-6 text-text-muted'>Pair the answers with framing copy and a contact path.</p>
      <Link href='#ask' className='mt-4 inline-flex items-center gap-2'>
        Ask a question
        <Icon name='ArrowRight' decorative size='sm' />
      </Link>
    </aside>
    <Faq heading='Common answers' headingLevel={ 4 } questions={ questions } />
  </Card>
);

const CardsFaq = () => (
  <div className='grid gap-4 md:grid-cols-2'>
    {questions.map((item) => (
      <Card key={ item.question } variant='outline' padding='lg'>
        <Icon name='Info' decorative className='text-accent' />
        <Typography as='h3' variant='heading-sm' className='mt-3'>{item.question}</Typography>
        <p className='mt-2 text-sm leading-6 text-text-muted'>{item.answer}</p>
      </Card>
    ))}
  </div>
);

const usageCode = `import { Faq } from '@gaudi/design-system/mdx';

const questions = [
  {
    question: 'What belongs in the design system?',
    answer: 'Reusable UI with stories, docs, and tests.'
  }
];

<Faq heading='Design-system questions' questions={questions} />`;

const variantRows = [
  [ 'Accordion FAQ', 'Long answer lists.', 'Answers are hidden until requested.' ],
  [ 'FAQ With Sidebar', 'Support or docs pages with framing copy.', 'Side context and expandable answers share one section.' ],
  [ 'Answer Cards', 'Short answers that should all be visible.', 'Every answer renders in the page flow as a card.' ]
];

const variantCode = {
  'accordion': `<Card variant='outline' padding='lg'>
  <Faq heading='Design-system questions' headingLevel={3} questions={questions} />
</Card>`,
  'cards': `<div className='grid gap-4 md:grid-cols-2'>
  {questions.map((item) => (
    <Card key={item.question} variant='outline' padding='lg'>
      <Icon name='Info' decorative className='text-accent' />
      <Typography as='h3' variant='heading-sm'>{item.question}</Typography>
      <p className='text-sm text-text-muted'>{item.answer}</p>
    </Card>
  ))}
</div>`,
  'sidebar': `<Card variant='outline' padding='lg' classNames={{ body: 'grid gap-8 lg:grid-cols-[16rem_1fr]' }}>
  <aside>
    <Pill tone='blue' variant='soft'>Help</Pill>
    <Typography as='h3' variant='heading-md'>Still have questions?</Typography>
    <Link href='/contact'>Ask a question</Link>
  </aside>
  <Faq heading='Common answers' headingLevel={4} questions={questions} />
</Card>`
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
  title: 'Blocks/To Sort/FAQs', id: 'blocks-faqs'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='FAQ Recipes'
      intro='Reference FAQ compositions for docs, content pages, and support sections, built from the exported MDX Faq component, Card, and Typography.'
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
      <Section title='FAQ With Sidebar' description='Use when an FAQ needs a contact path or framing copy.'>
        <div data-docs-example><SidebarFaq /></div>
        <CodeBlock code={ variantCode.sidebar } />
      </Section>
      <Section title='Answer Cards' description='Use when every answer is short enough to show at once.'>
        <div data-docs-example><CardsFaq /></div>
        <CodeBlock code={ variantCode.cards } />
      </Section>
      <Section title='Implementation Notes' description='FAQ recipes must keep the exported component semantics and keyboard behavior intact.'>
        <ul className='grid gap-2 text-sm leading-7 text-text-muted'>
          <li>Use <InlineCode>Faq</InlineCode> for article/MDX disclosure behavior.</li>
          <li>Compose custom layouts around <InlineCode>Faq</InlineCode> or the core <InlineCode>Accordion</InlineCode> rather than hand-rolled disclosure.</li>
          <li>Keep questions as readable headings or summaries; color should never be the only state cue.</li>
        </ul>
      </Section>
    </Page>
  )
};
