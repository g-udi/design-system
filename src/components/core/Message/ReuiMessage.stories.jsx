// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/message/c-message-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/message/c-message-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/message/c-message-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/message/c-message-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/message/c-message-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/message/c-message-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/message/c-message-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/message/c-message-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/message/c-message-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/message/c-message-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/message/c-message-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/message/c-message-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/message/c-message-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/message/c-message-7.jsx?raw';

export default {
  title: 'Core/Message',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='message'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Message compositions owned by Gaudi Message. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiMessage1 = {
  name: 'Two-sided conversation',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story:
          'Incoming and outgoing rows separated by nothing but the align prop.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiMessage2 = {
  name: 'Avatars on both sides',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story:
          'Bottom-anchored avatars that flip with the row, plus a presence dot.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiMessage3 = {
  name: 'Sender name and delivery status',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'Header for identity, footer for status, and how each one picks its side.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiMessage4 = {
  name: 'Reply actions in the footer',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story:
          'Copy, regenerate and rating controls under an unframed assistant reply.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiMessage5 = {
  name: 'Files shared in a thread',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story:
          'Image and document attachments stacked with the bubble in one message.'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiMessage6 = {
  name: 'Consecutive messages from one sender',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story:
          'A run of three messages under a single avatar, using MessageGroup.'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiMessage7 = {
  name: 'Streaming reply with a pending state',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story: 'One assistant row moving from thinking, to typing, to settled.'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
