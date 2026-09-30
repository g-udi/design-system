// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/frame/c-frame-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/frame/c-frame-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/frame/c-frame-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/frame/c-frame-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/frame/c-frame-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/frame/c-frame-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/frame/c-frame-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/frame/c-frame-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/frame/c-frame-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/frame/c-frame-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/frame/c-frame-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/frame/c-frame-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/frame/c-frame-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/frame/c-frame-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/frame/c-frame-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/frame/c-frame-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/frame/c-frame-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/frame/c-frame-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/frame/c-frame-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/frame/c-frame-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/frame/c-frame-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/frame/c-frame-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/frame/c-frame-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/frame/c-frame-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/frame/c-frame-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/frame/c-frame-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/frame/c-frame-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/frame/c-frame-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/frame/c-frame-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/frame/c-frame-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/frame/c-frame-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/frame/c-frame-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/frame/c-frame-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/frame/c-frame-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/frame/c-frame-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/frame/c-frame-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/frame/c-frame-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/frame/c-frame-19.jsx?raw';

export default {
  title: 'Core/Card',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='frame'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Frame compositions owned by Gaudi Card. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiFrame1 = {
  name: 'Frame: Basic frame',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic frame' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiFrame2 = {
  name: 'Frame: Frame with separated panels',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Frame with separated panels' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiFrame3 = {
  name: 'Frame: Frame with stacked panels',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Frame with stacked panels' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiFrame4 = {
  name: 'Frame: Frame with stacked panels and dense style',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Frame with stacked panels and dense style' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiFrame5 = {
  name: 'Frame: Frame with collapsible panels',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Frame with collapsible panels' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiFrame6 = {
  name: 'Frame: Frame with ghost(no outer border) variant',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Frame with ghost(no outer border) variant' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiFrame7 = {
  name: 'Frame: Frame with dense layout',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Frame with dense layout' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiFrame8 = {
  name: 'Frame: Frame with stacked panels',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Frame with stacked panels' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiFrame9 = {
  name: 'Frame: Frame with extra small spacing',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Frame with extra small spacing' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiFrame10 = {
  name: 'Frame: Frame with small spacing',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Frame with small spacing' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiFrame11 = {
  name: 'Frame: Frame with default spacing',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Frame with default spacing' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiFrame12 = {
  name: 'Frame: Frame with large spacing',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Frame with large spacing' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiFrame13 = {
  name: 'Frame: Frame with small border radius',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Frame with small border radius' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiFrame14 = {
  name: 'Frame: Frame with medium border radius',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Frame with medium border radius' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiFrame15 = {
  name: 'Frame: Frame with large border radius',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Frame with large border radius' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiFrame16 = {
  name: 'Frame: Frame with default border radius',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Frame with default border radius' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiFrame17 = {
  name: 'Frame: Frame with extra large border radius',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Frame with extra large border radius' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiFrame18 = {
  name: 'Frame: Frame with content-only panels',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Frame with content-only panels' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiFrame19 = {
  name: 'Frame: Frame with stacked content-only panels',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Frame with stacked content-only panels' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
