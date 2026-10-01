import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { distinctOptions, docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { AnimatedIcon } from '../../../icons';
import Button from '../Button';
import Icon, { iconColors, iconSizes } from './Icon';

const docs = getComponentDocs('Core/Icon');
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
// Aliases such as `info` and `blue` render like `primary`; offer each look once.
const semanticColors = ['neutral', 'muted', 'primary', 'success', 'warning', 'danger', 'attention'];
const colors = distinctOptions([...new Set([...semanticColors, ...Object.keys(iconColors)])], (color) => iconColors[color]);
const strokeWidths = [1, 1.5, 2, 2.5, 3];
const svgs = (canvasElement) => Array.from(canvasElement.querySelectorAll('svg'));

export default {
  title: 'Core/Icon',
  id: 'core-icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    name: ['Search', 'BookOpen', 'Github', 'Mail', 'Info', 'Warning', 'CopyIcon', 'CheckIcon', 'FolderOpen', 'javascript'],
    size: sizes,
    color: colors,
    label: 'text',
    decorative: 'boolean',
    strokeWidth: 'number'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <div className='flex flex-wrap items-center gap-4'><Story /></div>]
};

// An icon picker: the featured tile follows every control; its neighbours share `size` and `strokeWidth`.
const companions = [['Search', 'Search', 'muted'], ['AtSign', 'Mention', 'info'], ['CheckIcon', 'Done', 'success'], ['Warning', 'Warning', 'warning'], ['FolderOpen', 'Folder', 'amber']];
const tile = 'flex min-w-20 flex-col items-center justify-center gap-2 rounded-lg border p-3 text-xs';

