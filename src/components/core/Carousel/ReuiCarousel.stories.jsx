// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/carousel/c-carousel-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/carousel/c-carousel-11.jsx?raw';

export default {
  title: 'Core/Carousel',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='carousel'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Carousel compositions owned by Gaudi Carousel. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCarousel1 = {
  name: 'Basic carousel with single item',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic carousel with single item' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCarousel2 = {
  name: 'Vertical carousel orientation',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Vertical carousel orientation' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCarousel3 = {
  name: 'Carousel with multiple items visible',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with multiple items visible' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCarousel4 = {
  name: 'Carousel with responsive basis',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with responsive basis' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCarousel5 = {
  name: 'Carousel with autoplay plugin',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with autoplay plugin' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCarousel6 = {
  name: 'Carousel with centered slide alignment',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with centered slide alignment' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCarousel7 = {
  name: 'Carousel with custom spacing',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with custom spacing' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCarousel8 = {
  name: 'Carousel with images and overlays',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with images and overlays' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCarousel9 = {
  name: 'Carousel with thumbnail navigation',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with thumbnail navigation' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCarousel10 = {
  name: 'Carousel with overlay thumbnail navigation',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Carousel with overlay thumbnail navigation' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCarousel11 = {
  name: 'Carousel with dots navigation and content overlays',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story: 'Carousel with dots navigation and content overlays'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
