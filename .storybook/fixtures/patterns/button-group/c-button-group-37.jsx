'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [zoom, setZoom] = useState(100);
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10));
  };
  return (
    <ButtonGroup>
      <Button
        variant='outline'
        size='icon'
        aria-label='Zoom out'
        onClick={handleZoomOut}
      >
        <RegistryIcon lucide='MinusIcon' aria-hidden='true' />
      </Button>
      <ButtonGroupText className='w-16 justify-center'>{zoom}%</ButtonGroupText>
      <Button
        variant='outline'
        size='icon'
        aria-label='Zoom in'
        onClick={handleZoomIn}
      >
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      </Button>
    </ButtonGroup>
  );
}
