// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/field/c-field-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/field/c-field-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/field/c-field-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/field/c-field-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/field/c-field-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/field/c-field-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/field/c-field-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/field/c-field-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/field/c-field-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/field/c-field-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/field/c-field-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/field/c-field-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/field/c-field-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/field/c-field-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/field/c-field-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/field/c-field-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/field/c-field-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/field/c-field-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/field/c-field-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/field/c-field-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/field/c-field-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/field/c-field-11.jsx?raw';

export default {
  title: 'Core/Field',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='field'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Field compositions owned by Gaudi Field. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiField1 = {
  name: 'Fields with input groups',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Fields with input groups' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiField2 = {
  name: 'Field with input and textarea',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Field with input and textarea' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiField3 = {
  name: 'Field with select control',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Field with select control' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiField4 = {
  name: 'Field with radio groups and checkboxes',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Field with radio groups and checkboxes' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiField5 = {
  name: 'Filed with slider and switch',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Filed with slider and switch' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiField6 = {
  name: 'Field with OTP input',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Field with OTP input' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiField7 = {
  name: 'Settings form with validation',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Settings form with validation' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiField8 = {
  name: 'Permission settings with checkboxes',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Permission settings with checkboxes' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiField9 = {
  name: 'Responsive field layout',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Responsive field layout' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiField10 = {
  name: 'Notification preferences form',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Notification preferences form' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiField11 = {
  name: 'Form with validation errors',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Form with validation errors' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
