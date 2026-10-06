export function bracketError(rounds) {
  if (!Array.isArray(rounds)) return true;
  const roundIds = new Set();
  const matchIds = new Set();
  return rounds.some((round, index) => {
    if (!round?.id || roundIds.has(round.id) || !Array.isArray(round.matches) || !round.matches.length) return true;
    roundIds.add(round.id);
    if (index > 0 && rounds[index - 1].matches.length !== round.matches.length * 2) return true;
    if (index === rounds.length - 1 && round.matches.length !== 1) return true;
    return round.matches.some((match) => {
      if (!match?.id || matchIds.has(match.id)) return true;
      matchIds.add(match.id);
      return false;
    });
  });
}

export function bracketWindow(roundCount, width, requestedRound) {
  const columns = width >= 880 ? 3 : width >= 560 ? 2 : 1;
  const last = Math.max(0, roundCount - Math.min(columns, 2));
  const start = Math.min(last, Math.max(0, Number.isFinite(requestedRound) ? Math.floor(requestedRound) : 0));
  return { start, end: Math.min(roundCount, start + columns), last };
}
