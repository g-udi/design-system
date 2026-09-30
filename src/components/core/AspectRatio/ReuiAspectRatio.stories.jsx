// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/aspect-ratio/c-aspect-ratio-8.jsx?raw';

export default {
  title: 'Core/AspectRatio',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='aspect-ratio'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Aspect Ratio compositions owned by Gaudi AspectRatio. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiAspectRatio1 = {
  name: '16:9 widescreen aspect ratio',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: '16:9 widescreen aspect ratio' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio2 = {
  name: '4:3 standard aspect ratio',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: '4:3 standard aspect ratio' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio3 = {
  name: '1:1 square aspect ratio',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: '1:1 square aspect ratio' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio4 = {
  name: '21:9 ultrawide aspect ratio',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: '21:9 ultrawide aspect ratio' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio5 = {
  name: '9:16 portrait aspect ratio',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: '9:16 portrait aspect ratio' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio6 = {
  name: '3:2 classic photography aspect ratio',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: '3:2 classic photography aspect ratio' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio7 = {
  name: '4:5 social media portrait aspect ratio',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: '4:5 social media portrait aspect ratio' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiAspectRatio8 = {
  name: '16:10 computer monitor aspect ratio',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: '16:10 computer monitor aspect ratio' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
