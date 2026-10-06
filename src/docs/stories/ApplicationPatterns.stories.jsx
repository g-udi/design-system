import {
  Page,
  Section,
  QuickLink
} from '../components/StoryDocs';
import {
  blockCoverage
} from '../fixtures/application/coverage';
export default {
  title: 'Overview/Application patterns',
  id: 'overview-application-patterns',
  tags: ['!autodocs'],
  parameters: {
    visualAudit: { wide: 'State galleries lay cards on a full-width grid.' }, layout: 'fullscreen' }
};
export const Catalogue = {
  render: () => (
    <Page
      title='Application patterns'
      intro='Reusable workflows for the applications you build with Gaudi: workspaces, onboarding, settings, and collections. Start with a complete use case, then adapt the composition to your product. Examples use illustrative data and local state.'
    >
      <Section title='Start with a workflow'>
        <div className='grid gap-4 md:grid-cols-2'>
          {blockCoverage
            .filter(([, , id]) => id)
            .map(([title, description, storyId]) => (
              <QuickLink
                key={title}
                title={title}
                description={description}
                storyId={storyId}
              />
            ))}
        </div>
      </Section>
      <Section
        title='What belongs where'
        description='Gaudi owns visual structure, keyboard/focus behavior, local presentation state and generic validation. Applications supply records, permissions, requests, routing and persistence. Use leaf imports to load the components each route needs.'
      >
        <p className='ds-description'>
          Gaudi brings curated components and application patterns together
          through shared tokens, accessible behavior, and reusable APIs.
          Extend an existing component when it fits; add a new one when there
          is a distinct gap.
        </p>
      </Section>
      <Section
        title='Build on the component catalogue'
        description='Application patterns compose the same Gaudi components used across products. The curated collection adds variants and use cases to matching owners and fills gaps with new components.'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <QuickLink title='Component catalogue' description='Browse components and their working examples under Gaudi owners.' storyId='overview-component-catalogue--browse' />
          <QuickLink title='Core components' description='Find public APIs and guidance before composing or extending a component.' storyId='core-overview--default' />
        </div>
      </Section>
      <Section
        title='Integration boundaries'
        description='Gaudi supplies interface behavior; applications supply services and business rules. Authentication, uploads, saves, scheduling, and messages need host integrations. Use each component’s documented API and examples to check supported features.'
      >
        <p className='ds-description'>
          The DataTable convenience API handles client collections; composable
          data-grid examples live under the same owner. KanbanBoard exposes move
          menus, while Sortable provides drag-and-drop compositions. Calendar,
          EventCalendar, Gantt, Tree, Message, and specialized inputs have their
          own component examples. Product persistence, authorization, and workflow
          rules stay in the consuming application.
        </p>
      </Section>
    </Page>
  )
};

import StateGallery from '../fixtures/application/StateGallery';
export const StateGalleryExample = {
  name: 'Components in use',
  render: () => <StateGallery />
};
