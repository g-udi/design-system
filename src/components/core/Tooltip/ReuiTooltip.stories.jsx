// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/tooltip/c-tooltip-16.jsx?raw';

export default {
  title: 'Core/Tooltip',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='tooltip'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tooltip compositions owned by Gaudi Tooltip. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTooltip1 = {
  name: 'Basic tooltip.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic tooltip.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTooltip2 = {
  name: 'Tooltips opening from different sides.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Tooltips opening from different sides.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTooltip3 = {
  name: 'Tooltip with icon trigger.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with icon trigger.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTooltip4 = {
  name: 'Tooltip with keyboard shortcut.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with keyboard shortcut.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTooltip5 = {
  name: 'Tooltip on notification bell with badge count',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip on notification bell with badge count' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTooltip6 = {
  name: 'Tooltip with status badge',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with status badge' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiTooltip7 = {
  name: 'Tooltip with icon and description',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with icon and description' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiTooltip8 = {
  name: 'Toolbar with tooltip actions',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Toolbar with tooltip actions' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiTooltip9 = {
  name: 'Tooltip with warning badge',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with warning badge' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiTooltip10 = {
  name: 'Tooltip with feature badge and upgrade link',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with feature badge and upgrade link' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiTooltip11 = {
  name: 'Tooltip with avatar and role badge',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with avatar and role badge' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiTooltip12 = {
  name: 'Tooltip on disabled button with wrapper',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip on disabled button with wrapper' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiTooltip13 = {
  name: 'Tooltip with online status indicator',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with online status indicator' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiTooltip14 = {
  name: 'Tooltip with file info and badges',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with file info and badges' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiTooltip15 = {
  name: 'Tooltip with label badges',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with label badges' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiTooltip16 = {
  name: 'Tooltip with action button inside',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Tooltip with action button inside' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
