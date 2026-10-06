export default {
  "Layout/Search": {
    "description": "Controlled article filter with a clear action that returns focus to the search field.",
    "accessibility": "Supply a meaningful label and the result region ID. Filtering belongs to the host; clearing the query preserves keyboard focus.",
    "props": [["label", "string", "Filter articles", "Accessible label and placeholder."], ["value", "string", "—", "Controlled query from the host."], ["setSearchValue", "(query: string) => void", "—", "Notifies the host for typing and clearing."], ["resultsId", "string", "—", "ID referenced by aria-controls."]],
    "usage": "import Search from '@gaudi/design-system/layout/Search';\n\n<>\n<Search label='Filter articles' value={query} setSearchValue={setQuery} resultsId='article-results' />\n<div id='article-results'>{filteredArticles}</div>\n</>"
  }
};
