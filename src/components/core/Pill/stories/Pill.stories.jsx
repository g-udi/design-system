import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { distinctOptions, docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import Pill, { pillVariants } from '../Pill';
import { Badge } from '../Badge.jsx';

const docs = getComponentDocs('Core/Pill');
const { radius: radii, size: sizes, tone: tones, variant: variants } = pillVariants.variants;
// Aliases such as `yellow` render like `amber` in every variant; offer each look once.
const distinctTones = distinctOptions(Object.keys(tones), (tone) => Object.keys(variants).map((variant) => pillVariants({ tone, variant })).join('|'));
const pill = (canvasElement, text) => within(canvasElement).getByText(text).parentElement;
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
    await expect(element).toHaveClass(...pillVariants({ radius, size, tone, variant }).split(' '));
    await expect(element).toHaveAttribute('data-slot', 'badge');
    await expect(Boolean(element.querySelector('.animate-ping'))).toBe(args.pulse);
    const link = within(canvasElement).getByRole('link', { name: '#tokens' });
    await expect(link).toHaveAttribute('href', '/blog/tags/tokens');
    await expect(link).toHaveClass(radii[args.radius]);
  }
};

const inRow = (canvasElement, variant, tone) => within(canvasElement.querySelector(`[data-row="${variant}"]`)).getByText(tone).parentElement;
export const Tones = {
  parameters: { docs: { description: { story: 'Every tone in every variant. Tone names map to semantic colours, so `yellow` matches `amber` and `gray` is the muted metadata tone.' } } },
  render: () => (
    <div className='grid w-fit grid-cols-[auto_1fr] items-center gap-x-3'>
      {Object.keys(variants).map((variant) => (
        <div key={variant} className='contents'>
          <span className='text-xs text-text-muted'>{variant}</span>
          <div data-row={variant} className='flex flex-wrap items-center'>
            {distinctTones.map((tone) => <Pill key={tone} tone={tone} variant={variant} size='sm'>{tone}</Pill>)}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const expected = [
      ['solid', 'blue', ['bg-accent', 'text-accent-foreground']],
      ['soft', 'green', ['bg-success-subtle', 'text-success']],
      ['outline', 'red', ['border', 'border-danger-border']],
      ['soft', 'gray', ['bg-surface-muted', 'text-text-muted']],
      ['ghost', 'teal', ['text-discovery']],
      ['subtle', 'indigo', ['text-info']]
    ];
    for (const [variant, tone, classes] of expected) await expect(inRow(canvasElement, variant, tone)).toHaveClass(...classes);
  }
};

const semanticTones = ['info', 'success', 'discovery', 'attention'];
const treatments = [['solid', ''], ['light', '-light'], ['outline', '-outline']];
export const SemanticBadges = {
  parameters: {
    docs: {
      description: {
        story:
          'The semantic `Badge` variants side by side. `discovery` marks suggested or generated labels, such as tags an assistant proposed; `attention` marks records that need a person to look, such as staged or unreviewed items. Both come in solid, `-light` and `-outline` like `info` and `success`, and keep the meaning in the text.'
      },
      source: {
        code: "import { Badge } from '@gaudi/design-system';\n\n<>\n<Badge variant='discovery-light'>Suggested</Badge>\n<Badge variant='attention-light'>Needs review</Badge>\n<Badge variant='discovery'>AI</Badge>\n<Badge variant='attention-outline'>Staging</Badge>\n</>"
      }
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-lg'><Story /></ExampleFrame>],
  render: () => (
    <div className='grid gap-4'>
      <div className='grid w-fit grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2'>
        {treatments.map(([name, suffix]) => (
          <div key={name} className='contents'>
            <span className='text-xs text-text-muted'>{name}</span>
            <div data-row={name} className='flex flex-wrap items-center gap-1.5'>
              {semanticTones.map((tone) => <Badge key={tone} variant={`${tone}${suffix}`}>{tone}</Badge>)}
            </div>
          </div>
        ))}
      </div>
      <div className='grid gap-1 rounded-lg border border-border px-3 py-2.5'>
        <span className='text-sm font-medium text-foreground'>Field notes on knowledge graphs</span>
        <span className='flex flex-wrap items-center gap-1.5'>
          <Badge variant='secondary'>research</Badge>
          <Badge variant='discovery-light'>graphs · suggested</Badge>
          <Badge variant='discovery-light'>search · suggested</Badge>
          <Badge variant='attention-light'>Needs review</Badge>
        </span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = (row, tone) => within(canvasElement.querySelector(`[data-row="${row}"]`)).getByText(tone);
    await expect(badge('solid', 'discovery')).toHaveClass('bg-discovery', 'text-discovery-foreground');
    await expect(badge('solid', 'attention')).toHaveClass('bg-attention', 'text-attention-foreground');
    await expect(badge('light', 'discovery')).toHaveAttribute('data-variant', 'discovery-light');
    await expect(badge('light', 'attention')).toHaveClass('text-ui-attention-ink');
    await expect(badge('outline', 'discovery')).toHaveClass('text-ui-discovery-ink');
  }
};
