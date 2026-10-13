import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "Blocks/Blog/PostHeader": {
    ...definition('Article title, metadata, timestamps and supporting header controls.', [p('frontMatter / siteMetadata', 'object', '{}', 'Article id, title, category and tags as { id, label, href }, prepared seriesPosts, and site locale. String category/tag labels remain unlinked.'), p('titleLevel', 'number', '1', 'Article heading level.'), p('titleVariant', 'keyof typographyVariants', 'post-title', 'Shared Typography style for the title, independent of titleLevel. Blog page and article titles use title-md; featured articles use heading-md.'), p('subtitleVariant', 'keyof typographyVariants', 'post-subtitle', 'Shared Typography style for the subtitle. Blog compositions use paragraph-md.'), p('tocControl', 'ReactNode', '—', 'Optional table-of-contents control.'), p('classNames', 'Record<string, string>', '{}', 'Header slot classes.'), className], 'Preserve one clear article heading and machine-readable dates.'),
    usage: "import { PostHeader } from '@gaudi/design-system';\n\n<PostHeader frontMatter={frontMatter} siteMetadata={siteMetadata} tocControl={tocControl} />"
  }
};
