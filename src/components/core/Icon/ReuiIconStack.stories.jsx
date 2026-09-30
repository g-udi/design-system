// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/icon-stack/c-icon-stack-6.jsx?raw';

export default {
  title: 'Core/Icon',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='icon-stack'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Icon Stack compositions owned by Gaudi Icon. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiIconStack1 = {
  name: 'Icon Stack: Isometric icon stack',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Layered isometric icon' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiIconStack2 = {
  name: 'Icon Stack: Icon stack sizes',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Responsive icon stack sizes' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiIconStack3 = {
  name: 'Icon Stack: Icon stack colors',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Semantic icon stack colors' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiIconStack4 = {
  name: 'Icon Stack: Icon badge stack',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Icon stack with badge overlay' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiIconStack5 = {
  name: 'Icon Stack: Empty state illustration',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Shadcn empty state illustration' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiIconStack6 = {
  name: 'Icon Stack: Item media stack',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Icon stack in shadcn item' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
