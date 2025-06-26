export const ELEMENT_MULTIPLIERS = {
    fogo: { fogo: 1.0, agua: 1.2, terra: 1.2, ar: 0.8, puro: 0.9 },
    agua: { fogo: 0.8, agua: 1.0, terra: 1.2, ar: 1.2, puro: 0.9 },
    terra: { fogo: 0.8, agua: 0.8, terra: 1.0, ar: 1.2, puro: 0.9 },
    ar: { fogo: 1.2, agua: 0.8, terra: 0.8, ar: 1.0, puro: 0.9 },
    puro: { fogo: 1.0, agua: 1.0, terra: 1.0, ar: 1.0, puro: 1.2 }
};

export function getElementMultiplier(attacker, defender) {
    attacker = attacker?.toLowerCase();
    defender = defender?.toLowerCase();
    if (!ELEMENT_MULTIPLIERS[attacker] || !ELEMENT_MULTIPLIERS[attacker][defender]) {
        return 1.0;
    }
    return ELEMENT_MULTIPLIERS[attacker][defender];
}
