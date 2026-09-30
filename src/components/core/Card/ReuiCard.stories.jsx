// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/card/c-card-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/card/c-card-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/card/c-card-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/card/c-card-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/card/c-card-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/card/c-card-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/card/c-card-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/card/c-card-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/card/c-card-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/card/c-card-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/card/c-card-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/card/c-card-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/card/c-card-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/card/c-card-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/card/c-card-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/card/c-card-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/card/c-card-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/card/c-card-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/card/c-card-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/card/c-card-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/card/c-card-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/card/c-card-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/card/c-card-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/card/c-card-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/card/c-card-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/card/c-card-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/card/c-card-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/card/c-card-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/card/c-card-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/card/c-card-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/card/c-card-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/card/c-card-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/card/c-card-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/card/c-card-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/card/c-card-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/card/c-card-18.jsx?raw';

export default {
  title: 'Core/Card',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='card'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card compositions owned by Gaudi Card. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCard1 = {
  name: 'Basic card',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic card' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCard2 = {
  name: 'Card header with border',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Card header with border' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCard3 = {
  name: 'Card with border separation',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Card with border separation' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCard4 = {
  name: 'Card with header and footer',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Card with header and footer' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCard5 = {
  name: 'Card with link',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Card with link' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCard6 = {
  name: 'Card with dropdown menu',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Card with dropdown menu' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCard7 = {
  name: 'Card with image',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Card with image' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCard8 = {
  name: 'Card with image scale hover effect',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Card with image scale hover effect' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCard9 = {
  name: 'Card with full image',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Card with full image' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCard10 = {
  name: 'Full card with image and shadow fade effect',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Full card with image and shadow fade effect' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCard11 = {
  name: 'Card with stacked depth effect',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Card with stacked depth effect' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiCard12 = {
  name: 'Advanced clean login form card',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Advanced clean login form card' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiCard13 = {
  name: 'Expandable billing usage card',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Expandable billing usage card' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiCard14 = {
  name: 'Deployment status summary card',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Deployment status summary card' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiCard15 = {
  name: 'Stat card with trend and overflow menu',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Stat card with trend and overflow menu' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiCard16 = {
  name: 'Card with header badge and actions',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Card with header badge and actions' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiCard17 = {
  name: 'Card with icon, title and link',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Card with icon, title and link' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiCard18 = {
  name: 'Card with header label and link',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Card with header label and link' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
