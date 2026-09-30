// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/tabs/c-tabs-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/tabs/c-tabs-9.jsx?raw';

export default {
  title: 'Core/Tabs',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='tabs'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabs compositions owned by Gaudi Tabs. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTabs1 = {
  name: 'Basic tabs.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic tabs.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTabs2 = {
  name: 'Tabs with line variant.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with line variant.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTabs3 = {
  name: 'Tabs with vertical orientation.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with vertical orientation.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTabs4 = {
  name: 'Tabs with vertical orientation and line variant.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Tabs with vertical orientation and line variant.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTabs5 = {
  name: 'Tabs with icons.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with icons.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTabs6 = {
  name: 'Tabs with icons',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with icons' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiTabs7 = {
  name: 'Tabs with badge counts',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with badge counts' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiTabs8 = {
  name: 'Tabs with icons and line variant',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Tabs with icons and line variant' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiTabs9 = {
  name: 'Segmented control tabs',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Segmented control tabs' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
