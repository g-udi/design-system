import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Blocks/Blog/PostSeriesBox": {
    ...definition('List the articles in a series and identify the current entry.', [p('series', 'Article metadata[]', '—', 'Prepared { id, title, href, series, order? } entries in reading order. No routes or completion state are inferred.'), p('currentId', 'string | number', '—', 'Current article stable ID, including zero. Position in the supplied series drives the progress display.'), p('classNames', 'Record<string, string>', '{}', 'Slot classes.'), className], 'Identify the current article and use descriptive links for other entries.'),
    usage: "import { PostSeriesBox } from '@gaudi/design-system';\n\n<PostSeriesBox series={seriesPosts} currentId='components' />"
  }
};
