'use client';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useId,
  useState
} from 'react';
import { Slot } from 'radix-ui';
import { getNextIndex } from '../../../hooks/a11y/use-arrow-key-nav.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { cn } from '../../../utilities/cn/index.js';
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
  const [currentStep, handleSetActiveStep] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const instanceId = useId();
  const [triggers, setTriggers] = useState([]);
  const registerTrigger = useCallback((node, step, disabled) => {
    if (!node) return () => {};
    setTriggers((previous) =>
      [...previous.filter((trigger) => trigger.node !== node), { node, step, disabled }]
    );
    return () =>
      setTriggers((previous) => previous.filter((trigger) => trigger.node !== node));
  }, []);
  const available = triggers.filter((trigger) => !trigger.disabled)
    .sort((a, b) => a.node.compareDocumentPosition(b.node) & 2 ? 1 : -1);
  const tabStop = available.find((trigger) => trigger.step === currentStep)?.step ?? available[0]?.step;
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
      triggerNodes: triggers.map((trigger) => trigger.node),
      tabStop,
      indicators
    }),
    [
      currentStep,
      instanceId,
      indicators,
      handleSetActiveStep,
      children,
      orientation,
      registerTrigger,
      triggers,
      tabStop
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
  asChild = false,
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
  const Item = asChild ? Slot.Root : 'div';
  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <Item
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
      </Item>
    </StepItemContext.Provider>
  );
}
function StepperTrigger({
  asChild = false,
  className,
  children,
  tabIndex,
  onClick,
  onKeyDown,
  ...props
}) {
  const { state, isLoading } = useStepItem();
  const stepperCtx = useStepper();
  const {
    setActiveStep,
    activeStep,
    registerTrigger,
    triggerNodes,
    tabStop,
    orientation
  } = stepperCtx;
  const { step, isDisabled } = useStepItem();
  const isSelected = activeStep === step;
  const id = `${stepperCtx.instanceId}-step-${step}`;
  const btnRef = useRef(null);
  useIsomorphicLayoutEffect(() => registerTrigger(btnRef.current, step, isDisabled), [registerTrigger, step, isDisabled]);
  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    setActiveStep(step);
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (isDisabled || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent?.isComposing) return;
    // Sort by DOM order so conditional/reordered steps still navigate as displayed.
    const available = triggerNodes.filter((node) => !node.disabled && node.getAttribute('aria-disabled') !== 'true')
      .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1);
    const next = getNextIndex(available.indexOf(btnRef.current), event.key, {
      count: available.length,
      orientation,
      dir: getComputedStyle(event.currentTarget).direction,
      wrap: true
    });
    if (next !== null) {
      event.preventDefault();
      available[next]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
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
      tabIndex={isDisabled ? -1 : typeof tabIndex === 'number' ? tabIndex : (tabStop ?? activeStep) === step ? 0 : -1}
      data-slot='stepper-trigger'
      data-state={state}
      data-loading={isLoading}
      className={cn(
        'focus-visible:border-ui-ring focus-visible:ring-ui-primary inline-flex cursor-pointer items-center outline-none focus-visible:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60',
        'gap-2.5 rounded-full',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
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
        {(isLoading && indicators?.loading) || indicators?.[state] || children}
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
function StepperTitle({ asChild = false, children, className }) {
  const { state } = useStepItem();
  const Title = asChild ? Slot.Root : 'h3';
  return (
    <Title
      data-slot='stepper-title'
      data-state={state}
      className={cn('text-sm leading-none font-medium', className)}
    >
      {children}
    </Title>
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
function StepperNav({ asChild = false, children, className }) {
  const { activeStep, orientation } = useStepper();
  const Nav = asChild ? Slot.Root : 'nav';
  return (
    <Nav
      data-slot='stepper-nav'
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        'group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
        className
      )}
    >
      {children}
    </Nav>
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
