import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/number-field/c-number-field-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/number-field/c-number-field-6.jsx?raw';

export default {
  title: 'Core/NumberField',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='number-field'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Number Field compositions owned by Gaudi NumberField. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiNumberField1 = {
  play: catalogueInteractions['number-field-1'],
  name: 'Basic number field',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic number field' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiNumberField2 = {
  name: 'Basic number field',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Basic number field' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiNumberField3 = {
  name: 'Basic number field',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Basic number field' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiNumberField4 = {
  name: 'Number filed wiith buttons on right',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Number filed wiith buttons on right' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiNumberField5 = {
  name: 'Number field with spinner buttons',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Number field with spinner buttons' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiNumberField6 = {
  name: 'Number field in form',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Number field in form' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
