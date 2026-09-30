import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ToggleGroup from './ToggleGroup';

export default {
  tags: ['autodocs'],
  title: 'Core/ToggleGroup',
  component: ToggleGroup,
  ...applicationDocs(
    'Single or multiple selection for view modes and formatting. Pass label, options, type, controlled value and onValueChange, or defaultValue. Single selection can be cleared.',
    "import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';\n\n<ToggleGroup label='Collection view' defaultValue='list' options={[{value:'list',label:'List'},{value:'grid',label:'Grid'},{value:'board',label:'Board'}]} />",
    'Radix owns roving focus and pressed/checked semantics. Every option has readable text or an explicit ariaLabel.'
  )
};

export const ViewMode = {
  parameters: {
    docs: {
      source: {
        code: "<ToggleGroup label='Collection view' defaultValue='list' options={[{value:'list',label:'List'},{value:'grid',label:'Grid'},{value:'board',label:'Board'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <ToggleGroup
        label='Collection view'
        defaultValue='list'
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'board', label: 'Board' }
        ]}
      />
    </ExampleFrame>
  )
};

export const Multiple = {
  parameters: {
    docs: {
      source: {
        code: "<ToggleGroup label='Text formatting' type='multiple' defaultValue={['bold']} options={[{value:'bold',label:'Bold'},{value:'italic',label:'Italic'},{value:'underline',label:'Underline'}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <ToggleGroup
        label='Text formatting'
        type='multiple'
        defaultValue={['bold']}
        options={[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
          { value: 'underline', label: 'Underline' }
        ]}
      />
    </ExampleFrame>
  )
};

export const DisabledOptions = {
  parameters: {
    docs: {
      source: {
        code: "<ToggleGroup label='Export format' defaultValue='md' options={[{value:'md',label:'Markdown'},{value:'html',label:'HTML'},{value:'pdf',label:'PDF',disabled:true}]} />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <ToggleGroup
        label='Export format'
        defaultValue='md'
        options={[
          { value: 'md', label: 'Markdown' },
          { value: 'html', label: 'HTML' },
          { value: 'pdf', label: 'PDF', disabled: true }
        ]}
      />
    </ExampleFrame>
  )
};
