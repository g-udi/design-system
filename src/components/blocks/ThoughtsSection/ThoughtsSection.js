/**
 * Thoughts Section Component
 *
 * @description Homepage list of short editorial notes with an archive link beside the last note.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import Pill from '../../core/Pill';
import Typography from '../../../foundations/Typography';
import { cn } from '../../../utilities/cn';

const ThoughtEntry = ({ className, thought }) => (
  <article className={ cn('group', className) }>
    <Link href={ `/thoughts/${thought.slug}` } variant='bare' className='block'>
      <div className='mb-1 flex items-start gap-2'>
        <h3 className='text-lg font-semibold text-text transition-colors group-hover:text-accent'>{thought.title}</h3>
        {thought.featured && <Pill tone='blue' variant='soft' size='sm' radius='full' className='my-0 mr-0 shrink-0'>Featured</Pill>}
      </div>
      {thought.summary && <p className='text-base leading-7 text-text-muted'>{thought.summary}</p>}
    </Link>
  </article>
);

/**
 * Renders the recent thoughts section
 *
 * @param {Object} props - Component props
 * @param {Array<{ slug: string, title: string, summary?: string, featured?: boolean }>} [props.thoughts=[]] - Notes to list, newest first
 * @returns {JSX.Element} Thoughts section
 */
export default function ThoughtsSection({ thoughts = [] }) {
  const last = thoughts.at(-1);

  return (
    <div className='py-6'>
      <Typography as='h2' variant='heading-lg' className='mb-4'>Recent Thoughts</Typography>

      <div className='space-y-4'>
        {thoughts.slice(0, -1).map((thought) => <ThoughtEntry key={ thought.slug } thought={ thought } />)}
      </div>

      {last && (
        <div className='flex flex-col gap-4 pt-4 md:flex-row md:items-start md:justify-between'>
          <ThoughtEntry thought={ last } className='flex-1' />
          <Button variant='outline' tone='accent' href='/thoughts' className='group/archive self-end md:mt-1 md:self-start'>
            View all thoughts
            <Icon name='ChevronRight' decorative size='sm' className='transition-transform group-hover/archive:translate-x-1 motion-reduce:transition-none' />
          </Button>
        </div>
      )}
    </div>
  );
}
