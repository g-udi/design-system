// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/skeleton/c-skeleton-10.jsx?raw';

export default {
  title: 'Core/Skeleton',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='skeleton'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton compositions owned by Gaudi Skeleton. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSkeleton1 = {
  name: 'Skeleton loader for avatars and user info.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for avatars and user info.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton2 = {
  name: 'Skeleton loader for a card component.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a card component.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton3 = {
  name: 'Skeleton loader for text and paragraphs.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for text and paragraphs.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton4 = {
  name: 'Skeleton loader for a form.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a form.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton5 = {
  name: 'Skeleton loader for a data table.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a data table.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton6 = {
  name: 'Skeleton loader for a dashboard stats row',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a dashboard stats row' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton7 = {
  name: 'Skeleton loader for a list with actions',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a list with actions' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton8 = {
  name: 'Skeleton loader for a card grid',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a card grid' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton9 = {
  name: 'Skeleton loader for a full profile page',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for a full profile page' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiSkeleton10 = {
  name: 'Skeleton loader for chat messages',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Skeleton loader for chat messages' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
