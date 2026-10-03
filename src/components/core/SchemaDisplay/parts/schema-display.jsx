'use client';
import { useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Badge } from '../../Pill/parts/badge-extended.jsx';
import { CodeBlock } from '../../CodeBlock/parts/code-block-extended.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../Accordion/parts/collapsible.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/*
 * Schema display on Gaudi badges, disclosures and CodeBlock. It reads plain JSON Schema (type, properties, required, items, enum, format,
 * description, oneOf/anyOf) and an endpoint's method, path and parameters; it never fetches or validates.
 */

const methodVariants = { GET: 'success-light', POST: 'info-light', PUT: 'warning-light', PATCH: 'attention-light', DELETE: 'destructive-light' };

/** The HTTP method as a coloured badge: GET, POST, PUT, PATCH or DELETE (others read as outline). */
function SchemaDisplayMethod({ method, className }) {
  const verb = String(method || '').toUpperCase();
  return (
    <Badge data-slot='schema-display-method' variant={methodVariants[verb] || 'outline'} size='lg' className={cn('font-mono tracking-wide', className)}>
      {verb}
    </Badge>
  );
}

// Long paths wrap after a slash before they break inside a segment.
const withBreaks = (text, key) => text.split(/(?<=\/)/).flatMap((segment, index) => (index ? [<wbr key={`${key}-${index}`} />, segment] : [segment]));

/** The endpoint path with its parameters, `{id}` or `:id`, highlighted. */
function SchemaDisplayPath({ path = '', className }) {
  const parts = String(path).split(/(\{[^}]+\}|:[A-Za-z_]\w*)/g).filter(Boolean);
  return (
    <code data-slot='schema-display-path' className={cn('text-text min-w-0 font-mono text-sm break-words', className)}>
      {parts.map((part, index) => (/^(\{|:)/.test(part) ? (
        <span key={index} data-param='' className='bg-accent-subtle text-accent rounded-sm px-0.5'>{part}</span>
      ) : withBreaks(part, index)))}
    </code>
  );
}

const typeOf = (schema) => {
  if (!schema || typeof schema !== 'object') return 'any';
  if (schema.type === 'array' || (!schema.type && schema.items)) return `${typeOf(schema.items)}[]`;
  if (Array.isArray(schema.type)) return schema.type.join(' | ');
  if (schema.type) return schema.type;
  if (schema.properties) return 'object';
  if (schema.oneOf || schema.anyOf) return (schema.oneOf || schema.anyOf).map(typeOf).join(' | ');
  if (schema.enum) return typeof schema.enum[0];
  return 'any';
};

// The object whose properties a row opens to: the schema itself, or the items of an array of objects.
const nestedOf = (schema) => {
  if (schema?.properties) return schema;
  if (schema?.items?.properties) return schema.items;
  return null;
};

const defaultLabels = {
  parameters: 'Parameters',
  request: 'Request body',
  response: 'Response',
  schema: 'Schema',
  required: 'required',
  oneOf: 'One of',
  view: 'Schema view',
  json: 'JSON'
};

