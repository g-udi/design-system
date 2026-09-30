import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ResourceList from './ResourceList';
import Pill from '../../core/Pill';
import { articles } from '../../../../.storybook/fixtures/application/data';
export default {
  tags: ['autodocs'],
  title: 'Blocks/Application/ResourceList',
  component: ResourceList,
  ...applicationDocs(
    'Semantic collection lists with stable IDs, a renderItem slot, loading skeletons and actionable empty states. Consumers choose links and independent row actions.',
    "<ResourceList label='Drafts' items={drafts} renderItem={draft => <a href={draft.href}>{draft.title}</a>} />",
    'Uses a labelled list; loading exposes aria-busy and a status message. Keep nested controls separate from row links.'
  )
};
export const RecentArticles = {
  render: () => (
    <ExampleFrame>
      <ResourceList
        label='Recent articles'
        items={articles.slice(0, 4)}
        renderItem={(article) => (
          <div className='ds-actions justify-between'>
            <div>
              <p className='ds-label'>{article.title}</p>
              <p className='ds-description'>
                {article.author} · {article.updated}
              </p>
            </div>
            <Pill tone='neutral' variant='soft'>
              {article.status}
            </Pill>
          </div>
        )}
      />
    </ExampleFrame>
  )
};
export const Loading = {
  render: () => (
    <ExampleFrame>
      <ResourceList label='Recent articles' loading />
    </ExampleFrame>
  )
};
export const Empty = {
  render: () => (
    <ExampleFrame>
      <ResourceList
        label='Saved articles'
        emptyTitle='Your reading list is open'
        emptyDescription='Save an article and come back to it when you have time.'
      />
    </ExampleFrame>
  )
};
