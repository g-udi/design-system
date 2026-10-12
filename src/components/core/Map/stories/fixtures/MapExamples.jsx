import { useEffect, useMemo, useRef, useState } from 'react';
import { Map } from '@gaudi/design-system/core/Map';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import Icon from '@gaudi/design-system/core/Icon';
import Pill from '@gaudi/design-system/core/Pill';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { journeys } from './routes.js';

const fleet = [
  { id: 'TRK-208', driver: 'Ethan Brooks', status: 'Delayed', tone: 'warning', pill: 'amber', color: '#b45309', destination: 'Queensboro Plaza', eta: '10:25 AM', remaining: '6.2 km', stops: '2 of 6', badge: '+25m', delayLabel: '25 minutes delayed' },
  { id: 'TRK-104', driver: 'Sofia Chen', status: 'On route', tone: 'accent', pill: 'blue', color: '#2563eb', destination: 'Grand Central', eta: '10:12 AM', remaining: '3.8 km', stops: '4 of 7' },
  { id: 'TRK-312', driver: 'Marcus Reed', status: 'Completed', tone: 'success', pill: 'green', color: '#15803d', destination: 'East Village', eta: 'Arrived', remaining: '0 km', stops: '5 of 5' },
  { id: 'TRK-156', driver: 'Ava Patel', status: 'On route', tone: 'accent', pill: 'blue', color: '#2563eb', destination: 'Astoria', eta: '10:40 AM', remaining: '4.1 km', stops: '1 of 4' }
].map((item, index) => ({ ...item, coordinates: journeys[index][Math.floor(journeys[index].length * .45)], route: journeys[index] }));

const view = { center: [-73.97, 40.751], zoom: 12.3 };

