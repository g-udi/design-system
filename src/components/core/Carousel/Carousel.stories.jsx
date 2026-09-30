import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Carousel, { carouselVariants } from './Carousel';

const docs = getComponentDocs('Core/Carousel');
const editorialItems = [
  {
    action: 'Read article',
    description: 'A practical walkthrough of how graph-shaped context changes retrieval and reasoning systems.',
    eyebrow: 'Knowledge Graphs',
    href: '/blog',
    id: 'knowledge-graphs',
    image: 'static/images/posts/linked-data-quality.svg',
    content: 'Covers entity modelling, linking public datasets, and measuring the quality of the resulting graph.',
    title: 'An Introduction to Knowledge Graphs'
  },
  {
    action: 'Explore notes',
    description: 'Reusable tokens, layout elements, and accessible content components for long-form publishing.',
    eyebrow: 'Design Systems',
    href: '/blog',
    id: 'design-systems',
    image: 'static/images/posts/gaudi.svg',
    content: 'Walks through how Gaudi tokens, primitives, and editorial components share one source of truth.',
    title: 'Design systems keep editorial rhythm predictable'
  },
  {
    action: 'View project',
    description: 'A compact view into project architecture, documentation, and implementation decisions.',
    eyebrow: 'Projects',
    href: '/blog/projects',
    id: 'projects',
    image: 'static/images/posts/unifiedjs.svg',
    content: 'Documents the unified, remark, and rehype pipeline that turns Markdown into these pages.',
    title: 'Project notes for engineering work'
  }
];

const railItems = [
  {
    content: 'Use this variant for horizontal editorial cards where the image and title do most of the work. The expanded state gives readers more detail without navigating away.',
    description: 'A larger card format for feature collections.',
    eyebrow: 'Artificial Intelligence',
    id: 'ai',
    title: 'You can do more with AI.'
  },
  {
    content: 'Cards keep a consistent width, snap in a horizontal rail, and expose a dialog for deeper content when selected.',
    description: 'Dense but readable cards for grouped content.',
    eyebrow: 'Productivity',
    id: 'productivity',
    title: 'Enhance your productivity.'
  },
  {
    content: 'Use concise labels and meaningful accessible names. Decorative images can use an empty alt value.',
    description: 'An editorial rail card treatment.',
    eyebrow: 'Product',
    id: 'product',
    title: 'Launching a focused component system.'
  }
];
const overlayText = {
  description: '!text-white/95 drop-shadow-sm',
  eyebrow: '!text-white/85 drop-shadow-sm',
  title: '!text-white drop-shadow-sm'
};
const button = (canvas, name) => canvas.getByRole('button', { name });

const status = (canvas, text) => expect(canvas.getByText(text, { selector: '[aria-live]' })).toBeInTheDocument();

export default {
  title: 'Core/Carousel',
  id: 'core-carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['standard', 'rail'],
    size: Object.keys(carouselVariants.variants.size),
    radius: ['none', 'sm', 'md', 'lg'],
    controls: 'boolean',
    loop: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { variant: 'standard', size: 'md', radius: 'lg', controls: true, loop: true },
  parameters: {
    docs: {
      description: { story: 'Three illustrated articles with an eyebrow, summary, and call to action. Switch `variant` to rail for snapping cards that open their details in a dialog; without `loop`, Previous starts disabled and navigation stops at the ends.' },
      source: playgroundSource('Carousel', {
        imports: `import { Carousel } from '@gaudi/design-system';\n\nconst items = ${JSON.stringify(editorialItems, null, 2)};`,
        attributes: ["ariaLabel='Featured articles'", 'items={items}']
      })
    }
  },
  render: (args) => <Carousel ariaLabel='Featured articles' items={editorialItems} classNames={overlayText} className='mx-auto' {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = editorialItems;
    await expect(canvas.getByRole('region', { name: 'Featured articles' })).toHaveAttribute('aria-roledescription', 'carousel');
    if (args.variant === 'rail') {
      for (const item of editorialItems) await expect(button(canvas, `Open ${item.title}`)).toBeInTheDocument();
    } else {
      await expect(canvas.getByRole('heading', { level: 3, name: first.title })).toBeInTheDocument();
      await expect(canvas.getByRole('link', { name: first.action })).toHaveAttribute('href', first.href);
    }
    if (args.controls) {
      await expect(button(canvas, 'Previous slide')).toHaveProperty('disabled', !args.loop);
      await userEvent.click(button(canvas, 'Next slide'));
    } else {
      await expect(canvas.queryByRole('button', { name: 'Next slide' })).not.toBeInTheDocument();
      await userEvent.click(button(canvas, 'Go to slide 2'));
    }
    await status(canvas, '2 of 3');
    if (args.variant !== 'rail') await expect(canvas.getByRole('heading', { level: 3, name: second.title })).toBeInTheDocument();
    await userEvent.click(button(canvas, 'Go to slide 3'));
    await expect(button(canvas, 'Go to slide 3')).toHaveAttribute('aria-current', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await status(canvas, args.loop ? '1 of 3' : '3 of 3');
  }
};

export const EditorialRail = {
  parameters: { docs: { description: { story: 'The rail variant snaps cards horizontally; opening a card shows its `content` in a modal dialog that closes with Escape.' } } },
  render: () => <Carousel ariaLabel='Featured cards' variant='rail' items={railItems} classNames={overlayText} loop />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [, second, third] = railItems;
    await expect(button(canvas, 'Go to slide 1')).toHaveAttribute('aria-current', 'true');
    await userEvent.click(button(canvas, `Open ${second.title}`));
    const dialog = await screen.findByRole('dialog', { name: second.title });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(canvas.getByRole('button', { name: 'Go to slide 2', hidden: true })).toHaveAttribute('aria-current', 'true');
    await expect(within(dialog).getByText(second.content)).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close carousel card' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(await canvas.findByRole('button', { name: `Open ${third.title}` }));
    await expect(await screen.findByRole('dialog', { name: third.title })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
};

export const Sizes = {
  parameters: { docs: { description: { story: 'Small and large sizes; without `loop`, Previous starts disabled and each carousel keeps its own position.' } } },
  render: () => (
    <div className='space-y-8'>
      <Carousel ariaLabel='Small carousel' items={editorialItems} size='sm' />
      <Carousel ariaLabel='Large carousel' items={editorialItems} size='lg' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const small = within(canvas.getByRole('region', { name: 'Small carousel' }));
    const large = within(canvas.getByRole('region', { name: 'Large carousel' }));
    await expect(button(small, 'Previous slide')).toBeDisabled();
    await expect(button(large, 'Previous slide')).toBeDisabled();
    await userEvent.click(button(small, 'Next slide'));
    await expect(small.getByText('2 of 3')).toBeInTheDocument();
    await expect(large.getByText('1 of 3')).toBeInTheDocument();
  }
};
