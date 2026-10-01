import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'code-block',
  import.meta.glob('../../../../.storybook/fixtures/patterns/code-block/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/code-block/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/CodeBlock', id: 'core-codeblock', tags: ['autodocs'], ...catalogueMeta('code-block') };

export const CodeBlockPattern1 = {
  name: 'Code block options',
  ...pattern(1, 'Header with filename, language and copy, or a pinned copy button without it; line numbers, soft wrap, dual-axis scrolling, and design-token or always-dark syntax themes.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('use-totals.ts')).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Header' }));
    await expect(canvas.queryByText('use-totals.ts')).toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: 'Always dark' }));
    await expect(canvasElement.querySelector('[data-slot="code-block"]').closest('.dark')).not.toBeNull();
  }
};
export const CodeBlockPattern7 = {
  name: 'Line states',
  ...pattern(7, 'Highlighted lines and words, diff rows, diagnostic levels, and focus steps that dim the rest of the file, each switchable on one block.'),
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
export const CodeBlockPattern14 = {
  name: 'Tabbed code',
  ...pattern(14, 'The code group from articles, built from Tabs and CodeBlock: mono tabs on the dark code chrome, one copyable block per tab, for package-manager commands and the same snippet in several languages.'),
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
export const CodeBlockPattern9 = {
  name: 'Terminal output',
  ...pattern(9, 'An always-dark terminal fed by ANSI stdout, pre-coloured token lines, or plain unhighlighted text, with a wrap toggle.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Plain' }));
    await expect(canvas.getByText('turbo build')).toBeVisible();
  }
};
export const CodeBlockPattern23 = { name: 'Long file with folding', ...pattern(23, 'Collapsed at a line budget with an expand control and a line offset, plus nested fold regions and fold-all controls.') };
export const CodeBlockPattern13 = { name: 'Search in file', ...pattern(13, 'Live search marking every match, with a counter that reads the block through useCodeBlockConfig.') };
export const CodeBlockPattern18 = {
  name: 'Patch review',
  ...pattern(18, 'A proposed git patch parsed into files with dual gutters, counters and downloads, a before-and-after view, one scroll area for every file, and accept or reject actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Before and after' }));
    await expect(canvas.getAllByText('Before')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Accept' }));
    await expect(canvas.getByText('Change applied to the branch')).toBeVisible();
  }
};
export const CodeBlockPattern4 = { name: 'Streaming assistant reply', ...pattern(4, 'A chat reply streamed through markdownFences, with a caret, stick-to-bottom scrolling and a status badge on the open fence.') };
export const CodeBlockPattern24 = { name: 'Diagnostics with fixes', ...pattern(24, 'Error and warning lines, each with a fix action on its own row that applies the patch.') };
export const CodeBlockPattern25 = { name: 'Reference lines in chat', ...pattern(25, 'Select lines, then a gutter button turns them into file:line reference badges in a chat composer.') };
