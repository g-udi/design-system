import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Disclaimer from './index';

const docs = getComponentDocs('Post/Disclaimer');
const tones = ['info', 'warning', 'error'];
// A companion note takes the calm tone the featured disclaimer is not using. The Callout error tone
// fails colour contrast (text-danger on bg-danger-subtle is 4.41:1), so it stays opt-in via `type`.
const companionTones = ['info', 'warning'];
const companions = {
  info: 'Figures are rounded to the nearest release and may differ slightly from the changelog.',
  warning: 'This post includes forward-looking implementation notes that may change before release.'
};
const companionsFor = (type) => companionTones.filter((tone) => tone !== type).slice(0, 1);
const defaultCopy = 'The opinions and views expressed on this blog are solely my own and do not reflect the opinions, views, or positions of my employer or any affiliated organizations. All content provided on this blog is for informational purposes only.';
const toneClass = { info: 'info', warning: 'warning', error: 'danger' };
const expectTone = async (copy, type) => {
  const tone = toneClass[type];
  const callout = copy.closest('aside');
  await expect(copy).toBeVisible();
  await expect(callout).toHaveClass(`border-${tone}-border`, `bg-${tone}-subtle`);
  await expect(callout.querySelector('div')).toHaveClass(`text-${tone}`);
};

export default {
  title: 'Post/Disclaimer',
  component: Disclaimer,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { type: tones, children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'info', children: defaultCopy },
  parameters: {
    docs: {
      description: { story: 'The standard blog disclaimer, driven by the controls, above a note in the other calm tone. `type` recolours the featured callout; `children` replaces its copy, and an empty value falls back to the standard text.' },
      source: playgroundSource('Disclaimer', { imports: "import { Disclaimer } from '@gaudi/design-system';" })
    }
  },
  render: ({ children, type }) => (
    <div className='grid gap-3'>
      <Disclaimer type={type} className='mb-0'>{children || undefined}</Disclaimer>
      {companionsFor(type).map((tone) => <Disclaimer key={tone} type={tone} className='mb-0'>{companions[tone]}</Disclaimer>)}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelectorAll('aside')).toHaveLength(1 + companionsFor(args.type).length);
    await expectTone(canvas.getByText(args.children || defaultCopy), args.type);
    for (const tone of companionsFor(args.type)) await expectTone(canvas.getByText(companions[tone]), tone);
  }
};
