export const rounds = [
  { id: 'quarter', name: 'Quarter-finals', matches: [
    { id: 'q1', label: 'Oct 12 · 18:00', status: 'completed', home: { name: 'North London', seed: 1, score: 2 }, away: { name: 'Bristol City', seed: 8, score: 0 }, winner: 'home' },
    { id: 'q2', label: 'Oct 12 · 20:00', status: 'completed', home: { name: 'Manchester', seed: 4, score: 1, penalties: 4 }, away: { name: 'Brighton', seed: 5, score: 1, penalties: 3 }, winner: 'home' },
    { id: 'q3', label: 'Oct 13 · 18:00', status: 'completed', home: { name: 'Nottingham', seed: 2, score: 0 }, away: { name: 'East London', seed: 7, score: 1 }, winner: 'away' },
    { id: 'q4', label: 'Oct 13 · 20:00', status: 'live', home: { name: 'Liverpool', seed: 3, score: 2 }, away: { name: 'Newcastle', seed: 6, score: 2 } }
  ] },
  { id: 'semi', name: 'Semi-finals', matches: [
    { id: 's1', label: 'Oct 18 · 18:00', status: 'upcoming', home: { name: 'North London' }, away: { name: 'Manchester' } },
    { id: 's2', label: 'Oct 18 · 20:00', status: 'upcoming', home: { name: 'East London' }, away: null }
  ] },
  { id: 'final', name: 'Final', matches: [
    { id: 'f1', label: 'Oct 25 · 19:00', status: 'upcoming', home: null, away: null }
  ] }
];
