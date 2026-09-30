import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/stepper/c-stepper-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/stepper/c-stepper-15.jsx?raw';

export default {
  title: 'Core/Stepper',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='stepper'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Stepper compositions owned by Gaudi Stepper. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiStepper1 = {
  play: catalogueInteractions['stepper-1'],
  name: 'Basic stepper',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic stepper' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiStepper2 = {
  name: 'Stepper with completed state',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with completed state' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiStepper3 = {
  name: 'Stepper with loading state',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with loading state' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiStepper4 = {
  name: 'Controlled stepper',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Controlled stepper' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiStepper5 = {
  name: 'Stepper with title and indicator',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with title and indicator' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiStepper6 = {
  name: 'Stepper with progress bar indicator',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with progress bar indicator' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiStepper7 = {
  name: 'Stepper with icons and badges',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with icons and badges' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiStepper8 = {
  name: 'Stepper with descriptions',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with descriptions' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiStepper9 = {
  name: 'Stepper with inline titles',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with inline titles' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiStepper10 = {
  name: 'Stepper with content for each step',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with content for each step' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiStepper11 = {
  name: 'Stepper with progress bar and titles',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with progress bar and titles' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiStepper12 = {
  name: 'Stepper with segmented progress bar',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with segmented progress bar' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiStepper13 = {
  name: 'Stepper with vertical orientation and descriptions',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: {
        story: 'Stepper with vertical orientation and descriptions'
      },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiStepper14 = {
  name: 'Stepper with vertical orientation',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with vertical orientation' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiStepper15 = {
  name: 'Stepper with vertical orientation and titles',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Stepper with vertical orientation and titles' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
