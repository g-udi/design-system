// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-22.jsx?raw';
import { Pattern as Pattern23 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-23.jsx';
import source23 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-23.jsx?raw';
import { Pattern as Pattern24 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-24.jsx';
import source24 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-24.jsx?raw';
import { Pattern as Pattern25 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-25.jsx';
import source25 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-25.jsx?raw';
import { Pattern as Pattern26 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-26.jsx';
import source26 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-26.jsx?raw';
import { Pattern as Pattern27 } from '../../../../.storybook/fixtures/reui/code-block/c-code-block-27.jsx';
import source27 from '../../../../.storybook/fixtures/reui/code-block/c-code-block-27.jsx?raw';

export default {
  title: 'MDX/CodeGroupTabs',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='code-block'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Code Block compositions owned by Gaudi CodeGroupTabs. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCodeBlock1 = {
  name: 'Code Block: Basic code block',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Code block with header, filename, language and copy button.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock2 = {
  name: 'Code Block: Pinned copy button',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'Headerless block with a pinned copy button and dual-axis scrolling.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock3 = {
  name: 'Code Block: Streaming agent response',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'Agent writing code in real time with a caret and stick-to-bottom.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock4 = {
  name: 'Code Block: AI chat with code fences',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Streaming assistant message rendering markdown code fences.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock5 = {
  name: 'Code Block: Diff with change summary',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'A props-driven diff with added and removed lines and a change summary.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock6 = {
  name: 'Code Block: Diff via shiki transformers',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story: 'A diff expressed through a shiki transformer instead of props.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock7 = {
  name: 'Code Block: Highlighted lines and words',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story: 'Line ranges and word matches highlighted together.'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock8 = {
  name: 'Code Block: Focus walkthrough',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: {
        story: 'Stepping through regions of a file with the rest dimmed.'
      },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock9 = {
  name: 'Code Block: Terminal output',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story: 'Unhighlighted command output with a wrap toggle.'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock10 = {
  name: 'Code Block: Long file with expand',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: {
        story:
          'Collapsed at a line budget with an expand control and a line offset.'
      },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock11 = {
  name: 'Code Block: Line actions and diagnostics',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story:
          'Error and warning lines with an action button on the active line.'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock12 = {
  name: 'Code Block: Line selection',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Selecting lines to ask an assistant about them.' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock13 = {
  name: 'Code Block: Search in file',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story:
          'Live search marking every match, with a counter that reads the block through useCodeBlockConfig.'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock14 = {
  name: 'Code Block: File tabs in a dense frame',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: {
        story:
          'A framed file switcher loading one grammar chunk per selected language.'
      },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock15 = {
  name: 'Code Block: Pre-highlighted lines',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: {
        story:
          'Lines built without shiki, the shape a server component passes down.'
      },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock16 = {
  name: 'Code Block: Before and after',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: {
        story: 'Two blocks stacked in a frame for a refactor review.'
      },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock17 = {
  name: 'Code Block: Soft wrap',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Long single-line content with a wrap toggle.' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock18 = {
  name: 'Code Block: Unified patch review',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: {
        story:
          'A git patch parsed into files with dual old/new gutters, counters and a download.'
      },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock19 = {
  name: 'Code Block: Design-token theme',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: {
        story: 'Syntax colors driven by CSS variables mapped to design tokens.'
      },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock20 = {
  name: 'Code Block: Always-dark block',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: {
        story:
          'A block that stays dark in both site themes, with window chrome and every line state.'
      },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock21 = {
  name: 'Code Block: Dark terminal',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: {
        story: 'ANSI-style colored terminal output built from plain lines.'
      },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock22 = {
  name: 'Code Block: Patch review actions',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: {
        story: 'Agent-proposed diff with accept and reject actions.'
      },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock23 = {
  name: 'Code Block: Nested code folding',
  render: () => <Pattern23 />,
  parameters: {
    docs: {
      description: {
        story:
          'Fold regions detected from indentation, with nesting and fold-all controls.'
      },
      source: { code: publicSource(source23), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock24 = {
  name: 'Code Block: Fix with AI on the failing line',
  render: () => <Pattern24 />,
  parameters: {
    docs: {
      description: {
        story:
          'A line action scoped to the diagnostic line that applies the patch.'
      },
      source: { code: publicSource(source24), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock25 = {
  name: 'Code Block: Reference lines in chat',
  render: () => <Pattern25 />,
  parameters: {
    docs: {
      description: {
        story:
          'A gutter button that turns lines or a selection into file:line reference badges in a chat composer.'
      },
      source: { code: publicSource(source25), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock26 = {
  name: 'Code Block: Framed by an external ScrollArea',
  render: () => <Pattern26 />,
  parameters: {
    docs: {
      description: {
        story:
          'A changed-file list where one shadcn ScrollArea scrolls every block at once.'
      },
      source: { code: publicSource(source26), language: 'jsx' }
    }
  }
};
export const ReuiCodeBlock27 = {
  name: 'Code Block: ANSI terminal output',
  render: () => <Pattern27 />,
  parameters: {
    docs: {
      description: {
        story:
          'Agent stdout with SGR colour codes parsed by ansiToLines, retintable via --code-ansi-* variables.'
      },
      source: { code: publicSource(source27), language: 'jsx' }
    }
  }
};
