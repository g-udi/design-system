'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from './use-controllable-state.js';
import { clampStep } from './step-model.js';

/**
 * The current step of a wizard, onboarding flow or multi-page form. Steps are zero-based. Works
 * controlled (`step` + `onStepChange`) or uncontrolled (`defaultStep`). `canGoNext` and
 * `canGoPrevious` drive button state, and `goTo` clamps out-of-range requests.
 */
export function useStep({ count, step: stepProp, defaultStep = 0, onStepChange } = {}) {
  const [ rawStep, setRawStep ] = useControllableState({ value: stepProp, defaultValue: defaultStep, onChange: onStepChange });
  const step = clampStep(rawStep, count);
  const goTo = useCallback(
    (next) => setRawStep((current) => {
      const from = clampStep(current, count);
      return clampStep(typeof next === 'function' ? next(from) : next, count);
    }),
    [ count, setRawStep ]
  );
  const next = useCallback(() => goTo((current) => current + 1), [ goTo ]);
  const previous = useCallback(() => goTo((current) => current - 1), [ goTo ]);
  const reset = useCallback(() => goTo(defaultStep), [ defaultStep, goTo ]);

  return useMemo(() => ({
    step,
    count,
    isFirst: step === 0,
    isLast: step >= count - 1,
    canGoPrevious: step > 0,
    canGoNext: step < count - 1,
    goTo,
    next,
    previous,
    reset
  }), [ count, goTo, next, previous, reset, step ]);
}
