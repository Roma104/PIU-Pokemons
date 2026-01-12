export async function getRandomTCGCard() {
    const res = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=250');
    const data = await res.json();

    const card = data.data[Math.floor(Math.random() * data.data.length)];

    return {
        name: card.name,
        image: card.images.small,
        rarity: card.rarity ? card.rarity.toLowerCase() : 'common',
    };
}
