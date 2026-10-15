// Server-safe ChatPersona states, variants, sizes and their default labels.

export const personaLabels = {
  idle: 'Ready',
  connecting: 'Connecting',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  asleep: 'Asleep',
  error: 'Voice unavailable'
};

export const personaStates = Object.keys(personaLabels);

export const personaVariants = [ 'iridescent', 'mercury', 'waveform', 'activity', 'circle', 'bars', 'cloud', 'radial' ];

export const personaSizes = { xs: 32, sm: 48, md: 96, lg: 168, xl: 240 };
