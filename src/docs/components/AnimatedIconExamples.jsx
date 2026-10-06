import { useEffect, useId, useRef, useState } from 'react';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import { NativeSelect } from '../../components/core/Select';
import { CheckboxRoot } from '../../components/core/Checkbox';
import { writeToClipboard } from '../../hooks/interaction/use-copy-to-clipboard.js';
import { Pagination, PaginationNext, PaginationPrevious } from '../../components/core/Pagination';
import Icon, { AnimatedIcon, animatedIconMetadata } from '../../icons';
import { cn } from '../../utilities/cn';

const names = Object.keys(animatedIconMetadata).sort((a, b) => a.localeCompare(b));
const pageSize = 24;
const labelClasses = 'block text-sm font-semibold text-text';
const descriptionClasses = 'text-sm leading-5 text-text-muted';

function AnimatedIconCard({ name, animate, onCopy }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const metadata = animatedIconMetadata[name];
  return (
    <Button variant='outline' tone='neutral' size='sm'
      className='relative grid min-h-32 min-w-0 w-full content-center justify-items-center gap-3 px-3 py-4 text-sm font-normal'
      aria-label={`Copy ${name} animated icon`}
      onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onClick={() => onCopy(name)}>
      <AnimatedIcon name={name} active={animate && (hovered || focused)} size='xl' decorative />
      <span className='w-full break-words text-center leading-5'>{name}</span>
      <span className='text-xs text-text-muted'>
        {metadata.source === 'lucide-animated' ? 'Lucide Animated' : 'Gaudi draw'}
      </span>
    </Button>
  );
}

export function AnimatedIconsGallery() {
  const searchId = useId();
  const styleId = useId();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [source, setSource] = useState('all');
  const [animate, setAnimate] = useState(true);
  const [feedback, setFeedback] = useState('');
  const request = useRef(0);
  useEffect(() => () => { request.current += 1; }, []);
  const terms = query.toLowerCase().trim().split(/\s+/);
  const filtered = names.filter((name) => {
    const metadata = animatedIconMetadata[name];
    return (source === 'all' || source === metadata.source) && terms.every((term) => `${name} ${metadata.canonical}`.toLowerCase().includes(term));
  });
  const pages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pages - 1));
  const visible = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const onCopy = async (name) => {
    const id = ++request.current;
    const copied = await writeToClipboard(`import { AnimatedIcon } from '@gaudi/design-system/icons';\n\n<AnimatedIcon name="${name}" active size="md" decorative />`);
    if (id === request.current) setFeedback(copied ? `Copied ${name} usage.` : `Could not copy ${name}. Try again.`);
  };
  return (
    <div data-docs-example className='min-w-0 space-y-4' data-animated-gallery>
      <p className={descriptionClasses}>{names.length} animated icons. Hover or focus to preview; click or press Enter to copy usage. Animation follows your reduced-motion preference.</p>
      <div className='flex flex-wrap items-end gap-4'>
        <div className='min-w-0 flex-1 basis-64 space-y-2'>
          <label className={labelClasses} htmlFor={searchId}>Search animated icons</label>
          <Input id={searchId} type='search' value={query} className='bg-surface'
            inputClassName='text-sm' placeholder='Search by name, e.g. Bell or Arrow Up'
            prefix={<Icon name='Search' decorative size='sm' />}
            onChange={(event) => { setQuery(event.target.value); setPage(0); }} />
        </div>
        <div className='grid gap-2'>
          <label htmlFor={styleId} className={labelClasses}>Animation style</label>
          <NativeSelect id={styleId}
            value={source} onChange={(event) => { setSource(event.target.value); setPage(0); }}>
            <option value='all'>All styles</option>
            <option value='lucide-animated'>Lucide Animated</option>
            <option value='gaudi-draw'>Gaudi draw</option>
          </NativeSelect>
        </div>
        <label className='flex min-h-8 cursor-pointer items-center gap-2 text-sm'>
          <CheckboxRoot checked={animate} onCheckedChange={setAnimate} />
          Animate previews
        </label>
      </div>
      <div className='flex flex-wrap justify-between gap-2'>
        <p role='status' aria-label='Animated icon results' className={descriptionClasses}>
          {filtered.length ? `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, filtered.length)} of ${filtered.length} icons` : 'No matching icons'}
        </p>
        <p role='status' aria-label='Icon copy status' className={descriptionClasses}>{feedback}</p>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' aria-label='Animated icon gallery'>
        {visible.map((name) => <AnimatedIconCard key={name} name={name} animate={animate} onCopy={onCopy} />)}
      </div>
      {!filtered.length ? (
        <div className='space-y-3 rounded-md border border-border p-5'>
          <p className={labelClasses}>No animated icons match “{query}”.</p>
          <p className={descriptionClasses}>Try another name or reset the style filter.</p>
          <Button variant='outline' size='sm' className='text-sm' onClick={() => { setQuery(''); setSource('all'); setPage(0); }}>Reset search</Button>
        </div>
      ) : (
        <Pagination label='Animated icon pages' className='items-center justify-between gap-2'>
          <PaginationPrevious className='text-sm' disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} />
          <span className={cn(descriptionClasses, 'text-center')}>Page {currentPage + 1} of {pages}</span>
          <PaginationNext className='text-sm' disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)} />
        </Pagination>
      )}
    </div>
  );
}

