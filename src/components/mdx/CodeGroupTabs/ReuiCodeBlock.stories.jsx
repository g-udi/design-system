// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'code-block',
  import.meta.glob('../../../../.storybook/fixtures/reui/code-block/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/code-block/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/CodeGroupTabs', tags: ['autodocs'], ...catalogueMeta('code-block') };

export const ReuiCodeBlock1 = { name: 'Basic code block', ...pattern(1, 'Code block with header, filename, language and copy button.') };
export const ReuiCodeBlock2 = { name: 'Pinned copy button', ...pattern(2, 'Headerless block with a pinned copy button and dual-axis scrolling.') };
export const ReuiCodeBlock3 = { name: 'Streaming agent response', ...pattern(3, 'Agent writing code in real time with a caret and stick-to-bottom.') };
export const ReuiCodeBlock4 = { name: 'AI chat with code fences', ...pattern(4, 'Streaming assistant message rendering markdown code fences.') };
export const ReuiCodeBlock5 = { name: 'Diff with change summary', ...pattern(5, 'A props-driven diff with added and removed lines and a change summary.') };
export const ReuiCodeBlock6 = { name: 'Diff via shiki transformers', ...pattern(6, 'A diff expressed through a shiki transformer instead of props.') };
export const ReuiCodeBlock7 = { name: 'Highlighted lines and words', ...pattern(7, 'Line ranges and word matches highlighted together.') };
export const ReuiCodeBlock8 = { name: 'Focus walkthrough', ...pattern(8, 'Stepping through regions of a file with the rest dimmed.') };
export const ReuiCodeBlock9 = { name: 'Terminal output', ...pattern(9, 'Unhighlighted command output with a wrap toggle.') };
export const ReuiCodeBlock10 = { name: 'Long file with expand', ...pattern(10, 'Collapsed at a line budget with an expand control and a line offset.') };
export const ReuiCodeBlock11 = { name: 'Line actions and diagnostics', ...pattern(11, 'Error and warning lines with an action button on the active line.') };
export const ReuiCodeBlock12 = { name: 'Line selection', ...pattern(12, 'Selecting lines to ask an assistant about them.') };
export const ReuiCodeBlock13 = { name: 'Search in file', ...pattern(13, 'Live search marking every match, with a counter that reads the block through useCodeBlockConfig.') };
export const ReuiCodeBlock14 = { name: 'File tabs in a dense frame', ...pattern(14, 'A framed file switcher loading one grammar chunk per selected language.') };
export const ReuiCodeBlock15 = { name: 'Pre-highlighted lines', ...pattern(15, 'Lines built without shiki, the shape a server component passes down.') };
export const ReuiCodeBlock16 = { name: 'Before and after', ...pattern(16, 'Two blocks stacked in a frame for a refactor review.') };
export const ReuiCodeBlock17 = { name: 'Soft wrap', ...pattern(17, 'Long single-line content with a wrap toggle.') };
export const ReuiCodeBlock18 = { name: 'Unified patch review', ...pattern(18, 'A git patch parsed into files with dual old/new gutters, counters and a download.') };
export const ReuiCodeBlock19 = { name: 'Design-token theme', ...pattern(19, 'Syntax colors driven by CSS variables mapped to design tokens.') };
export const ReuiCodeBlock20 = { name: 'Always-dark block', ...pattern(20, 'A block that stays dark in both site themes, with window chrome and every line state.') };
export const ReuiCodeBlock21 = { name: 'Dark terminal', ...pattern(21, 'ANSI-style colored terminal output built from plain lines.') };
export const ReuiCodeBlock22 = { name: 'Patch review actions', ...pattern(22, 'Agent-proposed diff with accept and reject actions.') };
export const ReuiCodeBlock23 = { name: 'Nested code folding', ...pattern(23, 'Fold regions detected from indentation, with nesting and fold-all controls.') };
export const ReuiCodeBlock24 = { name: 'Fix with AI on the failing line', ...pattern(24, 'A line action scoped to the diagnostic line that applies the patch.') };
export const ReuiCodeBlock25 = { name: 'Reference lines in chat', ...pattern(25, 'A gutter button that turns lines or a selection into file:line reference badges in a chat composer.') };
export const ReuiCodeBlock26 = { name: 'Framed by an external ScrollArea', ...pattern(26, 'A changed-file list where one shadcn ScrollArea scrolls every block at once.') };
export const ReuiCodeBlock27 = { name: 'ANSI terminal output', ...pattern(27, 'Agent stdout with SGR colour codes parsed by ansiToLines, retintable via --code-ansi-* variables.') };
