// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/toggle/c-toggle-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/toggle/c-toggle-14.jsx?raw';

export default {
  title: 'Core/ToggleGroup',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='toggle'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toggle compositions owned by Gaudi ToggleGroup. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiToggle1 = {
  name: 'Toggle: Basic toggle.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic toggle.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiToggle2 = {
  name: 'Toggle: Toggle buttons with outline variant.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Toggle buttons with outline variant.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiToggle3 = {
  name: 'Toggle: Toggle buttons in different sizes.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Toggle buttons in different sizes.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiToggle4 = {
  name: 'Toggle: Toggle with button and icon.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with button and icon.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiToggle5 = {
  name: 'Toggle: Disabled toggle.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Disabled toggle.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiToggle6 = {
  name: 'Toggle: Toggle with icon.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with icon.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiToggle7 = {
  name: 'Toggle: Toggle with notification count badge',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with notification count badge' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiToggle8 = {
  name: 'Toggle: Toggle size variants showcase',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Toggle size variants showcase' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiToggle9 = {
  name: 'Toggle: Toggle with icon swap on press',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with icon swap on press' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiToggle10 = {
  name: 'Toggle: Toggle with text label that changes',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with text label that changes' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiToggle11 = {
  name: 'Toggle: Social media reaction toggles',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Social media reaction toggles' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiToggle12 = {
  name: 'Toggle: Toggle with tooltip',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Toggle with tooltip' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiToggle13 = {
  name: 'Toggle: Disabled toggle states',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Disabled toggle states' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiToggle14 = {
  name: 'Toggle: Toggle as mute/unmute button',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Toggle as mute/unmute button' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
