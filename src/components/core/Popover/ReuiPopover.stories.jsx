// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/popover/c-popover-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/popover/c-popover-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/popover/c-popover-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/popover/c-popover-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/popover/c-popover-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/popover/c-popover-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/popover/c-popover-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/popover/c-popover-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/popover/c-popover-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/popover/c-popover-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/popover/c-popover-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/popover/c-popover-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/popover/c-popover-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/popover/c-popover-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/popover/c-popover-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/popover/c-popover-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/popover/c-popover-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/popover/c-popover-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/popover/c-popover-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/popover/c-popover-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/popover/c-popover-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/popover/c-popover-11.jsx?raw';

export default {
  title: 'Core/Popover',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='popover'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Popover compositions owned by Gaudi Popover. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiPopover1 = {
  name: 'Basic popover.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic popover.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiPopover2 = {
  name: 'Popovers opening from different sides.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Popovers opening from different sides.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiPopover3 = {
  name: 'Popover with form.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Popover with form.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiPopover4 = {
  name: 'Popover alignment positions.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Popover alignment positions.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiPopover5 = {
  name: 'Popover within a dialog.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Popover within a dialog.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiPopover6 = {
  name: 'Popover with user profile details.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Popover with user profile details.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiPopover7 = {
  name: 'Popover with custom content',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Popover with custom content' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiPopover8 = {
  name: 'Popover with media preview.',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Popover with media preview.' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiPopover9 = {
  name: 'Relative time popover with timezone details',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Relative time popover with timezone details' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiPopover10 = {
  name: 'Popover with controls',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Popover with controls' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiPopover11 = {
  name: 'Popover with navigation',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Popover with navigation' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
