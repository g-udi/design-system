import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import Avatar from '../../Avatar';
import { TextHighlight, textHighlightVariants } from '../TextHighlight';

const docs = getComponentDocs('Core/TextHighlight');
const options = (name) => Object.keys(textHighlightVariants.variants[name]);
const tones = options('tone');
const variants = options('variant');
const phrase = 'consistency visible';
const supporting = ['fewer regressions', 'what changed'];
const prose = 'text-2xl font-semibold text-text';

export default {
  title: 'Core/TextHighlight',
  id: 'core-texthighlight',
  component: TextHighlight,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: variants, tone: tones, animate: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { variant: 'marker', tone: 'blue', animate: true },
  parameters: {
    docs: {
      description: { story: 'An essay pull quote. The headline phrase follows the controls and replays its sweep on every change; the body keeps a soft green and an underlined amber highlight for contrast.' },
      source: playgroundSource('TextHighlight', {
        imports: "import { TextHighlight } from '@gaudi/design-system';",
        before: '<>\n<h3>\n  Design systems make ',
        children: `  ${phrase}`,
        after: `.\n</h3>\n<p>\n  Shared tokens mean <TextHighlight variant='soft' tone='green'>${supporting[0]}</TextHighlight> and reviews about\n  <TextHighlight variant='underline' tone='amber'>${supporting[1]}</TextHighlight>, not pixel drift.\n</p>\n</>`
      })
    }
  },
  render: (args) => (
    <figure className='mx-auto grid max-w-xl gap-3'>
      <p className='text-xs font-medium uppercase tracking-wide text-text-muted'>From the essay · 6 min read</p>
      <h3 className={prose}>
        Design systems make <TextHighlight key={JSON.stringify(args)} {...args}>{phrase}</TextHighlight>.
      </h3>
      <p className='text-base leading-7 text-text-muted'>
        Shared tokens mean <TextHighlight variant='soft' tone='green' animate={false}>{supporting[0]}</TextHighlight> and reviews about{' '}
        <TextHighlight variant='underline' tone='amber' animate={false}>{supporting[1]}</TextHighlight>, not pixel drift.
      </p>
      <figcaption className='flex items-center gap-2 text-sm'>
        <Avatar name='Ahmad Assaf' size='xs' />
        <span className='font-medium'>Ahmad Assaf</span>
        <span className='text-text-muted'>· Principal designer</span>
      </figcaption>
    </figure>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const highlight = canvas.getByText(phrase);
    await expect(highlight.tagName).toBe('SPAN');
    await expect(highlight.classList.contains('ds-text-highlight-animate')).toBe(Boolean(args.animate));
    await expect(highlight).toHaveClass(...textHighlightVariants.variants.variant[args.variant].split(' '));
    await expect(highlight).toHaveClass(...textHighlightVariants({ tone: args.tone, variant: args.variant }).split(' '));
    await expect(canvas.getByText(supporting[0])).toHaveClass('bg-success-muted', 'text-text');
    await expect(canvas.getByText(supporting[1])).toHaveClass('underline', 'decoration-warning-border');
  }
};

export const Tones = {
  parameters: { docs: { description: { story: 'Every tone in each variant, static (`animate={false}`). Tone names map to semantic colours, so `yellow` matches `amber` and `gray` matches `neutral`.' } } },
  render: () => (
    <div className='grid w-fit grid-cols-[auto_repeat(3,auto)] items-baseline gap-x-2 gap-y-2 text-base font-medium text-text sm:gap-x-6'>
      <span />
      {variants.map((variant) => <span key={variant} className='text-xs font-normal text-text-muted'>{variant}</span>)}
      {tones.map((tone) => (
        <div key={tone} className='contents'>
          <span className='text-xs font-normal text-text-muted'>{tone}</span>
          {variants.map((variant) => <span key={variant}><TextHighlight tone={tone} variant={variant} animate={false}>{`${tone} ${variant}`}</TextHighlight></span>)}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('green marker')).toHaveClass('bg-linear-to-r', 'from-success-muted', 'to-success-border', 'px-1', 'pb-0.5');
    await expect(canvas.getByText('amber soft')).toHaveClass('bg-warning-muted', 'text-text');
    await expect(canvas.getByText('yellow soft')).toHaveClass('bg-warning-muted');
    await expect(canvas.getByText('red underline')).toHaveClass('underline', 'decoration-4', 'decoration-danger-border', 'bg-none');
    await expect(canvas.getByText('blue marker')).not.toHaveClass('ds-text-highlight-animate');
  }
};