export function AnimatedIconActions() {
  const [hot, setHot] = useState(null);
  const [focused, setFocused] = useState(null);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  return (
    <div data-docs-example className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <Button variant={saved ? 'soft' : 'outline'} size='sm' className='text-sm' aria-pressed={saved}
          onPointerEnter={() => setHot('save')} onPointerLeave={() => setHot(null)}
          onFocus={() => setFocused('save')} onBlur={() => setFocused(null)} onClick={() => setSaved(!saved)}>
          <AnimatedIcon name='Bookmark' size='sm' active={hot === 'save' || focused === 'save'} />
          {saved ? 'Saved to reading list' : 'Save to reading list'}
        </Button>
        <Button variant='outline' tone='neutral' size='sm' className='text-sm' aria-pressed={syncing} onClick={() => setSyncing(!syncing)}>
          <AnimatedIcon name='RefreshCw' size='sm' active={syncing} />
          {syncing ? 'Stop sync preview' : 'Preview sync'}
        </Button>
        <Button variant='outline' size='sm' className='text-sm' disabled><AnimatedIcon name='Download' size='sm' />Export unavailable</Button>
      </div>
      <p role='status' aria-label='Icon action status' className={descriptionClasses}>
        {syncing ? 'Sync preview running.' : 'Sync preview stopped.'} {saved ? 'Article saved.' : 'Article is not saved.'}
      </p>
    </div>
  );
}

export function AnimatedIconMotion() {
  const [active, setActive] = useState(false);
  return (
    <div data-docs-example className='space-y-4'>
      <Button variant='outline' size='sm' className='text-sm' aria-pressed={active} onClick={() => setActive(!active)}>{active ? 'Stop animations' : 'Play animations'}</Button>
      <div className='grid grid-cols-2 gap-6 sm:grid-cols-4'>
        {[
          ['Bell', 'Notification', 'primary'], ['HeartPulse', 'Activity', 'danger'],
          ['Rocket', 'Launch status', 'success'], ['Calendar', 'Original Gaudi artwork', 'muted']
        ].map(([name, title, color]) => (
          <div key={name} className='flex min-w-0 flex-col items-start gap-3'>
            <AnimatedIcon name={name} size='2xl' color={color} active={active} label={title} />
            <span className={descriptionClasses}>{title}</span>
          </div>
        ))}
      </div>
      <p className={descriptionClasses}>One-shot icons replay after Stop, then Play. Status loops continue while active. Offscreen icons and hidden tabs pause; reduced motion keeps the resting artwork visible.</p>
    </div>
  );
}
