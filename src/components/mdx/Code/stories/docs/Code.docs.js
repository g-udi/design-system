import { p, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  "MDX/Code": {
    ...definition('Article code rendered through the Core CodeBlock: CodeFence maps MDX pre, CodeGroup renders ::: code-group fences as tabs.', [p('CodeFence', 'MDX pre props', '—', 'Reads code, language and the remarkCode data-title, data-highlight, data-line-numbers, data-start-line and data-words attributes.'), p('CodeGroup.children', 'CodeFence elements', '—', 'One tab per fence, titled by data-title or the language.'), p('CodeGroup.label', 'string', 'Code examples', 'Accessible name for the tab list.'), p('remarkCode', 'remark plugin', '—', 'From @gaudi/design-system/mdx/remark; turns fence meta and ::: code-group blocks into what CodeFence and CodeGroup read.')], 'Fences are keyboard-scrollable regions with a labelled copy button; groups are Gaudi Tabs with roving focus and labelled panels.', ['Map pre to CodeFence and CodeGroup to CodeGroup in the MDX components; add remarkCode to the remark plugins.']),
    usage: "```tsx title=\"app/page.tsx\" {2} showLineNumbers\nexport default function Page() {\n  return <main>Article</main>;\n}\n```\n\n::: code-group labels=[pnpm, npm]\n\n```bash\npnpm add @gaudi/design-system\n```\n\n```bash\nnpm install @gaudi/design-system\n```\n\n:::"
  }
};
