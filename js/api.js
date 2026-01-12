// js/api.js
let cachedTCGCards = [];

// Pobranie kart do cache
export async function preloadTCGCards(count = 10) {
    try {
        const res = await fetch(
            `https://api.pokemontcg.io/v2/cards?pageSize=${count}`
        );
        const data = await res.json();

        cachedTCGCards = data.data
            .filter((card) => card.images?.large) // tylko z obrazkiem
            .map((card) => ({
                id: card.id,
                name: card.name,
                image: card.images.large,
                rarity: card.rarity || 'common',
            }));
    } catch (err) {
        console.error('Błąd pobierania kart TCG:', err);
    }
}

// Pobranie pojedynczej karty z cache (LIFO)
export function getCachedTCGCard() {
    if (cachedTCGCards.length === 0) return null;
    return cachedTCGCards.pop();
}
