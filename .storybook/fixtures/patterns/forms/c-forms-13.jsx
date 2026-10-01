'use client';
import { Fragment, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../../../../src/components/core/Field/parts/field.jsx';
import { formatBytes, useFileUpload } from '../../../../src/components/core/FileUpload/use-file-upload.js';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '../../../../src/components/core/NumberField/parts/number-field-extended.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { CharacterCount, FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

const collections = ['Books', 'Prints', 'Stationery', 'Bundles', 'Gifts under £20', 'New this month'];
const seed = [3, 7].map((art) => ({ id: `art-${art}`, name: `cover-${art}.svg`, size: 18400 + art * 1200, type: 'image/svg+xml', url: `static/images/art/${art}.svg` }));
const price = (value) => Number(String(value).replace(/[^\d.]/g, ''));
const rules = {
  title: [validators.required('Give the product a title.'), validators.maxLength(70)],
  price: [validators.required('Set a price.'), (value) => (!(price(value) > 0) ? 'Use a price above 0.' : '')],
  compare: (value, values) => (value && price(value) <= price(values.price) ? 'The compare-at price must be higher than the price.' : ''),
  sku: validators.pattern(/^[A-Z0-9-]{3,24}$/, 'Use 3–24 capital letters, numbers or dashes.'),
  collections: validators.required('Add the product to at least one collection.')
};
const labels = { title: 'Title', price: 'Price', compare: 'Compare-at price', sku: 'SKU', collections: 'Collections' };

function Section({ title, description, children }) {
  return (
    <section className='grid gap-4 rounded-lg border p-5'>
      <div className='grid gap-0.5'>
        <h3 className='text-sm font-semibold'>{title}</h3>
        {description ? <p className='text-text-muted text-sm'>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Media() {
  const [{ files, errors, isDragging }, { removeFile, openFileDialog, getInputProps, handleDragEnter, handleDragLeave, handleDragOver, handleDrop }] = useFileUpload({
    multiple: true,
    maxFiles: 6,
    maxSize: 5 * 1024 * 1024,
    accept: 'image/*',
    initialFiles: seed
  });
  return (
    <div className='grid gap-2'>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
        {files.map((entry, index) => (
          <figure key={entry.id} className={cn('group relative overflow-hidden rounded-md border', index === 0 && 'col-span-2 row-span-2')}>
            <img src={entry.preview} alt='' className='aspect-square w-full object-cover' />
            {index === 0 ? <Badge size='xs' variant='secondary' className='absolute start-1.5 top-1.5'>Cover</Badge> : null}
            <figcaption className='sr-only'>
              {entry.file.name}, {formatBytes(entry.file.size)}
            </figcaption>
            <Button type='button' size='icon-xs' variant='solid' tone='neutral' aria-label={`Remove ${entry.file.name}`} onClick={() => removeFile(entry.id)} className='absolute end-1.5 top-1.5'>
              <RegistryIcon lucide='XIcon' aria-hidden='true' />
            </Button>
          </figure>
        ))}
        {files.length < 6 ? (
          <button
            type='button'
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className='text-text-muted hover:bg-surface-muted data-[dragging]:border-accent data-[dragging]:bg-accent-subtle grid aspect-square place-items-center content-center gap-1 rounded-md border border-dashed text-xs'
          >
            <RegistryIcon lucide='ImageIcon' aria-hidden='true' className='size-5' />
            Add images
          </button>
        ) : null}
      </div>
      <input {...getInputProps()} aria-label='Add product images' className='sr-only' />
      <p className='text-text-muted text-xs'>Up to 6 images, 5 MB each. The first is the cover; drop files on the tile to add more.</p>
      {errors.length ? <p role='alert' className='text-danger text-xs'>{errors[0]}</p> : null}
    </div>
  );
}

export function Pattern() {
  const form = useFormValidation({
    initialValues: { title: 'Field notes, hardcover', description: '', status: 'draft', price: '32.00', compare: '', cost: '11.50', sku: 'FN-HC-01', track: true, stock: 140, oversell: false, collections: ['Books'], type: 'physical' },
    rules
  });
  const [saved, setSaved] = useState('');
  const anchor = useComboboxAnchor();
  const { values, errors } = form;
  const margin = price(values.price) > 0 && price(values.cost) >= 0 ? Math.round(((price(values.price) - price(values.cost)) / price(values.price)) * 100) : null;

  return (
    <form noValidate aria-labelledby='product-title' onSubmit={form.handleSubmit((data) => setSaved(data.status === 'active' ? 'Product published.' : 'Draft saved.'))} className='mx-auto grid w-full max-w-5xl gap-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 id='product-title' className='text-lg font-semibold'>New product</h2>
        <div className='flex items-center gap-2'>
          <span role='status' className='text-text-muted text-sm'>{saved}</span>
          <Button type='button' variant='ghost' tone='neutral' onClick={() => form.reset()}>Discard</Button>
          <Button type='submit'>{values.status === 'active' ? 'Publish' : 'Save draft'}</Button>
        </div>
      </div>
      <FormErrorSummary form={form} labels={labels} />
      <div className='grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]'>
        <div className='grid min-w-0 gap-5'>
          <Section title='Details'>
            <FieldGroup className='gap-4'>
              <Field data-invalid={errors.title ? true : undefined}>
                <div className='flex items-baseline justify-between gap-3'>
                  <FieldLabel htmlFor={form.id('title')}>Title</FieldLabel>
                  <CharacterCount id={form.id('title-count')} value={values.title} max={70} />
                </div>
                <Input {...form.field('title', { describedBy: form.id('title-count') })} />
                <FieldError id={form.errorId('title')}>{errors.title}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor={form.id('description')}>Description</FieldLabel>
                <Textarea {...form.field('description')} rows={4} placeholder='What it is, what it is made of, and who it is for.' />
              </Field>
            </FieldGroup>
          </Section>
          <Section title='Media'>
            <Media />
          </Section>
          <Section title='Pricing'>
            <div className='grid gap-4 sm:grid-cols-3'>
              <Field data-invalid={errors.price ? true : undefined}>
                <FieldLabel htmlFor={form.id('price')}>Price</FieldLabel>
                <Input {...form.field('price')} inputMode='decimal' prefix='£' inputClassName='tabular-nums' />
                <FieldError id={form.errorId('price')}>{errors.price}</FieldError>
              </Field>
              <Field data-invalid={errors.compare ? true : undefined}>
                <FieldLabel htmlFor={form.id('compare')}>Compare-at price</FieldLabel>
                <Input {...form.field('compare')} inputMode='decimal' prefix='£' placeholder='0.00' inputClassName='tabular-nums' />
                <FieldError id={form.errorId('compare')}>{errors.compare}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor={form.id('cost')}>Cost per item</FieldLabel>
                <Input {...form.field('cost', { describedBy: form.id('margin') })} inputMode='decimal' prefix='£' inputClassName='tabular-nums' />
                <FieldDescription id={form.id('margin')}>{margin == null ? 'Customers will not see this.' : `${margin}% margin`}</FieldDescription>
              </Field>
            </div>
          </Section>
          <Section title='Inventory'>
            <FieldGroup className='gap-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field data-invalid={errors.sku ? true : undefined}>
                  <FieldLabel htmlFor={form.id('sku')}>SKU</FieldLabel>
                  <Input {...form.field('sku')} onChange={(event) => form.setValue('sku', event.target.value.toUpperCase())} className='font-mono' />
                  <FieldError id={form.errorId('sku')}>{errors.sku}</FieldError>
                </Field>
                <NumberField id={form.id('stock')} value={values.stock} min={0} onValueChange={(stock) => form.setValue('stock', stock ?? 0)} disabled={!values.track}>
                  <FieldLabel htmlFor={form.id('stock')}>In stock</FieldLabel>
                  <NumberFieldGroup>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldGroup>
                </NumberField>
              </div>
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldLabel htmlFor={form.id('track')}>Track quantity</FieldLabel>
                  <FieldDescription>Stock goes down with every order.</FieldDescription>
                </FieldContent>
                <Switch id={form.id('track')} checked={values.track} onCheckedChange={(track) => form.setValue('track', track)} />
              </Field>
              <Field orientation='horizontal'>
                <Checkbox id={form.id('oversell')} checked={values.oversell} disabled={!values.track} onCheckedChange={(on) => form.setValue('oversell', on === true)} />
                <FieldLabel htmlFor={form.id('oversell')} className='font-normal'>Keep selling when out of stock</FieldLabel>
              </Field>
            </FieldGroup>
          </Section>
        </div>
        <div className='grid gap-5 lg:sticky lg:top-4'>
          <Section title='Status'>
            <Select value={values.status} onValueChange={(status) => form.setValue('status', status)}>
              <SelectTrigger aria-label='Status' className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent position='popper'>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='archived'>Archived</SelectItem>
              </SelectContent>
            </Select>
          </Section>
          <Section title='Organisation'>
            <FieldGroup className='gap-4'>
              <Field>
                <FieldLabel htmlFor={form.id('type')}>Product type</FieldLabel>
                <Select value={values.type} onValueChange={(type) => form.setValue('type', type)}>
                  <SelectTrigger id={form.id('type')} className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='physical'>Physical</SelectItem>
                    <SelectItem value='digital'>Digital download</SelectItem>
                    <SelectItem value='service'>Service</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field data-invalid={errors.collections ? true : undefined}>
                <FieldLabel htmlFor={form.id('collections')}>Collections</FieldLabel>
                <Combobox multiple autoHighlight items={collections} value={values.collections} onValueChange={(next) => form.setValue('collections', next)}>
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(selected) => (
                        <Fragment>
                          {selected.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)}
                          <ComboboxChipsInput
                            id={form.id('collections')}
                            placeholder={selected.length ? '' : 'Add collections'}
                            aria-invalid={errors.collections ? true : undefined}
                            aria-describedby={errors.collections ? form.errorId('collections') : undefined}
                          />
                        </Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No collections found.</ComboboxEmpty>
                    <ComboboxList>{(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError id={form.errorId('collections')}>{errors.collections}</FieldError>
              </Field>
            </FieldGroup>
          </Section>
        </div>
      </div>
    </form>
  );
}
