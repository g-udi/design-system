# Story conventions

Every component page follows the Accordion structure
(`src/components/core/Accordion/Accordion.stories.jsx` and `ReuiAccordion.stories.jsx`).
Each use case is shown exactly once, in a tight layout.

## Files per component

| File | Holds |
| --- | --- |
| `<Name>.stories.jsx` | Meta, `Playground`, and API or behaviour stories |
| `Reui<Family>.stories.jsx` | One pattern per use case, built from `.storybook/fixtures/reui/<family>/c-<family>-<n>.jsx` |

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

## Catalogue file

```jsx
const pattern = reuiPatterns('family', import.meta.glob('…/family/*.jsx', { eager: true }),
  import.meta.glob('…/family/*.jsx', { eager: true, query: '?raw', import: 'default' }));

export default { title: 'Core/Name', tags: ['autodocs'], ...catalogueMeta('family') };

export const ReuiFamily1 = { name: 'Short use-case name', ...pattern(1) };
export const ReuiFamily2 = { name: 'Another use case', ...pattern(2, 'Only when it adds more than the name.'), play };
```

- Keep `name` literal and export names stable: `coverage.json` and `catalogue.json` track story IDs.
- Fixtures export `Pattern`, import from `src/` paths that `publicSource` can rewrite, cap their own width
  (`mx-auto w-full max-w-lg` for compact components), and never import relative assets. Put assets in
  `.storybook/public`.

After changing stories, run `pnpm catalogue:sync`, `pnpm test:contracts`,
`node scripts/verify-reui-sources.mjs`, and `pnpm test-storybook <path>`.
