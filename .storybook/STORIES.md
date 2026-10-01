# Story conventions

Every component page follows the Accordion structure
(`src/components/core/Accordion/Accordion.stories.jsx` and `AccordionPatterns.stories.jsx`).
Each use case is shown exactly once, in a tight layout.

## Files per component

| File | Holds |
| --- | --- |
| `<Name>.stories.jsx` | Meta, `Playground`, and API or behaviour stories |
| `<Family>Patterns.stories.jsx` | One pattern per use case, built from `.storybook/fixtures/patterns/<family>/c-<family>-<n>.jsx` |

Both files share the same literal `title`. The docs page renders the Interactive Preview (`Playground` with
controls), the authored guidance from `componentDocumentation.js`, then **Examples**: native stories in
declaration order, then each catalogue in declaration order.

## Native file

```jsx
const docs = getComponentDocs('Core/Name');

export default {
  title: 'Core/Name',                 // literal: the indexer reads it statically
  component: Name,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { size: ['sm', 'md'], disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]   // when examples should be width-capped
};

export const Playground = {
  args: { size: 'md', disabled: false, onChange: fn() },
  parameters: { docs: { source: playgroundSource('Name', { imports: "import { Name } from '@gaudi/design-system';" }) } },
  render: (args) => <Name {...args} />,
  play: async ({ args, canvasElement }) => { /* core behaviour */ }
};
```

- `Playground` is the richest example on the page, not a bare instance. Show a realistic composition that
  mixes options at once: several items, variants, or states side by side, with real content (icons, media,
  metadata, actions). See `Core/Attachment`: an upload queue with a settled photo, a failed file, and a
  file driven by the controls.
- Every control must visibly change the preview. If a prop only sets an attribute or class the styling
  barely uses, render what that value means (the media, status text, and actions for `state`) or drop the
  control. Pick defaults that show the component at its most expressive.
- `Playground` comes first, renders from `args`, and its scalar args become the preview controls.
  Controls use `docsArgTypes`, so descriptions, types, and defaults come from the authored props reference.
  Grouped rows (`min / max / step`) and part rows (`ResizableHandle.withHandle`) resolve per prop.
- `playgroundSource` serializes scalar args. Pass `attributes: ['open={open}', 'trigger={<Button>Open</Button>}']`
  for state wiring and slots, and `before`/`after` for surrounding setup. String `children` print as JSX children.
- Other native stories cover only API or behaviour that no pattern shows: controlled state, multiple mode,
  states, keyboard, RTL, legacy APIs. Give each a one-sentence `docs.description.story`. Add a `play` test
  whenever the story is interactive.
- Hoist shared sample data into one constant and add small helpers for repeated queries. Don't copy literals
  between stories or add hand-written `source.code` that duplicates the render.
- The docs canvas owns spacing. Don't wrap stories in `p-6` or other padding. `ExampleFrame` only caps and
  centres width.
- Don't add galleries or overview stories that repeat catalogue patterns.
- Don't add dark-only stories. Every story renders in both themes through the toolbar's Theme switch (and `VITE_GAUDI_THEME=dark` in tests).

## Catalogue file

```jsx
const pattern = patternStories('family', import.meta.glob('…/family/*.jsx', { eager: true }),
  import.meta.glob('…/family/*.jsx', { eager: true, query: '?raw', import: 'default' }));

export default { title: 'Core/Name', tags: ['autodocs'], ...catalogueMeta('family') };

export const FamilyPattern1 = { name: 'Short use-case name', ...pattern(1) };
export const FamilyPattern2 = { name: 'Another use case', ...pattern(2, 'Only when it adds more than the name.'), play };
```

- One example per use case, never one per prop. Variants that differ only by size, tone, variant, shape,
  radius, border, density, placement or orientation belong in one example: a tight gallery with small labels, or one
  rich composition with in-example toggles (see `data-grid/c-data-grid-1.jsx`, which switches every layout flag on
  one grid). Keep distinct workflows (async, validation, controlled state, keyboard, composition) separate.
- In a gallery grid, examples in one row match in height. An example that is taller (a description, an error,
  a larger size, a multi-line control) takes its own full row (`sm:col-span-2`), and the grid uses
  `sm:grid-flow-dense` so the remaining examples pair up.
- Keep `name` literal and export names stable: `coverage.json` and `catalogue.json` track story IDs. When examples
  merge, keep the base example's export and delete the others with their fixtures and coverage entries.
- Fixtures export `Pattern`, import from `src/` paths that `publicSource` can rewrite, cap their own width
  (`mx-auto w-full max-w-lg` for compact components), and never import relative assets. Put assets in
  `.storybook/public`.

After changing stories, run `pnpm catalogue:sync`, `pnpm test:contracts`,
`node scripts/verify-pattern-sources.mjs`, and `pnpm test-storybook <path>`. Then check the rendered
layout with the audit modes: `VITE_GAUDI_VISUAL=1` (content spilling out of its container, or a
bordered container far wider than its content), `VITE_GAUDI_AUDIT=1` (page overflow at 20 widths),
and `VITE_GAUDI_THEME=dark` (accessibility in the dark theme). With Storybook running,
`pnpm audit:controls` changes every Playground control and fails if any leaves the preview unchanged;
controls visible only while interacting declare `parameters.controlAudit.interaction`. A deliberately full-width container
declares `parameters.visualAudit.wide = 'reason'`. The audits are evidence, not a substitute for
looking: screenshot what you changed.
