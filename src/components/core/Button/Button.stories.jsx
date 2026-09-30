import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource, previewSource } from '../../../../.storybook/stories/previewSource';
import { publicSource } from '../../../../.storybook/stories/PatternStoryHelpers';
import { ControlsExample } from '../../../../.storybook/fixtures/button/ControlsExample';
import controlsSource from '../../../../.storybook/fixtures/button/ControlsExample.jsx?raw';
import { RegistryIcon } from '../../../icons/RegistryIcon';
import Button, { buttonTones, buttonVariants } from './Button';

const docs = getComponentDocs('Core/Button');
const variants = Object.keys(buttonVariants.variants.variant);
const heights = { xs: 24, sm: 28, md: 32, lg: 36 };
const iconSize = (size) => (size === 'md' ? 'icon' : `icon-${size}`);
const height = (element) => element.getBoundingClientRect().height;
const Row = ({ children }) => <div className='flex flex-wrap items-center gap-3'>{children}</div>;

// An editor footer: the primary action follows every control; the supporting actions share its size and radius.
const supporting = [
  { label: 'Share draft', icon: 'Share2Icon', variant: 'outline', tone: 'neutral' },
  { label: 'Cancel', variant: 'ghost', tone: 'neutral' },
  { label: 'Save draft', variant: 'outline', tone: 'neutral' }
];
const supportingSource = ({ size, radius }) => supporting.map(({ label, icon, variant, tone }) => (icon
  ? `<Button size='${iconSize(size)}' radius='${radius}' variant='${variant}' tone='${tone}' aria-label='${label}'>\n  <RegistryIcon lucide='${icon}' aria-hidden='true' />\n</Button>\n`
  : `<Button size='${size}' radius='${radius}' variant='${variant}' tone='${tone}'>${label}</Button>\n`)).join('');

export default {
  title: 'Core/Button',
  id: 'core-button',
  component: Button,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    children: 'text',
    variant: variants,
    tone: [...buttonTones],
    size: Object.keys(heights),
    radius: ['sm', 'md', 'lg', 'full'],
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { children: 'Publish article', variant: 'solid', tone: 'accent', size: 'md', radius: 'md', disabled: false, onClick: fn() },
  parameters: {
    docs: {
      description: { story: 'An editor footer. The primary action follows every control; the icon-only share, Cancel and Save draft actions keep their neutral treatments and share the size, so heights always line up.' },
      source: {
        ...playgroundSource('Button'),
        transform: (_source, { args }) => previewSource('Button', args, {
          imports: "import { Button } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';",
          before: supportingSource(args)
        })
      }
    }
  },
  render: ({ size, radius, ...args }) => (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {supporting.map(({ label, icon, ...props }) => (icon ? (
        <Button key={label} {...props} size={iconSize(size)} radius={radius} aria-label={label}>
          <RegistryIcon lucide={icon} aria-hidden='true' />
        </Button>
      ) : <Button key={label} {...props} size={size} radius={radius}>{label}</Button>))}
      <Button {...args} size={size} radius={radius} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: args.children });
    const { radius, size, tone, variant } = args;
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass(...buttonVariants({ radius, size, tone, variant }).split(' '));
    for (const { label } of supporting) await expect(height(canvas.getByRole('button', { name: label }))).toBe(heights[size]);
    await expect(height(button)).toBe(heights[size]);
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(args.disabled ? 0 : 1);
  }
};

export const Variants = {
  parameters: { docs: { description: { story: 'Five treatments set the action hierarchy at the same 32px height.' } } },
  render: () => <Row>{variants.map((variant) => <Button key={variant} variant={variant}>{variant}</Button>)}</Row>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'solid' })).toHaveClass('bg-accent', 'text-accent-foreground');
    await expect(canvas.getByRole('button', { name: 'soft' })).toHaveClass('bg-accent-subtle', 'text-accent');
    await expect(canvas.getByRole('button', { name: 'outline' })).toHaveClass('border', 'border-accent-muted', 'text-accent');
    await expect(canvas.getByRole('button', { name: 'subtle' })).toHaveClass('p-0', 'text-accent');
    for (const button of canvas.getAllByRole('button')) await expect(height(button)).toBe(32);
  }
};

export const Tones = {
  parameters: { docs: { description: { story: 'Semantic tones carry meaning; pick them by intent, not colour.' } } },
  render: () => <Row>{buttonTones.map((tone) => <Button key={tone} tone={tone}>{tone}</Button>)}</Row>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'neutral' })).toHaveClass('bg-foreground', 'text-text-inverse');
    for (const tone of buttonTones.filter((name) => name !== 'neutral')) {
      await expect(canvas.getByRole('button', { name: tone })).toHaveClass(`bg-${tone}`, `text-${tone}-foreground`);
    }
  }
};

export const Sizes = {
  parameters: { docs: { description: { story: 'Text and icon-only sizes share heights: xs 24px, sm 28px, md 32px, lg 36px.' } } },
  render: () => (
    <Row>
      {Object.keys(heights).map((size) => (
        <div key={size} className='flex items-center gap-2'>
          <Button size={size}><RegistryIcon lucide='PlusIcon' aria-hidden='true' />Button {size}</Button>
          <Button size={iconSize(size)} variant='outline' aria-label={`Settings ${size}`}>
            <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
          </Button>
        </div>
      ))}
    </Row>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [size, px] of Object.entries(heights)) {
      const icon = canvas.getByRole('button', { name: `Settings ${size}` });
      await expect(height(canvas.getByRole('button', { name: `Button ${size}` }))).toBe(px);
      await expect(height(icon)).toBe(px);
      await expect(icon.getBoundingClientRect().width).toBe(px);
    }
  }
};

export const States = {
  parameters: { docs: { description: { story: 'Disabled buttons use the native attribute; `href` renders an internal link or a new-tab external anchor.' } } },
  render: () => (
    <Row>
      <Button disabled>Disabled action</Button>
      <Button href='/blog' variant='outline'>Internal link</Button>
      <Button href='https://example.com' variant='soft'>External link</Button>
    </Row>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const internal = canvas.getByRole('link', { name: 'Internal link' });
    const external = canvas.getByRole('link', { name: 'External link' });
    await expect(canvas.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
    await expect(new URL(internal.href).pathname).toBe('/blog');
    await expect(internal).toHaveClass('border', 'border-accent-muted', 'text-accent');
    await expect(internal).not.toHaveAttribute('target');
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', expect.stringContaining('noopener'));
  }
};

export const WithControls = {
  parameters: {
    docs: {
      description: { story: 'Inputs, selects, and buttons share a 32px default height. Match `sm` or `lg` for sized controls and the corresponding icon size. Keep visible labels or accessible names on every control.' },
      source: { code: publicSource(controlsSource), language: 'jsx' }
    }
  },
  render: () => <ControlsExample />,
  play: async ({ canvasElement }) => {
    for (const row of canvasElement.querySelectorAll('[data-control-row]')) {
      for (const button of row.querySelectorAll(':scope > button')) await expect(height(button)).toBe(height(row.firstElementChild));
    }
  }
};
