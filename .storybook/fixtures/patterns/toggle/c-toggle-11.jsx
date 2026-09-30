'use client';
import { useState } from 'react';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [shared, setShared] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Toggle
        variant='outline'
        aria-label='Like'
        pressed={liked}
        onPressedChange={setLiked}
      >
        <RegistryIcon lucide='HeartIcon' />
        {liked ? 13 : 12}
      </Toggle>
      <Toggle
        variant='outline'
        aria-label='Retweet'
        pressed={retweeted}
        onPressedChange={setRetweeted}
      >
        <RegistryIcon lucide='Repeat2Icon' />
        {retweeted ? 6 : 5}
      </Toggle>
      <Toggle
        variant='outline'
        aria-label='Share'
        pressed={shared}
        onPressedChange={setShared}
      >
        <RegistryIcon lucide='Share2Icon' />
        {shared ? 4 : 3}
      </Toggle>
      <Toggle
        variant='outline'
        aria-label='Bookmark'
        pressed={bookmarked}
        onPressedChange={setBookmarked}
      >
        <RegistryIcon lucide='BookmarkIcon' />
        {bookmarked ? 9 : 8}
      </Toggle>
    </div>
  );
}
