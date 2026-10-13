import { useId, useState } from 'react';
import Post from '@gaudi/design-system/post/Post';
import { PostReadingTime } from '@gaudi/design-system/post/PostHeader';
import Input from '@gaudi/design-system/core/Input';
import Icon from '@gaudi/design-system/core/Icon';
import Button from '@gaudi/design-system/core/Button';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import Link from '@gaudi/design-system/core/Link';
import { Typography } from '@gaudi/design-system';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { posts, preparePost } from '../../../../../docs/fixtures/site/blogPosts';
import styles from './BlogPostLists.css?raw';

export function BlogPostLists({ layout = 'grid', showImages = true, showAuthor = true, title = 'From the journal', description = 'Ideas on AI, data, engineering, and the tools that make work easier.' }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const entries = posts.slice(0, layout === 'featured' ? 3 : 6).filter(post => `${post.title} ${post.summary} ${post.category}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <style>{styles}</style>
    <section className='blog-post-lists' data-layout={layout} aria-labelledby={`${id}-title`}>
      <header className='blog-post-lists-header'>
        <GaudiBrand className='mb-6' />
        <div className='flex flex-wrap items-end justify-between gap-6'>
          <div className='min-w-0'>
            <Typography as='h2' variant='heading-xl' id={`${id}-title`}>{title}</Typography>
            <Typography variant='paragraph-md' className='mt-3 max-w-2xl'>{description}</Typography>
          </div>
          <Link href='/blog' className='shrink-0 text-sm'>View all articles</Link>
        </div>
      </header>
      <div role='search' className='mb-8 max-w-sm'>
        <Input type='search' aria-label='Filter articles' placeholder='Filter articles' aria-controls={`${id}-posts`}
          value={query} onChange={event => setQuery(event.target.value)} prefix={<Icon name='Search' decorative size='sm' />} />
      </div>
      <ul id={`${id}-posts`} className='blog-post-lists-items' aria-label='Blog posts'>
        {entries.map((post, index) => {
          const isLead = layout === 'featured' && index === 0;
          const image = showImages && (layout !== 'featured' || isLead);
          return <Post key={post.slug}
            frontMatter={preparePost(post)} locale='en-GB' titleAs='h3' titleVariant={isLead ? 'heading-md' : undefined}
            layout={layout === 'rows' ? 'horizontal' : layout === 'compact' ? 'list' : 'stacked'}
            className={isLead ? 'blog-post-lists-lead' : undefined}
            style={isLead ? { '--post-list-rows': Math.max(1, entries.length - 1) } : undefined}
            media={image ? <img src={`/static/images/art/${index % 3}.svg`} alt='' width='1200' height='900' /> : undefined}
            footer={<>{showAuthor && <span>Ahmad Assaf</span>}<PostReadingTime readingTime={post.readingTime.text} /></>}
          />;
        })}
        {!entries.length && <li className='blog-post-lists-empty'><EmptyState compact title='No articles found' description='Try a topic such as data or engineering.' actions={<Button variant='outline' onClick={() => setQuery('')}>Clear filter</Button>} /></li>}
      </ul>
    </section>
  </>;
}
