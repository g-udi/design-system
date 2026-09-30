export const canonicalButtonToneClasses = {
  'accent': {
    'ghost': 'text-accent hover:bg-accent-subtle',
    'outline': 'border-accent-muted text-accent hover:bg-accent-subtle',
    'soft': 'bg-accent-subtle text-accent hover:bg-accent-muted',
    'solid': 'bg-accent text-accent-foreground hover:bg-accent-dark',
    'subtle': 'p-0 text-accent hover:bg-transparent hover:text-accent-dark'
  },
  'attention': {
    'ghost': 'text-attention hover:bg-attention-subtle',
    'outline': 'border-attention-border text-attention hover:bg-attention-subtle',
    'soft': 'bg-attention-subtle text-attention hover:bg-attention-muted',
    'solid': 'bg-attention text-attention-foreground hover:brightness-95',
    'subtle': 'p-0 text-attention hover:bg-transparent hover:text-attention'
  },
  'danger': {
    'ghost': 'text-danger hover:bg-danger-subtle',
    'outline': 'border-danger-border text-danger hover:bg-danger-subtle',
    'soft': 'bg-danger-subtle text-danger hover:bg-danger-muted',
    'solid': 'bg-danger text-danger-foreground hover:brightness-95',
    'subtle': 'p-0 text-danger hover:bg-transparent hover:text-danger'
  },
  'discovery': {
    'ghost': 'text-discovery hover:bg-discovery-subtle',
    'outline': 'border-discovery-border text-discovery hover:bg-discovery-subtle',
    'soft': 'bg-discovery-subtle text-discovery hover:bg-discovery-muted',
    'solid': 'bg-discovery text-discovery-foreground hover:brightness-95',
    'subtle': 'p-0 text-discovery hover:bg-transparent hover:text-discovery'
  },
  'info': {
    'ghost': 'text-info hover:bg-info-subtle',
    'outline': 'border-info-border text-info hover:bg-info-subtle',
    'soft': 'bg-info-subtle text-info hover:bg-info-muted',
    'solid': 'bg-info text-info-foreground hover:brightness-95',
    'subtle': 'p-0 text-info hover:bg-transparent hover:text-info'
  },
  'neutral': {
    'ghost': 'text-foreground hover:bg-surface-muted',
    'outline': 'border-border text-foreground hover:bg-surface-muted',
    'soft': 'bg-surface-muted text-foreground hover:bg-ui-secondary',
    'solid': 'bg-text text-surface hover:bg-text-muted',
    'subtle': 'p-0 text-text-muted hover:bg-transparent hover:text-foreground'
  },
  'success': {
    'ghost': 'text-success hover:bg-success-subtle',
    'outline': 'border-success-border text-success hover:bg-success-subtle',
    'soft': 'bg-success-subtle text-success hover:bg-success-muted',
    'solid': 'bg-success text-success-foreground hover:brightness-95',
    'subtle': 'p-0 text-success hover:bg-transparent hover:text-success'
  },
  'warning': {
    'ghost': 'text-warning hover:bg-warning-subtle',
    'outline': 'border-warning-border text-warning hover:bg-warning-subtle',
    'soft': 'bg-warning-subtle text-warning hover:bg-warning-muted',
    'solid': 'bg-warning text-warning-foreground hover:brightness-95',
    'subtle': 'p-0 text-warning hover:bg-transparent hover:text-warning'
  }
};

export const buttonToneAliases = Object.freeze({
  amber: 'warning',
  blue: 'accent',
  gray: 'neutral',
  green: 'success',
  indigo: 'info',
  red: 'danger',
  rose: 'attention',
  teal: 'discovery',
  yellow: 'warning'
});

export const buttonTones = Object.freeze(Object.keys(canonicalButtonToneClasses));

export const buttonToneClasses = {
  ...canonicalButtonToneClasses,
  ...Object.fromEntries(Object.entries(buttonToneAliases).map(([ alias, tone ]) => [ alias, canonicalButtonToneClasses[tone] ]))
};
