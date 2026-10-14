import Link from 'next/link';
import { CodeBlock, CodeBlockCopyButton, CodeBlockGroup, codeChromeClassName } from '@gaudi/design-system/core/CodeBlock';
import sources from '@/generated/sources.json';
import { catalogue, componentsInSection, getComponent, getPattern, type ComponentEntry } from '@/lib/catalogue';
import { siteConfig, storybookStoryUrl } from '../../../site.config';
import { ExampleView } from './ExampleView';
import { Playground as PlaygroundView } from './Playground';
import { buildPlayground } from './playground-model';
import { PropsList } from './PropsList';

const sourceOf = (name: string) => (sources as Record<string, string>)[name] || '';
const registryInstall = (name: string) => `npx shadcn@latest add ${siteConfig.registryUrl.replace(/\/$/, '')}/r/${name}.json`;

function Badge({ children }: { children: React.ReactNode }) {
  return <span className='inline-flex items-center rounded-(--ds-radius-pill) border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-muted'>{children}</span>;
}

export function ComponentHeader({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry) return null;
  const category = catalogue.categories.find((item) => item.key === entry.category);
  return (
    <div className='not-prose my-4 flex flex-wrap items-center gap-2' data-testid='component-header'>
      <Badge>{category?.label}</Badge>
      {entry.group && entry.group !== category?.label ? <Badge>{entry.group}</Badge> : null}
      <code className='rounded-(--ds-radius-sm) bg-surface-muted px-2 py-0.5 text-xs'>{entry.import.leaf || entry.import.path}</code>
    </div>
  );
}

export function ComponentLinks({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry) return null;
  return (
    <div className='not-prose my-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm' data-testid='component-links'>
      {entry.storybook ? <a className='inline-flex min-h-11 items-center text-accent underline underline-offset-2' href={storybookStoryUrl(entry.storybook)} target='_blank' rel='noreferrer'>View in Storybook</a> : null}
      <a className='inline-flex min-h-11 items-center text-accent underline underline-offset-2' href={`${siteConfig.github}/tree/main/${entry.source}`} target='_blank' rel='noreferrer'>Source</a>
    </div>
  );
}

const pm = (command: (tool: string) => string) => ['pnpm', 'npm', 'yarn', 'bun'].map((tool) => ({ title: tool, language: 'bash', code: command(tool), defaultWrap: true }));
const addCommand = (tool: string, spec: string) => ({ pnpm: `pnpm add ${spec}`, npm: `npm install ${spec}`, yarn: `yarn add ${spec}`, bun: `bun add ${spec}` })[tool];

const importLine = (entry: ComponentEntry) => {
  const from = entry.import.leaf || entry.import.path;
  const name = entry.import.mainExport || entry.name;
  if (entry.import.exports.includes(name)) return `import { ${name} } from '${from}';`;
  if (entry.import.exports.includes('default')) return `import ${name.replace(/[^A-Za-z0-9_$]/g, '')} from '${from}';`;
  return `import { ${entry.import.exports[0]} } from '${from}';`;
};

export function Install({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry) return null;
  const peers = entry.category === 'charts' ? ' recharts' : entry.id === 'core-flow' ? ' @xyflow/react' : '';
  const first = entry.patterns[0];
  return (
    <div className='not-prose my-4 flex min-w-0 flex-col gap-6' data-testid='installation'>
      <CodeBlockGroup label='Install with' items={pm((tool) => addCommand(tool, `${siteConfig.installSpec}${peers}`) || '')} />
      <div className='flex min-w-0 flex-col gap-3'>
        <p className='m-0 text-base leading-relaxed text-text-muted'>
          Import from <code>{siteConfig.packageName}</code>. Load <code>@gaudi/design-system/global.css</code> once and add <code>transpilePackages: [&apos;@gaudi/design-system&apos;]</code> in Next.js.
        </p>
        <CodeBlock code={importLine(entry)} language='jsx' defaultWrap className={codeChromeClassName}>
          <CodeBlockCopyButton />
        </CodeBlock>
      </div>
      {first ? (
        <div className='flex min-w-0 flex-col gap-3'>
          <p className='m-0 text-base leading-relaxed text-text-muted'>Copy an example into your project with the shadcn CLI:</p>
          <CodeBlock code={registryInstall(first)} language='bash' defaultWrap className={codeChromeClassName}>
            <CodeBlockCopyButton />
          </CodeBlock>
        </div>
      ) : null}
    </div>
  );
}

export function Usage({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry?.usage) return null;
  return (
    <CodeBlock code={entry.usage} language='jsx' className='not-prose my-4'>
      <CodeBlockCopyButton />
    </CodeBlock>
  );
}

export function Example({ name }: { name: string }) {
  const pattern = getPattern(name);
  if (!pattern) return null;
  return (
    <ExampleView
      name={name}
      title={pattern.title}
      source={sourceOf(name)}
      block={pattern.block}
      expandable={pattern.owner === 'blocks/AppShell'}
      storybookUrl={storybookStoryUrl(pattern.storyId)}
      install={registryInstall(name)}
      file={`${name}.jsx`}
    />
  );
}

export function PropsTable({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry) return null;
  const returns = entry.returns?.length ? <PropsList rows={entry.returns} label='return value' testId='returns-table' /> : null;
  // Hooks without options list a placeholder "(none)" row in the metadata.
  const props = entry.props.filter((row) => row.name !== '(none)');
  if (!props.length) return returns;
  return (
    <>
      <PropsList rows={props} label={entry.kind === 'hook' ? 'option' : 'prop'} testId='props-table' />
      {returns}
    </>
  );
}

/** Live prop controls for owners listed in playground.config.json; renders nothing for the rest. */
export function Playground({ id }: { id: string }) {
  const entry = getComponent(id);
  const spec = entry ? buildPlayground(entry, importLine(entry)) : null;
  if (!entry || !spec?.controls.length) return null;
  return <PlaygroundView spec={spec} title={entry.name} />;
}

function ComponentCard({ entry }: { entry: ComponentEntry }) {
  return (
    <Link href={entry.url} className='site-card' data-plain>
      <span className='font-medium'>{entry.name}</span>
      <span className='line-clamp-2 text-sm text-text-muted'>{entry.summary || entry.description}</span>
      {entry.patterns.length ? <span className='mt-auto pt-1 text-xs text-text-subtle'>{entry.patterns.length} example{entry.patterns.length === 1 ? '' : 's'}</span> : null}
    </Link>
  );
}

export function Related({ id }: { id: string }) {
  const entry = getComponent(id);
  if (!entry?.related.length) return null;
  return (
    <div className='not-prose my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {entry.related.map((relatedId) => {
        const related = getComponent(relatedId);
        return related ? <ComponentCard key={relatedId} entry={related} /> : null;
      })}
    </div>
  );
}

export function SectionIndex({ section }: { section: string }) {
  const entries = componentsInSection(section);
  const groups = Object.entries(Object.groupBy(entries, (entry) => entry.group || 'All'));
  const examples = entries.reduce((sum, entry) => sum + entry.patterns.length, 0);
  return (
    <div className='not-prose'>
      <p className='mb-6 text-sm text-text-muted'>{entries.length} pages · {examples} live examples, generated from the design system metadata.</p>
      {groups.map(([group, list]) => (
        <section key={group} className='mb-8'>
          {groups.length > 1 ? <h2 className='mb-3 text-base font-semibold' id={group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>{group}</h2> : null}
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            {(list || []).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => <ComponentCard key={entry.id} entry={entry} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
