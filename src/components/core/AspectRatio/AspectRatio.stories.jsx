import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { AspectRatio } from './index.js';
import { aurora, dusk, lagoon, iris } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('Core/AspectRatio');
// Common media shapes, labelled the way editors name them.
const ratios = { '21:9': 21 / 9, '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '4:5': 4 / 5, '9:16': 9 / 16 };
const labelOf = (ratio) => Object.keys(ratios).find((label) => Math.abs(ratios[label] - ratio) < 0.01) || `${Number(ratio).toFixed(2)}:1`;
// A lesson page: the cover follows the `ratio` control; the "Up next" shelf keeps one consistent 16:9 frame.
const cover = { src: aurora, title: 'Designing with tokens', meta: 'Gaudi Academy · Lesson 3', duration: '12:48' };
const shelfRatio = 16 / 9;
const upNext = [
  { title: 'Linked data basics', src: dusk, duration: '8:15' },
  { title: 'Graph queries', src: lagoon, duration: '10:02' },
  { title: 'Ontology design', src: iris, duration: '14:37' }
];
const frame = 'overflow-hidden rounded-xl border border-ui-border bg-ui-muted';

export default {
  title: 'Core/AspectRatio',
  id: 'core-aspectratio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: (() => {
    const argTypes = docsArgTypes(docs, { ratio: Object.values(ratios) });
    argTypes.ratio.control = { type: 'select', labels: Object.fromEntries(Object.entries(ratios).map(([label, value]) => [value, label])) };
    return argTypes;
  })(),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-lg'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ratio: 16 / 9 },
  parameters: {
    docs: {
      description: { story: 'A lesson page. The cover follows the `ratio` control, from a 21:9 banner to a 9:16 story, while the shelf below keeps one consistent 16:9 frame.' },
      source: playgroundSource('AspectRatio', {
        imports: "import { AspectRatio } from '@gaudi/design-system';",
        attributes: ["className='overflow-hidden rounded-xl border'"],
        children: `  <img src='${cover.src}' alt='' className='size-full object-cover' />`
      })
    }
  },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <figure className={`mx-auto flex w-full flex-col gap-2 ${args.ratio < 1 ? 'max-w-56' : ''}`}>
        <AspectRatio {...args} className={`${frame} relative`}>
          <img src={cover.src} alt='' className='size-full object-cover' />
          <span className='absolute top-2 left-2 rounded-md bg-surface-dark/70 px-1.5 py-0.5 text-xs font-medium text-text-inverse tabular-nums'>{labelOf(args.ratio)}</span>
          <span className='absolute right-2 bottom-2 rounded-md bg-surface-dark/70 px-1.5 py-0.5 text-xs text-text-inverse tabular-nums'>{cover.duration}</span>
          <span className='absolute inset-0 m-auto flex size-11 items-center justify-center rounded-full bg-surface/90 text-text shadow-md'>
            <RegistryIcon lucide='PlayIcon' className='size-5 fill-current' />
          </span>
        </AspectRatio>
        <figcaption className='flex flex-col'>
          <span className='text-sm font-medium text-ui-foreground'>{cover.title}</span>
          <span className='text-xs text-ui-muted-foreground'>{cover.meta}</span>
        </figcaption>
      </figure>
      <div className='flex flex-col gap-2'>
        <span className='text-xs font-medium text-ui-muted-foreground'>Up next</span>
        <ul className='grid grid-cols-3 items-start gap-3'>
          {upNext.map((item) => (
            <li key={item.title} className='flex min-w-0 flex-col gap-1'>
              <AspectRatio ratio={shelfRatio} className={`${frame} relative`}>
                <img src={item.src} alt='' className='size-full object-cover' />
                <span className='absolute right-1.5 bottom-1.5 rounded bg-surface-dark/70 px-1 text-xs text-text-inverse tabular-nums'>{item.duration}</span>
              </AspectRatio>
              <span className='truncate text-xs text-ui-foreground'>{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [coverFrame, ...shelf] = canvasElement.querySelectorAll('[data-slot="aspect-ratio"]');
    const ratioOf = (element) => {
      const { width, height } = element.getBoundingClientRect();
      return width / height;
    };
    await expect(ratioOf(coverFrame)).toBeCloseTo(args.ratio, 1);
    await expect(within(coverFrame).getByText(labelOf(args.ratio))).toBeVisible();
    for (const thumbnail of shelf) await expect(ratioOf(thumbnail)).toBeCloseTo(shelfRatio, 1);
    await expect(canvas.getByText(cover.title)).toBeVisible();
  }
};
