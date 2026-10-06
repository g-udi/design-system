import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useId, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import Switch from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import './BackgroundDemo.css';

/** A shared example composition; the background remains mounted when content is hidden. */
export function BackgroundDemo({ children, paused: externallyPaused = false, hint, darkContent = false }) {
  const [paused, setPaused] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const contentId = useId();
  const headingId = useId();
  const content = (
    <div id={contentId} className={`gaudi-background-demo__content${darkContent ? ' dark' : ''}`} data-background-demo-content hidden={!showContent}>
      <header className="gaudi-background-demo__header">
        <a className="gaudi-background-demo__brand" href="https://github.com/ahmadassaf/design-system" target="_blank" rel="noreferrer">
          <GaudiBrand className="text-sm" />
        </a>
        <nav aria-label="Gaudi demo navigation" className="gaudi-background-demo__navigation">
          <Button href="https://github.com/ahmadassaf/design-system#usage" target="_blank" rel="noreferrer" variant="ghost" size="sm">Components</Button>
          <Button href="https://github.com/ahmadassaf/design-system#install" target="_blank" rel="noreferrer" size="sm">Get started</Button>
        </nav>
      </header>
      <section className="gaudi-background-demo__hero" aria-labelledby={headingId}>
        <div className="gaudi-background-demo__copy">
          <Badge variant="primary-outline" size="lg">Made with Gaudi</Badge>
          <h2 id={headingId}>Make room for <br />your next idea.</h2>
          <p>Thoughtful components. A little atmosphere.</p>
          <div className="gaudi-background-demo__actions">
            <Button href="https://github.com/ahmadassaf/design-system#usage" target="_blank" rel="noreferrer" size="lg">Explore components <RegistryIcon lucide="ArrowRight" /></Button>
            <Button href="https://github.com/ahmadassaf/design-system" target="_blank" rel="noreferrer" size="lg" variant="outline" className="bg-surface">View on GitHub</Button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="gaudi-background-demo">
      {children({ paused: externallyPaused || paused, content })}
      <div className="gaudi-background-demo__toolbar">
        {hint && <p className="gaudi-background-demo__hint">{hint}</p>}
        <div className="gaudi-background-demo__controls">
          <Button variant="outline" size="sm" disabled={externallyPaused} onClick={() => setPaused(value => !value)}>
            {externallyPaused || paused ? 'Resume animation' : 'Pause animation'}
          </Button>
          <Switch label="Demo content" size="sm" checked={showContent} onCheckedChange={setShowContent} aria-controls={contentId} />
        </div>
      </div>
    </div>
  );
}
