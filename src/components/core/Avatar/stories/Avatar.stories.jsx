import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Button from '../../Button';
import Dialog from '../../Dialog';
import Icon from '../../Icon';
import { Avatar, AvatarBadge, AvatarGroup, avatarVariants } from '../index';

const docs = getComponentDocs('Core/Avatar');
const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];
const tones = ['gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo'];
const people = [
  { id: 'maya', name: 'Mei Castellanos', src: '/avatars/person-20.svg', tone: 'teal' },
  { id: 'alex', name: 'Anouk Varga', src: '/avatars/person-41.svg', tone: 'blue' },
  { id: 'sam', name: 'Sam Rivera', src: '/avatars/person-31.svg', tone: 'indigo' },
  { id: 'lina', name: 'Lina Ahmed', src: '/avatars/person-07.svg', tone: 'rose' },
  { id: 'jules', name: 'Jules Martin', src: '/avatars/person-50.svg', tone: 'amber' },
  { id: 'jo', name: 'Jo Morgan', src: '/avatars/person-24.svg', tone: 'green' }
];
const [maya, alex] = people;
const brokenImage = 'data:image/png;base64,broken';
const avatar = (canvas, name) => canvas.getByRole('img', { name });
const imagesLoaded = (avatars) =>
  waitFor(() => expect(avatars.every((node) => node.querySelector('img')?.naturalWidth > 0)).toBe(true), { timeout: 10000 });

// A team roster: photos with presence, an initials fallback and a guest. Every control applies to each avatar;
// `tone` and `surface` show on the fallbacks, `grayscale` on the photos, `size` and `shape` everywhere.
const roster = [
  { ...maya, indicator: { label: 'Online', tone: 'success' } },
  { ...alex, indicator: { label: 'Verified', tone: 'primary', icon: 'Check', position: 'top-end' } },
  { id: 'priya', name: 'Priya Natarajan', indicator: { label: 'Away', tone: 'warning' } },
  { id: 'guest', name: 'Guest reviewer', fallback: true }
];
const [, , initialsPerson, guest] = roster;

export default {
  title: 'Core/Avatar',
  id: 'core-avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    size: sizes,
    shape: ['circle', 'square', 'tile'],
    surface: ['solid', 'tinted', 'plain', 'bare'],
    tone: tones,
    grayscale: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { size: 'lg', shape: 'circle', surface: 'solid', tone: 'indigo', grayscale: false, onLoadingStatusChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A review team: image avatars with presence and verification, an initials fallback, a guest silhouette, and a stacked group with overflow. Tone and surface colour the fallbacks, grayscale desaturates the photos, and size and shape apply to every avatar.' },
      source: {
        type: 'code',
        language: 'jsx',
        transform: (_source, { args }) => previewSource('Avatar', args, {
          imports: `import { Avatar, AvatarGroup } from '@gaudi/design-system';\n\nconst roster = ${JSON.stringify(roster, null, 2)};\nconst people = ${JSON.stringify(people, null, 2)};`,
          attributes: ['key={id}', '{...person}'],
          before: "export default function AvatarExample() {\n  return (<div className='flex flex-wrap items-center justify-center gap-4'>\n{roster.map(({ id, ...person }) => (\n",
          after: `\n))}\n<AvatarGroup avatars={people} max={3} size=${JSON.stringify(args.size)} shape=${JSON.stringify(args.shape)} label='Review team' />\n</div>);\n}`
        })
      }
    }
  },
  render: ({ onLoadingStatusChange, ...args }) => (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      {roster.map(({ id, ...person }) => (
        <Avatar key={id} {...person} {...args} onLoadingStatusChange={person.src ? onLoadingStatusChange : undefined} />
      ))}
      <AvatarGroup avatars={people} max={3} size={args.size} shape={args.shape} label='Review team' />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [photo, verified] = roster.map(({ name, indicator }) => avatar(canvas, [name, indicator?.label].filter(Boolean).join(', ')));
    const fallback = avatar(canvas, `${initialsPerson.name}, ${initialsPerson.indicator.label}`);
    for (const node of [photo, verified, fallback, avatar(canvas, guest.name)]) {
      await expect(node).toHaveAttribute('data-avatar-size', args.size);
      await expect(node).toHaveAttribute('data-surface', args.surface);
      await expect(node).toHaveClass(...avatarVariants.variants.shape[args.shape].split(' '));
    }
    await expect(fallback).toHaveTextContent('PN');
    if (args.surface === 'solid') await expect(fallback).toHaveClass(avatarVariants.variants.tone[args.tone].split(' ')[0]);
    await expect(within(canvas.getByRole('group', { name: 'Review team' })).getByLabelText('3 more people')).toHaveTextContent('+3');
    await waitFor(() => expect(args.onLoadingStatusChange).toHaveBeenCalledWith('loaded'), { timeout: 10000 });
    await imagesLoaded([photo, verified]);
    if (args.grayscale) await expect(getComputedStyle(photo.querySelector('img')).filter).toBe('grayscale(1)');
  }
};

