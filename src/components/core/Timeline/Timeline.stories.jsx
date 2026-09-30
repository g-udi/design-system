import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Timeline from './Timeline';
import { activity } from '../../../../.storybook/fixtures/application/data';

export default {
  tags: ['autodocs'],
  title: 'Core/Timeline',
  component: Timeline,
  ...applicationDocs(
    'Chronological activity, milestones and audit entries. Items use stable IDs, title, description, time and machine-readable dateTime; custom content stays host-owned.',
    "import Timeline from '@gaudi/design-system/core/Timeline';\n\n<Timeline items={activity} />",
    'Renders an ordered list and semantic time elements. Icons are decorative; all meaning is present in text.'
  )
};

export const EditorialActivity = {
  parameters: { docs: { source: { code: '<Timeline items={activity} />' } } },
  render: () => (
    <ExampleFrame>
      <Timeline items={activity} />
    </ExampleFrame>
  )
};

export const Milestones = {
  parameters: {
    docs: {
      source: {
        code: "<Timeline label='Publication milestones' items={[{id:'draft',title:'First draft',description:'The argument and supporting references are in place.',time:'24 Sep',dateTime:'2026-09-24'},{id:'review',title:'Peer review',description:'Open questions and factual checks.',time:'28 Sep',dateTime:'2026-09-28'},{id:'publish',title:'Publication',description:'Scheduled after final review.',time:'1 Oct',dateTime:'2026-10-01'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Timeline
        label='Publication milestones'
        items={[
          {
            id: 'draft',
            title: 'First draft',
            description: 'The argument and supporting references are in place.',
            time: '24 Sep',
            dateTime: '2026-09-24'
          },
          {
            id: 'review',
            title: 'Peer review',
            description: 'Open questions and factual checks.',
            time: '28 Sep',
            dateTime: '2026-09-28'
          },
          {
            id: 'publish',
            title: 'Publication',
            description: 'Scheduled after final review.',
            time: '1 Oct',
            dateTime: '2026-10-01'
          }
        ]}
      />
    </ExampleFrame>
  )
};

export const LongContent = {
  parameters: {
    docs: {
      source: {
        code: "<Timeline items={[{id:'long',title:'A deliberately detailed activity title that should remain readable on a narrow phone',description:'References include research from multiple sources, with long filenames and notes that wrap instead of escaping the timeline.',time:'Yesterday',dateTime:'2026-09-28'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Timeline
        items={[
          {
            id: 'long',
            title:
              'A deliberately detailed activity title that should remain readable on a narrow phone',
            description:
              'References include research from multiple sources, with long filenames and notes that wrap instead of escaping the timeline.',
            time: 'Yesterday',
            dateTime: '2026-09-28'
          }
        ]}
      />
    </ExampleFrame>
  )
};
