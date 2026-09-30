// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/native-select/c-native-select-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/native-select/c-native-select-6.jsx?raw';

export default {
  title: 'Core/Select',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='native-select'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Native Select compositions owned by Gaudi Select. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiNativeSelect1 = {
  name: 'Native Select: Basic native select.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic native select.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiNativeSelect2 = {
  name: 'Native Select: Native select with options grouped.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Native select with options grouped.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiNativeSelect3 = {
  name: 'Native Select: Small native select.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Small native select.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiNativeSelect4 = {
  name: 'Native Select: Native select embedded within a field.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Native select embedded within a field.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiNativeSelect5 = {
  name: 'Native Select: Disabled native select.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Disabled native select.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiNativeSelect6 = {
  name: 'Native Select: Invalid native select.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Invalid native select.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
