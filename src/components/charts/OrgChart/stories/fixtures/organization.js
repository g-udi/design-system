export const organization = {
  id: 'riley', name: 'Riley Morgan', role: 'Chief Executive Officer', department: 'Leadership', avatar: '/avatars/person-01.svg',
  children: [
    { id: 'alex', name: 'Bram Ellery', role: 'VP of Engineering', department: 'Engineering', avatar: '/avatars/person-41.svg', children: [
      { id: 'jordan', name: 'Jordan Lee', role: 'Engineering Manager', department: 'Platform', avatar: '/avatars/person-20.svg' },
      { id: 'sam', name: 'Sam Rivera', role: 'Staff Engineer', department: 'Infrastructure', avatar: '/avatars/person-31.svg' }
    ] },
    { id: 'casey', name: 'Casey Brooks', role: 'VP of Product', department: 'Product & Design', avatar: '/avatars/person-24.svg', children: [
      { id: 'taylor', name: 'Taylor James', role: 'Design Director', department: 'Experience', avatar: '/avatars/person-50.svg' },
      { id: 'morgan', name: 'Morgan Park', role: 'Product Manager', department: 'Growth', avatar: '/avatars/person-07.svg' }
    ] }
  ]
};
