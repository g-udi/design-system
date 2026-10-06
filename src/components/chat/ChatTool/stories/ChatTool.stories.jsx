import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button/index.js';
import { chatMeta } from '../../stories/story-helpers.jsx';
import { ChatMessageData, ChatMessageTool, ChatMessageToolApproval } from '../index.js';

const output = { scheduled: '2026-10-06T09:00:00Z', audience: 4180, segment: 'Weekly digest' };

export default {
  title: 'Chat/ChatTool',
  id: 'chat-chattool',
  tags: ['autodocs'],
  ...chatMeta('ChatTool', { component: ChatMessageTool, controls: { name: 'text', status: ['pending', 'running', 'done', 'failed', 'cancelled'], defaultOpen: 'boolean' }, primary: () => Playground })
};

function ToolExample({ name, status: initialStatus, defaultOpen }) {
  const [status, setStatus] = useState(initialStatus);
  return (
    <div className='w-full max-w-xl'>
      <ChatMessageTool
        name={name}
        status={status}
        defaultOpen={defaultOpen}
        duration={status === 'done' ? 1.4 : undefined}
        input={{ post: 'local-first-drafts', send: 'Monday 09:00' }}
        output={status === 'done' ? output : undefined}
        error={status === 'failed' ? 'The mailing service timed out after 30 seconds.' : undefined}
        onRetry={status === 'failed' ? () => setStatus('done') : undefined}
      />
    </div>
  );
}

export const Playground = {
  args: { name: 'schedule_newsletter', status: 'done', defaultOpen: true },
  parameters: {
    docs: {
      description: { story: 'One tool call. The header names the tool and its `status`; it opens to the input and output, shown with ChatMessageData as a readable list with a JSON view. A failed call opens on its own with the error and a retry.' },
      source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatMessageTool } from '@gaudi/design-system/chat/ChatTool';\nexport function ToolExample() {\n  const [status, setStatus] = useState('failed');\n  const result = { scheduled: '2026-10-06T09:00:00Z', audience: 4180 };\n  return <ChatMessageTool name='schedule_newsletter' status={status} input={{ post: 'local-first-drafts', send: 'Monday 09:00' }} output={status === 'done' ? result : undefined} error={status === 'failed' ? 'The mailing service timed out.' : undefined} onRetry={() => setStatus('done')} />;\n}\n// Retry resolves the local mock. The host supplies the real service request." }
    }
  },
  render: (args) => <ToolExample key={`${args.status}-${args.defaultOpen}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const tool = canvasElement.querySelector('[data-slot="message-tool"]');
    await expect(tool).toHaveAttribute('data-status', args.status);
    await expect(within(canvasElement).getByText(args.name)).toBeVisible();
    if (args.status === 'failed') {
      await userEvent.click(within(canvasElement).getByRole('button', { name: 'Retry', exact: true }));
      await expect(tool).toHaveAttribute('data-status', 'done');
    }
  }
};

export const StructuredData = {
  name: 'Structured data with a JSON view',
  parameters: { docs: { description: { story: 'ChatMessageData on its own: values a tool returned, read as a list or table, with a JSON view for people who want the raw shape.' } } },
  render: () => (
    <div className='w-full max-w-xl'>
      <ChatMessageData label='Newsletter performance' value={{ sent: 4180, opened: 2716, clicked: 612, unsubscribed: 9, topLink: '/posts/local-first-drafts', deployment_region_environment_identifier: 'europe-west-production' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Newsletter performance')).toBeVisible();
    const record = canvasElement.querySelector('dl');
    await expect(record.scrollWidth).toBeLessThanOrEqual(record.clientWidth + 1);
    await userEvent.click(canvas.getByRole('button', { name: 'JSON', exact: true }));
    await expect(canvas.getByRole('button', { name: 'JSON', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Data', exact: true }));
  }
};

export const FailureRecovery = {
  name: 'A running call fails',
  render: function FailureRecoveryExample() {
    const [status, setStatus] = useState('running');
    return <div className='grid w-full max-w-xl gap-3'>
      <ChatMessageTool name='Load draft' status={status} input={{ draft: 'Newsletter' }} error={status === 'failed' ? 'The draft could not be loaded.' : undefined} onRetry={() => setStatus('running')} />
      <Button onClick={() => setStatus('failed')}>Fail tool call</Button>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Load draft/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Fail tool call' }));
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('The draft could not be loaded.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry', exact: true }));
    await expect(canvasElement.querySelector('[data-slot="message-tool"]')).toHaveAttribute('data-status', 'running');
    await userEvent.click(canvas.getByRole('button', { name: 'Fail tool call' }));
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};

export const ControlledApproval = {
  name: 'A delayed approval keeps reader focus',
  parameters: { docs: { description: { story: 'The host accepts the approval after a separate confirmation. When the reader has moved to another control, the result is announced without moving their focus back into the card.' } } },
  render: function ControlledApprovalExample() {
    const [state, setState] = useState('requested');
    const [pending, setPending] = useState(false);
    return <div className='grid w-full max-w-xl gap-3'>
      <ChatMessageToolApproval name='Read project files' state={state} onApprove={() => setPending(true)} onDeny={() => setState('denied')} />
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' aria-disabled={!pending} onClick={() => { if (!pending) return; setState('approved'); setPending(false); }}>Confirm approval</Button>
        <Button variant='ghost' onClick={() => { setState('requested'); setPending(false); }}>Reset approval</Button>
      </div>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Approve', exact: true }));
    const confirm = canvas.getByRole('button', { name: 'Confirm approval' });
    await userEvent.click(confirm);
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="message-tool-approval"]')).toHaveAttribute('data-state', 'approved'));
    await expect(confirm).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset approval' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Deny', exact: true }));
    await waitFor(() => expect(canvas.getByText('Denied. Nothing was run.').parentElement).toHaveFocus());
  }
};
