'use client';
import { useEffect, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';

const people = [
  { src: '/avatars/person-41.svg', name: 'Anouk Varga', initials: 'AV' },
  { src: '/avatars/person-20.svg', name: 'Sabine Okafor', initials: 'SO' },
  { src: '/avatars/person-31.svg', name: 'Rafe Okonkwo', initials: 'RO' },
  { src: '/avatars/person-24.svg', name: 'Ilse Valtonen', initials: 'IV' }
];
const rings = ['ring-ui-primary', 'ring-ui-destructive', 'ring-discovery', 'ring-warning'];

function Photo({ person, className, imageClassName }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={person.src} alt={person.name} className={imageClassName} />
      <AvatarFallback>{person.initials}</AvatarFallback>
    </Avatar>
  );
}

function Uploading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setLoading((current) => !current), 2e3);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='relative' aria-busy={loading}>
      <Photo person={people[0]} />
      {loading ? (
        <div className='absolute inset-0 flex items-center justify-center rounded-full bg-ui-background/60'>
          <Loader className='text-ui-primary' />
        </div>
      ) : null}
    </div>
  );
}

const rows = [
  {
    label: 'Rings',
    items: people.map((person, index) => (
      <Photo key={person.name} person={person} className={`ring-2 ring-offset-2 ring-offset-ui-background ${rings[index]}`} />
    ))
  },
  {
    label: 'Activity',
    items: [
      <div key='live' className='relative'>
        <Photo person={people[0]} className='animate-pulse ring-2 ring-success ring-offset-2 ring-offset-ui-background motion-reduce:animate-none' />
        <span className='absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-ui-background bg-success' />
      </div>,
      <div key='story' className='group/story relative flex size-8 items-center justify-center'>
        <div className='absolute -inset-1 animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-tr from-yellow-400 via-fuchsia-500 to-violet-600 opacity-75 blur-xs transition-all duration-500 group-hover/story:opacity-100 motion-reduce:animate-none motion-reduce:transition-none' />
        <Photo person={people[1]} className='ring-2 ring-ui-background transition-transform duration-500 motion-reduce:transition-none motion-safe:group-hover/story:scale-95' />
      </div>,
      <Uploading key='uploading' />
    ]
  },
  {
    label: 'Inactive',
    items: people.slice(1).map((person) => <Photo key={person.name} person={person} imageClassName='grayscale' />)
  }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4'>
      {rows.map((row) => (
        <div key={row.label} className='contents'>
          <span className='text-xs text-text-muted'>{row.label}</span>
          <div className='flex flex-wrap items-center gap-3'>{row.items}</div>
        </div>
      ))}
    </div>
  );
}
