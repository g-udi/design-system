'use client';

import { Component, useEffect, useId, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '@gaudi/design-system/core/CodeBlock';
import { Label } from '@gaudi/design-system/core/Field';
import Input from '@gaudi/design-system/core/Input';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { Slider } from '@gaudi/design-system/core/Slider';
import Switch from '@gaudi/design-system/core/Switch';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { componentLoaders } from '@/generated/component-loaders';
import type { Control, ControlValue, PlaygroundSpec } from './playground-model';

type Values = Record<string, ControlValue>;

/** Props actually passed to the component, and printed in the code: only what the reader set. */
function effectiveProps(controls: Control[], values: Values) {
  const props: Record<string, string | number | boolean> = {};
  for (const control of controls) {
    const value = values[control.name];
    if (value === undefined || value === '') continue;
    if (control.kind === 'boolean' && value === control.defaultValue) continue;
    if (control.kind === 'number' && !Number.isFinite(value)) continue;
    props[control.name] = value;
  }
  return props;
}

const jsString = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const attribute = (name: string, value: string | number | boolean) => {
  if (value === true) return name;
  if (typeof value === 'string') return /['\n\\]/.test(value) ? `${name}={${jsString(value)}}` : `${name}='${value}'`;
  return `${name}={${value}}`;
};
const childText = (value: string) => (/[{}<>]/.test(value) ? `{${jsString(value)}}` : value);

/** The JSX for the current props, formatted like the design-system sources (single quotes). */
export function toJsx(tag: string, props: Record<string, string | number | boolean>) {
  const { children, ...rest } = props;
  const attrs = Object.entries(rest).map(([name, value]) => attribute(name, value));
  const child = children === undefined ? '' : childText(String(children));
  const open = attrs.length ? `<${tag} ${attrs.join(' ')}` : `<${tag}`;
  const oneLine = child ? `${open}>${child}</${tag}>` : `${open} />`;
  if (oneLine.length <= 72) return oneLine;
  const head = attrs.length ? `<${tag}\n${attrs.map((attr) => `  ${attr}`).join('\n')}\n` : `<${tag}`;
  return child ? `${head}>\n  ${child}\n</${tag}>` : `${head}/>`;
}

class LiveBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <p role='alert' className='rounded-(--ds-radius-card) border border-danger-border bg-danger-subtle p-3 text-sm'>
          This combination failed to render: {this.state.error.message}
        </p>
      );
    }
    return this.props.children;
  }
}

function useLiveComponent(id: string) {
  const [state, setState] = useState<{ id: string; Live?: ComponentType<Record<string, unknown>>; error?: string } | null>(null);
  useEffect(() => {
    let current = true;
    const load = componentLoaders[id];
    if (!load) return undefined;
    // A failed chunk request is retried: in dev every preview frame fetches the same large shared
    // chunk at once, and the browser cache can reject one of the concurrent writes.
    const attempt = (tries: number): Promise<unknown> => load().catch((error: Error) => (
      tries > 0 && current ? new Promise((resolve) => { setTimeout(resolve, 800); }).then(() => attempt(tries - 1)) : Promise.reject(error)
    ));
    attempt(3)
      .then((Live) => { if (current) setState({ id, Live: Live as ComponentType<Record<string, unknown>> }); })
      .catch((error: Error) => { if (current) setState({ id, error: error.message }); });
    return () => { current = false; };
  }, [id]);
  if (!componentLoaders[id]) return { error: 'No loader for this component.' };
  return state?.id === id ? state : null;
}

