import { useId, useRef } from 'react';
import { Scrollspy } from '@gaudi/design-system/core/Scrollspy';
import Button from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';

const sections = [
  { title: 'Overview', icon: 'BookOpenIcon', body: 'Scrollspy marks the link for the section at the top of the scroll container.' },
  { title: 'Installation', icon: 'DownloadIcon', body: 'Install the package, then import Scrollspy with the ScrollArea it observes.', code: 'pnpm add @gaudi/design-system' },
  { title: 'Usage', icon: 'CodeIcon', body: 'Point targetRef at the container and give each link a data-scrollspy-anchor.', code: '<Scrollspy targetRef={ref}>…</Scrollspy>' },
  { title: 'API', icon: 'BracesIcon', body: 'offset reserves room for sticky chrome, and smooth animates the jump.' },
  { title: 'Accessibility', icon: 'AccessibilityIcon', body: 'Links stay buttons in the tab order, and the active one is marked with data-active.' }
];

function ScrollspyExample({ offset, ...args }) {
  const prefix = useId();
  const targetRef = useRef(null);
  const id = (title) => `${prefix}-${title.toLowerCase()}`;
  return (
    <div className='flex gap-3'>
      <Scrollspy targetRef={targetRef} offset={offset} className='flex w-32 shrink-0 flex-col gap-0.5 sm:w-40' {...args}>
        {sections.map(({ title, icon }) => (
          <Button
            key={title}
            variant='ghost'
            tone='neutral'
            size='sm'
            data-scrollspy-anchor={id(title)}
            className='group/spy justify-start text-text-muted hover:text-text data-[active=true]:bg-surface-muted data-[active=true]:text-text'
          >
            <RegistryIcon lucide={icon} aria-hidden='true' className='group-data-[active=true]/spy:text-accent' />
            <span className='truncate'>{title}</span>
          </Button>
        ))}
      </Scrollspy>
      <div ref={targetRef} className='min-w-0 flex-1'>
        <ScrollArea aria-label='Guide' className='h-72 rounded-card border border-border'>
          {offset > 0 && (
            <div style={{ height: offset }} className='sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-surface px-4 text-xs text-text-muted'>
              <span className='truncate font-medium text-text'>Guide</span>
              <span className='shrink-0 tabular-nums'>offset {offset}px</span>
            </div>
          )}
          {sections.map(({ title, body, code }) => (
            <section key={title} id={id(title)} className='grid min-h-44 content-start gap-2 p-4 text-sm'>
              <h3 className='text-base font-semibold'>{title}</h3>
              <p className='text-text-muted'>{body}</p>
              {code && <code className='rounded-md bg-surface-muted px-2 py-1.5 font-mono text-xs break-all'>{code}</code>}
            </section>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

export const exampleDefaults = { offset: 44, smooth: true };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <ScrollspyExample {...args} />;
}

export { sections };
