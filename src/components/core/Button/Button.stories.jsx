import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource, previewSource } from '../../../../.storybook/stories/previewSource';
import { RegistryIcon } from '../../../icons/RegistryIcon';
import Button, { buttonTones, buttonVariants } from './Button';

const docs = getComponentDocs('Core/Button');
const variants = Object.keys(buttonVariants.variants.variant);
const heights = { xs: 24, sm: 28, md: 32, lg: 36 };
const iconSize = (size) => (size === 'md' ? 'icon' : `icon-${size}`);
const height = (element) => element.getBoundingClientRect().height;
const Row = ({ children }) => <div className='flex flex-wrap items-center gap-2'>{children}</div>;

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

const tonesShown = ['accent', 'neutral', 'danger', 'success'];

export const Variants = {
  name: 'Variants, tones and sizes',
  parameters: { docs: { description: { story: 'Variant sets the action hierarchy, tone carries meaning, and size keeps text and icon-only buttons on one height scale: xs 24px, sm 28px, md 32px, lg 36px.' } } },
  render: () => (
    <div className='grid grid-cols-[auto_repeat(5,auto)] items-center justify-start justify-items-start gap-x-2 gap-y-2 text-xs text-text-muted'>
      <span />
      {variants.map((variant) => <span key={variant}>{variant}</span>)}
      {tonesShown.map((tone) => [
        <span key={tone}>{tone}</span>,
        ...variants.map((variant) => <Button key={`${tone}-${variant}`} tone={tone} variant={variant} size='sm'>Save</Button>)
      ])}
      <span className='mt-1'>sizes</span>
      <div className='col-span-5 mt-1 flex flex-wrap items-center gap-2'>
        {Object.keys(heights).map((size) => (
          <div key={size} className='flex items-center gap-1'>
            <Button size={size}>Button {size}</Button>
            <Button size={iconSize(size)} variant='outline' tone='neutral' aria-label={`Settings ${size}`}>
              <RegistryIcon lucide='Settings2Icon' aria-hidden='true' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const saves = canvas.getAllByRole('button', { name: 'Save' });
    await expect(saves).toHaveLength(tonesShown.length * variants.length);
    await expect(saves[variants.indexOf('solid')]).toHaveClass('bg-accent', 'text-accent-foreground');
    for (const [size, px] of Object.entries(heights)) {
      const icon = canvas.getByRole('button', { name: `Settings ${size}` });
      await expect(height(canvas.getByRole('button', { name: `Button ${size}` }))).toBe(px);
      await expect(height(icon)).toBe(px);
      await expect(icon.getBoundingClientRect().width).toBe(px);
    }
  }
};

export const States = {
  name: 'Links and disabled',
  parameters: { docs: { description: { story: 'Pass `href` to render a link that looks like a button: internal paths navigate in place, external URLs open in a new tab, and `disabled` works on both.' } } },
  render: () => (
    <Row>
      <Button disabled>Disabled action</Button>
      <Button href='/blog' variant='outline'>Internal link</Button>
      <Button href='https://example.com' variant='soft'>External link</Button>
      <Button href='/blog' variant='outline' tone='neutral' disabled>Disabled link</Button>
    </Row>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const internal = canvas.getByRole('link', { name: 'Internal link' });
    const external = canvas.getByRole('link', { name: 'External link' });
    await expect(canvas.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
    await expect(new URL(internal.href).pathname).toBe('/blog');
    await expect(internal).not.toHaveAttribute('target');
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', expect.stringContaining('noopener'));
    await expect(canvas.getByText('Disabled link')).toHaveAttribute('aria-disabled', 'true');
  }
};
