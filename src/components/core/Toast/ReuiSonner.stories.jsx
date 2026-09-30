// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/sonner/c-sonner-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/sonner/c-sonner-21.jsx?raw';

export default {
  title: 'Core/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='sonner'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Sonner compositions owned by Gaudi Toast. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSonner1 = {
  name: 'Sonner: Basic toast notification.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic toast notification.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSonner2 = {
  name: 'Sonner: Toast notification with description.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Toast notification with description.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSonner3 = {
  name: 'Sonner: Toast positions',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Toast positions' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSonner4 = {
  name: 'Sonner: Toast variants with colored icons',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Toast variants with colored icons' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSonner5 = {
  name: 'Sonner: Toast duration options',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Toast duration options' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSonner6 = {
  name: 'Sonner: Toast with action button',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Toast with action button' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSonner7 = {
  name: 'Sonner: Promise toast with loading state',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Promise toast with loading state' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSonner8 = {
  name: 'Sonner: Toast with custom close and cancel buttons',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Toast with custom close and cancel buttons' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiSonner9 = {
  name: 'Sonner: Toast with custom rich content',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Toast with custom rich content' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiSonner10 = {
  name: 'Sonner: Toast with upload progress simulation',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Toast with upload progress simulation' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiSonner11 = {
  name: 'Sonner: Toast with status alert markup',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Toast with status alert markup' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiSonner12 = {
  name: 'Sonner: Custom accent border toast',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Custom accent border toast' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiSonner13 = {
  name: 'Sonner: Custom invert success toast',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Custom invert success toast' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiSonner14 = {
  name: 'Sonner: Custom invert error toast with details',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Custom invert error toast with details' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiSonner15 = {
  name: 'Sonner: Custom invert info toast with avatar',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Custom invert info toast with avatar' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiSonner16 = {
  name: 'Sonner: Custom invert warning toast with countdown',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Custom invert warning toast with countdown' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiSonner17 = {
  name: 'Sonner: Multi-action invert toast with avatar group',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Multi-action invert toast with avatar group' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiSonner18 = {
  name: 'Sonner: Toast with close button on top-right',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Toast with close button on top-right' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiSonner19 = {
  name: 'Sonner: Toast with custom icon',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Toast with custom icon' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiSonner20 = {
  name: 'Sonner: Custom integration toast',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Custom integration toast' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiSonner21 = {
  name: 'Sonner: Updatable toast with ID',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Updatable toast with ID' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
