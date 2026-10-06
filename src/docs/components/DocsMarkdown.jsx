import { AnchorMdx, CodeOrSourceMdx, HeadersMdx, Markdown } from '@storybook/addon-docs/blocks';

import { InlineText } from './StoryDocs';

const Paragraph = ({ children, ...props }) => <p {...props}><InlineText>{children}</InlineText></p>;
const ListItem = ({ children, ...props }) => <li {...props}><InlineText>{children}</InlineText></li>;

// Storybook's Markdown override preserves links, headings, and fenced code while
// routing story descriptions through the same inline formatter as our guides.
export const DocsMarkdown = ({ options, ...props }) => (
  <Markdown
    {...props}
    options={{
      ...options,
      overrides: {
        a: AnchorMdx,
        code: CodeOrSourceMdx,
        ...HeadersMdx,
        p: Paragraph,
        li: ListItem,
        ...options?.overrides
      }
    }}
  />
);
