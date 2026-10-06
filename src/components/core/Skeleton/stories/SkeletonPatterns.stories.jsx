import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'skeleton', import.meta.url,
  import.meta.glob('./fixtures/skeleton/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/skeleton/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Feedback & States/Skeleton', id: 'core-skeleton', tags: ['autodocs'], ...catalogueMeta('skeleton') };

export const AvatarList = { name: 'List with avatars and actions', ...pattern('avatar-list') };
export const MediaCard = { name: 'Media card', ...pattern('media-card') };
export const Dashboard = { name: 'Dashboard stats and table', ...pattern('dashboard') };
export const Form = { name: 'Form', ...pattern('form') };
export const Profile = { name: 'Profile page', ...pattern('profile') };
export const Chat = { name: 'Chat messages', ...pattern('chat') };
