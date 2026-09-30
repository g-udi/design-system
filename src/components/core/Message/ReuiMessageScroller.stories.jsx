import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/message-scroller/c-message-scroller-6.jsx?raw';

export default {
  title: 'Core/Message',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='message-scroller'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Message Scroller compositions owned by Gaudi Message. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiMessageScroller1 = {
  name: 'Message Scroller: Chat transcript with jump to latest',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story:
          'A scroll region that opens at the live edge with a jump to latest control.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiMessageScroller2 = {
  name: 'Message Scroller: Streaming reply that follows the edge',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'autoScroll pins the viewport while tokens arrive, and releases the moment the reader scrolls up.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiMessageScroller3 = {
  play: catalogueInteractions['message-scroller-3'],
  name: 'Message Scroller: Anchored turn with a previous peek',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'scrollAnchor lifts a sent message near the top while a slice of the previous turn stays visible.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiMessageScroller4 = {
  name: 'Message Scroller: Opening position for a saved thread',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story:
          'Compare start, end and last-anchor as the place a reopened thread opens at.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiMessageScroller5 = {
  name: 'Message Scroller: Load earlier without losing your place',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'Older turns prepend above the reader while the row they were reading stays put.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiMessageScroller6 = {
  name: 'Message Scroller: Thread navigator for stepping turns',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story:
          'A footer navigator that reports the turn you are reading and jumps between turns.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
