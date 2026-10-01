import { useEffect, useRef, useState } from 'react';
import { expect, fireEvent, spyOn, userEvent, waitFor, within } from 'storybook/test';

import Icon from '../../src/components/core/Icon';

import { CheckList, CodeBlock, InlineCode, Page, Section, Table, Td, Th } from './StoryDocs';
import { AnimatedIconActions, AnimatedIconsGallery } from './AnimatedIconExamples';

const iconGroups = [
  {
    'icons': [ 'Home', 'Search', 'ChevronRight', 'ChevronDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'X' ],
    'name': 'Navigation'
  },
  {
    'icons': [ 'BookOpen', 'FileText', 'FolderOpen', 'Tags', 'Calendar', 'Clock', 'LinkIcon', 'LinkSlashIcon', 'PhotoIcon' ],
    'name': 'Content'
  },
  {
    'icons': [ 'Github', 'Linkedin', 'Twitter', 'Youtube', 'Mail', 'Star', 'Fork', 'Google', 'Apple', 'Microsoft' ],
    'name': 'Social & Repositories'
  },
  {
    'icons': [ 'Plus', 'Minus', 'CheckIcon', 'CopyIcon', 'Info', 'Warning', 'ExclamationTriangleIcon', 'FaceIdError' ],
    'name': 'Actions & Status'
  },
  {
    'icons': [ 'javascript', 'typescript', 'react', 'node', 'python', 'json', 'css', 'html', 'markdown', 'docker', 'git', 'file', 'folder', 'folder-open' ],
    'name': 'File Types'
  },
  {
    'icons': [ 'Workflow', 'Undo', 'Redo', 'Magnet', 'Pause', 'Hourglass', 'Unlink', 'ZoomIn', 'ZoomOut' ],
    'name': 'Canvas & Workflow'
  },
  {
    'icons': [ 'ChessKnight', 'HandshakeLine', 'ChartArea', 'Cubes', 'Codepen', 'Robot' ],
    'name': 'About Page'
  }
];

const copyWithTextArea = (value) => {
  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
};

const CopyButton = ({ children, label, value }) => {
  const [ copied, setCopied ] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async() => {
    let didCopy = false;

    if (navigator.clipboard?.writeText)
      try {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      } catch {
        didCopy = false;
      }

    if (!didCopy) copyWithTextArea(value);

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type='button'
      className='rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300'
      aria-label={ `Copy ${label}` }
      title={ `Copy ${label}` }
      onClick={ handleCopy }
    >
      {copied ? 'Copied' : children}
    </button>
  );
};

const IconTile = ({ name }) => {
  const jsx = `<Icon name='${name}' decorative />`;

  return (
    <div className='group rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'>
      <div className='relative mb-3 flex h-16 items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800'>
        <Icon name={ name } size='lg' decorative className='text-gray-800 dark:text-gray-100' />
        <div className='absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'>
          <CopyButton label={ `${name} JSX` } value={ jsx }>JSX</CopyButton>
        </div>
      </div>
      <div className='truncate font-mono text-xs text-gray-600 dark:text-gray-300' title={ name }>{name}</div>
    </div>
  );
};

export default {
  id: 'overview-icons',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Icons'
};

export const Default = {
  name: 'Icons',
  'render': () => (
    <Page
      title='Icons'
      intro='Icons used across the blog and applications are routed through the design-system icon registry. The registry centralizes vendor imports, aliases legacy names, keeps sizing consistent, and makes accessibility behavior explicit.'
    >
      <Section title='Interactive icons' description='Browse animated counterparts, preview their motion, and copy the import and JSX for your application.'>
        <AnimatedIconsGallery />
      </Section>

      <Section title='Icons in actions and status' description='The host button or application state controls animation. Keep a visible label for the action or status.'>
        <AnimatedIconActions />
        <CodeBlock code={`import { AnimatedIcon } from '@gaudi/design-system/icons';
import { Button } from '@gaudi/design-system';

<Button onClick={toggleSync} aria-pressed={isSyncing}>
  <AnimatedIcon name="RefreshCw" active={isSyncing} size="sm" decorative />
  {isSyncing ? 'Stop sync' : 'Start sync'}
</Button>`} />
        <p>Use the same size and color tokens as static icons. Motion stops with reduced motion, while offscreen, and in hidden tabs. <a className='text-blue-600 underline dark:text-blue-400' href='/?path=/docs/core-icon--docs'>Explore the Icon examples and API</a>.</p>
      </Section>

      <Section title='Icon Contract' description='The Gaudi icon component accepts a registry name, an optional size, optional color, and an accessibility mode.'>
        <Table>
          <thead><tr><Th>Use</Th><Th>Requirement</Th><Th>Example</Th></tr></thead>
          <tbody>
            <tr><Td>Decorative icon</Td><Td>Hide from assistive technology.</Td><Td mono>{ '<Icon name="Search" decorative />' }</Td></tr>
            <tr><Td>Standalone meaning</Td><Td>Provide an accessible label.</Td><Td mono>{ '<Icon name="Info" label="More information" />' }</Td></tr>
            <tr><Td>Social link</Td><Td>Use the same registry component with <InlineCode>href</InlineCode>.</Td><Td mono>{ '<Icon kind="github" href="..." />' }</Td></tr>
            <tr><Td>Legacy alias</Td><Td>Old Heroicon-style names resolve through the registry.</Td><Td mono>{ '<Icon name="BookOpenIcon" />' }</Td></tr>
            <tr><Td>Interactive artwork</Td><Td>Pass host interaction or status through active.</Td><Td mono>{ '<AnimatedIcon name="Bell" active={isActive} size="sm" />' }</Td></tr>
          </tbody>
        </Table>
      </Section>

      <Section title='Application Consumption' description='Consuming applications and Gaudi components consume icons through the registry only. Direct vendor imports are limited to src/icons/index.jsx in ahmadassaf/design-system.'>
        <CodeBlock code={ `import { Icon } from '@gaudi/design-system';

<Icon name='Search' size='sm' decorative />
<Icon name='Github' href='https://github.com/ahmadassaf' />

# Verification
rg "from ['"](@heroicons|react-icons|lucide-react|@tabler/icons-react)" src app layouts lib scripts | rg -v "src/icons/index.jsx"` } />
      </Section>

      <Section title='Sizing, Color & Stroke' description='Prefer Gaudi props for common changes. Use className only for local layout adjustments or one-off sizing inside tight UI.'>
        <div className='grid gap-4 lg:grid-cols-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Sizes</h3>
            <div className='flex items-end gap-4'>
              <Icon name='Search' size='xs' decorative />
              <Icon name='Search' size='sm' decorative />
              <Icon name='Search' size='md' decorative />
              <Icon name='Search' size='lg' decorative />
              <Icon name='Search' size='xl' decorative />
            </div>
            <p className='mt-3 text-xs leading-6 text-gray-600 dark:text-gray-300'>Use <InlineCode>xs</InlineCode>, <InlineCode>sm</InlineCode>, <InlineCode>md</InlineCode>, <InlineCode>lg</InlineCode>, <InlineCode>xl</InlineCode>, or <InlineCode>2xl</InlineCode>.</p>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Colors</h3>
            <div className='flex items-center gap-4'>
              <Icon name='Info' color='neutral' size='lg' decorative />
              <Icon name='Info' color='muted' size='lg' decorative />
              <Icon name='Info' color='primary' size='lg' decorative />
              <Icon name='Info' color='green' size='lg' decorative />
              <Icon name='Info' color='danger' size='lg' decorative />
            </div>
            <p className='mt-3 text-xs leading-6 text-gray-600 dark:text-gray-300'>Use semantic color props first. Use Tailwind text classes only when the icon must inherit local context.</p>
          </div>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Stroke</h3>
            <div className='flex items-center gap-4'>
              <Icon name='BookOpen' size='lg' strokeWidth={ 1.5 } decorative />
              <Icon name='BookOpen' size='lg' strokeWidth={ 2 } decorative />
              <Icon name='BookOpen' size='lg' strokeWidth={ 2.5 } decorative />
            </div>
            <p className='mt-3 text-xs leading-6 text-gray-600 dark:text-gray-300'>Lucide icons accept <InlineCode>strokeWidth</InlineCode>. Filled vendor icons ignore stroke props, so adjust them with size and color only.</p>
          </div>
        </div>

        <Table>
          <thead><tr><Th>Adjustment</Th><Th>Use</Th><Th>Example</Th></tr></thead>
          <tbody>
            <tr><Td>Size token</Td><Td>Standard icon sizes across UI.</Td><Td mono>{ '<Icon name="Search" size="sm" />' }</Td></tr>
            <tr><Td>Color token</Td><Td>Semantic status or UI color.</Td><Td mono>{ '<Icon name="Info" color="primary" />' }</Td></tr>
            <tr><Td>Stroke width</Td><Td>Line-weight tuning for stroke icons.</Td><Td mono>{ '<Icon name="BookOpen" strokeWidth={1.5} />' }</Td></tr>
            <tr><Td>className</Td><Td>Local spacing, alignment, or exceptional sizes.</Td><Td mono>{ '<Icon name="Clock" className="mr-1 h-3.5 w-3.5" />' }</Td></tr>
          </tbody>
        </Table>

        <CodeBlock code={ `<Icon name='Search' size='sm' color='muted' decorative />
<Icon name='Info' size='lg' color='primary' label='More information' />
<Icon name='BookOpen' size='md' strokeWidth={1.5} decorative />
<Icon name='Github' className='h-5 w-5 text-gray-800' decorative />` } />
      </Section>

      {iconGroups.map((group) => (
        <Section key={ group.name } title={ group.name }>
          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-6'>
            {group.icons.map((name) => <IconTile key={ name } name={ name } />)}
          </div>
        </Section>
      ))}

      <Section title='Extending The Registry' description='Add new icons in one place, expose a stable registry name, document the icon in Storybook, then consume it through the Gaudi Icon component.'>
        <div className='grid gap-4 lg:grid-cols-2'>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Workflow</h3>
            <CheckList items={ [
              'Open src/icons/index.jsx in ahmadassaf/design-system.',
              'Import the vendor icon only in that registry file.',
              'Add a PascalCase registry key for product UI, or a lowercase key for file/social aliases.',
              'Add compatibility aliases when replacing old names such as Heroicon-style *Icon keys.',
              'Add a default accessible label in iconLabels when the icon is commonly rendered as a link.',
              'Add the icon name to this Storybook page under the right group.',
              'Use <Icon name="NewIcon" decorative /> or <Icon name="NewIcon" label="Meaning" /> everywhere else.'
            ] } />
          </div>
          <CodeBlock code={ `// src/icons/index.jsx
import { NewIcon } from 'lucide-react';

export const iconRegistry = {
  NewIcon,
  LegacyNewIconName: NewIcon,
};

export const iconLabels = {
  NewIcon: 'Accessible default label',
};

// Consumer
<Icon name='NewIcon' decorative />
<Icon name='NewIcon' label='Open details' />` } />
        </div>

        <Table>
          <thead><tr><Th>Decision</Th><Th>Rule</Th><Th>Reason</Th></tr></thead>
          <tbody>
            <tr><Td>Registry name</Td><Td>Use stable semantic names, not vendor package names.</Td><Td>Lets us swap icon vendors without changing app code.</Td></tr>
            <tr><Td>Vendor imports</Td><Td>Only import vendor icons inside <InlineCode>src/icons/index.jsx</InlineCode>.</Td><Td>Keeps bundle ownership and review surface centralized.</Td></tr>
            <tr><Td>Aliases</Td><Td>Keep aliases for migrated names until consumers are updated.</Td><Td>Prevents churn while still enforcing one registry.</Td></tr>
            <tr><Td>Accessibility</Td><Td>Decorative icons use <InlineCode>decorative</InlineCode>; meaningful icons use <InlineCode>label</InlineCode>.</Td><Td>Prevents unnamed icon-only controls and noisy screen-reader output.</Td></tr>
            <tr><Td>Verification</Td><Td>Run lint, Storybook build, and direct-import scan.</Td><Td>Confirms docs and implementation stay aligned.</Td></tr>
          </tbody>
        </Table>

        <CodeBlock code={ `pnpm lint
pnpm build-storybook
rg 'from ['\\''"](@heroicons|react-icons|lucide-react|@tabler/icons-react)' src app layouts lib scripts | rg -v 'src/icons/index.jsx'` } />
      </Section>

      <Section title='Usage Rules'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Do</h3>
            <CheckList items={ [
              'Import icons from the Gaudi Icon component or icons export only.',
              'Pair unfamiliar icons with visible text.',
              'Use decorative for icons that repeat nearby text.',
              'Use label for icon-only links, buttons, and status symbols.',
              'Keep icon sizing tied to the surrounding text scale.'
            ] } />
          </div>
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'>
            <h3 className='mb-3 text-sm font-semibold'>Avoid</h3>
            <CheckList items={ [
              'Do not import lucide, Heroicons, react-icons, or Tabler directly outside the registry.',
              'Do not use color as the only way to distinguish icon states.',
              'Do not use icon-only controls without aria-label or visible text.',
              'Do not create one-off inline SVGs for reusable UI.',
              'Do not add icons that are not documented in this Storybook page.'
            ] } />
          </div>
        </div>
      </Section>
    </Page>
  ),
  // Search, paging, preview, copy, and filtering in the animated icon gallery.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The gallery loads lazily; wait for it under a busy parallel runner.
    const search = await canvas.findByRole('searchbox', { name: 'Search animated icons' }, { timeout: 5000 });
    await waitFor(() => expect(canvas.getAllByRole('button', { name: /^Copy .* animated icon$/ })).toHaveLength(24), { timeout: 5000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Next', exact: true }));
    await expect(canvas.getByText(/Page 2 of/)).toBeVisible();
    search.focus();
    fireEvent.change(search, { target: { value: 'Bell' } });
    const bell = canvas.getByRole('button', { name: 'Copy Bell animated icon', exact: true });
    await waitFor(() => expect(bell.querySelector('[data-icon-artwork]')).toBeInTheDocument(), { timeout: 5000 });
    await userEvent.hover(bell);
    await waitFor(() => expect(bell.querySelector('svg')).toHaveAttribute('data-animated-icon-active', 'true'), { timeout: 5000 });
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
      await waitFor(() => expect(canvas.getByRole('status', { name: 'Icon copy status' })).toHaveTextContent('Copied Bell usage.'), { timeout: 5000 });
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
