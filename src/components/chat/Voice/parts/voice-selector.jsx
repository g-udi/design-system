'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { default as Input } from '../../../core/Input/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

const DEFAULT_LABELS = {
  label: 'Voice',
  search: 'Search voices',
  empty: 'No voice matches that search.',
  play: 'Play a sample of',
  stop: 'Stop the sample of',
  loading: 'Loading the sample of',
  previewFailed: 'The sample could not play.'
};

const GENDER = { female: 'Female', male: 'Male', neutral: 'Neutral', 'non-binary': 'Non-binary' };

const voiceTags = (voice) => [
  voice.gender ? GENDER[voice.gender] ?? voice.gender : null,
  voice.accent,
  voice.age,
  ...(Array.isArray(voice.style) ? voice.style : voice.style ? [ voice.style ] : [])
].filter(Boolean);

const matches = (voice, query) => {
  if (!query) return true;
  const haystack = [ voice.name, voice.provider, voice.description, ...voiceTags(voice) ].join(' ').toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
};

/**
 * Chooses a text-to-speech voice from data the app supplies. `voices` are
 * `{ id, name, provider?, gender?, accent?, age?, style?, description?, previewUrl? }`; the tags
 * read under each name. Voices are native radio buttons (arrow keys move the choice); each has a
 * separate sample button that plays `previewUrl`, or calls `onPreview(voice, { signal })` (return a
 * promise that settles when the sample ends, for example a speechSynthesis utterance). `groupBy`
 * (for example `provider`) adds headings, and `searchable` a filter (on by default past eight voices).
 */
function VoiceSelector({
  voices = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  onPreview,
  groupBy,
  searchable,
  labels: labelOverrides,
  className,
  ...props
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [ internal, setInternal ] = useState(defaultValue ?? voices[0]?.id);
  const value = valueProp === undefined ? internal : valueProp;
  const [ query, setQuery ] = useState('');
  const [ preview, setPreview ] = useState({ id: null, status: 'idle' });
  const [ notice, setNotice ] = useState('');
  const audioRef = useRef(null);
  const abortRef = useRef(null);
  const name = useId();
  const showSearch = searchable ?? voices.length > 8;

  const visible = useMemo(() => voices.filter((voice) => matches(voice, query)), [ voices, query ]);
  const groups = useMemo(() => {
    if (!groupBy) return [ [ null, visible ] ];
    const map = new Map();
    for (const voice of visible) {
      const key = voice[groupBy] ?? 'Other';
      map.set(key, [ ...(map.get(key) ?? []), voice ]);
    }
    return [ ...map.entries() ];
  }, [ groupBy, visible ]);

  const stopPreview = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPreview({ id: null, status: 'idle' });
  };

  const playPreview = async (voice) => {
    if (preview.id === voice.id) {
      stopPreview();
      return;
    }
    stopPreview();
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    abortRef.current = controller;
    setNotice('');
    setPreview({ id: voice.id, status: 'loading' });
    const done = () => {
      if (abortRef.current !== controller) return;
      abortRef.current = null;
      audioRef.current = null;
      setPreview({ id: null, status: 'idle' });
    };
    try {
      if (voice.previewUrl && typeof Audio !== 'undefined') {
        const audio = new Audio(voice.previewUrl);
        audioRef.current = audio;
        audio.addEventListener('ended', done);
        await audio.play();
        if (abortRef.current === controller) setPreview({ id: voice.id, status: 'playing' });
      } else if (onPreview) {
        const pending = onPreview(voice, { signal: controller?.signal });
        if (abortRef.current === controller) setPreview({ id: voice.id, status: 'playing' });
        await pending;
        done();
      }
    } catch {
      if (abortRef.current !== controller) return;
      done();
      setNotice(labels.previewFailed);
    }
  };

  // Stop a playing sample on unmount.
  useEffect(() => () => {
    abortRef.current?.abort();
    audioRef.current?.pause();
  }, []);

  const choose = (voice) => {
    setInternal(voice.id);
    onValueChange?.(voice.id, voice);
  };
  const canPreview = (voice) => Boolean(voice.previewUrl || onPreview);

  return (
    <fieldset data-slot='voice-selector' className={cn('ds-part-voice-selector', className)} {...props}>
      <legend className='ds-part-voice-selector-legend'>{labels.label}</legend>
      {showSearch ? (
        <Input
          type='search'
          aria-label={labels.search}
          placeholder={labels.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          prefix={<RegistryIcon lucide='Search' />}
          className='ds-part-voice-selector-search'
        />
      ) : null}
      {visible.length ? groups.map(([ group, list ]) => (
        <div key={group ?? 'all'} role={group ? 'group' : undefined} aria-label={group ?? undefined} className='ds-part-voice-selector-group'>
          {group ? <p aria-hidden='true' className='ds-part-voice-selector-heading'>{group}</p> : null}
          <ul className='ds-part-voice-selector-list'>
            {list.map((voice) => {
              const tags = voiceTags(voice);
              const playing = preview.id === voice.id;
              const action = playing ? (preview.status === 'loading' ? labels.loading : labels.stop) : labels.play;
              return (
                <li key={voice.id} data-checked={voice.id === value || undefined} className='ds-part-voice-selector-item'>
                  <label className='ds-part-voice-selector-option'>
                    <input type='radio' name={name} value={voice.id} checked={voice.id === value} onChange={() => choose(voice)} className='ds-part-voice-selector-radio' />
                    <span className='ds-part-voice-selector-text'>
                      <span className='ds-part-voice-selector-name'>{voice.name}</span>
                      {tags.length ? <span className='ds-part-voice-selector-tags'>{tags.map((tag) => <span key={tag} className='ds-part-voice-selector-tag'>{tag}</span>)}</span> : null}
                      {voice.description ? <span className='ds-part-voice-selector-description'>{voice.description}</span> : null}
                    </span>
                  </label>
                  {canPreview(voice) ? (
                    <Button
                      size='icon-sm'
                      variant='ghost'
                      aria-label={`${action} ${voice.name}`}
                      aria-pressed={playing}
                      onClick={() => playPreview(voice)}
                      className='ds-part-voice-selector-preview'
                    >
                      <RegistryIcon lucide={playing ? (preview.status === 'loading' ? 'LoaderCircle' : 'Square') : 'Play'} className={playing && preview.status === 'loading' ? 'ds-part-speech-input-spinner' : undefined} />
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      )) : <p className='ds-part-voice-selector-empty'>{labels.empty}</p>}
      <span role='status' aria-live='polite' className='sr-only'>{notice}</span>
    </fieldset>
  );
}

export { VoiceSelector, voiceTags, DEFAULT_LABELS as voiceSelectorLabels };
