'use client';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useId,
  useState
} from 'react';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
const StepperContext = createContext(void 0);
const StepItemContext = createContext(void 0);
function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used within a Stepper');
  return ctx;
}
function useStepItem() {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error('useStepItem must be used within a StepperItem');
  return ctx;
}
function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  indicators = {},
  ...props
}) {
  const [activeStep, setActiveStep] = useState(defaultValue);
  const instanceId = useId();
  const [triggerNodes, setTriggerNodes] = useState([]);
  const registerTrigger = useCallback((node) => {
    if (!node) return () => {};
    setTriggerNodes((previous) =>
      previous.includes(node) ? previous : [...previous, node]
    );
    return () =>
      setTriggerNodes((previous) => previous.filter((item) => item !== node));
  }, []);
  const handleSetActiveStep = useCallback(
    (step) => {
      if (value === void 0) {
        setActiveStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );
  const currentStep = value ?? activeStep;
  const focusTrigger = useCallback(
    (idx, direction = 1) => {
      if (!triggerNodes.length) return;
      for (let offset = 0; offset < triggerNodes.length; offset += 1) {
        const target =
          triggerNodes[
            (idx + direction * offset + triggerNodes.length * 2) %
              triggerNodes.length
          ];
        if (target && !target.disabled) {
          target.focus();
          return;
        }
      }
    },
    [triggerNodes]
  );
  const focusNext = useCallback(
    (index) => focusTrigger(index + 1),
    [focusTrigger]
  );
  const focusPrev = useCallback(
    (index) => focusTrigger(index - 1, -1),
    [focusTrigger]
  );
  const focusFirst = useCallback(() => focusTrigger(0), [focusTrigger]);
  const focusLast = useCallback(
    () => focusTrigger(triggerNodes.length - 1, -1),
    [focusTrigger, triggerNodes.length]
  );
  const contextValue = useMemo(
    () => ({
      activeStep: currentStep,
      instanceId,
      setActiveStep: handleSetActiveStep,
      stepsCount: Children.toArray(children).filter(
        (child) =>
          isValidElement(child) && child.type.displayName === 'StepperItem'
      ).length,
      orientation,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      triggerNodes,
      indicators
    }),
    [
      currentStep,
      instanceId,
      indicators,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      handleSetActiveStep,
      children,
      orientation,
      registerTrigger,
      triggerNodes
    ]
  );
  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role='group'
        aria-label={props['aria-label'] || 'Progress'}
        data-slot='stepper'
        className={cn('w-full', className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}
function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) {
  const { activeStep } = useStepper();
  const state =
    completed || step < activeStep
      ? 'completed'
      : activeStep === step
        ? 'active'
        : 'inactive';
  const isLoading = loading && step === activeStep;
  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot='stepper-item'
        className={cn(
          'group/step flex items-center justify-center not-last:flex-1 group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col',
          className
        )}
        data-state={state}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}
function StepperTrigger({
  asChild = false,
  className,
  children,
  tabIndex,
  ...props
}) {
  const { state, isLoading } = useStepItem();
  const stepperCtx = useStepper();
  const {
    setActiveStep,
    activeStep,
    registerTrigger,
    triggerNodes,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast
  } = stepperCtx;
  const { step, isDisabled } = useStepItem();
  const isSelected = activeStep === step;
  const id = `${stepperCtx.instanceId}-step-${step}`;
  const btnRef = useRef(null);
  useEffect(() => registerTrigger(btnRef.current), [registerTrigger]);
  const myIdx = triggerNodes.findIndex((node) => node === btnRef.current);
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if (myIdx !== -1 && focusNext) focusNext(myIdx);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if (myIdx !== -1 && focusPrev) focusPrev(myIdx);
        break;
      case 'Home':
        e.preventDefault();
        if (focusFirst) focusFirst();
        break;
      case 'End':
        e.preventDefault();
        if (focusLast) focusLast();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setActiveStep(step);
        break;
    }
  };
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      ref={btnRef}
      role='button'
      type='button'
      aria-label={props['aria-label'] || `Step ${step}`}
      id={id}
      aria-current={isSelected ? 'step' : undefined}
      tabIndex={typeof tabIndex === 'number' ? tabIndex : isSelected ? 0 : -1}
      data-slot='stepper-trigger'
      data-state={state}
      data-loading={isLoading}
      className={cn(
        'focus-visible:border-ui-ring focus-visible:ring-ui-ring/50 inline-flex cursor-pointer items-center outline-none focus-visible:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60',
        'gap-2.5 rounded-full',
        className
      )}
      onClick={() => setActiveStep(step)}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </Comp>
  );
}
function StepperIndicator({ children, className }) {
  const { state, isLoading } = useStepItem();
  const { indicators } = useStepper();
  return (
    <div
      data-slot='stepper-indicator'
      data-state={state}
      className={cn(
        'border-ui-background bg-ui-accent text-ui-accent-foreground data-[state=completed]:bg-ui-primary data-[state=completed]:text-ui-primary-foreground data-[state=active]:bg-ui-primary data-[state=active]:text-ui-primary-foreground relative flex size-6 shrink-0 items-center justify-center overflow-hidden',
        'rounded-full text-xs',
        className
      )}
    >
      <div className='absolute'>
        {indicators &&
        ((isLoading && indicators.loading) ||
          (state === 'completed' && indicators.completed) ||
          (state === 'active' && indicators.active) ||
          (state === 'inactive' && indicators.inactive))
          ? (isLoading && indicators.loading) ||
            (state === 'completed' && indicators.completed) ||
            (state === 'active' && indicators.active) ||
            (state === 'inactive' && indicators.inactive)
          : children}
      </div>
    </div>
  );
}
function StepperSeparator({ className }) {
  const { state } = useStepItem();
  return (
    <div
      data-slot='stepper-separator'
      data-state={state}
      className={cn(
        'bg-ui-muted rounded-sm m-0.5 group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1 group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5',
        className
      )}
    />
  );
}
function StepperTitle({ children, className }) {
  const { state } = useStepItem();
  return (
    <h3
      data-slot='stepper-title'
      data-state={state}
      className={cn('text-sm leading-none font-medium', className)}
    >
      {children}
    </h3>
  );
}
function StepperDescription({ children, className }) {
  const { state } = useStepItem();
  return (
    <div
      data-slot='stepper-description'
      data-state={state}
      className={cn('text-ui-muted-foreground text-sm', className)}
    >
      {children}
    </div>
  );
}
function StepperNav({ children, className }) {
  const { activeStep, orientation } = useStepper();
  return (
    <nav
      data-slot='stepper-nav'
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        'group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
        className
      )}
    >
      {children}
    </nav>
  );
}
function StepperPanel({ children, className }) {
  const { activeStep } = useStepper();
  return (
    <div
      data-slot='stepper-panel'
      data-state={activeStep}
      className={cn('w-full', className)}
    >
      {children}
    </div>
  );
}
function StepperContent({ value, forceMount, children, className }) {
  const { activeStep, instanceId } = useStepper();
  const isActive = value === activeStep;
  if (!forceMount && !isActive) {
    return null;
  }
  return (
    <div
      data-slot='stepper-content'
      id={`${instanceId}-content-${value}`}
      role='region'
      aria-label={`Step ${value}`}
      data-state={activeStep}
      className={cn('w-full', className, !isActive && forceMount && 'hidden')}
      hidden={!isActive && forceMount}
    >
      {children}
    </div>
  );
}
export {
  useStepper,
  useStepItem,
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperPanel,
  StepperContent,
  StepperNav
};
