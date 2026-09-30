import { useId, useRef, useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import Icon from '../Icon';
import DialogPortal from './DialogPortal';

const docs = getComponentDocs('Core/DialogPortal');
const title = 'Publish this article?';
const triggerLabel = 'Publish';
const article = { title: 'A practical guide to knowledge graphs', meta: 'Ada Lovelace · 2,480 words · reviewed today' };
const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
// What each setting means for the page behind the dialog; the checklist in the preview renders these lines.
const behaviour = {
  lockScroll: { true: 'The page behind cannot scroll', false: 'The page behind keeps scrolling' },
  restoreFocus: { true: `Focus returns to ${triggerLabel} on close`, false: 'Focus is not restored on close' }
};
const closedStatus = (restored) => (restored ? `Closed: focus is back on ${triggerLabel}.` : 'Closed: focus was not restored.');

function Check({ on, children }) {
  return (
    <li className='flex items-center gap-2'>
      <Icon name={on ? 'CircleCheck' : 'CircleX'} decorative size='sm' className={on ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
      {children}
    </li>
  );
}

// DialogPortal isolates the page; the dialog itself owns Escape and focus containment.
function PortalExample(props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const titleId = useId();
  const triggerRef = useRef(null);
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);
  const close = () => {
    setOpen(false);
    // Report where focus landed once the portal has unmounted and restored it.
    requestAnimationFrame(() => setStatus(closedStatus(document.activeElement === triggerRef.current)));
  };
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
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <article className='flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800'>
        <img src='static/images/og-card.jpg' alt='' className='aspect-video w-20 shrink-0 rounded-md object-cover' />
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium text-gray-950 dark:text-gray-100'>{article.title}</p>
          <p className='truncate text-xs text-gray-500 dark:text-gray-400'>{article.meta}</p>
        </div>
        <Button ref={triggerRef} size='sm' onClick={() => setOpen(true)}>{triggerLabel}</Button>
      </article>
      <ul aria-label='While the dialog is open' className='grid gap-1.5 text-sm text-gray-700 dark:text-gray-300'>
        <Check on>The rest of the page is inert and hidden from assistive technology</Check>
        <Check on={props.lockScroll}>{behaviour.lockScroll[props.lockScroll]}</Check>
        <Check on={props.restoreFocus}>{behaviour.restoreFocus[props.restoreFocus]}</Check>
      </ul>
      <p role='status' className='text-sm text-gray-500 dark:text-gray-400'>{status}</p>
      {open ? (
        <DialogPortal {...props} initialFocusRef={cancelRef}>
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
              <p className='mt-2 text-gray-700 dark:text-gray-300'>“{article.title}” goes live and is sent to 1,284 newsletter subscribers.</p>
              <div className='mt-6 flex flex-wrap justify-end gap-3'>
                <Button ref={cancelRef} variant='outline' tone='neutral' onClick={close}>Cancel</Button>
                <Button onClick={close}>Publish now</Button>
              </div>
            </div>
          </div>
        </DialogPortal>
      ) : null}
    </div>
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
      description: {
        story: 'A publish confirmation for one article. The checklist spells out what the portal does to the page while the dialog is open, following `lockScroll` and `restoreFocus`, and the status line reports where focus landed after the last close.'
      },
      source: playgroundSource('DialogPortal', {
        imports: "import { DialogPortal } from '@gaudi/design-system';",
        attributes: ['initialFocusRef={cancelRef}'],
        before: '{open ? (\n',
        after: '\n) : null}',
        children: [
          "  <div role='dialog' aria-modal='true' aria-labelledby='publish-title' onKeyDown={closeOnEscape}>",
          `    <h2 id='publish-title'>${title}</h2>`,
          '    <button ref={cancelRef} onClick={() => setOpen(false)}>Cancel</button>',
          '    <button onClick={publish}>Publish now</button>',
          '  </div>'
        ].join('\n')
      })
    }
  },
  render: (args) => <PortalExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(behaviour.lockScroll[args.lockScroll])).toBeVisible();
    await expect(canvas.getByText(behaviour.restoreFocus[args.restoreFocus])).toBeVisible();

    const trigger = canvas.getByRole('button', { name: triggerLabel });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: title });
    const scope = within(dialog);
    const cancel = scope.getByRole('button', { name: 'Cancel' });

    await waitFor(() => expect(cancel).toHaveFocus());
    await expect(canvasElement.closest('body > *')).toHaveAttribute('inert');
    await expect(document.body.style.overflow === 'hidden').toBe(args.lockScroll);
    await userEvent.tab();
    await expect(scope.getByRole('button', { name: 'Publish now' })).toHaveFocus();
    await userEvent.tab();
    await expect(cancel).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: title })).not.toBeInTheDocument());
    await expect(await canvas.findByText(closedStatus(args.restoreFocus))).toBeVisible();
    if (args.restoreFocus) await expect(trigger).toHaveFocus();
  }
};
