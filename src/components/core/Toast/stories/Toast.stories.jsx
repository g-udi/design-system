import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { PlaygroundDemo, saved } from './fixtures/NativeExamples.jsx';
import nativeSource from './fixtures/NativeExamples.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import ToastProvider from '../Toast';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const docs = getComponentDocs('Core/Toast');

export default {
  title: 'Core/Overlays & Menus/Toast', id: 'core-toast',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    position: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    expand: 'boolean',
    closeButton: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { position: 'bottom-right', expand: true, closeButton: true },
  parameters: {
    docs: {
      description: { story: 'An app window with a live stack: a saved draft, a failed export with a Retry action, and a publish in progress. `position` moves the stack, `expand` fans it out or collapses it, and `closeButton` adds a dismiss action to each toast. The toolbar buttons fire them again.' },
      source: { code: publicSource(nativeSource, new URL('./fixtures/NativeExamples.jsx', import.meta.url)) }
    }
  },
  render: (args) => <PlaygroundDemo {...args} />,
  play: async (context) => {
    const { args, canvasElement } = context;
    const canvas = within(canvasElement);
    const [y, x] = args.position.split('-');
    await waitFor(() => expect(canvas.getByText(saved.title)).toBeVisible());
    await expect(canvas.getByText('Export interrupted')).toBeInTheDocument();
    await expect(canvas.getByText('Publishing to 3 channels')).toBeInTheDocument();
    const toaster = canvasElement.querySelector('[data-sonner-toaster]');
    await expect(toaster).toHaveAttribute('data-y-position', y);
    await expect(toaster).toHaveAttribute('data-x-position', x);
    // Sonner omits the close action while a toast is loading.
    await expect(canvas.queryAllByRole('button', { name: /close toast/i })).toHaveLength(args.closeButton ? 2 : 0);
    if (args.expand) {
      await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(canvas.getByText('Export restarted')).toBeVisible());
    }
    // Leave the default stack in place for the story view.
    for (const name of ['Save draft', 'Export', 'Publish']) await userEvent.click(canvas.getByRole('button', { name, exact: true }));
    if (args.expand) {
      await auditOverlayState({ ...context, beforeAuditWidth: async () => {
        await waitFor(() => {
          const rects = [...toaster.querySelectorAll('[data-sonner-toast][data-mounted="true"][data-visible="true"]')]
            .map(toast => toast.getBoundingClientRect()).sort((a, b) => a.top - b.top);
          expect(rects).toHaveLength(3);
          for (let index = 1; index < rects.length; index += 1) expect(rects[index].top - rects[index - 1].bottom).toBeGreaterThanOrEqual(13);
        });
      } }, 'expanded');
    }

  }
};
