// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/spinner/c-spinner-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/spinner/c-spinner-12.jsx?raw';

export default {
  title: 'Core/Spinner',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='spinner'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Spinner compositions owned by Gaudi Spinner. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSpinner1 = {
  name: 'Basic spinner.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic spinner.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSpinner2 = {
  name: 'Spinners in buttons.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Spinners in buttons.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSpinner3 = {
  name: 'Spinners in badges.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Spinners in badges.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSpinner4 = {
  name: 'Spinner in input group.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Spinner in input group.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSpinner5 = {
  name: 'Spinner in empty state.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Spinner in empty state.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSpinner6 = {
  name: 'Button loading states',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Button loading states' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSpinner7 = {
  name: 'Overlay loading spinner',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Overlay loading spinner' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSpinner8 = {
  name: 'Full page loading state',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Full page loading state' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiSpinner9 = {
  name: 'Inline loading text with spinner',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Inline loading text with spinner' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiSpinner10 = {
  name: 'Animated loading dots',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Animated loading dots' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiSpinner11 = {
  name: 'Spinner overlay on card',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Spinner overlay on card' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiSpinner12 = {
  name: 'Spinner color variants',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Spinner color variants' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