function localStyle(dark) {
  return {
    version: 8,
    sources: {
      city: { type: 'geojson', data: '/static/maps/new-york.geojson', attribution: '<a href="https://data.cityofnewyork.us/">NYC Open Data · DCP / OTI</a>' },
      places: { type: 'geojson', data: { type: 'FeatureCollection', features: [
        ['MANHATTAN', -73.978, 40.772], ['QUEENS', -73.92, 40.755], ['BROOKLYN', -73.95, 40.703], ['East River', -73.967, 40.735]
      ].map(([name, lng, lat]) => ({ type: 'Feature', properties: { name }, geometry: { type: 'Point', coordinates: [lng, lat] } })) } }
    },
    layers: [
      { id: 'water', type: 'background', paint: { 'background-color': dark ? '#19252d' : '#dce7eb' } },
      { id: 'land', type: 'fill', source: 'city', filter: ['==', 'kind', 'land'], paint: { 'fill-color': dark ? '#24282d' : '#f1f1ed' } },
      { id: 'streets', type: 'line', source: 'city', filter: ['==', 'kind', 'road'], paint: { 'line-color': dark ? '#42474d' : '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, .35, 14, 3] } },
      { id: 'main-streets', type: 'line', source: 'city', filter: ['all', ['==', 'kind', 'road'], ['==', 'major', true]], paint: { 'line-color': dark ? '#61615b' : '#d5d0bd', 'line-width': ['interpolate', ['linear'], ['zoom'], 10, .4, 14, 2] } },
      { id: 'street-names', type: 'symbol', source: 'city', minzoom: 13.4, filter: ['==', 'kind', 'road'], layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': ['Arial'], 'text-size': 10, 'symbol-spacing': 250 }, paint: { 'text-color': dark ? '#b2b8bd' : '#59666d', 'text-halo-color': dark ? '#24282d' : '#f1f1ed', 'text-halo-width': 2 } },
      { id: 'place-names', type: 'symbol', source: 'places', layout: { 'text-field': ['get', 'name'], 'text-font': ['Arial'], 'text-size': 12, 'text-letter-spacing': .15 }, paint: { 'text-color': dark ? '#a6b4bc' : '#65747b', 'text-halo-color': dark ? '#24282d' : '#f1f1ed', 'text-halo-width': 2 } }
    ]
  };
}

function useLocalStyle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return useMemo(() => localStyle(dark), [dark]);
}

export function TrackingMap(args) {
  const map = useRef(null);
  const mapStyle = useLocalStyle();
  const [selectedId, setSelectedId] = useState('TRK-208');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All statuses');
  const [zoom, setZoom] = useState(view.zoom);
  const selected = fleet.find(item => item.id === selectedId);
  const visible = fleet.filter(item => (filter === 'All statuses' || item.status === filter) && `${item.id} ${item.driver}`.toLowerCase().includes(search.toLowerCase()));
  const select = id => { setSelectedId(id); };
  return (
    <div className='map-example'>
      <style>{exampleCss}</style>
      <header className='map-example-heading'><div><h2>Fleet overview</h2><p>Vehicles, journeys, and the next stop.</p></div><Pill tone='gray' size='sm'>Sample data</Pill></header>
      <div className='map-tracking-layout'>
        <aside className='map-fleet' aria-label='Active fleet'>
          <div className='map-fleet-header'><strong>Active fleet</strong><span>{fleet.length} vehicles</span></div>
          <Input type='search' aria-label='Search vehicles' placeholder='Search vehicle or driver' value={search} onChange={event => setSearch(event.target.value)} prefix={<Icon name='Search' size='sm' decorative />} />
          <NativeSelect aria-label='Filter vehicles by status' value={filter} onChange={event => setFilter(event.target.value)}>{['All statuses', 'On route', 'Delayed', 'Completed'].map(value => <NativeSelectOption key={value}>{value}</NativeSelectOption>)}</NativeSelect>
          <div className='map-fleet-list'>
            {visible.map(item => <Button key={item.id} type='button' variant='ghost' tone='neutral' className='map-fleet-row' aria-pressed={selectedId === item.id} aria-label={`Select ${item.id}, ${item.driver}`} onClick={() => select(item.id)}><span className='map-fleet-row-title'><strong>{item.id}</strong><Pill tone={item.pill} size='xs'>{item.status}</Pill></span><span>{item.driver}</span><span className='map-fleet-row-meta'>{item.destination}<span>{item.remaining}</span></span></Button>)}
            {!visible.length && <p className='map-empty' role='status'>No vehicles match. Try another name or status.</p>}
          </div>
          <p className='map-fleet-footnote'>Select a vehicle to inspect its journey.</p>
        </aside>
        <div className='map-tracking-main'>
          <div className='map-trip' aria-live='polite' aria-atomic='true'>
            <div className='map-trip-vehicle'><strong>{selected.id}</strong><span>{selected.driver}</span><Pill tone={selected.pill} size='xs'>{selected.status}</Pill></div>
            <dl><div><dt>Next stop</dt><dd>{selected.destination}</dd></div><div><dt>ETA</dt><dd>{selected.eta}</dd></div><div><dt>Remaining</dt><dd>{selected.remaining}</dd></div><div><dt>Stops</dt><dd>{selected.stops}</dd></div></dl>
          </div>
          <Map ref={map} {...args} mapStyle={mapStyle} initialViewState={view} minZoom={10} maxZoom={17}
            markers={fleet.map(item => ({ ...item, label: `${item.id}: ${item.status}, ${item.driver}${item.delayLabel ? `, ${item.delayLabel}` : ''}`, icon: <Icon name='Truck' size='sm' decorative /> }))}
            routes={fleet.map(item => ({ id: item.id, coordinates: item.route, color: item.color, width: selectedId === item.id ? 5 : 2, dashed: item.status === 'Delayed' }))}
            selectedMarkerId={selectedId} onMarkerClick={select} onViewStateChange={next => setZoom(next.zoom)}>
            <div className='map-legend' role='group' aria-label='Route legend'>{[['#2563eb', 'On route'], ['#b45309', 'Delayed'], ['#15803d', 'Completed']].map(([color, name]) => <span key={name}><i style={{ background: color }} />{name}</span>)}</div>
          </Map>
          <footer className='map-tracking-footer'><span>New York City <span aria-hidden='true'>·</span> Zoom <output aria-label='Map zoom'>{zoom.toFixed(1)}</output></span><Button type='button' variant='ghost' size='sm' tone='neutral' onClick={() => map.current?.flyTo({ center: selected.coordinates, zoom: 14 })}><Icon name='LocateFixed' size='sm' decorative /> Locate {selected.id}</Button></footer>
        </div>
      </div>
    </div>
  );
}

export function LocationMap() {
  const mapStyle = useLocalStyle();
  const [selected, setSelected] = useState(null);
  return <div className='map-example'><style>{exampleCss}</style><Map label='Bryant Park meeting point' mapStyle={mapStyle} initialViewState={{ center: [-73.983, 40.7535], zoom: 15 }} selectedMarkerId={selected} onMarkerClick={setSelected} markers={[{ id: 'meeting', coordinates: [-73.983, 40.7535], label: 'Bryant Park meeting point' }]}><div className='map-location-card'><strong>Bryant Park</strong><span>42nd Street & Sixth Avenue, New York</span>{selected && <span role='status'>Meet at the Sixth Avenue entrance.</span>}</div></Map></div>;
}

const unavailableStyle = { version: 8, sources: { missing: { type: 'geojson', data: '/static/maps/unavailable.geojson' } }, layers: [{ id: 'missing', type: 'line', source: 'missing' }] };
export function MapRecovery() {
  const mapStyle = useLocalStyle();
  const [recovered, setRecovered] = useState(false);
  return <div className='map-example'><style>{exampleCss}</style><Map label='Map recovery example' mapStyle={recovered ? mapStyle : unavailableStyle} initialViewState={view} fallback={<Button type='button' variant='outline' tone='neutral' onClick={() => setRecovered(true)}>Use available map</Button>} /></div>;
}

const exampleCss = `
.map-example { width:100%; min-width:0; color:var(--ds-color-text); font-size:13px; }
.map-example-heading { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * .75rem); margin-bottom:1.25rem; }
.map-example-heading h2 { margin:0; font-size:1.5rem; letter-spacing:-.035em; font-weight:650; }
.map-example-heading p { margin:.25rem 0 0; color:var(--ds-color-text-muted); }
.map-tracking-layout { display:grid; grid-template-columns:17rem minmax(0,1fr); gap:calc(var(--ds-space-scale,1) * 1rem); }
.map-fleet { display:flex; flex-direction:column; min-width:0; padding:calc(var(--ds-space-scale,1) * 1rem); gap:calc(var(--ds-space-scale,1) * .75rem); border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-card); }
.map-fleet-header { display:flex; justify-content:space-between; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * .5rem); }
.map-fleet-header > span,.map-fleet-footnote { color:var(--ds-color-text-muted); font-size:12px; }
.map-fleet [data-slot=native-select-wrapper] { width:100%; }
.map-fleet-list { display:flex; flex-direction:column; gap:calc(var(--ds-space-scale,1) * .25rem); }
.map-fleet-row { display:flex; flex-direction:column; align-items:stretch; height:auto; text-align:left; white-space:normal; padding:calc(var(--ds-space-scale,1) * .75rem); gap:calc(var(--ds-space-scale,1) * .25rem); font-size:12px; }
.map-fleet-row[aria-pressed=true] { background:var(--ds-color-accent-subtle); box-shadow:inset 3px 0 var(--ds-color-accent); }
.map-fleet-row-title { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * .5rem); }
.map-fleet-row-title strong { font-size:13px; }
.map-fleet-row-meta { display:flex; flex-wrap:wrap; justify-content:space-between; gap:calc(var(--ds-space-scale,1) * .25rem); color:var(--ds-color-text-muted); }
.map-fleet-footnote { margin:auto 0 0; }
.map-tracking-main { min-width:0; }
.map-trip { display:flex; flex-direction:column; gap:calc(var(--ds-space-scale,1) * .75rem); margin-bottom:1rem; }
.map-trip-vehicle { display:flex; align-items:center; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * .5rem); }
.map-trip-vehicle > span:nth-child(2) { color:var(--ds-color-text-muted); }
.map-trip dl { display:flex; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * 1.25rem); margin:0; }
.map-trip dt { color:var(--ds-color-text-muted); font-size:11px; }
.map-trip dd { margin:.125rem 0 0; font-weight:550; }
.map-tracking-main .ds-map { height:30rem; }
.map-legend { display:flex; flex-wrap:wrap; width:fit-content; gap:calc(var(--ds-space-scale,1) * .75rem); padding:calc(var(--ds-space-scale,1) * .5rem) calc(var(--ds-space-scale,1) * .75rem); border:1px solid var(--ds-color-border); border-radius:var(--ds-radius); background:var(--ds-color-surface); font-size:11px; }
.map-legend span { display:inline-flex; align-items:center; gap:calc(var(--ds-space-scale,1) * .375rem); }
.map-legend i { width:8px; height:8px; border-radius:50%; }
.map-tracking-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:calc(var(--ds-space-scale,1) * .5rem); margin-top:.5rem; color:var(--ds-color-text-muted); font-size:11px; }
.map-location-card { display:flex; flex-direction:column; gap:calc(var(--ds-space-scale,1) * .375rem); padding:calc(var(--ds-space-scale,1) * .75rem); width:fit-content; max-width:100%; background:var(--ds-color-surface); border:1px solid var(--ds-color-border); border-radius:var(--ds-radius); }
.map-location-card span { color:var(--ds-color-text-muted); }
.map-empty { color:var(--ds-color-text-muted); }
@media (max-width:767px) { .map-tracking-layout { grid-template-columns:minmax(0,1fr); } .map-fleet-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); } .map-tracking-main .ds-map { height:27rem; } }
@media (max-width:389px) { .map-fleet-list { grid-template-columns:minmax(0,1fr); } }
`;
