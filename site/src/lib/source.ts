import { docs } from '../../.source/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource()
});

export type DocsPage = ReturnType<typeof source.getPages>[number];
