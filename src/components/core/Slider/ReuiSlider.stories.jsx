// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/slider/c-slider-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/slider/c-slider-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/slider/c-slider-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/slider/c-slider-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/slider/c-slider-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/slider/c-slider-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/slider/c-slider-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/slider/c-slider-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/slider/c-slider-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/slider/c-slider-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/slider/c-slider-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/slider/c-slider-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/slider/c-slider-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/slider/c-slider-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/slider/c-slider-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/slider/c-slider-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/slider/c-slider-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/slider/c-slider-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/slider/c-slider-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/slider/c-slider-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/slider/c-slider-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/slider/c-slider-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/slider/c-slider-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/slider/c-slider-12.jsx?raw';

export default {
  title: 'Core/Slider',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='slider'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Slider compositions owned by Gaudi Slider. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSlider1 = {
  name: 'Basic slider.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic slider.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSlider2 = {
  name: 'Disabled slider',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Disabled slider' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSlider3 = {
  name: 'Slider with multiple discrete values',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Slider with multiple discrete values' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSlider4 = {
  name: 'Vertical slider with range selection',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Vertical slider with range selection' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSlider5 = {
  name: 'Slider with controlled value tracking',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Slider with controlled value tracking' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSlider6 = {
  name: 'Slider with range selection',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Slider with range selection' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiSlider7 = {
  name: 'Slider synced with number input',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Slider synced with number input' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiSlider8 = {
  name: 'Color temperature slider',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Color temperature slider' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiSlider9 = {
  name: 'Slider with reference labels',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Slider with reference labels' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiSlider10 = {
  name: 'Slider with tick marks',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Slider with tick marks' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiSlider11 = {
  name: 'Slider with dynamic tooltip indicator',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Slider with dynamic tooltip indicator' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiSlider12 = {
  name: 'Rating slider with emoji feedback',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Rating slider with emoji feedback' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
