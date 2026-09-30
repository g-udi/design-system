// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/collapsible/c-collapsible-10.jsx?raw';

export default {
  title: 'Core/Accordion',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='collapsible'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Collapsible compositions owned by Gaudi Accordion. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCollapsible1 = {
  name: 'Collapsible: Basic collapsible',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic collapsible' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible2 = {
  name: 'Collapsible: Collapsible with checkbox settings',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible with checkbox settings' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible3 = {
  name: 'Collapsible: Collapsible animated card',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible animated card' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible4 = {
  name: 'Collapsible: Collapsible card with bottom trigger',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible card with bottom trigger' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible5 = {
  name: 'Collapsible: Collapsible form fields',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible form fields' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible6 = {
  name: 'Collapsible: Collapsible frame',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible frame' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible7 = {
  name: 'Collapsible: Nested collapsible list with actions',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Nested collapsible list with actions' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible8 = {
  name: 'Collapsible: Collapsible User profile',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Collapsible User profile' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible9 = {
  name: 'Collapsible: Multi-level collapsible menu',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Multi-level collapsible menu' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCollapsible10 = {
  name: 'Collapsible: Tree view with file actions',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Tree view with file actions' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
