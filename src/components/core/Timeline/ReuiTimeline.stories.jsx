// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/timeline/c-timeline-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/timeline/c-timeline-12.jsx?raw';

export default {
  title: 'Core/Timeline',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='timeline'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Timeline compositions owned by Gaudi Timeline. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTimeline1 = {
  name: 'Basic timeline.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic timeline.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTimeline2 = {
  name: 'Timeline with roadmap.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with roadmap.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTimeline3 = {
  name: 'Timeline with order status.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with order status.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTimeline4 = {
  name: 'Timeline with git activity.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with git activity.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTimeline5 = {
  name: 'Timeline with milestones.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with milestones.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTimeline6 = {
  name: 'Timeline with pipeline steps.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with pipeline steps.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiTimeline7 = {
  name: 'Timeline with roadmap items.',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Timeline with roadmap items.' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiTimeline8 = {
  name: 'Vertical timeline',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Vertical timeline' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiTimeline9 = {
  name: 'Horizontal timeline with leading labels',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Horizontal timeline with leading labels' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiTimeline10 = {
  name: 'Deployment log timeline',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Deployment log timeline' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiTimeline11 = {
  name: 'Activity feed timeline with user avatars',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Activity feed timeline with user avatars' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiTimeline12 = {
  name: 'Compact horizontal milestone timeline',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Compact horizontal milestone timeline' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
