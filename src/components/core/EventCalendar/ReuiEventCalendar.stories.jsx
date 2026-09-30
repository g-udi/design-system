// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-5.jsx?raw';

export default {
  title: 'Core/EventCalendar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='event-calendar'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Event Calendar compositions owned by Gaudi EventCalendar. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiEventCalendar1 = {
  name: 'Event calendar with all views and live settings',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Event calendar with all views and live settings' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiEventCalendar2 = {
  name: 'Event calendar with resource view for room bookings',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story: 'Event calendar with resource view for room bookings'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiEventCalendar3 = {
  name: 'Event calendar with create and edit dialog',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story:
          'Month calendar with event CRUD in one dialog: open from an empty day, an event, or Add event, commit via apiRef. Title, color, start, duration, all-day fields. ReUI EventCalendar, Nav, Toolbar; shadcn Dialog, Field, Select, Switch. Scheduling apps.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiEventCalendar4 = {
  name: 'Event calendar with custom event chips',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Event calendar with custom event chips' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiEventCalendar5 = {
  name: 'Event calendar with drag-to-book appointments',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Event calendar with drag-to-book appointments' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
