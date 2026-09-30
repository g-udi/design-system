'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const stances = [
  {
    id: 'buy',
    label: 'Buy',
    icon: <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
  },
  {
    id: 'hold',
    label: 'Hold',
    icon: <RegistryIcon lucide='MinusIcon' aria-hidden='true' />
  },
  {
    id: 'sell',
    label: 'Sell',
    icon: <RegistryIcon lucide='TrendingDownIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState(null);
  return (
    <ButtonGroup>
      {stances.map((stance) => (
        <Button
          key={stance.id}
          variant={active === stance.id ? 'default' : 'outline'}
          onClick={() => setActive(active === stance.id ? null : stance.id)}
        >
          {stance.icon}
          {stance.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
