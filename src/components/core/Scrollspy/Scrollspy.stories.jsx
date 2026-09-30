import { useId, useRef } from 'react';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ScrollArea } from '../ScrollArea/index.js';
import { Scrollspy } from './index.js';

const docs = getComponentDocs('Core/Scrollspy');
// A guide page: icon links on the left, and a scroll area whose sticky header is exactly `offset` pixels tall.
const sections = [
  { title: 'Overview', icon: 'BookOpenIcon', body: 'Scrollspy marks the link for the section at the top of the scroll container.' },
  { title: 'Installation', icon: 'DownloadIcon', body: 'Install the package, then import Scrollspy with the ScrollArea it observes.', code: 'pnpm add @gaudi/design-system' },
  { title: 'Usage', icon: 'CodeIcon', body: 'Point targetRef at the container and give each link a data-scrollspy-anchor.', code: '<Scrollspy targetRef={ref}>…</Scrollspy>' },
  { title: 'API', icon: 'BracesIcon', body: 'offset reserves room for sticky chrome, and smooth animates the jump.' },
  { title: 'Accessibility', icon: 'AccessibilityIcon', body: 'Links stay buttons in the tab order, and the active one is marked with data-active.' }
];
const titles = sections.map((section) => section.title);

function ScrollspyExample({ offset, ...args }) {
  const prefix = useId();
  const targetRef = useRef(null);
  const id = (title) => `${prefix}-${title.toLowerCase()}`;
  return (
    <div className='flex gap-3'>
      <Scrollspy targetRef={targetRef} offset={offset} className='flex w-32 shrink-0 flex-col gap-0.5 text-sm sm:w-40' {...args}>
        {sections.map(({ title, icon }) => (
          <button
            key={title}
            type='button'
            data-scrollspy-anchor={id(title)}
            className='group/spy flex items-center gap-2 rounded-md px-3 py-1.5 text-start text-ui-muted-foreground hover:bg-ui-accent/60 hover:text-ui-foreground data-[active=true]:bg-ui-accent data-[active=true]:font-medium data-[active=true]:text-ui-foreground'
          >
            <RegistryIcon lucide={icon} aria-hidden='true' className='size-4 shrink-0 group-data-[active=true]/spy:text-ui-primary' />
            <span className='truncate'>{title}</span>
          </button>
        ))}
      </Scrollspy>
      <div ref={targetRef} className='min-w-0 flex-1'>
        <ScrollArea aria-label='Guide' className='h-72 rounded-2xl border border-ui-border'>
          {offset > 0 && (
            <div style={{ height: offset }} className='sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-ui-border bg-ui-background px-4 text-xs text-ui-muted-foreground'>
              <span className='truncate font-medium text-ui-foreground'>Guide</span>
              <span className='shrink-0 tabular-nums'>offset {offset}px</span>
            </div>
          )}
          {sections.map(({ title, body, code }) => (
            <section key={title} id={id(title)} className='grid min-h-44 content-start gap-2 p-4 text-sm'>
              <h3 className='text-base font-semibold'>{title}</h3>
              <p className='text-ui-muted-foreground'>{body}</p>
              {code && <code className='rounded-md bg-ui-muted px-2 py-1.5 font-mono text-xs break-all'>{code}</code>}
            </section>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

export default {
  title: 'Core/Scrollspy',
  id: 'core-scrollspy',
  component: Scrollspy,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { offset: 'number', smooth: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { offset: 44, smooth: true, onUpdate: fn() },
  parameters: {
    docs: {
      description: { story: 'A guide page. `offset` is the height of the sticky header, so a clicked section lands just below it and the active link switches at that line. `smooth` animates the jump.' },
      source: playgroundSource('Scrollspy', {
        imports: "import { useRef } from 'react';\nimport { ScrollArea, Scrollspy } from '@gaudi/design-system';",
        before: 'const targetRef = useRef(null);\n\n',
        attributes: ['targetRef={targetRef}'],
        children: "  <button data-scrollspy-anchor='overview'>Overview</button>\n  <button data-scrollspy-anchor='usage'>Usage</button>",
        after: "\n\n<div ref={targetRef}>\n  <ScrollArea className='h-72'>\n    <header className='sticky top-0'>Guide</header>\n    <section id='overview'>…</section>\n    <section id='usage'>…</section>\n  </ScrollArea>\n</div>"
      })
    }
  },
  render: (args) => <ScrollspyExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = (name) => canvas.getByRole('button', { name });
    const viewport = canvas.getByRole('region', { name: 'Guide' });
    await waitFor(() => expect(anchor(titles[0])).toHaveAttribute('data-active', 'true'));
    const url = window.location.href;
    const scrollTo = spyOn(viewport, 'scrollTo');
    await userEvent.click(anchor('Usage'));
    // One click runs one handler, and `history` is opt-in, so the page URL is untouched.
    await expect(scrollTo).toHaveBeenCalledTimes(1);
    scrollTo.mockRestore();
    await expect(window.location.href).toBe(url);
    // Settle both anchors together: the smooth scroll can pass through the first section.
    await waitFor(() => {
      expect(anchor('Usage')).toHaveAttribute('data-active', 'true');
      expect(anchor(titles[0])).not.toHaveAttribute('data-active');
    });
    await expect(args.onUpdate).toHaveBeenLastCalledWith(anchor('Usage').dataset.scrollspyAnchor);
    // The clicked section lands `offset` pixels below the top, just under the sticky header.
    const usage = document.getElementById(anchor('Usage').dataset.scrollspyAnchor);
    const target = Math.min(usage.offsetTop - args.offset, viewport.scrollHeight - viewport.clientHeight);
    await waitFor(() => expect(Math.abs(viewport.scrollTop - target)).toBeLessThanOrEqual(1));
    anchor('Usage').blur();
  }
};
