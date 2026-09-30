// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/bubble/c-bubble-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/bubble/c-bubble-7.jsx?raw';

export default {
  title: 'Core/Message',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='bubble'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bubble compositions owned by Gaudi Message. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiBubble1 = {
  name: 'Bubble: Support thread with sender alignment',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story:
          'A two sided billing thread where align and variant carry the sender.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiBubble2 = {
  name: 'Bubble: Bubble variants in a release thread',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'All seven variants doing the job each one is for, in one deploy thread.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiBubble3 = {
  name: 'Bubble: Grouped consecutive messages',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'Consecutive turns from one sender collapse into a single BubbleGroup.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiBubble4 = {
  name: 'Bubble: Message reactions and a reaction button',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story:
          'A static emoji row, a pressable reaction with a count, and a top anchored row.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiBubble5 = {
  name: 'Bubble: Long reply with show more',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'A long assistant answer folds to its first paragraph behind a Collapsible.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiBubble6 = {
  name: 'Bubble: Quick reply bubbles and an action row',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story:
          'Tinted bubbles that are real buttons and a link, plus an action row after the pick.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiBubble7 = {
  name: 'Bubble: Assistant answer with formatted content',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story:
          'A ghost bubble carrying a heading, a list, emphasis and inline code.'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
