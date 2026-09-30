// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/breadcrumb/c-breadcrumb-15.jsx?raw';

export default {
  title: 'Blocks/Navigation/Breadcrumb',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='breadcrumb'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Breadcrumb compositions owned by Gaudi Breadcrumb. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiBreadcrumb1 = {
  name: 'Basic breadcrumb',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic breadcrumb' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb2 = {
  name: 'Breadcrumb with dropdown menu',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with dropdown menu' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb3 = {
  name: 'Breadcrumb with Next.js link',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with Next.js link' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb4 = {
  name: 'Breadcrumb with a custom slash separator',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with a custom slash separator' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb5 = {
  name: 'Breadcrumb with icons for each item',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with icons for each item' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb6 = {
  name: 'Breadcrumb with ellipsis for long paths',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with ellipsis for long paths' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb7 = {
  name: 'Breadcrumb items with avatars',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb items with avatars' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb8 = {
  name: 'Breadcrumb with double chevron separators',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with double chevron separators' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb9 = {
  name: 'Breadcrumb inside card',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb inside card' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb10 = {
  name: 'Pill-style breadcrumb inside frame',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Pill-style breadcrumb inside frame' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb11 = {
  name: 'Breadcrumb items containing badge with count',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb items containing badge with count' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb12 = {
  name: 'Breadcrumb starting with home icon item',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb starting with home icon item' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb13 = {
  name: 'Breadcrumb with a custom separator',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with a custom separator' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb14 = {
  name: 'Button-style breadcrumb',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Button-style breadcrumb' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiBreadcrumb15 = {
  name: 'Breadcrumb with project, user and document info',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Breadcrumb with project, user and document info' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
