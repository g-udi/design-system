'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Button
      aria-label='Collapse'
      variant='ghost'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? 'Show less' : 'Show more'}
      {isExpanded ? (
        <RegistryIcon lucide='ChevronUpIcon' aria-hidden='true' />
      ) : (
        <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
      )}
    </Button>
  );
}
