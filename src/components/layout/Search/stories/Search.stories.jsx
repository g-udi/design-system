import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { useState } from 'react';

import { expect, userEvent, within } from 'storybook/test';

import Search from '..';

const story = description => ({
  docs: {
    description: {
      story: description
    }
  }
});

const SearchExample = ({
  label
}) => {
  const [query, setQuery] = useState('');
  return <div className='mx-auto max-w-xl p-6'>
      <Search label={label} resultsId='storybook-article-results' setSearchValue={setQuery} value={query} />
      <p id='storybook-article-results' className='mt-4 text-sm text-text-muted' role='status'>
        {query ? `Filtering articles by “${query}”` : 'Showing all articles'}
      </p>
    </div>;
};

export const ArticleSearch = {
  name: 'Search',
  args: {
    label: 'Filter articles'
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible label and placeholder.'
    }
  },
  parameters: { ...story('The article filter: typing reports each change, and the clear button appears once there is a query.'), __id: 'layout-components--article-search' },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', {
      name: args.label
    });
    await userEvent.type(search, 'graphs');
    await expect(canvas.getByRole('status')).toHaveTextContent('Filtering articles by “graphs”');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Clear article filter'
    }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing all articles');
    await expect(search).toHaveFocus();
    await userEvent.type(search, 'systems');
    await userEvent.tab();
    await expect(canvas.getByRole('button', {
      name: 'Clear article filter'
    })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(search).toHaveValue('');
    await expect(search).toHaveFocus();
  },
  render: args => <SearchExample {...args} />
};

const docs = getComponentDocs('Layout/Search');

export default {
  title: 'Layout/Search',
  id: 'layout-search',
  component: Search,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => ArticleSearch }) } }
};