// One person per tone, so each fallback shows distinct initials on its gradient shade.
const toneNames = ['Edda Quilliam', 'Nora Quinn', 'Ben Adler', 'Tara Singh', 'Gabriel Ruiz', 'Ada Okafor', 'Yuki Mori', 'Rafael Diaz', 'Rosa Park', 'Ivan Petrov'];
const indicators = [
  { label: 'Online', tone: 'success' },
  { label: 'Away', tone: 'warning', position: 'top-end' },
  { label: 'Do not disturb', tone: 'danger', icon: 'Minus' },
  { label: 'Offline', tone: 'neutral', position: 'bottom-start' },
  { label: 'Verified', tone: 'primary', icon: 'Check', position: 'top-start' }
];
export const Indicators = {
  parameters: { docs: { description: { story: '`indicator` adds a host-provided presence or verification badge whose label joins the accessible name. Children add custom badges.' } } },
  render: () => (
    <div className='flex flex-wrap items-center gap-6'>
      {indicators.map((indicator) => <Avatar key={indicator.label} name={maya.name} src={maya.src} tone={maya.tone} size='lg' shape='circle' indicator={indicator} />)}
      <Avatar name={alex.name} src={alex.src} tone={alex.tone} size='lg' shape='circle' aria-label={`${alex.name}, online, 3 unread messages`} indicator={indicators[0]}>
        <AvatarBadge className='inset-auto -top-1 -right-1 size-5 bg-danger text-xs text-danger-foreground' aria-hidden='true'>3</AvatarBadge>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const { label } of indicators) await expect(avatar(canvas, `${maya.name}, ${label}`)).toBeVisible();
    await expect(avatar(canvas, `${alex.name}, online, 3 unread messages`)).toBeVisible();
    const unreadBadge = canvas.getByText('3');
    await expect(unreadBadge.getBoundingClientRect().width).toBe(20);
    await expect(unreadBadge.getBoundingClientRect().height).toBe(20);
  }
};

