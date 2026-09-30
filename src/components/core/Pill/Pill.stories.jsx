import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { distinctOptions, docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Pill, { pillVariants } from './Pill';

const docs = getComponentDocs('Core/Pill');
const { radius: radii, size: sizes, tone: tones, variant: variants } = pillVariants.variants;
// Aliases such as `yellow` render like `amber` in every variant; offer each look once.
const distinctTones = distinctOptions(Object.keys(tones), (tone) => Object.keys(variants).map((variant) => pillVariants({ tone, variant })).join('|'));
const pill = (canvasElement, text) => within(canvasElement).getByText(text).parentElement;
const expectClasses = async (canvasElement, expected) => {
  for (const [text, classes] of Object.entries(expected)) await expect(pill(canvasElement, text)).toHaveClass(...classes);
};
const Row = ({ children }) => <div className='flex flex-wrap items-center gap-2'>{children}</div>;
const tagIcon = (lucide) => <RegistryIcon lucide={lucide} className='size-3' />;
// A pull-request list: the first status pill follows every control; size, variant, and radius restyle the whole set.
const pullRequests = [
  {
    title: 'Migrate colour tokens to OKLCH',
    meta: '#482 · opened 2 hours ago',
    tags: [
      { children: 'Design systems', tone: 'teal', icon: tagIcon('PaletteIcon') },
      { children: 'Breaking', tone: 'rose' },
      { children: '#tokens', tone: 'gray', href: '/blog/tags/tokens' }
    ]
  },
  {
    title: 'Raise focus ring contrast',
    meta: '#479 · merged yesterday',
    tags: [
      { children: 'Shipped', tone: 'green', icon: tagIcon('CheckIcon') },
      { children: 'Accessibility', tone: 'indigo', icon: tagIcon('AccessibilityIcon') },
      { children: 'v2.4', tone: 'neutral' }
    ]
  }
];
const featured = pullRequests[0].title;

export default {
  title: 'Core/Pill',
  id: 'core-pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    children: 'text',
    size: Object.keys(sizes),
    tone: distinctTones,
    variant: Object.keys(variants),
    radius: Object.keys(radii),
    pulse: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { children: 'In review', size: 'sm', tone: 'amber', variant: 'soft', radius: 'full', pulse: true },
  parameters: {
    docs: {
      description: { story: 'A pull-request list mixing status, category, icon, and link pills. The first status pill follows `children`, `tone`, and `pulse`; `size` and `variant` restyle every pill so the treatments compare side by side.' },
      source: playgroundSource('Pill', { imports: "import { Pill } from '@gaudi/design-system';" })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-lg'><Story /></ExampleFrame>],
  render: ({ children, tone, pulse, ...style }) => (
    <ul className='m-0 grid list-none gap-2 p-0'>
      {pullRequests.map((request) => (
        <li key={request.title} className='grid gap-1 rounded-lg border border-border px-3 py-2.5'>
          <span className='flex flex-wrap items-baseline justify-between gap-x-3'>
            <span className='text-sm font-medium text-foreground'>{request.title}</span>
            <span className='text-xs text-text-muted'>{request.meta}</span>
          </span>
          {/* Pills carry their own my-1 mr-1, so the row adds only a little horizontal space. */}
          <span className='flex flex-wrap items-center gap-x-1'>
            {request.title === featured ? <Pill {...style} tone={tone} pulse={pulse}>{children}</Pill> : null}
            {request.tags.map((tag) => <Pill key={tag.children} {...style} {...tag} />)}
          </span>
        </li>
      ))}
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const element = pill(canvasElement, args.children);
    const { radius, size, tone, variant } = args;
    await expect(element.tagName).toBe('SPAN');
    await expect(getComputedStyle(element).textTransform).toBe('none');
    await expect(element.className).toBe(pillVariants({ radius, size, tone, variant }));
    await expect(Boolean(element.querySelector('.animate-ping'))).toBe(args.pulse);
    const link = within(canvasElement).getByRole('link', { name: '#tokens' });
    await expect(link).toHaveAttribute('href', '/blog/tags/tokens');
    await expect(link).toHaveClass(radii[args.radius]);
  }
};

export const Tones = {
  parameters: { docs: { description: { story: 'Each `tone` alias maps to a semantic token family, so several aliases share one palette.' } } },
  render: () => <Row>{Object.keys(tones).map((tone) => <Pill key={tone} tone={tone}>{tone}</Pill>)}</Row>,
  play: ({ canvasElement }) => expectClasses(canvasElement, {
    blue: ['bg-accent', 'text-accent-foreground'],
    gray: ['bg-foreground', 'text-text-inverse'],
    neutral: ['bg-foreground', 'text-text-inverse'],
    green: ['bg-success', 'text-success-foreground'],
    indigo: ['bg-info', 'text-info-foreground'],
    red: ['bg-danger', 'text-danger-foreground'],
    amber: ['bg-warning', 'text-warning-foreground'],
    yellow: ['bg-warning', 'text-warning-foreground'],
    rose: ['bg-attention', 'text-attention-foreground'],
    teal: ['bg-discovery', 'text-discovery-foreground']
  })
};

export const Variants = {
  parameters: { docs: { description: { story: '`variant` sets the emphasis for a tone, from filled `solid` to text-only `ghost`.' } } },
  render: () => <Row>{Object.keys(variants).map((variant) => <Pill key={variant} variant={variant} tone='green'>{variant}</Pill>)}</Row>,
  play: ({ canvasElement }) => expectClasses(canvasElement, {
    solid: ['bg-success', 'text-success-foreground'],
    soft: ['bg-success-subtle', 'text-success'],
    outline: ['border', 'border-success-border'],
    ghost: ['text-success'],
    subtle: ['text-success']
  })
};

export const Sizes = {
  parameters: { docs: { description: { story: '`size` scales padding and text for dense tables through to headings.' } } },
  render: () => <Row>{Object.keys(sizes).map((size) => <Pill key={size} size={size} variant='soft'>{size}</Pill>)}</Row>,
  play: ({ canvasElement }) => expectClasses(canvasElement, {
    xs: ['text-xs', 'px-1.5'],
    sm: ['text-xs', 'px-2'],
    md: ['text-xs', 'px-2.5'],
    lg: ['text-sm', 'px-3']
  })
};

export const LinkedAndStatus = {
  parameters: { docs: { description: { story: '`href` renders a tag link, and `pulse` adds a decorative live dot beside the status text.' } } },
  render: () => (
    <Row>
      <Pill href='/blog/tags/engineering' tone='gray' variant='soft'>Engineering</Pill>
      <Pill tone='green' variant='soft' pulse>Stable</Pill>
    </Row>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Engineering' });
    await expect(link).toHaveAttribute('href', '/blog/tags/engineering');
    await expect(link).toHaveClass('bg-surface-muted', 'text-text-muted');
    await expect(pill(canvasElement, 'Stable').querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  }
};
