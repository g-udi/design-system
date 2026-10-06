import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '@gaudi/design-system/core/Breadcrumb';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gaudi/design-system/core/Tabs';
import { useScrollPosition } from '@gaudi/design-system/hooks/layout/use-scroll-position';
import { useElementSize } from '@gaudi/design-system/hooks/layout/use-element-size';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';
import styles from './MergingNavigationDemo.css?raw';

const views = [
  { id: 'overview', title: 'Overview', description: 'Your website, at a glance.', group: 'Project details', rows: [['Framework', 'Next.js'], ['Repository', 'personal-space / website'], ['Production branch', 'main'], ['Environment', 'Production']] },
  { id: 'deployments', title: 'Deployments', description: 'Recent builds for this project.', group: 'Recent deployments', rows: [['Update the journal layout', 'Ready · main'], ['Add image captions', 'Ready · main'], ['Refine the article index', 'Preview · article-index'], ['Refresh the colophon', 'Ready · main']] },
  { id: 'analytics', title: 'Analytics', description: 'A local sample of the pages readers visit.', group: 'Popular pages', rows: [['Journal', '1,240 views'], ['Projects', '864 views'], ['About', '512 views'], ['Library', '386 views']] },
  { id: 'logs', title: 'Logs', description: 'Recent requests from the sample workspace.', group: 'Request log', rows: [['GET /journal', '200 · 42 ms'], ['GET /projects', '200 · 38 ms'], ['GET /about', '200 · 31 ms'], ['GET /library', '200 · 45 ms']] },
  { id: 'storage', title: 'Storage', description: 'Files and collections used by this website.', group: 'Collections', rows: [['Article covers', '24 images'], ['Project assets', '18 files'], ['Profile images', '4 images'], ['Documents', '12 files']] },
  { id: 'settings', title: 'Settings', description: 'The current configuration of this sample project.', group: 'Configuration', rows: [['Project name', 'Website'], ['Default branch', 'main'], ['Build command', 'pnpm build'], ['Runtime', 'Node.js']] }
];
const notes = [
  ['Keep context close', 'At the top, the workspace and project name give you a sense of place. As you scroll, that context makes room for the sections you use throughout the page.'],
  ['Keep navigation available', 'The selected section stays visible in the sticky header. Try changing tabs while the header is compact; the content changes without sending you back to the top.'],
  ['Make room on small screens', 'The same tabs remain available on a phone. Swipe the tab row, or focus a tab and use the arrow keys to reach another section. The page itself stays within the frame.'],
  ['Return to the beginning', 'Scroll back up to restore the project breadcrumb. The Gaudi logo button also returns this workspace to the top. All data in this example is local and illustrative.']
];

export function MergingNavigationDemo({ onSectionChange }) {
  const viewport = useRef(null);
  const [section, setSection] = useState('overview');
  const [measureRow, row] = useElementSize({ initialSize: { width: 0, height: 52 } });
  const position = useScrollPosition({ targetRef: viewport });
  const reducedMotion = usePrefersReducedMotion();
  const progress = reducedMotion ? 1 : Math.min(1, position / Math.max(1, row.height));
  const merged = progress === 1;

  return (
    <Tabs className='merging-navigation-demo' value={section} onValueChange={(value) => { setSection(value); onSectionChange?.(value); }} data-testid='merging-navigation-demo'>
      <style>{styles}</style>
      <ScrollArea viewportRef={viewport} className='merging-navigation-scroll' aria-label='Project workspace'>
        <header className='merging-navigation-header' data-merged={merged} data-reduced-motion={reducedMotion} style={{ '--merge-progress': progress, '--measured-row': `${row.height}px` }}>
          <div className='merging-navigation-context' aria-hidden={merged || undefined}>
            <Breadcrumb label='Project breadcrumb'>
              <BreadcrumbList>
                <BreadcrumbItem><span>Personal Space</span></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Website</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button variant='ghost' className='merging-navigation-brand' aria-label='Back to workspace top' onClick={() => viewport.current?.scrollTo({ top: 0, behavior: 'instant' })}><GaudiLogo aria-hidden='true' className='size-6' /></Button>
          <div ref={measureRow} className='merging-navigation-row'>
            <TabsList className='merging-navigation-tabs' variant='underline' aria-label='Project sections'>
              {views.map(view => <TabsTrigger key={view.id} value={view.id}>{view.title}</TabsTrigger>)}
            </TabsList>
          </div>
        </header>
        {views.map(view => (
          <TabsContent className='merging-navigation-content' key={view.id} value={view.id}>
            <h2>{view.title}</h2>
            <p className='merging-navigation-description'>{view.description}</p>
            <p className='merging-navigation-instruction'>Scroll this workspace to bring the navigation into the header.</p>
            <section aria-label={view.group} className='merging-navigation-details'>
              <h3>{view.group}</h3>
              <dl>{view.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </section>
            <section className='merging-navigation-notes' aria-label='About this navigation'>
              {notes.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
            </section>
            <p className='merging-navigation-footnote'>Demo workspace · Local sample data</p>
          </TabsContent>
        ))}
      </ScrollArea>
    </Tabs>
  );
}
