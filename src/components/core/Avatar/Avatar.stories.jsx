import { previewSource } from '../../../../.storybook/stories/previewSource';
import { IdentityFallbacks } from '../../../../.storybook/fixtures/avatar/IdentityFallbacks.jsx';
import IdentityFallbacksSource from '../../../../.storybook/fixtures/avatar/IdentityFallbacks.jsx?raw';
import { PresenceIndicators } from '../../../../.storybook/fixtures/avatar/PresenceIndicators.jsx';
import PresenceIndicatorsSource from '../../../../.storybook/fixtures/avatar/PresenceIndicators.jsx?raw';
import { TeamRoster } from '../../../../.storybook/fixtures/avatar/TeamRoster.jsx';
import TeamRosterSource from '../../../../.storybook/fixtures/avatar/TeamRoster.jsx?raw';
import { ImageRecovery } from '../../../../.storybook/fixtures/avatar/ImageRecovery.jsx';
import ImageRecoverySource from '../../../../.storybook/fixtures/avatar/ImageRecovery.jsx?raw';
import { AccountMenu } from '../../../../.storybook/fixtures/avatar/AccountMenu.jsx';
import AccountMenuSource from '../../../../.storybook/fixtures/avatar/AccountMenu.jsx?raw';
import { IdentityOverview } from '../../../../.storybook/fixtures/avatar/IdentityOverview.jsx';
import IdentityOverviewSource from '../../../../.storybook/fixtures/avatar/IdentityOverview.jsx?raw';
import { getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import Avatar from './Avatar';
import { ApplicationDocsPage, ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { publicSource } from '../../../../.storybook/stories/ReuiStoryHelpers';

const componentDocs = getComponentDocs('Core/Avatar');
const toneOptions = [ 'gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo' ];

export default {
  args: { onLoadingStatusChange: fn() },
  argTypes: {
    'shape': {
      'control': 'select',
      'options': [ 'square', 'circle', 'tile' ]
    },
    'size': {
      'control': 'select',
      'options': [ '2xs', 'xs', 'sm', 'md', 'lg', 'xl' ]
    },
    surface: { control: 'select', options: ['solid', 'tinted', 'plain', 'bare'] },
    name: { control: 'text', description: 'Full identity; generates Unicode-aware initials when no image is available.' },
    indicator: { control: 'object', description: 'Labelled presence or verification badge, including tone, icon and logical position.' },
    onLoadingStatusChange: { control: false, description: 'Reports loading, loaded or error for host-owned feedback.' },
    'tone': {
      'control': 'select',
      'options': toneOptions
    }
  },
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: ApplicationDocsPage
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-avatar',
  title: 'Core/Avatar'
};

export const Initials = {
  'args': {
    'label': 'AA',
    'shape': 'circle',
    'size': 'lg',
    'tone': 'blue'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('img', { name: 'AA avatar' });

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveClass('rounded-full');
    await expect(avatar).toHaveClass('size-14');
    await expect(avatar).toHaveClass('bg-blue-600');
    await expect(avatar.querySelector('[data-slot="avatar-fallback"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(avatar).toHaveAccessibleName('AA avatar');
  }
};

export const Sizes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatars = canvas.getAllByRole('img', { name: 'Alex Johnson' });

    await expect(avatars).toHaveLength(6);
    await expect(avatars[0]).toHaveClass('size-4');
    await expect(avatars[1]).toHaveClass('size-5', 'text-xs');
    await expect(avatars[2]).toHaveClass('size-8', 'text-xs');
    await expect(avatars[3]).toHaveClass('size-10', 'text-sm');
    await expect(avatars[4]).toHaveClass('size-14', 'text-base');
    await expect(avatars[5]).toHaveClass('size-20', 'text-2xl');
    await expect(avatars.every((avatar) => avatar.classList.contains('rounded-full'))).toBe(true);
    await waitFor(() => expect(avatars.every((avatar) => avatar.querySelector('img')?.naturalWidth > 0)).toBe(true), { timeout: 10000 });
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4'>
      {[ '2xs', 'xs', 'sm', 'md', 'lg', 'xl' ].map((size) => (
        <Avatar key={ size } name='Alex Johnson' src='https://randomuser.me/api/portraits/men/32.jpg' tone='blue' shape='circle' size={ size } />
      ))}
    </div>
  )
};

export const Colors = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatars = canvas.getAllByRole('img', { name: 'AA avatar' });

    await expect(avatars).toHaveLength(10);
    await expect(avatars[0]).toHaveClass('bg-gray-600');
    await expect(avatars[1]).toHaveClass('bg-neutral-600');
    await expect(avatars[2]).toHaveClass('bg-blue-600');
    await expect(avatars[3]).toHaveClass('bg-teal-700');
    await expect(avatars[4]).toHaveClass('bg-green-700');
    await expect(avatars[5]).toHaveClass('bg-amber-700');
    await expect(avatars[6]).toHaveClass('bg-yellow-500', 'text-yellow-950');
    await expect(avatars[7]).toHaveClass('bg-red-600');
    await expect(avatars[8]).toHaveClass('bg-rose-700');
    await expect(avatars[9]).toHaveClass('bg-indigo-600');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4'>
      {toneOptions.map((tone) => (
        <Avatar key={ tone } label='AA' tone={ tone } shape='circle' size='lg' />
      ))}
    </div>
  )
};

