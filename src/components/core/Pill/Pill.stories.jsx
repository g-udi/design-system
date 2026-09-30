import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Pill, { pillVariants } from './Pill';

const docs = getComponentDocs('Core/Pill');
const { radius: radii, size: sizes, tone: tones, variant: variants } = pillVariants.variants;
const pill = (canvasElement, text) => within(canvasElement).getByText(text).parentElement;
const expectClasses = async (canvasElement, expected) => {
  for (const [text, classes] of Object.entries(expected)) await expect(pill(canvasElement, text)).toHaveClass(...classes);
};
const Row = ({ children }) => <div className='flex flex-wrap items-center gap-2'>{children}</div>;

export default {
  title: 'Core/Pill',
  id: 'core-pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    children: 'text',
    size: Object.keys(sizes),
    tone: Object.keys(tones),
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
  args: { children: 'Engineering', size: 'md', tone: 'blue', variant: 'solid', radius: 'sm', pulse: false },
  parameters: {
    docs: {
      source: playgroundSource('Pill', { imports: "import { Pill } from '@gaudi/design-system';" })
    }
  },
  render: (args) => <Pill {...args} />,
  play: async ({ args, canvasElement }) => {
    const element = pill(canvasElement, args.children);
    await expect(element.tagName).toBe('SPAN');
    await expect(getComputedStyle(element).textTransform).toBe('none');
    await expect(within(canvasElement).queryByRole('link')).toBeNull();
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