export const Playground = {
  args: { name: 'Info', size: 'xl', color: 'primary', label: 'More information', decorative: false, strokeWidth: 1.5 },
  parameters: {
    docs: {
      description: { story: 'An icon picker. The highlighted tile follows every control and captions its accessible name, or shows that it is hidden when `decorative`. `size` and `strokeWidth` apply to every tile.' },
      source: playgroundSource('Icon', { imports: "import { Icon } from '@gaudi/design-system';" })
    }
  },
  render: (args) => (
    <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
      <figure className={`${tile} m-0 border-accent-muted bg-accent-subtle`}>
        <Icon {...args} />
        <figcaption className={args.decorative ? 'italic text-text-muted' : 'font-medium'}>{args.decorative ? 'Decorative' : args.label}</figcaption>
      </figure>
      {companions.map(([name, caption, color]) => (
        <figure key={name} className={`${tile} m-0 border-border text-text-muted`}>
          <Icon name={name} color={color} size={args.size} strokeWidth={args.strokeWidth} decorative />
          <figcaption>{caption}</figcaption>
        </figure>
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const icons = svgs(canvasElement);
    const [featured] = icons;
    await expect(icons).toHaveLength(companions.length + 1);
    for (const icon of icons) {
      await expect(icon).toHaveClass(iconSizes[args.size].split(' ')[0]);
      if (args.strokeWidth) await expect(icon).toHaveAttribute('stroke-width', String(args.strokeWidth));
    }
    if (args.color) await expect(featured).toHaveClass(iconColors[args.color].split(' ')[0]);
    if (args.decorative) {
      await expect(featured).toHaveAttribute('aria-hidden', 'true');
      await expect(within(canvasElement).queryByRole('img')).toBeNull();
      await expect(within(canvasElement).getByText('Decorative')).toBeVisible();
    } else {
      await expect(within(canvasElement).getByRole('img', { name: args.label })).toBe(featured);
    }
  }
};

export const SocialLink = {
  parameters: { docs: { description: { story: '`kind` with `href` renders a labelled icon link. External URLs open in a new tab and `mailto:` links stay in place.' } } },
  render: () => (
    <>
      <Icon kind='github' href='https://github.com/ahmadassaf' />
      <Icon kind='linkedin' href='https://www.linkedin.com' />
      <Icon kind='youtube' href='https://youtube.com' />
      <Icon kind='mail' href='mailto:hello@example.com' />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const github = canvas.getByRole('link', { name: 'GitHub profile' });
    await expect(github).toHaveAttribute('target', '_blank');
    await expect(github).toHaveAttribute('rel', expect.stringContaining('noopener'));
    await expect(canvas.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
  }
};

const tokenRow = (label, children) => (
  <div className='grid grid-cols-[5rem_1fr] items-center gap-3' data-row={label}>
    <span className='text-xs text-text-muted'>{label}</span>
    <div className='flex flex-wrap items-center gap-3'>{children}</div>
  </div>
);
const row = (canvasElement, label) => canvasElement.querySelector(`[data-row="${label}"]`);
export const Sizes = {
  name: 'Sizes, colors and stroke widths',
  parameters: { docs: { description: { story: 'Token sizes from `xs` to `2xl`, semantic and palette colors (omit `color` to inherit `currentColor`), and `strokeWidth` on line icons; filled icons ignore it. Decorative icons are hidden from assistive technology.' } } },
  decorators: [(Story) => <div className='grid w-full gap-3'><Story /></div>],
  render: () => (
    <>
      {tokenRow('Size', sizes.map((size) => <Icon key={size} name='Search' decorative size={size} />))}
      {tokenRow('Color', Object.keys(iconColors).map((color) => <Icon key={color} name='Info' label={color} color={color} size='lg' />))}
      {tokenRow('Stroke', (
        <>
          {strokeWidths.map((strokeWidth) => <Icon key={strokeWidth} name='BookOpen' decorative size='lg' strokeWidth={strokeWidth} />)}
          <Icon name='Github' label='Filled GitHub mark' size='lg' strokeWidth={3} />
        </>
      ))}
    </>
  ),
  play: async ({ canvasElement }) => {
    const sized = svgs(row(canvasElement, 'Size'));
    for (const icon of sized) await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(sized.map((icon) => icon.getAttribute('class').match(/\bsize-\d+/)[0])).toEqual(['size-3', 'size-4', 'size-5', 'size-6', 'size-8', 'size-10']);
    const icon = (name) => within(row(canvasElement, 'Color')).getByRole('img', { name });
    await expect(icon('danger')).toHaveClass('text-red-600');
    await expect(icon('warning')).toHaveClass('text-amber-700');
    await expect(icon('attention')).toHaveClass('text-rose-700');
    await expect(icon('teal')).toHaveClass('text-teal-700');
    const stroked = svgs(row(canvasElement, 'Stroke'));
    const [filled, ...line] = [stroked.at(-1), ...stroked.slice(0, -1)];
    await expect(line.map((item) => Number(item.getAttribute('stroke-width')))).toEqual(strokeWidths);
    // A filled brand glyph keeps its own zero stroke, so it stays crisp.
    await expect(filled).toHaveAccessibleName('Filled GitHub mark');
    await expect(filled).toHaveAttribute('stroke-width', '0');
  }
};

const animated = [['Bell', 'Notification', 'primary'], ['RefreshCw', 'Sync', 'info'], ['Rocket', 'Launch', 'success'], ['Calendar', 'Schedule', 'muted']];
function AnimatedExample() {
  const [active, setActive] = useState(false);
  return (
    <>
      <Button variant='outline' size='sm' aria-pressed={active} onClick={() => setActive(!active)}>
        {active ? 'Stop animations' : 'Play animations'}
      </Button>
      {animated.map(([name, label, color]) => <AnimatedIcon key={name} name={name} label={label} color={color} size='xl' active={active} />)}
    </>
  );
}
export const AnimatedMotion = {
  name: 'Animated icons',
  parameters: { docs: { description: { story: '`AnimatedIcon` moves only while the host sets `active`. One-shot icons replay on the next activation, and reduced motion keeps the resting artwork.' } } },
  render: () => <AnimatedExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const activeIcons = () => canvasElement.querySelectorAll('[data-animated-icon-active="true"]');
    for (let replay = 0; replay < 2; replay += 1) {
      await userEvent.click(canvas.getByRole('button', { name: 'Play animations' }));
      await waitFor(() => expect(activeIcons()).toHaveLength(animated.length));
      await userEvent.click(canvas.getByRole('button', { name: 'Stop animations' }));
      await expect(activeIcons()).toHaveLength(0);
    }
  }
};
