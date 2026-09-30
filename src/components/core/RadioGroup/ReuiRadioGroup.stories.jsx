// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/radio-group/c-radio-group-17.jsx?raw';

export default {
  title: 'Core/RadioGroup',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='radio-group'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Radio Group compositions owned by Gaudi RadioGroup. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiRadioGroup1 = {
  name: 'Basic radio group',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic radio group' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup2 = {
  name: 'Disabled radio group',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Disabled radio group' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup3 = {
  name: 'Radio with description',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Radio with description' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup4 = {
  name: 'Invalid radio group',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Invalid radio group' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup5 = {
  name: 'Colored radio group',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Colored radio group' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup6 = {
  name: 'Radio group with legend and description',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Radio group with legend and description' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup7 = {
  name: 'Card radio group with descriptions',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Card radio group with descriptions' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup8 = {
  name: 'Radio group in card with separators',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Radio group in card with separators' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup9 = {
  name: 'Radio group in card with icons',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Radio group in card with icons' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup10 = {
  name: 'Radio group in frame',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Radio group in frame' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup11 = {
  name: 'Radio group with grid layout',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Radio group with grid layout' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup12 = {
  name: 'Avatar based card radio group',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Avatar based card radio group' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup13 = {
  name: 'Payment method radio cards',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Payment method radio cards' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup14 = {
  name: 'Radio group with tooltip info',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Radio group with tooltip info' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup15 = {
  name: 'Radio group with badges',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Radio group with badges' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup16 = {
  name: 'Inline horizontal radio group',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Inline horizontal radio group' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiRadioGroup17 = {
  name: 'Pricing plan radio cards',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Pricing plan radio cards' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
