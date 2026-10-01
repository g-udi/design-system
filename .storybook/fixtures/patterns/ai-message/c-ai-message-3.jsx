'use client';
import { useEffect, useState } from 'react';
import { Message, MessageAvatar, MessageContent, MessageHeader } from '../../../../src/components/core/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/core/Message/parts/message-parts.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const topPosts = [
  { title: 'Notes on local-first software', views: 18240, read: '6m 10s' },
  { title: 'Small tools, long lifetimes', views: 9120, read: '4m 02s' },
  { title: 'A guide to knowledge graphs', views: 7380, read: '7m 45s' }
];

const initial = {
  analytics: 'running',
  links: 'running',
  publish: 'failed'
};

export function Pattern() {
  const [status, setStatus] = useState(initial);
  // The analytics call finishes a moment after the turn appears, as it would against a real API.
  useEffect(() => {
    const timer = setTimeout(() => setStatus((current) => ({ ...current, analytics: 'done', links: 'done' })), 1200);
    return () => clearTimeout(timer);
  }, []);
  const retry = (part) => {
    if (part.id !== 'publish') return;
    setStatus((current) => ({ ...current, publish: 'running' }));
    setTimeout(() => setStatus((current) => ({ ...current, publish: 'done' })), 900);
  };
  const parts = [
    { type: 'text', text: 'Pulling last month’s numbers and checking the draft before it goes out.' },
    { id: 'search', type: 'tool', name: 'search_posts', description: 'Published in September', status: 'done', duration: '0.4s', input: { published: '2026-09', limit: 3, sort: 'views' }, output: topPosts },
    { id: 'analytics', type: 'tool', name: 'fetch_analytics', description: 'Newsletter opens and clicks', status: status.analytics, duration: status.analytics === 'done' ? '1.2s' : undefined, input: { range: 'last_30_days', metrics: ['opens', 'clicks'] }, output: status.analytics === 'done' ? { opens: 4210, clicks: 612, clickRate: '14.5%', unsubscribes: 3 } : undefined },
    {
      id: 'links',
      type: 'tool',
      name: 'audit_links',
      description: 'Checks every link in the draft',
      status: status.links,
      parts: [
        { id: 'links-1', type: 'tool', name: 'fetch', description: 'gaudi.dev/notes/local-first', status: 'done', duration: '0.2s' },
        { id: 'links-2', type: 'tool', name: 'fetch', description: 'example.com/research/scroll-depth', status: status.links === 'done' ? 'done' : 'running' }
      ]
    },
    {
      id: 'publish',
      type: 'tool',
      name: 'schedule_newsletter',
      description: 'Friday 08:00 to 4,980 subscribers',
      status: status.publish,
      input: { send_at: '2026-10-09T08:00:00Z', segment: 'all' },
      error: status.publish === 'failed' ? 'The mail provider rejected the request: sender domain is not verified yet.' : undefined,
      output: status.publish === 'done' ? { scheduled: true, sendAt: 'Fri 9 Oct, 08:00' } : undefined
    },
    ...(status.publish === 'done' ? [{ type: 'text', text: 'Scheduled for **Friday at 08:00**. Clicks were up on last month, led by the local-first post.' }] : [])
  ];
  const busy = Object.values(status).includes('running');
  return (
    <div className='mx-auto w-full max-w-2xl'>
      <Message>
        <MessageAvatar className='self-start'>
          <span className='bg-accent-subtle text-accent grid size-8 place-items-center rounded-full'>
            <RegistryIcon lucide='Sparkles' className='size-4' />
          </span>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader className='px-0'>Gaudi</MessageHeader>
          <MessageParts parts={parts} streaming={busy} onToolRetry={retry} />
          <span role='status' className='sr-only'>{busy ? 'Gaudi is running tools.' : 'All tools finished.'}</span>
        </MessageContent>
      </Message>
    </div>
  );
}
