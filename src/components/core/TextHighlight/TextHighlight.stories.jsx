import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { TextHighlight, textHighlightVariants } from './TextHighlight';

const docs = getComponentDocs('Core/TextHighlight');
const options = (name) => Object.keys(textHighlightVariants.variants[name]);
const tones = options('tone');
const variants = options('variant');
const phrase = 'consistency visible';
const prose = 'text-2xl font-semibold text-gray-900 dark:text-gray-100';

export default {
  title: 'Core/TextHighlight',
  id: 'core-texthighlight',
  component: TextHighlight,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { variant: variants, tone: tones, radius: options('radius'), animate: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { variant: 'marker', tone: 'blue', radius: 'sm', animate: true },
  parameters: {
    docs: {
      source: playgroundSource('TextHighlight', {
        imports: "import { TextHighlight } from '@gaudi/design-system';",
        before: '<p>\n  Design systems make ',
        children: `  ${phrase}`,
        after: '.\n</p>'
      })
    }
  },
  render: (args) => (
    <p className={prose}>
      Design systems make <TextHighlight {...args}>{phrase}</TextHighlight>.
    </p>
  ),
  play: async ({ args, canvasElement }) => {
    const highlight = within(canvasElement).getByText(phrase);
    await expect(highlight.tagName).toBe('SPAN');
    await expect(highlight.classList.contains('ds-text-highlight-animate')).toBe(Boolean(args.animate));
  }
};

export const Variants = {
  parameters: { docs: { description: { story: '`marker` draws a gradient sweep, `soft` tints the phrase, and `underline` adds a heavy text decoration.' } } },
  render: () => (
    <div className={`grid gap-4 ${prose}`}>
      {variants.map((variant) => (
        <p key={variant}>
          Design systems make <TextHighlight variant={variant} tone='green'>{variant} emphasis</TextHighlight> reusable.
        </p>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('marker emphasis')).toHaveClass('bg-linear-to-r', 'from-green-100', 'to-green-300', 'px-1', 'pb-0.5');
    await expect(canvas.getByText('soft emphasis')).toHaveClass('bg-green-50', 'text-green-900', 'px-1');
    await expect(canvas.getByText('underline emphasis')).toHaveClass('underline', 'decoration-4', 'underline-offset-2', 'decoration-green-300', 'bg-none');
  }
};

export const Tones = {
  parameters: { docs: { description: { story: 'Every `tone` of the marker variant, rendered with `animate={false}` so the static result is stable for visual tests.' } } },
  render: () => (
    <div className='grid gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100'>
      {tones.map((tone) => (
        <p key={tone}>
          <TextHighlight tone={tone} animate={false}>{tone}</TextHighlight> highlight tone
        </p>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const tone of tones.filter((name) => name !== 'indigo')) {
      await expect(canvas.getByText(tone)).toHaveClass(`from-${tone}-100`, `to-${tone}-300`);
    }
    await expect(canvas.getByText('indigo')).toHaveClass('from-sky-100', 'to-blue-300');
    await expect(canvas.getByText('blue')).not.toHaveClass('ds-text-highlight-animate');
  }
};