function PropertyRow({ name, schema = {}, required, location, depth, defaultExpandDepth, labels }) {
  const nested = nestedOf(schema);
  const [open, setOpen] = useState(depth < defaultExpandDepth);
  const summary = (
    <span className='flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1'>
      <code className='text-text font-mono text-xs font-medium break-all'>{name}</code>
      <Badge variant='outline' size='sm' className='font-mono font-normal'>{typeOf(schema)}</Badge>
      {location ? <Badge variant='secondary' size='sm' className='font-normal'>{location}</Badge> : null}
      {schema.format ? <span className='text-text-subtle text-xs'>{schema.format}</span> : null}
      {required ? <span className='text-danger text-xs font-medium'>{labels.required}</span> : null}
    </span>
  );
  const details = (
    <>
      {schema.description ? <p className='text-text-muted m-0 text-xs leading-relaxed'>{schema.description}</p> : null}
      {schema.enum ? (
        <p className='text-text-muted m-0 flex flex-wrap items-center gap-1 text-xs'>
          {`${labels.oneOf}:`}
          {schema.enum.map((value) => <code key={String(value)} className='bg-surface-muted rounded-sm px-1 font-mono'>{JSON.stringify(value)}</code>)}
        </p>
      ) : null}
    </>
  );
  if (!nested) {
    return (
      <li data-slot='schema-display-property' className='grid gap-1 ps-5'>
        {summary}
        {details}
      </li>
    );
  }
  return (
    <li data-slot='schema-display-property' className='grid gap-1'>
      <Collapsible open={open} onOpenChange={setOpen} className='grid gap-1'>
        <CollapsibleTrigger className='hover:bg-surface-muted focus-visible:ring-accent -mx-1 flex w-[calc(100%+0.5rem)] min-w-0 items-start gap-1 rounded-(--ds-radius-control) px-1 py-0.5 text-start focus-visible:ring-2 focus-visible:outline-none'>
          <RegistryIcon lucide='ChevronRight' className={cn('text-text-muted mt-0.5 size-4 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-90')} />
          {summary}
        </CollapsibleTrigger>
        <div className='grid gap-1 ps-5'>{details}</div>
        <CollapsibleContent>
          <SchemaDisplayProperties schema={nested} depth={depth + 1} defaultExpandDepth={defaultExpandDepth} labels={labels} className='mt-1 ms-2' />
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

/**
 * A JSON Schema object as a property tree: names, types, formats, required markers, descriptions and
 * enums. Nested objects and arrays of objects open and close; `defaultExpandDepth` levels start open.
 */
function SchemaDisplayProperties({ schema, depth = 0, defaultExpandDepth = 1, labels: labelOverrides, className }) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const target = nestedOf(schema) || schema;
  const required = new Set(target?.required || []);
  const entries = Object.entries(target?.properties || {});
  if (!entries.length) {
    return <p className={cn('text-text-muted m-0 text-xs', className)}><Badge variant='outline' size='sm' className='font-mono font-normal'>{typeOf(schema)}</Badge>{schema?.description ? ` ${schema.description}` : null}</p>;
  }
  return (
    <ul data-slot='schema-display-properties' className={cn('m-0 grid list-none gap-2 p-0', depth > 0 && 'border-border border-s ps-3', className)}>
      {entries.map(([name, value]) => (
        <PropertyRow key={name} name={name} schema={value} required={required.has(name)} depth={depth} defaultExpandDepth={defaultExpandDepth} labels={labels} />
      ))}
    </ul>
  );
}

function Section({ title, level, children }) {
  const Heading = `h${Math.min(6, Math.max(2, level))}`;
  return (
    <section className='grid gap-2 px-3 py-3'>
      <Heading className='text-text-muted m-0 text-xs font-medium tracking-wide uppercase'>{title}</Heading>
      {children}
    </section>
  );
}

/**
 * An API endpoint or a JSON Schema, read as a reference card. Pass `method` and `path` (with
 * `parameters`, `requestBody` and `responseBody` schemas) for an endpoint, or `schema` alone. `showJson`
 * adds a toggle to the raw definition in CodeBlock; `headingLevel` fits the section titles to the page.
 */
function SchemaDisplay({ method, path, title, description, parameters = [], requestBody, responseBody, schema, defaultExpandDepth = 1, showJson = false, headingLevel = 3, labels: labelOverrides, className }) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const [view, setView] = useState('schema');
  const raw = { method, path, parameters: parameters.length ? parameters : undefined, requestBody, responseBody, schema };
  return (
    <div data-slot='schema-display' className={cn('ds-part-schema-display bg-surface grid min-w-0 rounded-(--ds-radius-card) border text-sm', className)}>
      <div className='grid gap-1.5 border-b px-3 py-2.5'>
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          {method ? <SchemaDisplayMethod method={method} /> : null}
          {path ? <SchemaDisplayPath path={path} className='flex-1 basis-40' /> : null}
          {title ? <span className='min-w-0 flex-1 basis-40 font-medium'>{title}</span> : null}
          {showJson ? (
            <div className='ms-auto flex gap-0.5' role='group' aria-label={labels.view}>
              {['schema', 'json'].map((option) => (
                <Button key={option} size='xs' variant='ghost' aria-pressed={view === option} className='aria-pressed:bg-surface-muted h-5 px-1.5' onClick={() => setView(option)}>
                  {option === 'schema' ? labels.schema : labels.json}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {description ? <p className='text-text-muted m-0 text-xs leading-relaxed'>{description}</p> : null}
      </div>
      {view === 'json' ? (
        <div className='p-3'>
          <CodeBlock code={JSON.stringify(raw, null, 2)} language='json' maxLines={18} />
        </div>
      ) : (
        <div className='divide-border grid divide-y'>
          {parameters.length ? (
            <Section title={labels.parameters} level={headingLevel}>
              <ul className='m-0 grid list-none gap-2 p-0'>
                {parameters.map((parameter) => (
                  <PropertyRow
                    key={`${parameter.in}-${parameter.name}`}
                    name={parameter.name}
                    schema={{ description: parameter.description, ...parameter.schema, ...(parameter.type ? { type: parameter.type } : null) }}
                    required={parameter.required || parameter.in === 'path'}
                    location={parameter.in}
                    depth={0}
                    defaultExpandDepth={defaultExpandDepth}
                    labels={labels}
                  />
                ))}
              </ul>
            </Section>
          ) : null}
          {requestBody ? <Section title={labels.request} level={headingLevel}><SchemaDisplayProperties schema={requestBody} defaultExpandDepth={defaultExpandDepth} labels={labels} /></Section> : null}
          {responseBody ? <Section title={labels.response} level={headingLevel}><SchemaDisplayProperties schema={responseBody} defaultExpandDepth={defaultExpandDepth} labels={labels} /></Section> : null}
          {schema ? <Section title={labels.schema} level={headingLevel}><SchemaDisplayProperties schema={schema} defaultExpandDepth={defaultExpandDepth} labels={labels} /></Section> : null}
        </div>
      )}
    </div>
  );
}

export { SchemaDisplay, SchemaDisplayMethod, SchemaDisplayPath, SchemaDisplayProperties };
