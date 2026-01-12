// js/utils.js
export function getRandomRarity() {
    const roll = Math.random() * 100;
    if (roll < 60) return 'common';
    if (roll < 85) return 'rare';
    if (roll < 97) return 'epic';
    return 'legendary';
}
