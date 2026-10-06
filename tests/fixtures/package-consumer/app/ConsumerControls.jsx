'use client';

import { useState } from 'react';
import { Button, Dialog, SiteConfigProvider, useDisclosure } from '@gaudi/design-system';
import LatexText from '@gaudi/design-system/mdx/LatexText';
import Mermaid from '@gaudi/design-system/mdx/Mermaid';
import { Map } from '@gaudi/design-system/core/Map';

const mapStyle = { version: 8, sources: {}, layers: [{ id: 'base', type: 'background', paint: { 'background-color': '#dce7eb' } }] };

export default function ConsumerControls({ serverContent, mathMarkup }) {
  const [count, setCount] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const disclosure = useDisclosure();
  return (
    <SiteConfigProvider>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <Button onClick={() => setCount((value) => value + 1)}>Count: {count}</Button>
        <Dialog
          title='Package dialog'
          description='A hydrated control with a server-supplied slot.'
          trigger={<Button>Open package dialog</Button>}
          open={disclosure.open}
          onOpenChange={disclosure.setOpen}
        >
          {serverContent}
          <Button onClick={disclosure.onClose}>Done</Button>
        </Dialog>
      </div>
      <section aria-label='Sanitized article content'>
        <p><LatexText>{mathMarkup}</LatexText></p>
        <p><LatexText>{'<a href="jav&#97;script:alert(1)">Blocked article link</a><span style="width:2em;background-image:url(javascript:alert(1))" onclick="alert(1)">Safe article label</span>'}</LatexText></p>
        <Mermaid chart={'flowchart LR\n  start[Start] --> done[Done]'} description='Packed article diagram' />
      </section>
      <Button onClick={() => setShowMap(true)}>Show geographic map</Button>
      {showMap && <Map label='Packed geographic map' mapStyle={mapStyle} markers={[{ id: 'origin', coordinates: [0, 0], label: 'Packed location' }]} selectedMarkerId={selectedMarker} onMarkerClick={setSelectedMarker} onError={error => console.error('Packed Map:', error)} />}
    </SiteConfigProvider>
  );
}
