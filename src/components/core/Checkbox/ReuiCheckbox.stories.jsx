// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/checkbox/c-checkbox-22.jsx?raw';

export default {
  title: 'Core/Checkbox',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='checkbox'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Checkbox compositions owned by Gaudi Checkbox. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCheckbox1 = {
  name: 'Basic checkbox with label',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic checkbox with label' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox2 = {
  name: 'Disabled checkbox',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Disabled checkbox' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox3 = {
  name: 'Invalid checkbox',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Invalid checkbox' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox4 = {
  name: 'Indeterminate checkbox',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Indeterminate checkbox' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox5 = {
  name: 'Checkbox with label and description',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox with label and description' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox6 = {
  name: 'Colored checkbox',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Colored checkbox' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox7 = {
  name: 'Circle checkbox',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Circle checkbox' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox8 = {
  name: 'Checkbox group',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox group' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox9 = {
  name: 'Card checkbox with group',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Card checkbox with group' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox10 = {
  name: 'Checkbox group in a frame',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox group in a frame' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox11 = {
  name: 'Card checkbox group with icons',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Card checkbox group with icons' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox12 = {
  name: 'Card checkbox group with icons',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Card checkbox group with icons' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox13 = {
  name: 'Custom positioned checkbox',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Custom positioned checkbox' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox14 = {
  name: 'Custom positioned checkbox',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Custom positioned checkbox' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox15 = {
  name: 'Avatar based card checkbox',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Avatar based card checkbox' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox16 = {
  name: 'Nested checkbox group',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Nested checkbox group' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox17 = {
  name: 'Payment method card checkbox',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Payment method card checkbox' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox18 = {
  name: 'Checkbox with label and tooltip info',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox with label and tooltip info' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox19 = {
  name: 'Checkbox group with badge',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox group with badge' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox20 = {
  name: 'Checkbox with label and tooltip info',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox with label and tooltip info' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox21 = {
  name: 'Inline horizontal checkbox group',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Inline horizontal checkbox group' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiCheckbox22 = {
  name: 'Checkbox with feature badge',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: { story: 'Checkbox with feature badge' },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
