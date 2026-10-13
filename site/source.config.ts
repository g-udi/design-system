import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { remarkCode } from '@gaudi/design-system/mdx/remark';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      /** Full-width page without the table of contents (blocks). */
      full: z.boolean().optional(),
      /** Catalogue id of a generated component page. */
      component: z.string().optional()
    })
  }
});

// Code fences render through Gaudi's CodeBlock (`CodeFence` + `remarkCode` fence meta), so the
// Fumadocs build-time highlighter is off.
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    remarkPlugins: [remarkCode]
  }
});
