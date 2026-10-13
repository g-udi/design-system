'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '../../core/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../core/Accordion';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { Scrollspy } from '../../core/Scrollspy';
import { ScrollArea } from '../../core/ScrollArea';
import Typography from '../../../foundations/Typography';
import { useCollapsibleSections } from '../../../hooks/layout/use-collapsible-sections.js';
import { cn } from '../../../utilities/cn';
import { collectVisuals } from './contentIndex.js';
import styles from './TableOfContents.module.css';

const flatten = entries => entries.flatMap(entry => [entry, ...flatten(entry.children || [])]);
const containsHeading = (heading, id) => heading.id === id || (heading.children || []).some(child => containsHeading(child, id));
const emptyToc = [];

function HeadingList({ headings, activeId, expansion }) {
  const baseDepth = Math.min(...headings.map(heading => heading.depth || 1));
  return <ul className={styles.list}>
    {headings.map(heading => {
      const children = heading.children || [];
      const open = expansion.isExpanded(heading.id);
      const item = <li key={heading.id} style={{ '--toc-depth': Math.max(0, (heading.depth || baseDepth) - baseDepth) }}>
        <div className={styles.row}>
          <Link href={heading.url || `#${heading.id}`} variant='bare' className={styles.link}
            data-scrollspy-anchor={heading.id} data-active={activeId === heading.id ? 'true' : undefined}
            aria-current={activeId === heading.id ? 'location' : undefined}>{heading.value}</Link>
          {children.length > 0 && <CollapsibleTrigger asChild>
            <Button size='icon-xs' variant='ghost' tone='neutral' className={styles.branchTrigger}
              aria-label={`${open ? 'Collapse' : 'Expand'} ${heading.value}`}>
              <Icon name='ChevronRight' size='xs' decorative className={styles.chevron} />
            </Button>
          </CollapsibleTrigger>}
        </div>
        {children.length > 0 && <CollapsibleContent forceMount hidden={!open} className={styles.branch}>
          {/* Keep target links mounted so Scrollspy can follow headings in a closed branch. */}
          <HeadingList headings={children} activeId={activeId} expansion={expansion} />
        </CollapsibleContent>}
      </li>;
      return children.length > 0
        ? <Collapsible asChild key={heading.id} open={open} onOpenChange={() => expansion.toggle(heading.id)}>{item}</Collapsible>
        : item;
    })}
  </ul>;
}

/**
 * Article navigation using the shared Scrollspy, Link and Collapsible owners.
 * `targetRef` selects the document or nested reading viewport; `contentRef`
 * scopes the optional captioned-diagram and table index to one article.
 * Four or fewer top-level entries expand initially; larger lists follow the
 * active heading's ancestors. Readers can also toggle any branch directly.
 */
export default function TableOfContents({ className, contentRef, targetRef, toc = emptyToc, offset = 24, smooth = true, indexVisuals = true, ...props }) {
  const [activeId, setActiveId] = useState('');
  const [visuals, setVisuals] = useState([]);
  const branches = useMemo(() => flatten(toc).filter(heading => heading.children?.length), [toc]);
  const branchIds = useMemo(() => branches.map(heading => heading.id), [branches]);
  const expandAll = toc.length <= 4;
  const expansion = useCollapsibleSections({ sections: branchIds, expandAll });
  const { setExpanded } = expansion;

  useEffect(() => {
    setExpanded(expandAll ? branchIds : branches.filter(heading => containsHeading(heading, activeId)).map(heading => heading.id));
  }, [activeId, branchIds, branches, expandAll, setExpanded]);

  useEffect(() => {
    setVisuals(indexVisuals && (!contentRef || contentRef.current) ? collectVisuals(contentRef?.current) : []);
  }, [contentRef, indexVisuals, toc]);

  const diagrams = visuals.filter(visual => visual.kind === 'diagram').length;
  const tables = visuals.length - diagrams;
  if (!toc.length && !visuals.length) return null;
  return <nav aria-label='Table of contents' data-slot='table-of-contents' className={cn(styles.root, className)} {...props}>
    <Typography as='p' variant='metadata' className={styles.label}>On this page</Typography>
    <ScrollArea type='auto' className={styles.scroll} aria-label='Contents links'>
    <Scrollspy targetRef={targetRef} offset={offset} smooth={smooth} onUpdate={setActiveId}>
      <HeadingList headings={toc} activeId={activeId} expansion={expansion} />
    </Scrollspy>
    {visuals.length > 0 && <Collapsible className={styles.visualIndex}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' tone='neutral' size='sm' className={styles.visualIndexHeader}>
          <span className={styles.visualIndexTitle}>Diagrams &amp; tables</span>
          <span className={styles.visualIndexCount}>{[
            diagrams > 0 && `${diagrams} ${diagrams === 1 ? 'diagram' : 'diagrams'}`,
            tables > 0 && `${tables} ${tables === 1 ? 'table' : 'tables'}`
          ].filter(Boolean).join(' · ')}</span>
          <Icon name='ChevronRight' size='xs' decorative className={styles.chevron} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className={styles.visualBody}>
        <Scrollspy targetRef={targetRef} offset={offset} smooth={smooth} fallbackToFirst={false}>
          <ul className={styles.list}>{visuals.map(visual => <li key={visual.id}>
            <Link href={visual.url} variant='bare' className={cn(styles.link, styles.visualLink)} data-scrollspy-anchor={visual.id}
              aria-label={`${visual.kind === 'diagram' ? 'Diagram' : 'Table'}: ${visual.label}`}>
              <Icon name={visual.kind === 'diagram' ? 'ChartArea' : 'Grid'} size='sm' decorative />
              <span>{visual.label}</span>
            </Link>
          </li>)}</ul>
        </Scrollspy>
      </CollapsibleContent>
    </Collapsible>}
    </ScrollArea>
  </nav>;
}
