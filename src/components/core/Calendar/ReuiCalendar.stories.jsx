// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-20.jsx?raw';
import { Pattern as Pattern21 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-21.jsx';
import source21 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-21.jsx?raw';
import { Pattern as Pattern22 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-22.jsx';
import source22 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-22.jsx?raw';
import { Pattern as Pattern23 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-23.jsx';
import source23 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-23.jsx?raw';
import { Pattern as Pattern24 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-24.jsx';
import source24 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-24.jsx?raw';
import { Pattern as Pattern25 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-25.jsx';
import source25 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-25.jsx?raw';
import { Pattern as Pattern26 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-26.jsx';
import source26 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-26.jsx?raw';
import { Pattern as Pattern27 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-27.jsx';
import source27 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-27.jsx?raw';
import { Pattern as Pattern28 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-28.jsx';
import source28 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-28.jsx?raw';
import { Pattern as Pattern29 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-29.jsx';
import source29 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-29.jsx?raw';
import { Pattern as Pattern30 } from '../../../../.storybook/fixtures/reui/calendar/c-calendar-30.jsx';
import source30 from '../../../../.storybook/fixtures/reui/calendar/c-calendar-30.jsx?raw';

export default {
  title: 'Core/Calendar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='calendar'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Calendar compositions owned by Gaudi Calendar. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCalendar1 = {
  name: 'Basic calendar',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic calendar' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCalendar2 = {
  name: 'Range calendar',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Range calendar' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCalendar3 = {
  name: 'Disabled dates',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Disabled dates' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCalendar4 = {
  name: 'Multiple day selection',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Multiple day selection' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCalendar5 = {
  name: 'Custom select day style',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Custom select day style' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCalendar6 = {
  name: 'Custom select range style',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Custom select range style' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCalendar7 = {
  name: 'Right navigation',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Right navigation' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCalendar8 = {
  name: 'Month and year selection',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Month and year selection' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiCalendar9 = {
  name: 'Year select with navigation',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Year select with navigation' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiCalendar10 = {
  name: 'Display week numbers',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Display week numbers' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiCalendar11 = {
  name: 'Current month button',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Current month button' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiCalendar12 = {
  name: 'Today button',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: { story: 'Today button' },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiCalendar13 = {
  name: 'Custom navigation with year view',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Custom navigation with year view' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiCalendar14 = {
  name: 'Preset time selection',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Preset time selection' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiCalendar15 = {
  name: 'Calendar with presets',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with presets' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiCalendar16 = {
  name: 'Range calendar with presets',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Range calendar with presets' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiCalendar17 = {
  name: 'Calendar with pricing',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with pricing' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiCalendar18 = {
  name: 'Calendar with presets',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with presets' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiCalendar19 = {
  name: 'Appointment calendar',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'Appointment calendar' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiCalendar20 = {
  name: 'Display 2 months',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'Display 2 months' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
export const ReuiCalendar21 = {
  name: 'Display 2 months with range picker',
  render: () => <Pattern21 />,
  parameters: {
    docs: {
      description: { story: 'Display 2 months with range picker' },
      source: { code: publicSource(source21), language: 'jsx' }
    }
  }
};
export const ReuiCalendar22 = {
  name: 'Calendar with event list',
  render: () => <Pattern22 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with event list' },
      source: { code: publicSource(source22), language: 'jsx' }
    }
  }
};
export const ReuiCalendar23 = {
  name: 'Localize calendar',
  render: () => <Pattern23 />,
  parameters: {
    docs: {
      description: { story: 'Localize calendar' },
      source: { code: publicSource(source23), language: 'jsx' }
    }
  }
};
export const ReuiCalendar24 = {
  name: 'Calendar with date picker',
  render: () => <Pattern24 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date picker' },
      source: { code: publicSource(source24), language: 'jsx' }
    }
  }
};
export const ReuiCalendar25 = {
  name: 'Calendar with date range picker',
  render: () => <Pattern25 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date range picker' },
      source: { code: publicSource(source25), language: 'jsx' }
    }
  }
};
export const ReuiCalendar26 = {
  name: 'Calendar with date picker and year view',
  render: () => <Pattern26 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date picker and year view' },
      source: { code: publicSource(source26), language: 'jsx' }
    }
  }
};
export const ReuiCalendar27 = {
  name: 'Calendar with date and appointment picker',
  render: () => <Pattern27 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date and appointment picker' },
      source: { code: publicSource(source27), language: 'jsx' }
    }
  }
};
export const ReuiCalendar28 = {
  name: 'Calendar with date picker and presets',
  render: () => <Pattern28 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date picker and presets' },
      source: { code: publicSource(source28), language: 'jsx' }
    }
  }
};
export const ReuiCalendar29 = {
  name: 'Range calendar with date picker and presets',
  render: () => <Pattern29 />,
  parameters: {
    docs: {
      description: { story: 'Range calendar with date picker and presets' },
      source: { code: publicSource(source29), language: 'jsx' }
    }
  }
};
export const ReuiCalendar30 = {
  name: 'Calendar with date and time range picker',
  render: () => <Pattern30 />,
  parameters: {
    docs: {
      description: { story: 'Calendar with date and time range picker' },
      source: { code: publicSource(source30), language: 'jsx' }
    }
  }
};
