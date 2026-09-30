import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fireEvent, spyOn, userEvent, waitFor, within } from 'storybook/test';
import Icon from './Icon';
import { AnimatedIconActions, AnimatedIconMotion, AnimatedIconsGallery } from '../../../../.storybook/stories/AnimatedIconExamples';

const componentDocs = getComponentDocs('Core/Icon');

export default {
  argTypes: {
    'color': {
      'control': 'select',
      'options': [ undefined, 'neutral', 'muted', 'primary', 'info', 'success', 'warning', 'danger', 'attention', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'dim' ]
    },
    'name': {
      'control': 'select',
      'options': [ 'Search', 'BookOpen', 'Github', 'Linkedin', 'Medium', 'Twitter', 'Mail', 'Info', 'Warning', 'CopyIcon', 'CheckIcon', 'FolderOpen', 'javascript' ]
    },
    'size': {
      'control': 'select',
      'options': [ 'xs', 'sm', 'md', 'lg', 'xl', '2xl' ]
    }
  },
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-icon',
  title: 'Core/Icon'
};

export const RegistryIcon = {
  'args': {
    'decorative': true,
    'name': 'Search',
    'size': 'md'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const decorativeIcon = canvasElement.querySelector('svg');

    await expect(canvas.queryByRole('img')).toBeNull();
    await expect(decorativeIcon).toHaveAttribute('aria-hidden', 'true');
    await expect(decorativeIcon).toHaveClass('h-5', 'w-5');
  }
};

export const SocialLink = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const githubLink = canvas.getByRole('link', { 'name': 'GitHub profile' });
    const mailLink = canvas.getByRole('link', { 'name': 'Email' });

    await expect(githubLink).toHaveAttribute('href', 'https://github.com/ahmadassaf');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    await expect(mailLink).toHaveAttribute('href', 'mailto:hello@example.com');
    await expect(mailLink).not.toHaveAttribute('target');
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      <Icon kind='github' href='https://github.com/ahmadassaf' />
      <Icon kind='linkedin' href='https://www.linkedin.com' />
      <Icon kind='twitter' href='https://x.com' />
      <Icon kind='youtube' href='https://youtube.com' />
      <Icon kind='mail' href='mailto:hello@example.com' />
    </div>
  )
};

export const LabeledIcon = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('img', { 'name': 'More information' });

    await expect(icon).toHaveAttribute('aria-label', 'More information');
    await expect(icon).toHaveClass('h-6', 'w-6', 'text-blue-600');
    await expect(icon).not.toHaveAttribute('aria-hidden', 'true');
  },
  'render': () => (
    <div className='p-6'>
      <Icon name='Info' label='More information' color='primary' size='lg' />
    </div>
  )
};

export const Sizes = {
  'play': async ({ canvasElement }) => {
    const icons = Array.from(canvasElement.querySelectorAll('svg'));

    await expect(icons).toHaveLength(6);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
    await expect(icons.map((icon) => icon.getAttribute('class'))).toEqual([
      expect.stringContaining('h-3 w-3'),
      expect.stringContaining('h-4 w-4'),
      expect.stringContaining('h-5 w-5'),
      expect.stringContaining('h-6 w-6'),
      expect.stringContaining('h-8 w-8'),
      expect.stringContaining('h-10 w-10')
    ]);
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {[ 'xs', 'sm', 'md', 'lg', 'xl', '2xl' ].map((size) => (
        <Icon key={ size } name='Search' decorative size={ size } />
      ))}
    </div>
  )
};

export const Colors = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    [
      'neutral',
      'muted',
      'primary',
      'info',
      'success',
      'warning',
      'danger',
      'attention',
      'blue',
      'teal',
      'green',
      'amber',
      'yellow',
      'red',
      'rose',
      'dim'
    ].forEach((color) => {
      expect(canvas.getByRole('img', { 'name': `${color} information icon` })).toBeVisible();
    });
    expect(canvas.getByRole('img', { 'name': 'danger information icon' })).toHaveClass('text-red-600');
    expect(canvas.getByRole('img', { 'name': 'warning information icon' })).toHaveClass('text-amber-700');
    expect(canvas.getByRole('img', { 'name': 'attention information icon' })).toHaveClass('text-rose-700');
    expect(canvas.getByRole('img', { 'name': 'teal information icon' })).toHaveClass('text-teal-700');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4 p-6'>
      {[ 'neutral', 'muted', 'primary', 'info', 'success', 'warning', 'danger', 'attention', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'dim' ].map((color) => (
        <Icon key={ color } name='Info' label={ `${color} information icon` } color={ color } size='lg' />
      ))}
    </div>
  )
};

export const StrokeWidths = {
  'play': async ({ canvasElement }) => {
    const icons = Array.from(canvasElement.querySelectorAll('svg'));

    await expect(icons).toHaveLength(5);
    await expect(icons.map((icon) => icon.getAttribute('stroke-width'))).toEqual([ '1', '1.5', '2', '2.5', '3' ]);
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {[ 1, 1.5, 2, 2.5, 3 ].map((strokeWidth) => (
        <Icon key={ strokeWidth } name='BookOpen' decorative size='lg' strokeWidth={ strokeWidth } />
      ))}
    </div>
  )
};

