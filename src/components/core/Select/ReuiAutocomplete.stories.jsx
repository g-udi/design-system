// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/autocomplete/c-autocomplete-12.jsx?raw';

export default {
  title: 'Core/Select',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='autocomplete'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Autocomplete compositions owned by Gaudi Select. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiAutocomplete1 = {
  name: 'Autocomplete: Basic autocomplete control',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic autocomplete control' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete2 = {
  name: 'Autocomplete: Disabled state',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Disabled state' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete3 = {
  name: 'Autocomplete: Auto highlight option as you type',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Auto highlight option as you type' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete4 = {
  name: 'Autocomplete: Control with label',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Control with label' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete5 = {
  name: 'Autocomplete: With clear button',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'With clear button' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete6 = {
  name: 'Autocomplete: With trigger button',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'With trigger button' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete7 = {
  name: 'Autocomplete: With clear and trigger buttons',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'With clear and trigger buttons' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete8 = {
  name: 'Autocomplete: With groups and labels',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'With groups and labels' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete9 = {
  name: 'Autocomplete: With search results',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'With search results' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete10 = {
  name: 'Autocomplete: Small autocomplete',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Small autocomplete' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete11 = {
  name: 'Autocomplete: Large autocomplete',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Large autocomplete' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiAutocomplete12 = {
  name: 'Autocomplete: Form integration',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Form integration' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
