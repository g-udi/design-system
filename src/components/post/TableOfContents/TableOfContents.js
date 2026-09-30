'use client';

/**
 * TableOfContents Component
 *
 * @description Interactive table of contents component that tracks user scroll position
 * and highlights the currently active section. Features automatic expansion/collapse logic,
 * smooth scrolling navigation, and responsive design that hides on mobile screens.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from 'react';

import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

import styles from './TableOfContents.module.css';

const visualKindLabels = {
  'diagram': 'Diagram',
  'table': 'Table'
};

const visualKindIcons = {
  'diagram': 'ChartArea',
  'table': 'Grid'
};

const normalizeVisualLabel = (value, fallback) => {
  const normalized = value?.replace(/\s+/g, ' ').trim();

  if (!normalized) return fallback;
  if (normalized.length <= 72) return normalized;

  return `${normalized.slice(0, 69).trim()}…`;
};

const slugifyVisualLabel = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 48);

const getFigureLabel = (figure, index) => normalizeVisualLabel(
  figure.dataset.tocLabel || figure.querySelector('figcaption strong')?.textContent || figure.querySelector('figcaption')?.textContent,
  `Diagram ${index + 1}`
);

const getTableLabel = (table, index) => {
  const caption = table.querySelector('caption')?.textContent;
  const headers = [ ...table.querySelectorAll('thead th') ]
    .map((header) => header.textContent?.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' · ');

  return normalizeVisualLabel(caption || headers, `Table ${index + 1}`);
};

const collectVisuals = (content) => {
  const article = content || document.querySelector('main article') || document.querySelector('article');

  if (!article) return [];

  const figures = [ ...article.querySelectorAll('figure') ]
    .filter((figure) => !figure.hasAttribute('data-rehype-pretty-code-figure') && figure.querySelector('figcaption'))
    .map((element, index) => ({
      element,
      'kind': 'diagram',
      'label': getFigureLabel(element, index)
    }));
  const tables = [ ...article.querySelectorAll('table') ].map((element, index) => ({
    element,
    'kind': 'table',
    'label': getTableLabel(element, index)
  }));
  const candidates = [ ...figures, ...tables ].sort((first, second) => (
    first.element.compareDocumentPosition(second.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  ));
  const claimedIds = new Set([ ...document.querySelectorAll('[id]') ].map((element) => element.id).filter(Boolean));

  return candidates.map((visual, index) => {
    let id = visual.element.id;

    if (!id) {
      const labelSlug = slugifyVisualLabel(visual.label) || `${visual.kind}-${index + 1}`;
      const baseId = `visual-${visual.kind}-${labelSlug}`;
      let suffix = 1;

      id = baseId;
      while (claimedIds.has(id)) {
        suffix += 1;
        id = `${baseId}-${suffix}`;
      }

      visual.element.id = id;
      claimedIds.add(id);
    }

    visual.element.dataset.contentIndexTarget = 'true';

    return {
      id,
      'kind': visual.kind,
      'label': visual.label,
      'url': `#${id}`
    };
  });
};

/**
 * Renders an interactive table of contents with scroll tracking
 *
 * @description Sidebar table of contents that observes heading visibility using Intersection Observer.
 * Automatically highlights the current section, handles URL hash navigation, and provides
 * expandable/collapsible nested structure based on heading hierarchy.
 *
 * @param {Object} props - Component props
 * @param {React.RefObject<HTMLElement>} [props.contentRef] - Article to index when several articles share a page
 * @param {Array<Object>} props.toc - Table of contents data structure
 * @param {string} props.toc[].id - Heading element ID for navigation
 * @param {string} props.toc[].value - Heading text content
 * @param {string} props.toc[].url - Hash URL for the heading
 * @param {number} props.toc[].depth - Heading level (1-6)
 * @param {Array<Object>} props.toc[].children - Nested child headings
 *
 * @returns {JSX.Element} Interactive table of contents sidebar
 *
 * @example
 * // Basic usage with TOC data
 * const tocData = [{
 *   id: 'heading-1',
 *   value: 'Introduction',
 *   url: '#heading-1',
 *   depth: 1,
 *   children: []
 * }];
 * <TableOfContents toc={tocData} />
 *
 * @example
 * // TOC automatically expands when there are 4 or fewer level-1 headings
 * <TableOfContents toc={smallTocData} />
 */