const names = [
  ['Élodie Brontë', 'ÉB'],
  ['李明', '李明'],
  ['Alexandria Cassandra Montgomery-Wellington', 'AM']
];
export const Fallbacks = {
  parameters: { docs: { description: { story: 'Without an image, `name` yields Unicode-aware initials on a tone gradient; `surface` sets tinted, plain or bare backgrounds, `fallback` takes custom artwork, and `fallback` set to true shows the guest silhouette. `label` keeps explicit legacy initials and names the avatar `<label> avatar`.' } } },
  render: () => (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        {tones.map((tone, index) => <Avatar key={tone} name={toneNames[index]} tone={tone} shape='circle' size='md' />)}
        <Avatar label='AA' tone='indigo' shape='circle' size='md' />
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Avatar name='Research library' surface='plain' size='md' shape='tile' fallback={<Icon name='BookOpen' decorative />} />
        <Avatar name='External source' surface='bare' size='md' fallback={<Icon name='Globe' decorative />} />
        <Avatar name='Guest account' surface='tinted' size='md' shape='circle' fallback />
        {names.map(([name]) => <Avatar key={name} name={name} surface='tinted' size='md' shape='circle' />)}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blue = avatar(canvas, toneNames[tones.indexOf('blue')]);
    await expect(blue).toHaveClass('bg-linear-135', 'from-sky-200', 'text-blue-950');
    await expect(blue).toHaveTextContent('BA');
    await expect(blue.querySelector('[data-slot="avatar-fallback"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(avatar(canvas, 'AA avatar')).toHaveTextContent('AA');
    for (const [name, initials] of names) await expect(avatar(canvas, name)).toHaveTextContent(initials);
    await expect(avatar(canvas, 'Guest account').querySelector('svg')).toBeInTheDocument();
  }
};

function ImageRecoveryExample() {
  const [source, setSource] = useState(brokenImage);
  const [status, setStatus] = useState('loading');
  return (
    <div className='grid justify-items-start gap-4'>
      <div className='flex items-center gap-4'>
        <Avatar name={maya.name} src={source} size='xl' shape='tile' tone={maya.tone} onLoadingStatusChange={setStatus} />
        <p role='status' className='text-sm text-text-muted'>
          {{ loaded: 'Image loaded', error: 'Image unavailable, initials shown' }[status] ?? 'Loading image, initials shown'}
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' onClick={() => setSource(maya.src)}>Load sample photo</Button>
        <Button variant='outline' tone='neutral' onClick={() => setSource(brokenImage)}>Use broken image</Button>
        <Button variant='ghost' tone='neutral' onClick={() => setSource('')}>Remove image</Button>
      </div>
    </div>
  );
}
export const ImageRecovery = {
  parameters: { docs: { description: { story: 'Failed and pending images keep the initials visible; `onLoadingStatusChange` reports each state and a new `src` recovers automatically.' } } },
  render: () => <ImageRecoveryExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const node = avatar(canvas, maya.name);
    const status = canvas.getByRole('status');
    const click = (name) => userEvent.click(canvas.getByRole('button', { name }));
    await waitFor(() => expect(status).toHaveTextContent('Image unavailable'));
    await expect(within(node).getByText('MC')).toBeVisible();
    await click('Load sample photo');
    await waitFor(() => expect(status).toHaveTextContent('Image loaded'), { timeout: 10000 });
    await imagesLoaded([node]);
    await click('Use broken image');
    await waitFor(() => expect(status).toHaveTextContent('Image unavailable'));
    await expect(within(node).getByText('MC')).toBeVisible();
    await click('Load sample photo');
    await waitFor(() => expect(status).toHaveTextContent('Image loaded'), { timeout: 10000 });
    await click('Remove image');
    await waitFor(() => expect(within(node).getByText('MC')).toBeVisible());
  }
};

export const GroupOverflow = {
  parameters: { docs: { description: { story: '`AvatarGroup` shows `max` identities; `renderOverflow` turns the remainder into a real control, here a dialog listing everyone beside decorative avatars.' } } },
  render: () => (
    <AvatarGroup
      avatars={people}
      max={3}
      label='Review team'
      renderOverflow={(count, total) => (
        <Dialog
          title='Review team'
          description='Everyone assigned to this review.'
          trigger={
            <Button variant='ghost' tone='neutral' size='icon' radius='full' className='size-10 min-h-10 p-0' aria-label={`View ${total} more reviewers`}>
              <span aria-hidden='true'>{count}</span>
            </Button>
          }
        >
          <ul className='grid gap-4'>
            {people.map(({ id, ...person }) => (
              <li key={id} className='flex items-center gap-3'>
                <Avatar {...person} shape='circle' alt='' />
                <span>{person.name}</span>
              </li>
            ))}
          </ul>
        </Dialog>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'View 3 more reviewers' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog', { name: 'Review team' });
    await expect(within(dialog).getAllByRole('listitem')).toHaveLength(people.length);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
