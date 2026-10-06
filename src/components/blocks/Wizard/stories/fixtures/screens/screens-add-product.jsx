'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as Field, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { default as Wizard } from '@gaudi/design-system/blocks/Wizard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';

const steps = [
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Media' },
  { id: 'options', label: 'Options' },
  { id: 'variants', label: 'Variants' },
  { id: 'review', label: 'Review' }
];
const artwork = [0, 3, 5, 7, 9, 11];
const optionValues = { Size: ['XS', 'S', 'M', 'L', 'XL'], Colour: ['Ink', 'Sand', 'Moss', 'Rust'] };
// Every combination of the chosen values becomes one SKU row.
const combine = (options) =>
  Object.entries(options)
    .filter(([, values]) => values.length)
    .reduce((rows, [name, values]) => rows.flatMap((row) => values.map((value) => ({ ...row, [name]: value }))), [{}]);
const skuOf = (slug, combo) => [slug, ...Object.values(combo)].join('-').toUpperCase();

export function Pattern() {
  const [details, setDetails] = useState({ name: 'Field jacket', category: 'Outerwear', description: 'Waxed cotton with a corduroy collar.', price: '189' });
  const [media, setMedia] = useState(['0', '5']);
  const [options, setOptions] = useState({ Size: ['S', 'M', 'L'], Colour: ['Ink', 'Moss'] });
  const [stock, setStock] = useState({});
  const [checked, setChecked] = useState(false);
  const slug = details.name.trim().split(/\s+/).map((word) => word.slice(0, 3)).join('') || 'SKU';
  const variants = combine(options);
  const valid = [Boolean(details.name.trim() && Number(details.price) > 0), media.length > 0, Object.values(options).some((values) => values.length), true, true];
  return (
    <div className='w-full max-w-4xl rounded-xl border p-5'>
      <Wizard
        title='Add a product'
        steps={steps}
        validateStep={(index) => {
          if (!valid[index]) setChecked(true);
          return valid[index];
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
        completeLabel='Publish product'
        completionTitle={`${details.name} is live`}
        completionDescription={`${variants.length} variants are on sale in the store.`}
      >
        {(step) =>
          step === 0 ? (
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field>
                <FieldLabel>Product name</FieldLabel>
                <Input value={details.name} invalid={checked && !details.name.trim()} onChange={(event) => setDetails({ ...details, name: event.target.value })} />
                <FieldError>{checked && !details.name.trim() ? 'Name the product.' : null}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor='product-category'>Category</FieldLabel>
                <NativeSelect id='product-category' value={details.category} onChange={(event) => setDetails({ ...details, category: event.target.value })} className='w-full'>
                  {['Outerwear', 'Knitwear', 'Accessories'].map((category) => <NativeSelectOption key={category} value={category}>{category}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
              <Field className='sm:col-span-2'>
                <FieldLabel>Description</FieldLabel>
                <Textarea rows={3} value={details.description} onChange={(event) => setDetails({ ...details, description: event.target.value })} />
              </Field>
              <Field>
                <FieldLabel>Base price (€)</FieldLabel>
                <NumberField min={1} value={(details.price) === '' || !Number.isFinite(Number(details.price)) ? null : Number(details.price)} onValueChange={(value) => setDetails({ ...details, price: (value ?? '') })}>
                  <NumberFieldGroup>
                    <NumberFieldInput invalid={checked && !(Number(details.price) > 0)} />
                  </NumberFieldGroup>
                </NumberField>
                <FieldError>{checked && !(Number(details.price) > 0) ? 'Set a price above zero.' : null}</FieldError>
              </Field>
            </div>
          ) : step === 1 ? (
            <div className='grid gap-3'>
              <p id='media-label' className='text-sm font-medium'>Pick the product images <span className='text-text-muted font-normal'>· the first is the cover</span></p>
              <ToggleGroup aria-labelledby='media-label' type='multiple' variant='outline' spacing={2} value={media} onValueChange={setMedia} className='grid! grid-cols-3 sm:grid-cols-6'>
                {artwork.map((index) => (
                  <ToggleGroupItem key={index} value={String(index)} aria-label={`Image ${index + 1}`} className='h-auto! p-1 data-[state=on]:ring-2 data-[state=on]:ring-accent'>
                    <img src={`static/images/art/${index}.svg`} alt='' className='aspect-square w-full rounded-sm object-cover' />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {checked && !media.length ? <p role='alert' className='text-danger text-sm'>Choose at least one image.</p> : null}
            </div>
          ) : step === 2 ? (
            <div className='grid gap-4'>
              {Object.entries(optionValues).map(([name, values]) => (
                <div key={name} className='grid gap-2'>
                  <span id={`option-${name}`} className='text-sm font-medium'>{name}</span>
                  <ToggleGroup aria-labelledby={`option-${name}`} type='multiple' variant='outline' size='sm' spacing={0} value={options[name]} onValueChange={(next) => setOptions({ ...options, [name]: next })}>
                    {values.map((value) => <ToggleGroupItem key={value} value={value}>{value}</ToggleGroupItem>)}
                  </ToggleGroup>
                </div>
              ))}
              <p className='text-text-muted text-sm' aria-live='polite'>{variants.length} variants from {Object.values(options).flat().length} values.</p>
              {checked && !valid[2] ? <p role='alert' className='text-danger text-sm'>Pick at least one size or colour.</p> : null}
            </div>
          ) : step === 3 ? (
            <div className='grid gap-3'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <p className='text-text-muted text-sm'>Prices start at €{details.price}. Leave stock empty to track it later.</p>
                <Button size='sm' variant='outline' onClick={() => setStock(Object.fromEntries(variants.map((combo) => [skuOf(slug, combo), '25'])))}>
                  <RegistryIcon lucide='LayersIcon' />
                  Set all to 25
                </Button>
              </div>
              <Table containerProps={{ role: 'region', 'aria-label': 'Variants', tabIndex: 0, className: 'max-h-72 overflow-auto rounded-lg border' }} className='min-w-[30rem]'>
                <TableCaption className='sr-only'>Variants</TableCaption>
                <TableHeader className='sticky top-0'>
                  <TableRow>
                    <TableHead scope='col' className='text-left'>Variant</TableHead>
                    <TableHead scope='col' className='text-left'>SKU</TableHead>
                    <TableHead scope='col' className='w-28 text-left'>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((combo) => {
                    const sku = skuOf(slug, combo);
                    const label = Object.values(combo).join(' / ');
                    return (
                      <TableRow key={sku}>
                        <TableCell as='th' scope='row' className='text-left font-normal'>{label}</TableCell>
                        <TableCell className='font-mono text-xs'>{sku}</TableCell>
                        <TableCell>
                          <NumberField min={0} value={(stock[sku] ?? '') === '' || !Number.isFinite(Number(stock[sku] ?? '')) ? null : Number(stock[sku] ?? '')} onValueChange={(value) => setStock({ ...stock, [sku]: (value ?? '') })}>
                            <NumberFieldGroup>
                              <NumberFieldInput aria-label={`Stock for ${label}`} />
                            </NumberFieldGroup>
                          </NumberField>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='grid gap-4 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]'>
              <img src={`static/images/art/${media[0]}.svg`} alt='' className='aspect-square w-32 rounded-md border object-cover' />
              <div className='grid content-start gap-2'>
                <p className='text-base font-semibold'>{details.name} <span className='text-text-muted font-normal'>· €{details.price}</span></p>
                <p className='text-text-muted'>{details.description}</p>
                <div className='flex flex-wrap gap-1.5'>
                  <Badge size='sm' variant='secondary'>{details.category}</Badge>
                  <Badge size='sm' variant='info-light'>{variants.length} variants</Badge>
                  <Badge size='sm' variant='success-light'>{Object.values(stock).reduce((sum, value) => sum + (Number(value) || 0), 0)} in stock</Badge>
                  <Badge size='sm' variant='secondary'>{media.length} images</Badge>
                </div>
              </div>
            </div>
          )
        }
      </Wizard>
    </div>
  );
}
