'use client';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const heroes = [
  { src: 'static/images/art/2.svg', caption: 'This week: the slow web' },
  { src: 'static/images/art/5.svg', caption: 'Reader meet-up in Barcelona' },
  { src: 'static/images/art/9.svg', caption: 'Season 3 of the podcast is out' }
];
const sections = [
  { id: 'home', label: 'Home', icon: 'House' },
  { id: 'circles', label: 'Circles', icon: 'Users' },
  { id: 'events', label: 'Events', icon: 'CalendarDays' },
  { id: 'saved', label: 'Saved', icon: 'Bookmark' },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare' }
];
const pills = ['For you', 'Following', 'Essays', 'Questions', 'Events'];
const posts = [
  { id: 'p1', author: 'Priya Natarajan', avatar: 'women/44', circle: 'Long reads', when: '12m', text: 'Finished “Small tools, long lifetimes”. The bit about maintenance as a design material stuck with me. Anyone tried the checklist at the end?', likes: 24, comments: 6 },
  { id: 'p2', author: 'Daniel Okafor', avatar: 'men/52', circle: 'Writers', when: '1h', text: 'Running a 30-day writing streak in October. Short posts count. Who is in?', likes: 51, comments: 19 },
  { id: 'p3', author: 'Ana Ruiz', avatar: 'women/68', circle: 'Events', when: '3h', text: 'Twelve seats left for the Barcelona reader meet-up on 17 October.', likes: 33, comments: 4 }
];

function Banner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % heroes.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section aria-roledescription='carousel' aria-label='Featured' className='relative h-40 overflow-hidden rounded-(--ds-radius-card) sm:h-48'>
      {heroes.map((hero, position) => (
        <img key={hero.src} src={hero.src} alt='' className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${position === index ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 text-white'>
        <p className='text-lg font-semibold text-balance' aria-live='polite'>{heroes[index].caption}</p>
        <div className='flex gap-1.5'>
          {heroes.map((hero, position) => (
            <button key={hero.src} type='button' aria-label={`Show ${hero.caption}`} aria-current={position === index ? 'true' : undefined} onClick={() => setIndex(position)} className='grid size-6 place-items-center'>
              <span aria-hidden='true' className={`h-1.5 rounded-full bg-white transition-all ${position === index ? 'w-5' : 'w-1.5 opacity-60'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pattern() {
  const [section, setSection] = useState('home');
  const [pill, setPill] = useState('For you');
  const [liked, setLiked] = useState({});
  return (
    <SidebarProvider shortcut={false} defaultOpen={false} className='bg-surface relative h-[44rem] min-h-0 w-full flex-col overflow-hidden rounded-(--ds-radius-card) border'>
      <header className='bg-surface z-20 flex h-14 shrink-0 items-center gap-3 border-b px-3'>
        <SidebarTrigger />
        <span className='flex items-center gap-2 font-semibold'><RegistryIcon lucide='Sparkles' className='text-accent size-5' aria-hidden='true' />Gaudi Community</span>
        <Input type='search' aria-label='Search the community' placeholder='Search posts and people' className='ms-auto hidden w-64 md:block' />
        <Button size='sm' className='ms-auto md:ms-0'><RegistryIcon lucide='SquarePen' className='size-4' aria-hidden='true' />Post</Button>
        <Avatar className='size-8'><AvatarImage src='https://randomuser.me/api/portraits/women/65.jpg' alt='Maya Lopez' /><AvatarFallback>ML</AvatarFallback></Avatar>
      </header>
      <div className='relative flex min-h-0 flex-1'>
        <Sidebar collapsible='icon' variant='floating' className='absolute h-full **:data-[sidebar=sidebar]:bg-surface/70 **:data-[sidebar=sidebar]:backdrop-blur-md'>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu aria-label='Community'>
                  {sections.map((entry) => (
                    <SidebarMenuItem key={entry.id}>
                      <SidebarMenuButton tooltip={entry.label} isActive={section === entry.id} aria-current={section === entry.id ? 'page' : undefined} onClick={() => setSection(entry.id)}>
                        <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                        <span>{entry.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className='min-h-0 min-w-0'>
          <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
            <div className='mx-auto grid max-w-2xl gap-4'>
              <Banner />
              <nav aria-label='Feed filters' className='-mx-1 overflow-x-auto px-1'>
                <ul className='flex gap-1.5'>
                  {pills.map((label) => (
                    <li key={label}>
                      <Button size='sm' variant={pill === label ? 'solid' : 'outline'} tone={pill === label ? 'accent' : 'neutral'} aria-current={pill === label ? 'page' : undefined} onClick={() => setPill(label)} className='rounded-(--ds-radius-pill) whitespace-nowrap'>
                        {label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
              <h1 className='sr-only'>{pill}</h1>
              <ul className='grid gap-3' aria-label='Posts'>
                {posts.map((post) => (
                  <li key={post.id} className='rounded-(--ds-radius-card) border p-4'>
                    <article aria-label={`Post by ${post.author}`}>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-9'><AvatarImage src={`https://randomuser.me/api/portraits/${post.avatar}.jpg`} alt='' /><AvatarFallback>{post.author[0]}</AvatarFallback></Avatar>
                        <p className='min-w-0 text-sm'>
                          <span className='font-medium'>{post.author}</span>
                          <span className='text-text-muted block text-xs'>{post.circle} · {post.when}</span>
                        </p>
                      </div>
                      <p className='mt-3 text-sm leading-relaxed'>{post.text}</p>
                      <div className='mt-3 flex gap-1'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size='xs' variant='ghost' tone='neutral' aria-pressed={Boolean(liked[post.id])} onClick={() => setLiked((current) => ({ ...current, [post.id]: !current[post.id] }))}>
                              <RegistryIcon lucide='Heart' className={liked[post.id] ? 'text-danger size-4 fill-current' : 'size-4'} aria-hidden='true' />
                              <span className='tabular-nums'>{post.likes + (liked[post.id] ? 1 : 0)}</span>
                              <span className='sr-only'>likes</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{liked[post.id] ? 'Unlike' : 'Like'}</TooltipContent>
                        </Tooltip>
                        <Button size='xs' variant='ghost' tone='neutral'>
                          <RegistryIcon lucide='MessageSquare' className='size-4' aria-hidden='true' />
                          <span className='tabular-nums'>{post.comments}</span>
                          <span className='sr-only'>comments</span>
                        </Button>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
