import data from '@/generated/catalogue.json';

/** `subcomponent`, `passthrough` and `api` mark rows that document something other than a plain prop. */
export interface Prop { name: string; names?: string[]; part?: string; subcomponent?: boolean; passthrough?: boolean; api?: boolean; type: string; default: string | null; required: boolean; description: string }
export interface Returned { name: string; type: string; description: string }
export interface ComponentEntry {
  id: string;
  name: string;
  kind: string;
  category: string;
  section: string;
  group: string | null;
  url: string;
  owner: string;
  import: { path: string; category?: string; leaf?: string; root?: boolean; mainExport?: string; exports: string[] };
  description: string;
  summary: string | null;
  props: Prop[];
  propsTitle: string | null;
  returns: Returned[] | null;
  variants: Record<string, string[]>;
  accessibility: string | null;
  notes: string[];
  usage: string | null;
  stories: { name: string; id: string }[];
  patterns: string[];
  storybook: string | null;
  source: string;
  docs: string;
  related: string[];
}
export interface PatternEntry {
  name: string;
  title: string;
  description: string | null;
  owner: string;
  block: boolean;
  storyId: string;
  sourceFile: string;
  uses: string[];
  dependencies: string[];
  assets: string[];
}
export interface Category { key: string; label: string; description: string; count: number; section: string; sectionTitle: string }

export const catalogue = data as unknown as {
  package: string;
  version: string;
  generatedAt: string;
  categories: Category[];
  components: ComponentEntry[];
  patterns: Record<string, PatternEntry>;
  presets: string[];
  install: { github: string; npm: string; note: string };
  tokens: Record<string, unknown> & {
    colors: { usage: string; semanticUtilities: string[] };
    spacing: { variable: string; usage: string; scales: Record<string, number> };
    radius: { variable: string; default: string; usage: string };
    typography: { fontFamily: Record<string, string[]>; lineHeight: Record<string, string> };
    motion: { duration: Record<string, string>; ease: Record<string, string> };
  };
};

const byId = new Map(catalogue.components.map((entry) => [entry.id, entry]));
export const getComponent = (id: string) => byId.get(id);
export const getPattern = (name: string) => catalogue.patterns[name];
export const componentsInSection = (section: string) => catalogue.components.filter((entry) => entry.section === section);