export const AnimatedCatalogue = {
  name: 'Interactive icon catalogue',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Search all animated names, filter by motion style, hover or focus to preview, and copy public usage. Gaudi aliases retain their original artwork.' },
      source: { code: `import { useState } from 'react';
import { Button } from '@gaudi/design-system';
import { AnimatedIcon } from '@gaudi/design-system/icons';

export function SaveArticle() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Button aria-pressed={saved} onClick={() => setSaved(!saved)}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <AnimatedIcon name="Bookmark" active={hovered || focused} size="sm" decorative />
      {saved ? 'Saved' : 'Save article'}
    </Button>
  );
}` }
    }
  },
  render: () => <AnimatedIconsGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search animated icons' });
    await expect(canvas.getAllByRole('button', { name: /^Copy .* animated icon$/ })).toHaveLength(24);
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await expect(canvas.getByText(/Page 2 of/)).toBeVisible();
    search.focus();
    fireEvent.change(search, { target: { value: 'Bell' } });
    const bell = canvas.getByRole('button', { name: 'Copy Bell animated icon', exact: true });
    await waitFor(() => expect(bell.querySelector('[data-icon-artwork]')).toBeInTheDocument());
    await userEvent.hover(bell);
    await waitFor(() => expect(bell.querySelector('svg')).toHaveAttribute('data-animated-icon-active', 'true'));
    await userEvent.unhover(bell);
    await expect(bell.querySelector('svg')).toHaveAttribute('data-animated-icon-active', 'false');
    search.focus();
    await userEvent.tab();
    // Style, preview toggle, then the first result.
    await userEvent.tab();
    await userEvent.tab();
    await expect(bell).toHaveFocus();
    await expect(bell.querySelector('svg')).toHaveAttribute('data-animated-icon-active', 'true');
    // The headless runner cannot access the system clipboard. Verify the payload
    // and feedback here; the real clipboard is checked in the live gallery.
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    try {
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(canvas.getByRole('status', { name: 'Icon copy status' })).toHaveTextContent('Copied Bell usage.'));
      await expect(writeText).toHaveBeenCalledWith('import { AnimatedIcon } from \'@gaudi/design-system/icons\';\n\n<AnimatedIcon name="Bell" active={isActive} size="md" decorative />');
    } finally { writeText.mockRestore(); }
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Animate previews' }));
    await userEvent.hover(bell);
    await expect(bell.querySelector('svg')).toHaveAttribute('data-animated-icon-active', 'false');
    await userEvent.unhover(bell);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Animate previews' }));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Animation style' }), 'gaudi-draw');
    await expect(canvas.queryByRole('button', { name: 'Copy Bell animated icon', exact: true })).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'not-an-icon' } });
    await expect(canvas.getByText('No animated icons match “not-an-icon”.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset search' }));
    await expect(search).toHaveValue('');
    await expect(canvas.getAllByRole('button', { name: /^Copy .* animated icon$/ })).toHaveLength(24);
    window.scrollTo(0, 0);
  }
};

export const AnimatedActions = {
  name: 'Animated actions and status',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Save a reading-list item, start or stop a sync preview, and preserve a disabled export action. Host controls own focus, pressed state, and action callbacks.' },
      source: { code: `import { useState } from 'react';
import { Button } from '@gaudi/design-system';
import { AnimatedIcon } from '@gaudi/design-system/icons';

export function SyncPreview() {
  const [syncing, setSyncing] = useState(false);
  return (
    <Button aria-pressed={syncing} onClick={() => setSyncing(!syncing)}>
      <AnimatedIcon name="RefreshCw" active={syncing} size="sm" decorative />
      {syncing ? 'Stop sync preview' : 'Preview sync'}
    </Button>
  );
}` }
    }
  },
  render: () => <AnimatedIconActions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save to reading list' }));
    await expect(canvas.getByRole('button', { name: 'Saved to reading list' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Preview sync' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-animated-icon="RefreshCw"]')).toHaveAttribute('data-animated-icon-active', 'true'));
    await userEvent.click(canvas.getByRole('button', { name: 'Stop sync preview' }));
    await expect(canvasElement.querySelector('[data-animated-icon="RefreshCw"]')).toHaveAttribute('data-animated-icon-active', 'false');
    await expect(canvas.getByRole('button', { name: 'Export unavailable' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Saved to reading list' }));
  }
};

export const AnimatedMotion = {
  name: 'Controlled motion and replay',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Play and interrupt notification, activity, launch, and original-artwork draw animations. Size and semantic color follow Gaudi’s icon tokens.' },
      source: { code: `import { useState } from 'react';
import { Button } from '@gaudi/design-system';
import { AnimatedIcon } from '@gaudi/design-system/icons';

export function LaunchPreview() {
  const [active, setActive] = useState(false);
  return (
    <div>
      <Button aria-pressed={active} onClick={() => setActive(!active)}>
        {active ? 'Stop animation' : 'Play animation'}
      </Button>
      <AnimatedIcon name="Rocket" active={active} size="2xl" color="success" label="Launch preview" />
    </div>
  );
}` }
    }
  },
  render: () => <AnimatedIconMotion />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (let replay = 0; replay < 2; replay += 1) {
      await userEvent.click(canvas.getByRole('button', { name: 'Play animations' }));
      await waitFor(() => expect(canvasElement.querySelectorAll('[data-animated-icon-active="true"]')).toHaveLength(4));
      await userEvent.click(canvas.getByRole('button', { name: 'Stop animations' }));
      await expect(canvasElement.querySelectorAll('[data-animated-icon-active="true"]')).toHaveLength(0);
    }
  }
};
