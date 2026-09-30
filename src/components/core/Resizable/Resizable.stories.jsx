import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './index.js';

const docs = getComponentDocs('Core/Resizable');
const groupClass = 'mx-auto min-h-48 w-full max-w-lg rounded-2xl border';
const Pane = ({ children }) => (
  <div className='flex h-full items-center justify-center p-6 text-sm font-semibold'>{children}</div>
);
const handle = (canvasElement) => within(canvasElement).getByRole('separator');
const size = (separator) => Number(separator.getAttribute('aria-valuenow'));

export default {
  title: 'Core/Resizable',
  id: 'core-resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { orientation: ['horizontal', 'vertical'], withHandle: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { orientation: 'horizontal', withHandle: true, onLayoutChanged: fn() },
  parameters: {
    docs: {
      source: playgroundSource('ResizablePanelGroup', {
        imports: "import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gaudi/design-system';",
        children: "  <ResizablePanel defaultSize='30%' minSize='20%'>Sidebar</ResizablePanel>\n  <ResizableHandle withHandle />\n  <ResizablePanel defaultSize='70%' minSize='40%'>Content</ResizablePanel>"
      })
    }
  },
  render: ({ withHandle, ...args }) => (
    <ResizablePanelGroup key={args.orientation} className={groupClass} {...args}>
      <ResizablePanel defaultSize='30%' minSize='20%'>
        <Pane>Sidebar</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize='70%' minSize='40%'>
        <Pane>Content</Pane>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const separator = handle(canvasElement);
    await waitFor(() => expect(size(separator)).toBe(30));
    separator.focus();
    await userEvent.keyboard(args.orientation === 'vertical' ? '{ArrowDown}' : '{ArrowRight}');
    await waitFor(() => expect(size(separator)).toBeGreaterThan(30));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(size(separator)).toBe(20));
    await waitFor(() => expect(args.onLayoutChanged).toHaveBeenCalled());
  }
};

export const Collapsible = {
  parameters: {
    docs: { description: { story: '`collapsible` lets a panel close below its `minSize`. Enter on the focused handle collapses and restores it.' } }
  },
  render: () => (
    <ResizablePanelGroup orientation='horizontal' className={groupClass}>
      <ResizablePanel defaultSize='30%' minSize='20%' collapsible>
        <Pane>Filters</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize='70%'>
        <Pane>Results</Pane>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvasElement }) => {
    const separator = handle(canvasElement);
    separator.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(size(separator)).toBe(0));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(size(separator)).toBe(30));
  }
};
