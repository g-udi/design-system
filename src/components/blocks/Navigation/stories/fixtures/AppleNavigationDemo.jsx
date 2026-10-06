import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useEffect, useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import Dialog from '@gaudi/design-system/core/Dialog';
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@gaudi/design-system/core/Accordion';
import {
  NavigationMenuRoot, NavigationMenuListPrimitive, NavigationMenuItemPrimitive,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLinkPrimitive
} from '@gaudi/design-system/core/NavigationMenu';
import { useMediaQuery } from '@gaudi/design-system/hooks/environment/use-media-query';
import styles from './AppleNavigationDemo.css?raw';

const sections = [
  { title: 'Journal', groups: [
    { title: 'Explore the journal', links: ['Latest stories', 'Design', 'Engineering', 'Field notes'] },
    { title: 'Browse', links: ['All topics', 'Archive', 'Reading list'] },
    { title: 'Start here', links: ['Notes on craft', 'Building in public', 'A slower web'] }
  ] },
  { title: 'Projects', groups: [
    { title: 'Selected work', links: ['All projects', 'Gaudi', 'Small experiments'] },
    { title: 'By discipline', links: ['Interfaces', 'Data visualisation', 'Creative coding'] },
    { title: 'Behind the work', links: ['Process notes', 'Open source'] }
  ] },
  { title: 'Library', groups: [
    { title: 'A growing collection', links: ['Bookshelf', 'Bookmarks', 'Tools', 'Inspiration'] },
    { title: 'Collections', links: ['For designers', 'For developers', 'For curious minds'] },
    { title: 'Recently added', links: ['This month', 'All collections'] }
  ] },
  { title: 'About', groups: [
    { title: 'Meet the studio', links: ['Our story', 'What we believe', 'Now'] },
    { title: 'Connect', links: ['Get in touch', 'Collaborate'] },
    { title: 'Elsewhere', links: ['Talks', 'Colophon'] }
  ] }
];
const destination = (section, title) => `/${section.toLowerCase()}/${title.toLowerCase().replaceAll(' ', '-')}`;

function MenuColumns({ section, onNavigate, activeHref, desktop = false }) {
  const Link = desktop ? NavigationMenuLinkPrimitive : 'a';
  return (
    <div className='apple-navigation-columns'>
      {section.groups.map((group, column) => (
        <div className='apple-navigation-column' key={group.title} style={{ '--column-delay': `${column * 35}ms` }}>
          <p className='apple-navigation-group-label'>{group.title}</p>
          <ul>
            {group.links.map((title) => {
              const href = destination(section.title, title);
              return <li key={title}><Link className='apple-navigation-link' href={href} aria-current={activeHref === href ? 'page' : undefined} onClick={(event) => onNavigate(event, { title, href })}>{title}</Link></li>;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** An app can keep these hrefs and replace the demo navigation callback with its router. */
export function AppleNavigationDemo({ onNavigate }) {
  const [frame, setFrame] = useState(null);
  const [expanded, setExpanded] = useState('');
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const opener = useRef(null);
  const headingId = useId();
  const desktop = useMediaQuery('(min-width: 1024px)');
  useEffect(() => { setPhoneOpen(false); setExpanded(''); }, [desktop]);

  const navigate = (event, item) => {
    // Preserve ordinary browser behavior for opening a destination in a new tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setCurrent(item);
    setExpanded('');
    setPhoneOpen(false);
    onNavigate?.(item);
  };

  return (
    <div ref={setFrame} className='apple-navigation-demo' data-testid='apple-navigation-demo'>
      <style>{styles}</style>
      <header className='apple-navigation-header'>
        {desktop ? (
          <NavigationMenuRoot className='apple-navigation-desktop' aria-label='Studio navigation' value={expanded} onValueChange={setExpanded} delayDuration={120} skipDelayDuration={300}>
            <NavigationMenuListPrimitive className='apple-navigation-bar'>
              <NavigationMenuItemPrimitive>
                <NavigationMenuLinkPrimitive ref={opener} className='apple-navigation-brand' href='/' onClick={(event) => navigate(event, { title: 'Home', href: '/' })}>
                  <GaudiBrand className='text-sm' />
                </NavigationMenuLinkPrimitive>
              </NavigationMenuItemPrimitive>
              {sections.map((section) => (
                <NavigationMenuItemPrimitive key={section.title} value={section.title}>
                  <NavigationMenuTrigger className='apple-navigation-trigger'>{section.title}</NavigationMenuTrigger>
                  <NavigationMenuContent className='apple-navigation-panel'>
                    <MenuColumns section={section} onNavigate={navigate} activeHref={current?.href} desktop />
                  </NavigationMenuContent>
                </NavigationMenuItemPrimitive>
              ))}
            </NavigationMenuListPrimitive>
          </NavigationMenuRoot>
        ) : (
          <div className='apple-navigation-phone-bar'>
            <a className='apple-navigation-brand' href='/' onClick={(event) => navigate(event, { title: 'Home', href: '/' })}><GaudiBrand className='text-sm' /></a>
            <Button ref={opener} variant='ghost' size='icon' aria-label='Open studio menu' aria-haspopup='dialog' aria-expanded={phoneOpen} onClick={() => setPhoneOpen(true)}><Icon name='Menu' decorative size='sm' /></Button>
          </div>
        )}
      </header>
      <section className='apple-navigation-page' aria-labelledby={headingId}>
        <h2 id={headingId}>{current && current.href !== '/' ? current.title : <>Room for<br />new ideas.</>}</h2>
        <p>{current && current.href !== '/' ? `You’re exploring ${current.title.toLowerCase()}. Choose another destination from the menu.` : 'Stories, experiments, and useful things from a curious corner of the internet.'}</p>
        <Button variant='subtle' onClick={() => { if (desktop) setExpanded('Journal'); else setPhoneOpen(true); }}>Explore the journal <Icon name='ArrowUpRight' decorative size='sm' /></Button>
        <p className='apple-navigation-caption' role='status'>{current ? `Preview destination: ${current.href}` : 'A studio navigation example'}</p>
      </section>
      {expanded && desktop && <div className='apple-navigation-backdrop' aria-hidden='true' onPointerDown={() => setExpanded('')} />}
      {frame && (
        <Dialog variant='bare' label='Studio menu' open={phoneOpen} onOpenChange={setPhoneOpen} container={frame} restoreFocusRef={opener} className='apple-navigation-phone-dialog'>
          <div className='apple-navigation-phone-heading'>
            <span className='apple-navigation-brand'><GaudiBrand className='text-sm' /></span>
            <Button variant='ghost' size='icon' aria-label='Close studio menu' onClick={() => setPhoneOpen(false)}><Icon name='X' decorative size='sm' /></Button>
          </div>
          <nav aria-label='Studio navigation' className='apple-navigation-phone-content'>
            <AccordionRoot variant='flush' className='apple-navigation-accordion'>
              {sections.map((section) => (
                <AccordionItem key={section.title} value={section.title}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent><MenuColumns section={section} onNavigate={navigate} activeHref={current?.href} /></AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </nav>
        </Dialog>
      )}
    </div>
  );
}
