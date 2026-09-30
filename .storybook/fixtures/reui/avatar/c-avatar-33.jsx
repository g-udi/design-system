// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='group/avatar relative mx-auto size-10 flex items-center justify-center'>
      {/* Animated Story Ring */}
      <div className='absolute -inset-1 motion-reduce:animate-none animate-[spin_3s_linear_infinite] rounded-full bg-linear-to-tr from-yellow-400 via-fuchsia-500 to-violet-600 opacity-75 blur-xs motion-reduce:transition-none transition-all duration-500 group-hover/avatar:opacity-100 group-hover/avatar:blur-sm' />

      {/* Main Avatar */}
      <Avatar className='ring-ui-background size-10 ring-2 motion-reduce:transition-none transition-transform duration-500 motion-safe:group-hover/avatar:scale-95'>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='User story' />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}
