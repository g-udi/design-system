// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/toggle-group/c-toggle-group-16.jsx?raw';

export default {
  title: 'Core/ToggleGroup',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='toggle-group'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toggle Group compositions owned by Gaudi ToggleGroup. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiToggleGroup1 = {
  name: 'Basic toggle group.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic toggle group.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup2 = {
  name: 'Toggle group with outline variant.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group with outline variant.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup3 = {
  name: 'Toggle groups in different sizes.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Toggle groups in different sizes.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup4 = {
  name: 'Toggle group with custom spacing.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group with custom spacing.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup5 = {
  name: 'Toggle group with filter control.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group with filter control.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup6 = {
  name: 'Toggle group with vertical orientation.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group with vertical orientation.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup7 = {
  name: 'Toggle group for text alignment',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for text alignment' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup8 = {
  name: 'Toggle group for view mode switching',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for view mode switching' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup9 = {
  name: 'Vertical toggle group for settings',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Vertical toggle group for settings' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup10 = {
  name: 'Toggle group for color theme',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for color theme' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup11 = {
  name: 'Toggle group for font size',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for font size' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup12 = {
  name: 'Toggle group for time range filter',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for time range filter' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup13 = {
  name: 'Toggle group for notification channels',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for notification channels' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup14 = {
  name: 'Toggle group for layout columns',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for layout columns' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup15 = {
  name: 'Toggle group for sort direction',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for sort direction' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiToggleGroup16 = {
  name: 'Toggle group for pricing tier',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Toggle group for pricing tier' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
