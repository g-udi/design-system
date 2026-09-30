// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/input/c-input-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/input/c-input-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/input/c-input-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/input/c-input-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/input/c-input-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/input/c-input-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/input/c-input-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/input/c-input-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/input/c-input-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/input/c-input-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/input/c-input-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/input/c-input-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/input/c-input-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/input/c-input-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/input/c-input-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/input/c-input-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/input/c-input-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/input/c-input-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/input/c-input-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/input/c-input-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/input/c-input-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/input/c-input-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/input/c-input-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/input/c-input-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/input/c-input-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/input/c-input-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/input/c-input-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/input/c-input-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/input/c-input-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/input/c-input-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/input/c-input-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/input/c-input-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/input/c-input-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/input/c-input-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/input/c-input-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/input/c-input-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/input/c-input-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/input/c-input-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/input/c-input-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/input/c-input-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/input/c-input-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/input/c-input-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/input/c-input-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/input/c-input-22.jsx?raw';
import { Pattern as Pattern23 } from '../../../../.storybook/fixtures/reui/input/c-input-23.jsx';
import source23 from '../../../../.storybook/fixtures/reui/input/c-input-23.jsx?raw';
import { Pattern as Pattern24 } from '../../../../.storybook/fixtures/reui/input/c-input-24.jsx';
import source24 from '../../../../.storybook/fixtures/reui/input/c-input-24.jsx?raw';
import { Pattern as Pattern25 } from '../../../../.storybook/fixtures/reui/input/c-input-25.jsx';
import source25 from '../../../../.storybook/fixtures/reui/input/c-input-25.jsx?raw';
import { Pattern as Pattern26 } from '../../../../.storybook/fixtures/reui/input/c-input-26.jsx';
import source26 from '../../../../.storybook/fixtures/reui/input/c-input-26.jsx?raw';
import { Pattern as Pattern27 } from '../../../../.storybook/fixtures/reui/input/c-input-27.jsx';
import source27 from '../../../../.storybook/fixtures/reui/input/c-input-27.jsx?raw';
import { Pattern as Pattern28 } from '../../../../.storybook/fixtures/reui/input/c-input-28.jsx';
import source28 from '../../../../.storybook/fixtures/reui/input/c-input-28.jsx?raw';
import { Pattern as Pattern29 } from '../../../../.storybook/fixtures/reui/input/c-input-29.jsx';
import source29 from '../../../../.storybook/fixtures/reui/input/c-input-29.jsx?raw';
import { Pattern as Pattern30 } from '../../../../.storybook/fixtures/reui/input/c-input-30.jsx';
import source30 from '../../../../.storybook/fixtures/reui/input/c-input-30.jsx?raw';
import { Pattern as Pattern31 } from '../../../../.storybook/fixtures/reui/input/c-input-31.jsx';
import source31 from '../../../../.storybook/fixtures/reui/input/c-input-31.jsx?raw';

export default {
  title: 'Core/Input',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='input'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input compositions owned by Gaudi Input. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiInput1 = {
  name: 'Basic input',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic input' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiInput2 = {
  name: 'Input with label',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Input with label' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiInput3 = {
  name: 'Input with description',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Input with description' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiInput4 = {
  name: 'Disabled input',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Disabled input' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiInput5 = {
  name: 'Input with error message',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Input with error message' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiInput6 = {
  name: 'Input with character counter',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Input with character counter' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiInput7 = {
  name: 'Input with password type',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Input with password type' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiInput8 = {
  name: 'Input with phone type',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Input with phone type' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiInput9 = {
  name: 'Input with URL type',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Input with URL type' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiInput10 = {
  name: 'Input with number type',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Input with number type' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiInput11 = {
  name: 'Input with date type',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Input with date type' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiInput12 = {
  name: 'Input with file type',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Input with file type' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiInput13 = {
  name: 'Input with required indicator',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Input with required indicator' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiInput14 = {
  name: 'Input with time type',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Input with time type' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiInput15 = {
  name: 'Complex input form with multiple fields',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Complex input form with multiple fields' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiInput16 = {
  name: 'Input label with tooltip',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Input label with tooltip' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiInput17 = {
  name: 'Input label with badge',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Input label with badge' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiInput18 = {
  name: 'Input label with optional badge',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Input label with optional badge' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiInput19 = {
  name: 'Input label with link and visibility toggle',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Input label with link and visibility toggle' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiInput20 = {
  name: 'Input with horizontal orientation',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Input with horizontal orientation' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiInput21 = {
  name: 'Input with multiple error messages',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Input with multiple error messages' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiInput22 = {
  name: 'Basic password strength with dynamic hint and icons',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: {
        story: 'Basic password strength with dynamic hint and icons'
      },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
export const ReuiInput23 = {
  name: 'Advanced password strength indicator with progress',
  render: () => <Pattern23 />,
  parameters: {
    docs: {
      description: {
        story: 'Advanced password strength indicator with progress'
      },
      source: { code: publicSource(source23), language: 'jsx' }
    }
  }
};
export const ReuiInput24 = {
  name: 'Input with pulsed background animation',
  render: () => <Pattern24 />,
  parameters: {
    docs: {
      description: { story: 'Input with pulsed background animation' },
      source: { code: publicSource(source24), language: 'jsx' }
    }
  }
};
export const ReuiInput25 = {
  name: 'Input with custom focus ring',
  render: () => <Pattern25 />,
  parameters: {
    docs: {
      description: { story: 'Input with custom focus ring' },
      source: { code: publicSource(source25), language: 'jsx' }
    }
  }
};
export const ReuiInput26 = {
  name: 'Input with subtle background',
  render: () => <Pattern26 />,
  parameters: {
    docs: {
      description: { story: 'Input with subtle background' },
      source: { code: publicSource(source26), language: 'jsx' }
    }
  }
};
export const ReuiInput27 = {
  name: 'Input with bottom border only',
  render: () => <Pattern27 />,
  parameters: {
    docs: {
      description: { story: 'Input with bottom border only' },
      source: { code: publicSource(source27), language: 'jsx' }
    }
  }
};
export const ReuiInput28 = {
  name: 'Color input',
  render: () => <Pattern28 />,
  parameters: {
    docs: {
      description: { story: 'Color input' },
      source: { code: publicSource(source28), language: 'jsx' }
    }
  }
};
export const ReuiInput29 = {
  name: 'Range input with value indicator',
  render: () => <Pattern29 />,
  parameters: {
    docs: {
      description: { story: 'Range input with value indicator' },
      source: { code: publicSource(source29), language: 'jsx' }
    }
  }
};
export const ReuiInput30 = {
  name: 'Pill-shaped input',
  render: () => <Pattern30 />,
  parameters: {
    docs: {
      description: { story: 'Pill-shaped input' },
      source: { code: publicSource(source30), language: 'jsx' }
    }
  }
};
export const ReuiInput31 = {
  name: 'Minimal input without borders or background',
  render: () => <Pattern31 />,
  parameters: {
    docs: {
      description: { story: 'Minimal input without borders or background' },
      source: { code: publicSource(source31), language: 'jsx' }
    }
  }
};
