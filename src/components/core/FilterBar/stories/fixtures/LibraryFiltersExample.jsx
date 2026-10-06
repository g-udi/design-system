import { useState } from 'react';
import FilterBar from '@gaudi/design-system/core/FilterBar';

export const libraryFacets = [
  {
    id: 'collection',
    label: 'Collection',
    multiple: true,
    options: [
      { value: 'reading', label: 'Reading list', count: 42 },
      { value: 'research', label: 'Research notes on knowledge graphs and semantic search for personal libraries', count: 18 },
      { value: 'recipes', label: 'Recipes', count: 7 }
    ]
  },
  {
    id: 'tag',
    label: 'Tag',
    multiple: true,
    options: [
      'Accessibility', 'Architecture decision records and long-form engineering write-ups', 'Design systems', 'Editorial',
      'Interaction design', 'Knowledge management', 'Typography', 'Writing'
    ].map((label, index) => ({ value: label.toLowerCase(), label, count: 30 - index * 3 }))
  },
  { id: 'type', label: 'Type', options: ['Article', 'Video', 'Note', 'Image', 'Document'].map((label) => ({ value: label, label })) },
  { id: 'source', label: 'Source', options: ['Saved by hand', 'Imported from a browser export', 'Suggested'].map((label) => ({ value: label, label })) },
  { id: 'state', label: 'Reading state', options: ['Unread', 'In progress', 'Finished'].map((label) => ({ value: label, label })) },
  { id: 'year', label: 'Year saved', options: ['2026', '2025', '2024', 'Earlier'].map((label) => ({ value: label, label })) }
];

export function LibraryFilters() {
    const [query, setQuery] = useState('');
    const [state, setState] = useState({ collection: [], tag: ['design systems'], type: '', source: '', state: '', year: '' });
    const facets = libraryFacets.map((facet) => ({
      ...facet,
      value: state[facet.id],
      onChange: (value) => setState((current) => ({ ...current, [facet.id]: value }))
    }));
    return <FilterBar query={query} onQueryChange={setQuery} searchLabel='Search library' facets={facets} labels={{ facet: 'Filter by' }} />;
}
