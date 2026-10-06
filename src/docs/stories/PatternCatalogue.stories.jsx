import { expect, userEvent, within } from 'storybook/test';
import { useEffect, useId, useMemo, useState } from 'react';
import fallbackIndex from '../catalogue/catalogue.json';
import { catalogueFromIndex, filterCatalogue } from '../components/catalogueModel';
import { Page } from '../components/StoryDocs';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import { NativeSelect } from '../../components/core/Select';
import { ToggleGroupRoot, ToggleGroupItem } from '../../components/core/ToggleGroup';

const PAGE_SIZE = 48;
const storyURL = (id) => `./?path=/${id.endsWith('--docs') ? 'docs' : 'story'}/${id}`;

function Catalogue() {
  const areaId = useId();
  const [index, setIndex] = useState(fallbackIndex);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [mode, setMode] = useState('components');
  const [owner, setOwner] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => {
    const controller = new AbortController();
    fetch('./index.json', {signal:controller.signal}).then(response => {
      if (!response.ok) throw new Error('Index unavailable');
      return response.json();
    }).then(value => { if (value.entries) setIndex(value); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const owners = useMemo(() => catalogueFromIndex(index), [index]);
  const matches = useMemo(() => filterCatalogue(owners, {query, category, owner}), [owners, query, category, owner]);
  const examples = matches.flatMap(item => item.examples.map(example => ({...example, owner:item.name, category:item.category})));
  const items = mode === 'components' ? matches : examples;
  const resetResults = () => setLimit(PAGE_SIZE);
  const showExamples = (key) => { setOwner(key); setMode('examples'); setQuery(''); resetResults(); };

  return (
    <Page compact title='Component Catalogue' intro='Find a component or use case across Gaudi. Open the documentation or explore working examples, from application controls to publishing and MDX.'>
      <div className='gaudi-catalogue-controls'>
        <label>Find a component or use case<Input value={query} onChange={event=>{setQuery(event.target.value);resetResults();}} placeholder='Search avatars, dialogs, forms…' /></label>
        <label htmlFor={areaId}>Area<NativeSelect id={areaId} className='w-full' value={category} onChange={event=>{setCategory(event.target.value);setOwner('');resetResults();}}><option value='all'>All areas</option>{['Core','Blocks','Chat','Charts','Hooks','MDX','Post','Layout'].map(value=><option key={value}>{value}</option>)}</NativeSelect></label>
      </div>
      <div className='gaudi-catalogue-view'>
        <ToggleGroupRoot type='single' variant='outline' aria-label='Catalogue view' value={mode} onValueChange={value => {
          if (!value) return;
          setMode(value);
          if (value === 'components') setOwner('');
          resetResults();
        }}>
          <ToggleGroupItem value='components'>Components</ToggleGroupItem>
          <ToggleGroupItem value='examples'>Examples</ToggleGroupItem>
        </ToggleGroupRoot>
        {owner && <Button variant='ghost' onClick={()=>{setOwner('');resetResults();}}>Clear {owners.find(item=>item.key===owner)?.name} filter</Button>}
        <p role='status'>{items.length} {items.length === 1 ? mode.slice(0,-1) : mode}{items.length > limit ? ` · showing ${limit}` : ''}</p>
      </div>
      {items.length ? <ul className={`gaudi-catalogue-results gaudi-catalogue-results--${mode}`} aria-label={mode==='components'?'Components':'Examples'}>
        {items.slice(0,limit).map(item=> mode==='components' ? (
          <li key={item.key}>
            <div><a target='_top' href={storyURL(item.docs || item.examples[0].id)}>{item.name}</a><span>{item.category}</span></div>
            <Button variant='subtle' size='sm' className='shrink-0' onClick={()=>showExamples(item.key)} aria-label={`Explore ${item.name} examples`}>{item.examples.length} {item.examples.length === 1 ? 'example' : 'examples'}</Button>
          </li>
        ) : (
          <li key={item.id}><div><a target='_top' href={storyURL(item.id)}>{item.name}</a><span>{item.owner} · {item.category}</span></div></li>
        ))}
      </ul> : <p className='gaudi-guide-note'>No matches. Try another search or choose All areas.</p>}
      {items.length > limit && <Button variant='outline' className='self-start' onClick={()=>setLimit(value=>value+PAGE_SIZE)}>Show more {mode}</Button>}
    </Page>
  );
}

export default {
  id: 'overview-component-catalogue',
  title: 'Component Catalogue',
  tags: [ 'dev', '!autodocs' ],
  parameters: { layout: 'fullscreen' }
};
export const Browse = {
  name: 'Component Catalogue',
  render: () => <Catalogue />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByLabelText('Find a component or use case');
    await userEvent.type(search, 'Avatar');
    await expect(canvas.getByRole('link', {name:'Avatar',exact:true})).toHaveAttribute('href','./?path=/docs/core-avatar--docs');
    await userEvent.click(canvas.getByRole('button',{name:'Explore Avatar examples'}));
    await expect(canvas.getByRole('status')).toHaveTextContent('15 examples');
    await userEvent.click(canvas.getByRole('button',{name:'Clear Avatar filter'}));
    await userEvent.type(search,'spreadsheet editing');
    await expect(canvas.getByRole('link',{name:/Spreadsheet editing/})).toHaveAttribute('href','./?path=/story/core-datatable--spreadsheet');
    await userEvent.clear(search);
    await userEvent.click(canvas.getByRole('radio',{name:'Components',exact:true}));
    await userEvent.selectOptions(canvas.getByLabelText('Area'),'MDX');
    await expect(canvas.getByRole('link',{name:'Footnote',exact:true})).toHaveAttribute('href','./?path=/docs/mdx-footnote--docs');
    await userEvent.type(search,'no-matching-component');
    await expect(canvas.getByText('No matches. Try another search or choose All areas.')).toBeVisible();
    await userEvent.clear(search);
    await userEvent.selectOptions(canvas.getByLabelText('Area'),'all');
  }
};