const TableOfContents = ({ className, contentRef, toc = [] }) => {
  const [ activeSlug, setActiveSlug ] = useState('');
  const [ activeVisualId, setActiveVisualId ] = useState('');
  const [ visuals, setVisuals ] = useState([]);
  const isTableOfContentsLoaded = useRef(false);

  useEffect(() => {
    const observeHeadings = (headings, observer) => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);

        if (element) observer.observe(element);
        if ((heading.children || []).length > 0) observeHeadings(heading.children, observer);
      });
    };

    if (location.hash && !isTableOfContentsLoaded.current) {
      setActiveSlug(location.hash.replace('#', ''));
      isTableOfContentsLoaded.current = true;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry?.isIntersecting) setActiveSlug(entry.target.id);
        });
      }, {
        'rootMargin': '-25% 0px -75% 0px'
      }
    );

    observeHeadings(toc, observer);

    return () => observer.disconnect();
  }, [ toc ]);

  useEffect(() => {
    const indexedVisuals = collectVisuals(contentRef?.current);

    setVisuals(indexedVisuals);

    if (location.hash) {
      const hashId = location.hash.replace('#', '');

      if (indexedVisuals.some((visual) => visual.id === hashId)) setActiveVisualId(hashId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry?.isIntersecting) setActiveVisualId(entry.target.id);
        });
      }, {
        'rootMargin': '-20% 0px -65% 0px'
      }
    );

    indexedVisuals.forEach((visual) => {
      const element = document.getElementById(visual.id);

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ contentRef ]);

  /**
   * Checks if any descendant heading is currently active
   *
   * @description Recursively checks if the current heading or any of its children
   * match the active slug, used for determining expansion state.
   *
   * @param {Object} heading - Heading object to check
   * @returns {boolean} True if heading or descendants are active
   */
  const isDescendantActive = (heading) => {
    if (heading.id === activeSlug) return true;

    return (heading.children || []).some((child) => isDescendantActive(child));
  };

  /**
   * Recursively renders the table of contents structure
   *
   * @description Renders nested TOC structure with proper indentation and styling.
   * Handles active states, expansion logic, and depth-based styling.
   *
   * @param {Array<Object>} _toc - TOC data to render
   * @param {boolean} [parentActive=false] - Whether parent is active
   * @param {boolean} [expandAll=false] - Whether to expand all sections
   * @returns {JSX.Element} Rendered TOC structure
   */
  const renderToc = (_toc, parentActive = false, expandAll = false) => (
    <ul>
      {_toc.map((heading) => {
        const isActive = activeSlug === heading.id;
        const shouldShowChildren = expandAll || isActive || parentActive || isDescendantActive(heading);

        return (
          <li
            key={ heading.url || heading.id }
            className={ cn(
              'flex flex-col py-[7px]',
              isActive && 'text-blue-600! dark:text-blue-400!',
              heading.depth === 2 && 'ml-3!',
              heading.depth > 2 ? 'ml-5! font-light text-gray-500 dark:text-gray-400' : 'font-medium text-gray-600 dark:text-gray-300'
            ) }
          >
            <a
              className='flex text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              href={ heading.url }
              aria-current={ isActive ? 'location' : undefined }
              onClick={ () => setActiveSlug(heading.id) }
            >
              {heading.value}
            </a>
            {(heading.children || []).length > 0 && shouldShowChildren &&
              renderToc(heading.children, shouldShowChildren, expandAll)}
          </li>
        );
      })}
    </ul>
  );

  const level1HeadingsCount = toc.filter((heading) => heading.depth === 1).length;
  const expandAll = level1HeadingsCount <= 4;
  const diagramCount = visuals.filter((visual) => visual.kind === 'diagram').length;
  const tableCount = visuals.filter((visual) => visual.kind === 'table').length;

  return (
    <nav aria-label='Table of contents' className={ cn('p-4 sticky top-20 text-gray-800 col-span-3 max-xl:hidden max-h-[calc(100vh-5rem)] overflow-y-auto', className) }>
      {renderToc(toc, false, expandAll)}

      {visuals.length > 0 && (
        <details className={ styles.visualIndex }>
          <summary className={ styles.visualIndexHeader }>
            <span className={ styles.visualIndexTitle }>Diagrams &amp; tables</span>
            <span className={ styles.visualIndexCount }>
              {diagramCount > 0 && `${diagramCount} ${diagramCount === 1 ? 'diagram' : 'diagrams'}`}
              {diagramCount > 0 && tableCount > 0 && ' · '}
              {tableCount > 0 && `${tableCount} ${tableCount === 1 ? 'table' : 'tables'}`}
            </span>
            <Icon name='ChevronRight' size='xs' decorative className={ styles.visualIndexChevron } />
          </summary>

          <ul className={ styles.visualList }>
            {visuals.map((visual) => {
              const isActive = activeVisualId === visual.id;

              return (
                <li key={ visual.id }>
                  <a
                    className={ styles.visualLink }
                    data-active={ isActive }
                    href={ visual.url }
                    aria-label={ `${visualKindLabels[visual.kind]}: ${visual.label}` }
                    aria-current={ isActive ? 'location' : undefined }
                    onClick={ () => setActiveVisualId(visual.id) }
                  >
                    <Icon name={ visualKindIcons[visual.kind] } size='sm' decorative className={ styles.visualIcon } />
                    <span className={ styles.visualLabel }>{visual.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </nav>
  );
};

export default TableOfContents;
