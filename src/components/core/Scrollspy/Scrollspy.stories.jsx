import { useId, useRef } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import { ScrollArea } from '../ScrollArea/index.js';
import { Scrollspy } from './index.js';

const docs = getComponentDocs('Core/Scrollspy');
const sections = ['Overview', 'Installation', 'Usage', 'Accessibility'];

function ScrollspyExample(args) {
  const prefix = useId();
  const targetRef = useRef(null);
  const id = (section) => `${prefix}-${section.toLowerCase()}`;
  return (
    <div className='flex gap-4'>
      <Scrollspy targetRef={targetRef} className='flex w-36 shrink-0 flex-col gap-2' {...args}>
        {sections.map((section) => (
          <Button
            key={section}
            variant='outline'
            data-scrollspy-anchor={id(section)}
            className='data-[active=true]:bg-ui-primary data-[active=true]:text-ui-primary-foreground'
          >
            {section}
          </Button>
        ))}
      </Scrollspy>
      <div ref={targetRef} className='min-w-0 flex-1'>
        <ScrollArea aria-label='Guide' className='h-72 rounded-2xl border'>
          {sections.map((section) => (
            <section key={section} id={id(section)} className='space-y-2 p-4'>
              <h3 className='text-base font-semibold'>{section}</h3>
              <div className='h-56 rounded-2xl bg-ui-muted' />
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
  argTypes: docsArgTypes(docs, { offset: 'number', smooth: 'boolean', history: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { offset: 0, smooth: true, history: false, onUpdate: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Scrollspy', {
        imports: "import { useRef } from 'react';\nimport { Button, ScrollArea, Scrollspy } from '@gaudi/design-system';",
        before: 'const targetRef = useRef(null);\n\n',
        attributes: ['targetRef={targetRef}'],
        children: "  <Button data-scrollspy-anchor='overview'>Overview</Button>\n  <Button data-scrollspy-anchor='usage'>Usage</Button>",
        after: "\n\n<div ref={targetRef}>\n  <ScrollArea className='h-72'>\n    <section id='overview'>…</section>\n    <section id='usage'>…</section>\n  </ScrollArea>\n</div>"
      })
    }
  },
  render: (args) => <ScrollspyExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = (name) => canvas.getByRole('button', { name });
    await waitFor(() => expect(anchor('Overview')).toHaveAttribute('data-active', 'true'));
    await userEvent.click(anchor('Usage'));
    await waitFor(() => expect(anchor('Usage')).toHaveAttribute('data-active', 'true'));
    await expect(anchor('Overview')).not.toHaveAttribute('data-active');
    await expect(args.onUpdate).toHaveBeenLastCalledWith(anchor('Usage').dataset.scrollspyAnchor);
  }
};
