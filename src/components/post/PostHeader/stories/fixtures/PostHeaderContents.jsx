'use client';
import { useId, useRef } from 'react';
import { Typography } from '@gaudi/design-system';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import PostHeader from '@gaudi/design-system/post/PostHeader';
import TableOfContents from '@gaudi/design-system/post/TableOfContents';

const sections = [
  {
    key: 'ownership',
    title: 'Who owns the header?',
    body: 'The publishing app supplies the article title, date and series. The shared header lays them out and keeps the reading order consistent.'
  },
  {
    key: 'review',
    title: 'Review the published page',
    body: 'Open the contents with a keyboard. Follow a section link, read the heading, then check that the same navigation works on a narrow screen.'
  }
];

export function PostHeaderContents(props) {
  const prefix = useId();
  const article = useRef(null);
  const toc = sections.map(({ key, title }) => ({ id: `${prefix}-${key}`, value: title, depth: 2 }));
  return (
    <article ref={article}>
      <Collapsible>
        <PostHeader
          {...props}
          tocControl={
            <CollapsibleTrigger asChild>
              <Button size='xs' variant='outline' tone='neutral'>
                <Icon name='List' decorative size='xs' />
                Contents
              </Button>
            </CollapsibleTrigger>
          }
        />
        <CollapsibleContent>
          <TableOfContents toc={toc} contentRef={article} indexVisuals={false} smooth={false} />
        </CollapsibleContent>
      </Collapsible>
      {sections.map((section, index) => (
        <section key={section.key} aria-labelledby={toc[index].id} className='mt-6 max-w-prose'>
          <Typography as='h2' variant='heading-md' id={toc[index].id}>
            {section.title}
          </Typography>
          <Typography as='p' variant='paragraph-sm' className='mt-2'>
            {section.body}
          </Typography>
        </section>
      ))}
    </article>
  );
}