export const IdentityOverviewExample = {
  name: 'Account and collaboration',
  render: () => <ExampleFrame><IdentityOverview /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(IdentityOverviewSource) + '\n\n<IdentityOverview />', language: 'jsx' } } }
};

export const AccountMenuExample = {
  name: 'Account menu',
  render: () => <ExampleFrame><AccountMenu /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(AccountMenuSource) + '\n\n<AccountMenu />', language: 'jsx' } } }
};

export const ImageRecoveryExample = {
  name: 'Image failure and recovery',
  render: () => <ExampleFrame><ImageRecovery /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(ImageRecoverySource) + '\n\n<ImageRecovery />', language: 'jsx' } } }
};

export const TeamRosterExample = {
  name: 'Reviewer group with full roster',
  render: () => <ExampleFrame><TeamRoster /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(TeamRosterSource) + '\n\n<TeamRoster />', language: 'jsx' } } }
};

export const PresenceIndicatorsExample = {
  name: 'Presence and custom badges',
  render: () => <ExampleFrame><PresenceIndicators /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(PresenceIndicatorsSource) + '\n\n<PresenceIndicators />', language: 'jsx' } } }
};

export const IdentityFallbacksExample = {
  name: 'Workspace identities and international names',
  render: () => <ExampleFrame><IdentityFallbacks /></ExampleFrame>,
  parameters: { docs: { source: { code: publicSource(IdentityFallbacksSource) + '\n\n<IdentityFallbacks />', language: 'jsx' } } }
};

AccountMenuExample.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  const trigger = canvas.getByRole('button', { name: 'Account menu for Maya Chen' });
  await userEvent.click(trigger);
  await userEvent.click(await body.findByRole('menuitem', { name: 'View profile' }));
  await expect(canvas.getByRole('status')).toHaveTextContent('Profile selected for Maya Chen.');
  await expect(trigger).toHaveFocus();
};
TeamRosterExample.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  const trigger = canvas.getByRole('button', { name: 'View 3 more reviewers' });
  await userEvent.click(trigger);
  const dialog = await body.findByRole('dialog', { name: 'Review team' });
  await expect(within(dialog).getAllByRole('listitem')).toHaveLength(6);
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await expect(trigger).toHaveFocus();
};
ImageRecoveryExample.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const avatar = canvas.getByTestId('recovering-avatar');
  await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Image unavailable'));
  await expect(avatar).toHaveAccessibleName('Maya Chen');
  await expect(within(avatar).getByText('MC')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Load sample photo' }));
  await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Image loaded'), { timeout: 10000 });
  await expect(avatar.querySelector('img')).toBeVisible();
  await expect(avatar.querySelector('img').naturalWidth).toBeGreaterThan(0);
  await userEvent.click(canvas.getByRole('button', { name: 'Use broken image' }));
  await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Image unavailable'));
  await expect(within(avatar).getByText('MC')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Load sample photo' }));
  await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Image loaded'), { timeout: 10000 });
  await userEvent.click(canvas.getByRole('button', { name: 'Remove image' }));
  await waitFor(() => expect(within(avatar).getByText('MC')).toBeVisible());
};

export const Playground = {
  args: { name: 'Maya Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg', size: 'lg', shape: 'circle', surface: 'solid', tone: 'blue', grayscale: false },
  argTypes: { name: { control: 'text' }, src: { control: 'text' }, grayscale: { control: 'boolean' } },
  render: (args) => (<ExampleFrame><Avatar {...args} /></ExampleFrame>),
  parameters: { docs: { description: { story: 'Adjust the controls to explore the component. The examples below cover complete usage patterns.' }, source: { type: 'dynamic', transform: (_, context) => previewSource('Avatar', context.args, { imports: "import Avatar from '@gaudi/design-system/core/Avatar';" }) } } }
};
