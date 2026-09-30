import { useId } from 'react';
import { cn } from '../../../utilities/cn';

export default function SettingsPanel({
  title,
  description,
  children,
  footer,
  className
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn('ds-settings-panel', className)}
    >
      <header>
        <h2 id={id} className='ds-title'>
          {title}
        </h2>
        {description && <p className='ds-description'>{description}</p>}
      </header>
      <div className='ds-settings-fields'>{children}</div>
      {footer && <footer className='ds-settings-footer'>{footer}</footer>}
    </section>
  );
}
