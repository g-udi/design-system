/**
 * Example voice catalogues in the shape VoiceSelector reads. They describe the public voice
 * names of two common TTS providers for demos only; apps supply their own list (and preview URLs)
 * from their provider's API.
 */
export const exampleVoices = [
  { id: 'openai-alloy', name: 'Alloy', provider: 'OpenAI', gender: 'neutral', accent: 'American', style: [ 'balanced', 'clear' ], description: 'Even and versatile; a safe default.' },
  { id: 'openai-ash', name: 'Ash', provider: 'OpenAI', gender: 'male', accent: 'American', style: [ 'warm', 'conversational' ] },
  { id: 'openai-coral', name: 'Coral', provider: 'OpenAI', gender: 'female', accent: 'American', style: [ 'bright', 'friendly' ] },
  { id: 'openai-fable', name: 'Fable', provider: 'OpenAI', gender: 'neutral', accent: 'British', style: [ 'storytelling' ], description: 'Expressive, for narration.' },
  { id: 'openai-nova', name: 'Nova', provider: 'OpenAI', gender: 'female', accent: 'American', style: [ 'energetic' ] },
  { id: 'openai-onyx', name: 'Onyx', provider: 'OpenAI', gender: 'male', accent: 'American', style: [ 'deep', 'authoritative' ] },
  { id: 'openai-sage', name: 'Sage', provider: 'OpenAI', gender: 'female', accent: 'American', style: [ 'calm', 'measured' ] },
  { id: 'eleven-rachel', name: 'Rachel', provider: 'ElevenLabs', gender: 'female', accent: 'American', age: 'young', style: [ 'narration', 'calm' ] },
  { id: 'eleven-george', name: 'George', provider: 'ElevenLabs', gender: 'male', accent: 'British', age: 'middle-aged', style: [ 'warm', 'narration' ] },
  { id: 'eleven-charlotte', name: 'Charlotte', provider: 'ElevenLabs', gender: 'female', accent: 'Swedish', age: 'young', style: [ 'seductive', 'video games' ] },
  { id: 'eleven-daniel', name: 'Daniel', provider: 'ElevenLabs', gender: 'male', accent: 'British', age: 'middle-aged', style: [ 'news', 'deep' ] },
  { id: 'eleven-aria', name: 'Aria', provider: 'ElevenLabs', gender: 'female', accent: 'American', age: 'middle-aged', style: [ 'expressive', 'social media' ] }
];
