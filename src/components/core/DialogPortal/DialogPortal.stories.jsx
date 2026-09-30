import { useId, useRef, useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import DialogPortal from './DialogPortal';

const docs = getComponentDocs('Core/DialogPortal');
const title = 'Isolated dialog';
const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// DialogPortal isolates the page; the dialog itself owns Escape and focus containment.
function PortalExample(props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const close = () => setOpen(false);
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...(dialogRef.current?.querySelectorAll(focusableSelector) || [])];
    const edge = event.shiftKey ? focusable[0] : focusable.at(-1);
    if (document.activeElement !== edge) return;
    event.preventDefault();
    (event.shiftKey ? focusable.at(-1) : focusable[0])?.focus();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      {open ? (
        <DialogPortal {...props} initialFocusRef={closeButtonRef}>
          <div
            ref={dialogRef}
            className='fixed inset-0 z-[var(--ds-z-overlay)] grid place-items-center bg-gray-950/70 p-4'
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            onKeyDown={handleKeyDown}
          >
            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-950'>
              <h2 id={titleId} className='text-xl font-bold text-gray-950 dark:text-gray-100'>{title}</h2>
              <p className='mt-2 text-gray-700 dark:text-gray-300'>The page behind this dialog is inert while it is open.</p>
              <div className='mt-6 flex flex-wrap justify-end gap-3'>
                <Button variant='outline' onClick={close}>Cancel</Button>
                <Button ref={closeButtonRef} onClick={close}>Close dialog</Button>
              </div>
            </div>
          </div>
        </DialogPortal>
      ) : null}
    </>
  );
}

export default {
  title: 'Core/DialogPortal',
  id: 'core-dialogportal',
  component: DialogPortal,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { lockScroll: 'boolean', restoreFocus: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { lockScroll: true, restoreFocus: true },
  parameters: {
    docs: {
      source: playgroundSource('DialogPortal', {
        imports: "import { DialogPortal } from '@gaudi/design-system';",
        children: `  <div role='dialog' aria-modal='true' aria-labelledby='dialog-title'>\n    <h2 id='dialog-title'>${title}</h2>\n    <button onClick={() => setOpen(false)}>Close dialog</button>\n  </div>`
      })
    }
  },
  render: (args) => <PortalExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Open dialog' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: title });
    const scope = within(dialog);
    const closeButton = scope.getByRole('button', { name: 'Close dialog' });

    await waitFor(() => expect(closeButton).toHaveFocus());
    await expect(canvasElement.closest('body > *')).toHaveAttribute('inert');
    if (args.lockScroll) await expect(document.body).toHaveStyle({ overflow: 'hidden' });
    await userEvent.tab();
    await expect(scope.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(closeButton).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: title })).not.toBeInTheDocument());
    if (args.restoreFocus) await expect(trigger).toHaveFocus();
  }
};
