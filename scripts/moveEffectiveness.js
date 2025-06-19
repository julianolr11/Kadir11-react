export function calculateMovePower(basePower, level, maxHealth) {
  if (!basePower || basePower <= 0) return 0;

  const effectiveLevel = Math.max(level, 1);
  const levelScale = 1 + (effectiveLevel - 1) * 0.05; // 5% increase per level

  let scaled = basePower * levelScale;

  if (typeof maxHealth === 'number' && maxHealth > 0) {
    const min = Math.ceil(maxHealth * 0.05); // at least 5% of max health
    const max = Math.ceil(maxHealth * 0.3); // at most 30% of max health
    scaled = Math.min(Math.max(scaled, min), max);
  }

  return Math.round(scaled);
}
