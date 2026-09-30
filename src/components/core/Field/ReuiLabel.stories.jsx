// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/label/c-label-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/label/c-label-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/label/c-label-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/label/c-label-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/label/c-label-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/label/c-label-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/label/c-label-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/label/c-label-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/label/c-label-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/label/c-label-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/label/c-label-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/label/c-label-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/label/c-label-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/label/c-label-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/label/c-label-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/label/c-label-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/label/c-label-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/label/c-label-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/label/c-label-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/label/c-label-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/label/c-label-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/label/c-label-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/label/c-label-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/label/c-label-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/label/c-label-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/label/c-label-13.jsx?raw';

export default {
  title: 'Core/Field',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='label'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Label compositions owned by Gaudi Field. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiLabel1 = {
  name: 'Label: Basic label.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic label.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiLabel2 = {
  name: 'Label: Label paired with a checkbox.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Label paired with a checkbox.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiLabel3 = {
  name: 'Label: Label for a textarea field.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Label for a textarea field.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiLabel4 = {
  name: 'Label: Label in a disabled state.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Label in a disabled state.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiLabel5 = {
  name: 'Label: Label with required indicator',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Label with required indicator' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiLabel6 = {
  name: 'Label: Label with optional indicator',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Label with optional indicator' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiLabel7 = {
  name: 'Label: Label with tooltip info icon',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Label with tooltip info icon' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiLabel8 = {
  name: 'Label: Label with badge indicator',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Label with badge indicator' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiLabel9 = {
  name: 'Label: Label with character counter',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Label with character counter' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiLabel10 = {
  name: 'Label: Label with helper description text',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Label with helper description text' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiLabel11 = {
  name: 'Label: Label with error state',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Label with error state' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiLabel12 = {
  name: 'Label: Label with inline edit toggle',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Label with inline edit toggle' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiLabel13 = {
  name: 'Label: Label with status indicator dot',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Label with status indicator dot' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
