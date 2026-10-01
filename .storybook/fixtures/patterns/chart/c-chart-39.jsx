'use client';
import { useState } from 'react';
import { TreemapChart } from '../../../../src/components/mdx/Chart/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

// Media library storage in megabytes, by folder and file type.
const storage = [
  { name: 'Images', children: [{ name: 'Covers', value: 1840 }, { name: 'Diagrams', value: 920 }, { name: 'Photos', value: 2610 }, { name: 'Icons', value: 140 }] },
  { name: 'Video', children: [{ name: 'Talks', value: 3920 }, { name: 'Demos', value: 1480 }] },
  { name: 'Audio', children: [{ name: 'Podcast', value: 1210 }, { name: 'Narration', value: 460 }] },
  { name: 'Documents', children: [{ name: 'PDFs', value: 380 }, { name: 'Slides', value: 640 }, { name: 'Datasets', value: 1090 }] }
];

export function Pattern() {
  const [colorBy, setColorBy] = useState('group');
  return (
    <TreemapChart
      ariaLabel='Media storage by folder and file type'
      title='Storage'
      description='Media library usage; larger tiles take more space.'
      toolbar={
        <ToggleGroup aria-label='Colour by' type='single' variant='outline' size='sm' spacing={0} value={colorBy} onValueChange={(next) => next && setColorBy(next)}>
          <ToggleGroupItem value='group'>Folder</ToggleGroupItem>
          <ToggleGroupItem value='value'>Size</ToggleGroupItem>
        </ToggleGroup>
      }
      data={storage}
      colorBy={colorBy}
      formatValue={(megabytes) => (megabytes >= 1000 ? `${(megabytes / 1000).toFixed(1)} GB` : `${megabytes} MB`)}
      valueLabel='Size'
      height={340}
      className='my-0 w-full max-w-3xl'
    />
  );
}
