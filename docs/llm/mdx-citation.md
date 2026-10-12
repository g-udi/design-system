# Citation

> MDX/Citation · mdx · `@gaudi/design-system/mdx/CitationPopover`

Citation documents the blog citation authoring flow and the Gaudi runtime components that hydrate generated citation links.

Use citations in three places. Authors put BibTeX files in the blog, list those files in post frontmatter, and cite keys directly in prose with Pandoc-style brackets. The blog MDX pipeline runs rehypeSimpleCitations, which converts those text markers into numbered anchors plus a generated References section. Gaudi does not parse BibTeX or rewrite MDX; it only provides the runtime CitationPopover and CitationTracker behavior for the generated markup.

## Import

```js
import Citation from '@gaudi/design-system/mdx/CitationPopover';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Authoring Example

```jsx
---
title: 'An Introduction to Knowledge Graphs'
bibliography: ['meta/bibliography/references.bib', 'meta/bibliography/kg.bib']
---

A heterogeneous graph [@HusseinYC18; @WangJSWYCY19; @YangXJWHW20] assigns types to nodes and edges.

The same source can be cited again later [@HusseinYC18].

<!-- Do not hand-write citation anchors, popover data attributes, or references markup. -->
```

## Accessibility

Generated citation links are real anchors with readable labels. Popovers open on hover or focus, grouped references remain individually reachable, and CitationTracker keeps bibliography back-links pointed at the most recent citation instance.

## Notes

- The authoring API is markdown citation syntax, not a React component API.
- `rehypeSimpleCitations` is the blog rehype plugin. It loads BibTeX through `citation-js`, assigns first-use numbers, supports grouped citations, emits citation anchors, and appends the References list.
- `CitationPopover` binds to generated anchors marked with `data-citation-popover` and reads the generated citation keys, numbers, and reference text from data attributes.
- `CitationTracker` updates bibliography back-links so a reference points back to the most recent citation instance the reader used.

## Do

- Add BibTeX files to `data/meta/bibliography` in the blog repo.
- List the BibTeX files in post frontmatter with `bibliography: ['meta/bibliography/references.bib', 'meta/bibliography/kg.bib']`.
- Cite one source with `[@HusseinYC18]` and grouped sources with `[@HusseinYC18; @WangJSWYCY19; @YangXJWHW20]`.
- Let `rehypeSimpleCitations` generate numbered anchors, popover data attributes, and the References section.
- Use `CitationPopover` and `CitationTracker` only as runtime hydration for the generated citation markup.

## Don’t

- Do not hand-write `<sup>`, `citation-link` classes, `data-citation-*` attributes, or References markup in MDX.
- Do not import `CitationPopover` or `CitationTracker` inside individual MDX posts.
- Do not use `CitationPopover` as a manual popover for arbitrary text; it expects generated citation anchors.

## Consumer responsibilities

- Keep BibTeX source files in the blog, usually under `data/meta/bibliography`. They do not belong in the design-system package.
- Register `rehypeSimpleCitations` in the blog MDX/content pipeline so citation text is transformed before React renders the article.
- Mount `CitationTracker` once in the app layout and mount `CitationPopover` near the rendered article content.
- Keep citation keys in MDX prose exactly matched to the BibTeX ids in the bibliography files.

## Examples

- Playground (Storybook `mdx-citation--playground`)

## Related

`mdx-citationtracker`
