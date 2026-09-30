import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import StatGroup from './StatGroup';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/StatGroup',
  component: StatGroup,
  ...applicationDocs(
    'A responsive definition list for prepared metrics. Items supply id, label, value, optional detail and explicit tone. The system never calculates business values or assumes whether a change is favorable.',
    "<StatGroup items={[{id:'articles',label:'Published articles',value:'24',detail:'3 published this month'}]} />",
    'Labels and values use dl/dt/dd. Color is supplementary to the supplied comparison text. Long values wrap and numbers use tabular spacing.'
  )
};
export const EditorialSummary = {
  render: () => (
    <ExampleFrame wide>
      <StatGroup
        items={[
          {
            id: 'articles',
            label: 'Published articles',
            value: '24',
            detail: '3 published this month'
          },
          {
            id: 'readers',
            label: 'Subscribers',
            value: '1,280',
            detail: '+86 this month',
            tone: 'success'
          },
          {
            id: 'drafts',
            label: 'Open drafts',
            value: '6',
            detail: '2 awaiting review'
          },
          {
            id: 'time',
            label: 'Average reading time',
            value: '8 min',
            detail: 'Across published articles'
          }
        ]}
      />
    </ExampleFrame>
  )
};
export const QuietPeriod = {
  render: () => (
    <ExampleFrame>
      <StatGroup
        items={[
          {
            id: 'articles',
            label: 'Published this week',
            value: '0',
            detail: 'Your next piece can take its time.'
          },
          {
            id: 'readers',
            label: 'New subscribers',
            value: '—',
            detail: 'Data is not available.'
          }
        ]}
      />
    </ExampleFrame>
  )
};
