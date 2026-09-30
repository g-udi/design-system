import { Canvas, DocsContext, DocsStory, PureArgsTable, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import { useContext, useEffect, useId, useState } from 'react';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from 'storybook/internal/core-events';

import { HighlightedCode } from './HighlightedCode';
import { InlineCode as CodeValue, InlineText, Table } from './StoryDocs';
import { getComponentDocs } from './componentDocumentation';
export { getComponentDocs } from './componentDocumentation';
import { acceptsPreviewArgs, displayedPreviewArgs, previewArgTypes, referenceFromArgTypes, selectPreviewStory } from './docsContract';

const toSectionId = (title) => title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const Section = ({ children, title }) => (
  <section id={ toSectionId(title) } className='sb-unstyled ds-docs-section scroll-mt-28'>
    <h2>{title}</h2>
    {children}
  </section>
);

const List = ({ items }) => (
  <ul>
    {items.map((item, index) => <li key={ typeof item === 'string' ? item : index }><InlineText>{item}</InlineText></li>)}
  </ul>
);

const AccessibilityTable = ({ docs }) => (
  <p><InlineText>{docs.accessibility}</InlineText></p>
);

const RecoveryGuidance = ({ items }) => <List items={ items } />;

const DecisionRules = ({ rules }) => (
  <ul className='grid gap-2'>
    {rules.map((rule) => (
      <li key={ rule } className='flex gap-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>
        <span aria-hidden='true' className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400' />
        <span><InlineText>{rule}</InlineText></span>
      </li>
    ))}
  </ul>
);

const PropsTable = ({ rows }) => (
  <>
    <dl className='ds-docs-props-list divide-y divide-gray-200 border-y border-gray-200 md:hidden dark:divide-gray-800 dark:border-gray-800'>
      {rows.map(([ name, values, defaultValue, description = '-' ]) => (
        <div key={ name } className='grid gap-1.5 py-3'>
          <dt className='font-semibold text-gray-900 dark:text-gray-100'><CodeValue>{name}</CodeValue></dt>
          <dd className='flex flex-wrap items-baseline gap-2 text-xs text-gray-500 dark:text-gray-400'>
            <span className='font-semibold'>Type</span>
            <CodeValue>{values}</CodeValue>
          </dd>
          <dd className='flex flex-wrap items-baseline gap-2 text-xs text-gray-500 dark:text-gray-400'>
            <span className='font-semibold'>Default</span>
            <CodeValue>{defaultValue}</CodeValue>
          </dd>
          <dd className='text-sm leading-6 text-gray-600 dark:text-gray-300'><InlineText>{description}</InlineText></dd>
        </div>
      ))}
    </dl>
    <div className='hidden md:block'>
      <Table label='Component properties'>
        <thead>
          <tr>
            <th scope='col'>Prop</th>
            <th scope='col'>Type / Values</th>
            <th scope='col'>Default</th>
            <th scope='col'>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([ name, values, defaultValue, description = '-' ]) => (
            <tr key={ name }>
              <td><CodeValue>{name}</CodeValue></td>
              <td><CodeValue>{values}</CodeValue></td>
              <td><CodeValue>{defaultValue}</CodeValue></td>
              <td><InlineText>{description}</InlineText></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </>
);

const hasDistinctOverview = (docs) => Boolean(docs.overview && docs.overview.trim() !== docs.description.trim());

const PreviewControls = ({ of, hasReference, referenceTitle, include }) => {
  const { story } = useOf(of || 'story', ['story']);
  const context = useContext(DocsContext);
  const controlsId = useId();
  const [args, setArgs] = useState(() => ({...context.getStoryContext(story).args}));
  const rows = previewArgTypes(story, include);

  useEffect(() => {
    // Keep externally updated args in sync without retaining a mutable snapshot.
    const syncArgs = ({ storyId, args: nextArgs }) => {
      if (storyId === story.id) setArgs({...nextArgs});
    };
    context.channel.on(STORY_ARGS_UPDATED, syncArgs);
    return () => context.channel.off(STORY_ARGS_UPDATED, syncArgs);
  }, [context.channel, story.id]);

  const updateArgs = (updatedArgs) => {
    setArgs((current) => ({...current, ...updatedArgs}));
    context.channel.emit(UPDATE_STORY_ARGS, {storyId: story.id, updatedArgs});
  };
  const resetArgs = (argNames) => {
    setArgs((current) => argNames
      ? {...current, ...Object.fromEntries(argNames.map((name) => [name, story.initialArgs[name]]))}
      : {...story.initialArgs});
    context.channel.emit(RESET_STORY_ARGS, {storyId: story.id, argNames});
  };

  if (!acceptsPreviewArgs(story) || !Object.keys(rows).length) return null;

  return (
    <div className='ds-docs-preview-controls' data-compact={hasReference || undefined}>
      <h3>Preview controls</h3>
      <p>
        Change these values to update the example above.
        {hasReference ? <> See <a href={`#${toSectionId(referenceTitle)}`}>the full props reference</a> for types, defaults, and descriptions.</> : null}
      </p>
      <div className='ds-docs-controls-table rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
        <PureArgsTable
          compact={hasReference}
          rows={rows}
          args={displayedPreviewArgs(rows, args)}
          globals={context.getStoryContext(story).globals}
          controlsId={controlsId}
          storyId={story.id}
          updateArgs={updateArgs}
          resetArgs={resetArgs}
        />
      </div>
    </div>
  );
};

export const ComponentDocumentation = ({ docs }) => (
  <div className='sb-unstyled ds-docs-page'>
    <div className='ds-docs-title'>
      <h1>{docs.component}</h1>
    </div>
    <p><InlineText>{docs.description}</InlineText></p>

    {hasDistinctOverview(docs) ? <Section title='Overview'>
      <p><InlineText>{docs.overview || docs.description}</InlineText></p>
    </Section> : null}

    {docs.decisionRules.length ? (
      <Section title='Decision Rules'>
        <DecisionRules rules={ docs.decisionRules } />
      </Section>
    ) : null}

    <Section title={ docs.usageTitle || 'Canonical Usage' }>
      <HighlightedCode code={ docs.usage } language={ docs.usageLanguage } />
    </Section>

    {docs.dos.length ? <Section title='When To Use'>
      <List items={ docs.dos } />
    </Section> : null}

    {docs.donts.length ? <Section title='When Not To Use'>
      <List items={ docs.donts } />
    </Section> : null}

    <Section title='Accessibility'>
      <AccessibilityTable docs={ docs } />
    </Section>

    {docs.recovery.length ? (
      <Section title='States & Recovery'>
        <RecoveryGuidance items={ docs.recovery } />
      </Section>
    ) : null}

    {docs.notes?.length ? (
      <Section title='API Notes'>
        <List items={ docs.notes } />
      </Section>
    ) : null}

    {docs.consumerResponsibilities?.length ? (
      <Section title='Consumer Responsibilities'>
        <List items={ docs.consumerResponsibilities } />
      </Section>
    ) : null}

    {docs.props?.length ? (
      <Section title={ docs.propsTitle || 'Props' }>
        <PropsTable rows={ docs.props } />
      </Section>
    ) : null}

  </div>
);

export const CatalogueDocsPage = ({ documentation, options = {} }) => {
    const { stories = true, examples = true, primaryStory, previewControls, overviewStory } = options;
    const context = useContext(DocsContext);
    const allStories = context.componentStories();
    const selected = primaryStory ? context.resolveOf(primaryStory(), ['story']).story : selectPreviewStory(allStories);
    const primary = selected?.moduleExport;
    const overview = overviewStory ? context.resolveOf(overviewStory(), ['story']).story : undefined;
    const authored = documentation || getComponentDocs(selected?.title || allStories[0]?.title || 'Core');
    const exampleStories = allStories.filter(story => story.tags?.includes('autodocs') && !story.usesMount && story.id !== overview?.id && (
      // Preserve Accordion's approved catalogue. Elsewhere, mount each example
      // once so fixed IDs and document-level effects are not duplicated.
      authored.title === 'Core/Accordion' || !stories || story.id !== selected?.id
    ));
    const storyDocs = selected?.parameters.docs || {};
    const previewUsage = storyDocs.source?.type === 'dynamic' && storyDocs.source?.transform
      ? storyDocs.source.transform('', {...context.getStoryContext(selected), args: selected.initialArgs}) : undefined;
    const props = authored.props?.length ? authored.props : referenceFromArgTypes(selected?.argTypes);
    const docs = {
      ...authored,
      props,
      usage: authored.hasAuthoredUsage ? authored.usage : (typeof previewUsage === 'string' && previewUsage) || storyDocs.gaudi?.usage || allStories.find(story => story.parameters.docs?.source?.code?.includes('@gaudi/design-system'))?.parameters.docs.source.code || authored.usage,
      usageLanguage: authored.hasAuthoredUsage ? authored.usageLanguage : storyDocs.source?.language || 'jsx',
      accessibility: storyDocs.gaudi?.accessibility || authored.accessibility
    };
    return (
      <>
        <div className='sb-unstyled ds-docs-page'>
          <div className='ds-docs-title'>
            <div className='ds-docs-title-copy'><Title /></div>
          </div>
          <Subtitle />
          <p><InlineText>{storyDocs.gaudi?.description || docs.description}</InlineText></p>
          {hasDistinctOverview(docs) ? <Section title='Overview'>
            <p><InlineText>{docs.overview || docs.description}</InlineText></p>
          </Section> : null}

          {docs.decisionRules.length ? (
            <Section title='Decision Rules'>
              <DecisionRules rules={ docs.decisionRules } />
            </Section>
          ) : null}

          {stories && primary ? (
            <Section title='Interactive Preview'>
              <Canvas of={ primary } withToolbar story={{ __primary: true }} />
              <PreviewControls
                of={primary}
                include={previewControls}
                hasReference={Boolean(docs.props?.length)}
                referenceTitle={docs.propsTitle || 'Props'}
              />
            </Section>
          ) : null}

          <Section title={ docs.usageTitle || 'Canonical Usage' }>
            <HighlightedCode code={ docs.usage } language={ docs.usageLanguage } />
          </Section>

          {docs.dos.length ? <Section title='When To Use'>
            <List items={ docs.dos } />
          </Section> : null}

          {docs.donts.length ? <Section title='When Not To Use'>
            <List items={ docs.donts } />
          </Section> : null}

          <Section title='Accessibility'>
            <AccessibilityTable docs={ docs } />
          </Section>

          {docs.recovery.length ? (
            <Section title='States & Recovery'>
              <RecoveryGuidance items={ docs.recovery } />
            </Section>
          ) : null}

          {docs.notes?.length ? (
            <Section title='API Notes'>
              <List items={ docs.notes } />
            </Section>
          ) : null}

          {docs.consumerResponsibilities?.length ? (
            <Section title='Consumer Responsibilities'>
              <List items={ docs.consumerResponsibilities } />
            </Section>
          ) : null}

          {docs.props?.length ? (
            <Section title={ docs.propsTitle || 'Props' }>
              <PropsTable rows={ docs.props } />
            </Section>
          ) : null}

          {examples && overview ? (
            <div className='ds-docs-examples' data-docs-overview>
              <DocsStory of={overview.moduleExport} expanded __forceInitialArgs />
            </div>
          ) : null}

          {examples && exampleStories.length ? (
            <section className='ds-docs-examples' aria-label='Patterns and use cases'>
              <h2>Patterns and use cases</h2>
              {exampleStories.map(story => <DocsStory key={story.id} of={story.moduleExport} expanded __forceInitialArgs />)}
            </section>
          ) : null}

        </div>

      </>
    );
};

export const createComponentDocsPage = (docs, options = {}) => {
  const ComponentDocsPage = () => <CatalogueDocsPage documentation={docs} options={options} />;
  ComponentDocsPage.displayName = 'ComponentDocsPage';

  return ComponentDocsPage;
};
