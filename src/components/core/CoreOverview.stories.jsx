import { CheckList, InlineCode, Page, QuickLink, Section, Table, Td, Th } from '../../../.storybook/stories/StoryDocs';
import { expect, within } from 'storybook/test';

export default {
  id: 'core-overview',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Core'
};

const primaryTasks = [
  [ 'Act and navigate', 'Button, Link, Breadcrumb, Pagination', 'Match the semantic element to the job: buttons change state, links change location.', 'core-button--docs' ],
  [ 'Collect and choose', 'Field, Select, Checkbox, Switch', 'Use persistent labels, visible state, and bounded choices before custom form composition.', 'core-field--docs' ],
  [ 'Communicate state', 'Banner, Pill, Spinner, Skeleton', 'Use text-first feedback and recovery so color never carries meaning alone.', 'core-banner--docs' ],
  [ 'Organize and reveal', 'Card, Grid, DataTable, Accordion, Popover, Commander', 'Choose structure, comparison, or disclosure from the smallest component that preserves context.', 'core-card--docs' ]
];

const choiceRules = [
  'Start with the user job, then choose the smallest semantic primitive that does that job.',
  'Use blue for primary action, links, focus, and active state; use semantic tones only when the state meaning is explicit in text.',
  'Prefer exported variants over local Tailwind color, radius, spacing, or icon choices.',
  'Use Button for actions and Link for navigation; do not swap them for visual preference.',
  'Keep dense component choices behind docs pages; this overview is the safe entry point for browsing.'
];

const highValuePaths = [
  [ 'Buttons', 'One primary action, secondary actions, states, sizes, and tones.', 'core-button--docs' ],
  [ 'Fields', 'Labels, descriptions, errors, disabled state, and input composition.', 'core-field--docs' ],
  [ 'Data tables', 'Captions, headers, custom cells, and scroll behavior.', 'core-datatable--docs' ],
  [ 'Command launcher', 'Keyboard-first search and navigation overlay.', 'core-commander--docs' ]
];

export const Default = {
  name: 'Overview',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const [ title, , storyId ] of highValuePaths)
      await expect(canvas.getByRole('link', { name: new RegExp(`^${title}`) })).toHaveAttribute('href', `./?path=/docs/${storyId}`);

  },
  render: () => (
    <Page
      title='Core Components'
      intro='Core brings together reusable components for the blog and applications: identity, actions, forms, data views, navigation, feedback, and overlays. Curated patterns extend these owners with richer variants and use cases.'
    >
      <Section title='Choose By Job' description='The fastest path is task-first. Pick the row that matches the user need, then open the component docs for exact props and states.'>
        <Table>
          <thead>
            <tr><Th>User job</Th><Th>Start with</Th><Th>Rule</Th></tr>
          </thead>
          <tbody>
            {primaryTasks.map(([ job, component, rule ]) => (
              <tr key={ job }>
                <Td>{job}</Td>
                <Td mono>{component}</Td>
                <Td>{rule}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section title='Decision Rules' description='These rules keep Core usage consistent across the blog, applications, and documentation.'>
        <CheckList items={ choiceRules } />
      </Section>

      <Section title='Direct Paths' description='Open these first when browsing by task. Variant galleries stay inside the component pages.'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {highValuePaths.map(([ title, description, storyId ]) => (
            <QuickLink key={ storyId } title={ title } description={ description } storyId={ storyId } />
          ))}
        </div>
      </Section>

      <Section title='Package Boundary' description='Core exports should remain small, reusable, and app-data-free.'>
        <p className='max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300'>
          Import primitives from <InlineCode>@gaudi/design-system</InlineCode> or the documented subpath. Keep route data, content records, generated MDX output, and one-off page wiring in the consuming app.
        </p>
      </Section>
    </Page>
  )
};
