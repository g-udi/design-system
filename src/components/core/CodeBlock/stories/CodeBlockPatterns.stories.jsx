import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'code-block', import.meta.url,
  import.meta.glob('./fixtures/code-block/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/code-block/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/CodeBlock', id: 'core-codeblock', tags: ['autodocs'], ...catalogueMeta('code-block') };

export const Options = {
  name: 'Code block options',
  ...pattern('options', 'Header with filename, language and copy, or a pinned copy button without it; line numbers, soft wrap, dual-axis scrolling, and design-token or always-dark syntax themes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('use-totals.ts')).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Header' }));
    await expect(canvas.queryByText('use-totals.ts')).toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: 'Always dark' }));
    await expect(canvasElement.querySelector('[data-slot="code-block"]').closest('.dark')).not.toBeNull();
  }
};
export const LineStates = {
  name: 'Line states',
  ...pattern('line-states', 'Highlighted lines and words, diff rows, diagnostic levels, and focus steps that dim the rest of the file, each switchable on one block.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('1 warning')).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Diagnostics' }));
    await expect(canvas.queryByText('1 warning')).toBeNull();
    const session = canvas.getByRole('radio', { name: 'Session' });
    await userEvent.click(session);
    await expect(session).toHaveAttribute('aria-checked', 'true');
  }
};
export const Tabbed = {
  name: 'Tabbed code',
  ...pattern('tabbed', 'The code group from articles, built from Tabs and CodeBlock: mono tabs on the dark code chrome, one copyable block per tab, for package-manager commands and the same snippet in several languages.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const install = canvas.getByRole('tablist', { name: 'Install' });
    // Highlighting splits code into token spans, so assert on the selected panel's text.
    const panelOf = async (name) => {
      await userEvent.click(canvas.getByRole('tab', { name }));
      return canvas.getByRole('tabpanel', { name });
    };
    await waitFor(async () => expect(await panelOf('bun')).toHaveTextContent('bun add @gaudi/design-system'));
    await waitFor(async () => expect(await panelOf('greeting.py')).toHaveTextContent('def greeting(name: str)'));
    await expect(install).toBeVisible();
  }
};
export const TerminalOutput = {
  name: 'Shell session with output',
  ...pattern('terminal-output', 'An always-dark terminal fed by ANSI stdout, pre-coloured token lines, or plain unhighlighted text, with a wrap toggle.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByText('AssertionError: expected 402 to be 204', { exact: false });
    const continuation = canvas.getByText('Refund response did not match', { exact: false });
    await expect(getComputedStyle(continuation).color).toBe(getComputedStyle(first).color);
    await userEvent.click(canvas.getByRole('radio', { name: 'Plain' }));
    await expect(canvas.getByText('turbo build')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'ANSI' }));
  }
};
export const Folding = {
  name: 'Long file with folding',
  ...pattern('folding', 'Collapsed at a line budget with an expand control and a line offset, plus nested fold regions and fold-all controls.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const line = (number) => canvasElement.querySelector(`[data-code-line="${number}"]`);
    await userEvent.click(canvas.getByRole('button', { name: 'Fold all' }));
    await expect(line(41)).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Unfold 18 hidden lines' }));
    // Displayed line numbers are offset; fold state remains relative to the snippet.
    await expect(line(41)).toBeInTheDocument();
    await expect(line(44)).toBeNull();
    await userEvent.click(within(line(43)).getByRole('button', { name: /^Unfold \d+ hidden lines$/ }));
    await expect(line(44)).toBeInTheDocument();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--nested-unfolded` });
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Unfold all' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Show more' }));
    await userEvent.hover(canvasElement.querySelector('[data-slot="scroll-area"]'));
    await waitFor(() => {
      const thumb = canvasElement.querySelector('[data-orientation="horizontal"] [data-slot="scroll-area-thumb"]');
      expect(thumb).not.toBeNull();
      const rect = thumb.getBoundingClientRect();
      expect(canvasElement.ownerDocument.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)).toBe(thumb);
      const button = canvas.getByRole('button', { name: 'Show less' }).getBoundingClientRect();
      expect(button.bottom).toBeLessThanOrEqual(thumb.parentElement.getBoundingClientRect().top);
      expect(line(59).getBoundingClientRect().bottom).toBeLessThanOrEqual(button.top);
    });
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--expanded` });
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Show less' }));
  }
};
export const FileSearch = { name: 'Find within a long file', ...pattern('file-search', 'Live search marking every match, with a counter that reads the block through useCodeBlockConfig.') };
export const PatchReview = {
  name: 'Patch review',
  ...pattern('patch-review', 'A proposed git patch parsed into files with dual gutters, counters and downloads, a before-and-after view, one scroll area for every file, and accept or reject actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    const anchorClick = HTMLAnchorElement.prototype.click;
    let payload;
    try {
      URL.createObjectURL = (blob) => { payload = blob; return 'blob:demo-patch'; };
      URL.revokeObjectURL = () => {};
      HTMLAnchorElement.prototype.click = () => {};
      await userEvent.click(canvas.getAllByRole('button', { name: 'Download code' })[0]);
      const patch = await payload.text();
      await expect(patch).toContain('diff --git a/lib/seats.ts b/lib/seats.ts');
      await expect(patch).toContain('-  const used = members.length');
      await expect(patch).toContain('+  const used = members.filter');
      await expect(patch).not.toContain('diff --git a/app/api');
    } finally {
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
      HTMLAnchorElement.prototype.click = anchorClick;
    }
    await userEvent.click(canvas.getByRole('radio', { name: 'Before and after' }));
    await expect(canvas.getAllByText('Before')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Accept' }));
    await expect(canvas.getByText('Change accepted in this demo')).toBeVisible();
  }
};
export const StreamingReply = { name: 'Streaming assistant reply', ...pattern('streaming-reply', 'A chat reply streamed through markdownFences, with a caret, stick-to-bottom scrolling and a status badge on the open fence.') };
export const Diagnostics = { name: 'Diagnostics with fixes', ...pattern('diagnostics', 'Error and warning lines, each with a fix action on its own row that applies the patch.') };
export const ChatReferences = {
  name: 'Quoted lines in a chat answer',
  ...pattern('chat-references', 'Select lines, then a gutter button turns them into file:line reference badges in a chat composer.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'typescript code' });
    grid.focus();
    await userEvent.keyboard('{Home} ');
    const first = canvas.getByRole('row', { name: /^Line 1:/ });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(grid).toHaveAttribute('aria-activedescendant', first.id);
    const reference = canvas.getByRole('button', { name: 'Reference line 1 in the chat' });
    reference.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Highlight line 1 in the code' })).toBeVisible();
    await expect(first).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Ask AI' }));
    await expect(canvas.getByRole('status', { name: 'Prepared question' })).toHaveTextContent('Prepared a question about use-mobile.ts, lines 1, in this demo.');
    // Leave a row action visible so accessibility checks cover the mixed content.
    grid.focus();
    await userEvent.keyboard('{Home}');
  }
};
