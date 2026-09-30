// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/switch/c-switch-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/switch/c-switch-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/switch/c-switch-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/switch/c-switch-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/switch/c-switch-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/switch/c-switch-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/switch/c-switch-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/switch/c-switch-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/switch/c-switch-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/switch/c-switch-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/switch/c-switch-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/switch/c-switch-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/switch/c-switch-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/switch/c-switch-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/switch/c-switch-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/switch/c-switch-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/switch/c-switch-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/switch/c-switch-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/switch/c-switch-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/switch/c-switch-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/switch/c-switch-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/switch/c-switch-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/switch/c-switch-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/switch/c-switch-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/switch/c-switch-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/switch/c-switch-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/switch/c-switch-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/switch/c-switch-14.jsx?raw';

export default {
  title: 'Core/Switch',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='switch'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Switch compositions owned by Gaudi Switch. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSwitch1 = {
  name: 'Basic switch.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic switch.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSwitch2 = {
  name: 'Switch with description.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Switch with description.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSwitch3 = {
  name: 'Disabled switch.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Disabled switch.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSwitch4 = {
  name: 'Switch in different sizes.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Switch in different sizes.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSwitch5 = {
  name: 'Switch group',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Switch group' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSwitch6 = {
  name: 'Switch list in card with separators',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Switch list in card with separators' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSwitch7 = {
  name: 'Switch list in card with icons',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Switch list in card with icons' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSwitch8 = {
  name: 'Switch in frame',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Switch in frame' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiSwitch9 = {
  name: 'Switch with tooltip info',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Switch with tooltip info' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiSwitch10 = {
  name: 'Switch with badges',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Switch with badges' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiSwitch11 = {
  name: 'Colored switches',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Colored switches' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiSwitch12 = {
  name: 'Destructive switch with confirmation text',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Destructive switch with confirmation text' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiSwitch13 = {
  name: 'Compact settings table with switches',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Compact settings table with switches' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiSwitch14 = {
  name: 'Switch with descriptions in card grid',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Switch with descriptions in card grid' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