function ControlField({ control, value, onChange }: { control: Control; value: ControlValue; onChange: (value: ControlValue) => void }) {
  const id = useId();
  const hint = control.defaultValue !== undefined && control.kind !== 'boolean' ? `default ${control.defaultValue}` : null;
  // Native controls get `for`; the segmented group is named by aria-label instead (a div is not labelable).
  const segmented = control.kind === 'enum' && control.segmented;
  const label = (
    <span className='flex min-w-0 items-baseline justify-between gap-2'>
      <Label htmlFor={segmented ? undefined : id} id={`${id}-label`} className='font-mono text-xs font-medium text-text'>{control.name}</Label>
      {hint ? <span className='truncate text-xs text-text-subtle'>{hint}</span> : null}
    </span>
  );

  if (control.kind === 'boolean') {
    return (
      <div className='flex min-h-9 items-center justify-between gap-3'>
        <Label htmlFor={id} className='font-mono text-xs font-medium text-text'>{control.name}</Label>
        <Switch id={id} size='sm' checked={value === undefined ? control.defaultValue : Boolean(value)} onCheckedChange={(checked: boolean) => onChange(checked)} />
      </div>
    );
  }

  if (control.kind === 'enum') {
    const options = control.options.map(String);
    const current = value === undefined ? '' : String(value);
    const pick = (next: string) => onChange(next === '' ? undefined : control.options.find((option) => String(option) === next));
    return (
      <div className='flex min-w-0 flex-col gap-1.5'>
        {label}
        {segmented ? (
          <ToggleGroup
            id={id}
            type='single'
            size='sm'
            label={control.name}
            value={current}
            onValueChange={pick}
            options={options.map((option) => ({ value: option, label: option }))}
          />
        ) : (
          <NativeSelect id={id} size='sm' className='w-full' value={current} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => pick(event.target.value)}>
            <NativeSelectOption value=''>{control.defaultValue !== undefined ? `Default (${control.defaultValue})` : 'Not set'}</NativeSelectOption>
            {options.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}
          </NativeSelect>
        )}
      </div>
    );
  }

  if (control.kind === 'number' && control.range) {
    const [min, max, step] = control.range;
    const current = typeof value === 'number' ? value : control.defaultValue ?? min;
    return (
      <div className='flex min-w-0 flex-col gap-1.5'>
        <span className='flex items-baseline justify-between gap-2'>
          <Label id={`${id}-label`} className='font-mono text-xs font-medium text-text'>{control.name}</Label>
          <output htmlFor={id} className='text-xs tabular-nums text-text-muted'>{value === undefined ? 'not set' : current}</output>
        </span>
        <Slider id={id} aria-labelledby={`${id}-label`} min={min} max={max} step={step} value={[current]} onValueChange={(next: number[]) => onChange(next[0])} className='py-2' />
      </div>
    );
  }

  return (
    <div className='flex min-w-0 flex-col gap-1.5'>
      {label}
      <Input
        id={id}
        type={control.kind === 'number' ? 'number' : 'text'}
        value={value === undefined ? '' : String(value)}
        placeholder={control.defaultValue !== undefined ? String(control.defaultValue) : undefined}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const raw = event.target.value;
          if (control.kind === 'number') onChange(raw === '' ? undefined : Number(raw));
          else onChange(raw === '' ? undefined : raw);
        }}
      />
    </div>
  );
}

/** A live preview whose controls are generated from the component's props metadata. */
export function Playground({ spec, title }: { spec: PlaygroundSpec; title: string }) {
  const [values, setValues] = useState<Values>(spec.initial);
  const loaded = useLiveComponent(spec.id);
  const props = useMemo(() => effectiveProps(spec.controls, values), [spec.controls, values]);
  const jsx = toJsx(spec.tag, props);
  const code = `${spec.importLine}\n\n${jsx}`;
  // Remount on every change so uncontrolled props (defaultChecked…) and the error boundary follow the controls.
  const key = JSON.stringify(props);
  const { children, ...rest } = props;
  const Live = loaded && 'Live' in loaded ? loaded.Live : undefined;

  return (
    <div className='not-prose my-4 overflow-hidden rounded-(--ds-radius-card) border border-border bg-background' data-testid='playground' data-playground={spec.id}>
      <div className='site-preview-stage flex min-h-40 items-center justify-center overflow-x-auto p-6 sm:p-10' data-testid='playground-stage' aria-live='polite'>
        <div className='flex min-w-0 max-w-full justify-center' data-ready={Live ? 'true' : undefined}>
          {loaded?.error ? (
            <p role='alert' className='text-sm text-danger'>The live preview failed to load: {loaded.error}</p>
          ) : Live ? (
            <LiveBoundary key={key}>
              <Live {...rest}>{children === undefined ? undefined : String(children)}</Live>
            </LiveBoundary>
          ) : (
            <div className='h-10 w-32 animate-pulse rounded-(--ds-radius-control) bg-surface' role='status' aria-label={`Loading ${title}`} />
          )}
        </div>
      </div>
      <fieldset className='border-t border-border p-3 sm:p-4'>
        <legend className='sr-only'>{title} props</legend>
        <div className='mb-3 flex items-center justify-between gap-2'>
          <span className='text-sm font-medium'>Props</span>
          <Button variant='ghost' tone='neutral' size='sm' onClick={() => setValues(spec.initial)}>Reset</Button>
        </div>
        <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
          {spec.controls.map((control) => (
            <ControlField
              key={control.name}
              control={control}
              value={values[control.name]}
              onChange={(value) => setValues((previous) => ({ ...previous, [control.name]: value }))}
            />
          ))}
        </div>
      </fieldset>
      <div className='border-t border-border p-3'>
        <CodeBlock code={code} language='jsx'>
          <CodeBlockHeader>
            <CodeBlockTitle>{`${spec.tag}.jsx`}</CodeBlockTitle>
            <CodeBlockCopyButton className='ms-auto' />
          </CodeBlockHeader>
        </CodeBlock>
      </div>
    </div>
  );
}
