'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';

import Icon from '../Icon';
import { omit } from '../../../utilities/content';
import { useSiteConfig } from '../../../utilities/SiteConfig';
import CommandPalette, { filterItems, getItemIndexMap } from './CommandPalette';
import { CommandFooter } from './parts/command.jsx';

const normalizeSlug = (value = '') => String(value).replace(/^\//, '');
const allowedExternalProtocols = new Set([ 'http:', 'https:', 'mailto:' ]);

const normalizeExternalUrl = (value) => {
  if (!value) return null;

  try {
    const url = new URL(String(value).trim());

    return allowedExternalProtocols.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const normalizeEmailUrl = (email) => {
  const address = String(email || '').trim();

  if (!address || /[\s<>"'`]/.test(address) || !address.includes('@')) return null;

  return normalizeExternalUrl(`mailto:${address}`);
};

const createExternalAction = (url) => () => {
  const href = normalizeExternalUrl(url);

  if (!href || typeof window === 'undefined') return;

  try {
    window.open(href, '_blank', 'noopener,noreferrer')?.focus();
  } catch {

    // Browser policies can block popups or external handlers.
  }
};

const commandItemProps = ({ closeOnSelect, href, onClick }) => {
  return {
    ...(typeof closeOnSelect === 'boolean' ? { closeOnSelect } : {}),
    ...(href ? { href } : {}),
    ...(onClick ? { onClick } : {})
  };
};

const itemConfig = {
  'navigation': {},
  'post': { 'showSubtitle': true },
  'project': { 'showSubtitle': true },
  'publication': { 'showSubtitle': true },
  'tag': { 'showSubtitle': true },
  'thought': { 'showSubtitle': true }
};

const CmdItem = ({ category, children, count, icon, inlineMetadata = false, subtitle, title, type = 'navigation' }) => {
  const config = itemConfig[type] || itemConfig.navigation;
  const resolvedSubtitle = (type === 'post' && category ? category.replace(/[-_]/g, ' ') : null) || (type === 'tag' && typeof count !== 'undefined' ? `${count} ${count === 1 ? 'post' : 'posts'}` : null) || subtitle;
  const showSubtitle = config.showSubtitle && resolvedSubtitle;

  return (
    <div className='group flex w-full items-center gap-2.5 rounded-lg px-3 py-2'>
      {icon ? <Icon name={ icon } decorative size='sm' className='text-gray-600 dark:text-gray-300' /> : null}
      {inlineMetadata ? (
        <>
          <div className='min-w-0 flex-1 truncate text-sm font-medium text-gray-950 dark:text-gray-100'>{title || children}</div>
          {showSubtitle ? (
            <div
              className={ [
                'ml-auto max-w-[38%] shrink-0 truncate text-right text-xs text-gray-500 sm:max-w-[45%] dark:text-gray-400',
                type === 'post' ? 'capitalize' : ''
              ].filter(Boolean).join(' ') }
              data-cmdk-item-meta
            >
              {resolvedSubtitle}
            </div>
          ) : null}
        </>
      ) : (
        <div className='min-w-0 flex-1'>
          <div className='truncate text-sm font-medium text-gray-950 dark:text-gray-100'>{title || children}</div>
          {showSubtitle ? (
            <div className='mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400'>{resolvedSubtitle}</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const prepareCollection = (collection, type) => (collection || []).map((item) => {
  const base = {
    ...item,
    'children': item.title || item.display || item.name,
    'id': type === 'publication' ? item.id : item.slug,
    'showType': false,
    'title': item.title || item.display || item.name,
    type
  };

  if (type === 'post')
    return omit({ ...base, 'href': `/blog/${normalizeSlug(item.slug)}` }, [ 'draft', 'externalLink', 'featured', 'filePath', 'readingTime', 'sameAs', 'tableOfContents', 'venueType' ]);

  if (type === 'project')
    return omit({ ...base, 'href': `/blog/projects/${normalizeSlug(item.slug)}`, 'subtitle': item.subtitle || item.description || item.summary }, [ 'draft', 'externalLink', 'featured', 'filePath' ]);

  if (type === 'thought')
    return omit({ ...base, 'href': `/thoughts/${normalizeSlug(item.slug)}`, 'subtitle': item.summary || item.description }, [ 'draft', 'featured', 'filePath' ]);

  if (type === 'publication')
    return omit({ ...base, 'href': item.href, 'subtitle': item.year }, [ 'sameAs', 'venueType' ]);

  return base;
});

const prepareTags = (tags = []) => tags.map((tag) => {
  return {
    'children': tag.title || tag.display || tag.name,
    'count': tag.count,
    'href': tag.href || `/blog/tags/${normalizeSlug(tag.slug || tag.id)}`,
    'id': tag.slug || tag.id,
    'showType': false,
    'title': tag.title || tag.display || tag.name,
    'type': 'tag'
  };
});

const collectionPageConfig = {
  'posts': { 'heading': 'Posts', 'inlineMetadata': true, 'label': 'Posts', 'type': 'post' },
  'projects': { 'heading': 'Projects', 'inlineMetadata': false, 'label': 'Projects', 'type': 'project' },
  'publications': { 'heading': 'Publications', 'inlineMetadata': true, 'label': 'Publications', 'type': 'publication' },
  'tags': { 'heading': 'Tags', 'inlineMetadata': true, 'label': 'Tags', 'type': 'tag' },
  'thoughts': { 'heading': 'Thoughts', 'inlineMetadata': false, 'label': 'Thoughts', 'type': 'thought' }
};

const CollectionPage = ({ id, items, page, search, setPage }) => {
  const config = collectionPageConfig[id];

  // Only the active page pays for filtering; CommandPalette.Page renders null for the rest anyway
  if (page !== id) return <CommandPalette.Page id={ id } searchPrefix={ [ 'General', config.label ] } />;

  const filtered = filterItems([{ 'heading': config.heading, id, items, 'options': { 'filterOnListHeading': true } }], search);
  const indexById = getItemIndexMap(filtered);

  return (
    <CommandPalette.Page id={ id } searchPrefix={ [ 'General', config.label ] } onEscape={ () => setPage('root') }>
      {filtered.length ? filtered.map((list) => (
        <CommandPalette.List key={ list.id } heading={ list.heading }>
          {list.items.map(({ category, children, count, 'id': itemId, subtitle, title, type, ...rest }) => (
            <CommandPalette.ListItem key={ itemId } index={ indexById.get(itemId) } { ...commandItemProps(rest) }>
              <CmdItem inlineMetadata={ config.inlineMetadata } title={ title } subtitle={ subtitle } category={ category } count={ count } type={ type || config.type }>
                {children}
              </CmdItem>
            </CommandPalette.ListItem>
          ))}
        </CommandPalette.List>
      )) : <CommandPalette.FreeSearchAction />}
    </CommandPalette.Page>
  );
};

/**
 * Builds the contact page entries from site metadata. Consumers can override the
 * whole list via the CommandLauncher `social` prop.
 */
const buildSocialItems = (metadata = {}, social) => {
  if (social) return social;

  const items = [];
  const linkedin = normalizeExternalUrl(metadata.linkedin);
  const twitter = normalizeExternalUrl(metadata.twitter);
  const github = normalizeExternalUrl(metadata.github);
  const youtube = normalizeExternalUrl(metadata.youtube);
  const email = normalizeEmailUrl(metadata.email);

  if (email) items.push({ 'children': 'Email', 'closeOnSelect': false, 'icon': 'Mail', 'id': 'mail', 'onClick': createExternalAction(email), 'title': 'Email' });
  if (github) items.push({ 'children': 'GitHub', 'closeOnSelect': false, 'icon': 'Github', 'id': 'github', 'onClick': createExternalAction(github), 'title': 'GitHub' });
  if (youtube) items.push({ 'children': 'YouTube', 'closeOnSelect': false, 'icon': 'Youtube', 'id': 'youtube', 'onClick': createExternalAction(youtube), 'title': 'YouTube' });
  if (linkedin) items.push({ 'children': 'LinkedIn', 'closeOnSelect': false, 'icon': 'Linkedin', 'id': 'linkedin', 'onClick': createExternalAction(linkedin), 'title': 'LinkedIn' });
  if (twitter) items.push({ 'children': 'X', 'closeOnSelect': false, 'icon': 'Twitter', 'id': 'twitter', 'onClick': createExternalAction(twitter), 'title': 'X' });

  return items;
};

const SocialPage = ({ items = [], page, search, setPage }) => {
  if (page !== 'contact') return <CommandPalette.Page id='contact' searchPrefix={ [ 'General', 'Contact' ] } />;

  const socialItems = filterItems([
    {
      'heading': 'Contact',
      'id': 'contact',
      items
    }
  ], search);
  const indexById = getItemIndexMap(socialItems);

  return (
    <CommandPalette.Page id='contact' searchPrefix={ [ 'General', 'Contact' ] } onEscape={ () => setPage('root') }>
      {socialItems.length ? socialItems.map((list) => (
        <CommandPalette.List key={ list.id } heading={ list.heading }>
          {list.items.map(({ children, icon, id, title, ...rest }) => (
            <CommandPalette.ListItem key={ id } index={ indexById.get(id) } { ...commandItemProps(rest) }>
              <CmdItem title={ title } icon={ icon }>{children}</CmdItem>
            </CommandPalette.ListItem>
          ))}
        </CommandPalette.List>
      )) : <CommandPalette.FreeSearchAction />}
    </CommandPalette.Page>
  );
};

const NoResults = ({ search }) => (
  <div className='flex items-center gap-2 px-3 py-3 text-sm text-gray-500 dark:text-gray-400'>
    <Icon name='FaceIdError' decorative size='sm' />
    <span>No results for “{search}”.</span>
  </div>
);

const CommandLauncher = ({
  open,
  posts = [],
  projects = [],
  publications = [],
  restoreFocusRef,
  setOpen,
  social,
  tags = [],
  thoughts = []
}) => {
  const [ page, setPage ] = useState('root');
  const [ search, setSearch ] = useState('');
  const [ selected, setSelected ] = useState(0);
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { metadata } = useSiteConfig();
  const socialItems = useMemo(() => buildSocialItems(metadata, social), [ metadata, social ]);

  const collections = useMemo(() => {
    return {
      'posts': prepareCollection(posts, 'post'),
      'projects': prepareCollection(projects, 'project'),
      'publications': prepareCollection(publications, 'publication'),
      'tags': prepareTags(tags),
      'thoughts': prepareCollection(thoughts, 'thought')
    };
  }, [ posts, projects, publications, tags, thoughts ]);

  const rootItems = useMemo(() => filterItems([
    {
      'heading': 'Explore content',
      'id': 'commander',
      /* Collection entries only appear when the consumer actually supplied that collection. */
      'items': [
        { 'children': 'Home', 'cmdIcon': 'HomeIcon', 'href': '/', 'id': 'home' },
        { 'children': 'Blog', 'cmdIcon': 'BookOpenIcon', 'href': '/blog', 'id': 'blog' },
        ...(collections.projects.length ? [{ 'children': 'Projects', 'closeOnSelect': false, 'cmdIcon': 'RectangleGroupIcon', 'id': 'projects', 'onClick': () => {
          setPage('projects'); setSearch('');
        } }] : []),
        ...(collections.posts.length ? [{ 'children': 'Posts', 'closeOnSelect': false, 'cmdIcon': 'RectangleStackIcon', 'id': 'posts_list', 'onClick': () => {
          setPage('posts'); setSearch('');
        } }] : []),
        ...(collections.thoughts.length ? [{ 'children': 'Thoughts', 'closeOnSelect': false, 'cmdIcon': 'LightBulbIcon', 'id': 'thoughts', 'onClick': () => {
          setPage('thoughts'); setSearch('');
        } }] : []),
        ...(collections.publications.length ? [{ 'children': 'Publications', 'closeOnSelect': false, 'cmdIcon': 'NewspaperIcon', 'id': 'publications', 'onClick': () => {
          setPage('publications'); setSearch('');
        } }] : []),
        ...(collections.tags.length ? [{ 'children': 'Tags', 'closeOnSelect': false, 'cmdIcon': 'TagIcon', 'id': 'tags', 'onClick': () => {
          setPage('tags'); setSearch('');
        } }] : [])
      ]
    },
    {
      'heading': 'Other',
      'id': 'other',
      'items': [
        { 'children': 'About me', 'cmdIcon': 'FingerPrintIcon', 'href': '/about', 'id': 'about_me' },
        ...(socialItems.length ? [{ 'children': 'Reach out', 'closeOnSelect': false, 'cmdIcon': 'IdentificationIcon', 'id': 'reach_out', 'onClick': () => {
          setPage('contact'); setSearch('');
        } }] : []),
        { 'children': 'Switch theme', 'closeOnSelect': false, 'cmdIcon': 'ArrowRightOnRectangleIcon', 'id': 'switch_theme', 'onClick': () => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark') }
      ]
    },
    { 'heading': 'Posts', 'hidden': true, 'id': 'posts_fullTextSearch', 'items': collections.posts, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Projects', 'hidden': true, 'id': 'projects_fullTextSearch', 'items': collections.projects, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Thoughts', 'hidden': true, 'id': 'thoughts_fullTextSearch', 'items': collections.thoughts, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Publications', 'hidden': true, 'id': 'publications_fullTextSearch', 'items': collections.publications, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Tags', 'hidden': true, 'id': 'tags_fullTextSearch', 'items': collections.tags, 'options': { 'filterOnListHeading': true } }
  ], page === 'root' ? search : ''), [ collections, page, resolvedTheme, search, setTheme, socialItems, theme ]);

  const rootIndexById = useMemo(() => getItemIndexMap(rootItems), [ rootItems ]);

  useEffect(() => {
    const down = (event) => {
      if (event.key !== 'k' || (!event.metaKey && !event.ctrlKey)) return;

      event.preventDefault();
      setOpen((currentOpen) => !currentOpen);
      setPage('root');
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [ setOpen ]);

  return (
    <div className='gaudi-command-launcher'>
      <CommandPalette
        className='gaudi-command-launcher'
        footer={ <CommandFooter /> }
        isOpen={ open }
        onChangeOpen={ setOpen }
        onChangeSearch={ setSearch }
        onChangeSelected={ setSelected }
        page={ page }
        restoreFocusRef={ restoreFocusRef }
        search={ search }
        selected={ selected }
        showType={ false }
      >
        <CommandPalette.Page id='root' searchPrefix={ [ 'General' ] }>
          {rootItems.length ? rootItems.map((list) => (
            <div key={ `cmd-${list.id}` } className={ search.toLowerCase() === list.heading.toLowerCase() ? 'hidden' : '' }>
              <div className={ list.hidden && !search.length ? 'hidden' : 'visible' }>
                <CommandPalette.List key={ `cmdPalette-${list.id}` } heading={ list.heading }>
                  {list.items.map(({ category, children, cmdIcon, count, id, subtitle, title, type, ...rest }) => (
                    <CommandPalette.ListItem key={ `cmdPaletteItem-${list.id}-${id}` } index={ rootIndexById.get(id) } { ...commandItemProps(rest) }>
                      <CmdItem title={ title } subtitle={ subtitle } category={ category } count={ count } type={ type || 'navigation' } icon={ cmdIcon }>
                        {children}
                      </CmdItem>
                    </CommandPalette.ListItem>
                  ))}
                </CommandPalette.List>
              </div>
            </div>
          )) : <NoResults search={ search } />}
        </CommandPalette.Page>
        <CollectionPage id='projects' page={ page } setPage={ setPage } search={ search } items={ collections.projects } />
        <CollectionPage id='posts' page={ page } setPage={ setPage } search={ search } items={ collections.posts } />
        <CollectionPage id='thoughts' page={ page } setPage={ setPage } search={ search } items={ collections.thoughts } />
        <CollectionPage id='publications' page={ page } setPage={ setPage } search={ search } items={ collections.publications } />
        <CollectionPage id='tags' page={ page } setPage={ setPage } search={ search } items={ collections.tags } />
        <SocialPage page={ page } setPage={ setPage } search={ search } items={ socialItems } />
      </CommandPalette>
    </div>
  );
};

export default CommandLauncher;
