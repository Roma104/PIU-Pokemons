let cachedTCGCards = [];

const cardSets = [
    'bp.json',
    'bw1.json',
    'bw2.json',
    'bw3.json',
    'bw4.json',
    'bw5.json',
    'bw6.json',
    'bw7.json',
    'bw8.json',
    'bw9.json',
    'bw10.json',
    'bw11.json',
    'bwp.json',
    'cel25.json',
    'cel25c.json',
    'col1.json',
    'dc1.json',
    'det1.json',
    'dp1.json',
    'dp2.json',
    'dp3.json',
    'dp4.json',
    'dp5.json',
    'dp6.json',
    'dp7.json',
    'dpp.json',
    'dv1.json',
    'ecard1.json',
    'ecard2.json',
    'ecard3.json',
    'ex1.json',
    'ex2.json',
    'ex3.json',
    'ex4.json',
    'ex5.json',
    'ex6.json',
    'ex7.json',
    'ex8.json',
    'ex9.json',
    'ex10.json',
    'ex11.json',
    'ex12.json',
    'ex13.json',
    'ex14.json',
    'ex15.json',
    'ex16.json',
    'fut20.json',
    'g1.json',
    'gym1.json',
    'gym2.json',
    'hgss1.json',
    'hgss2.json',
    'hgss3.json',
    'hgss4.json',
    'hsp.json',
    'mcd11.json',
    'mcd12.json',
    'mcd14.json',
    'mcd15.json',
    'mcd16.json',
    'mcd17.json',
    'mcd18.json',
    'mcd19.json',
    'mcd21.json',
    'mcd22.json',
    'me1.json',
    'me2.json',
    'neo1.json',
    'neo2.json',
    'neo3.json',
    'neo4.json',
    'np.json',
    'pgo.json',
    'pl1.json',
    'pl2.json',
    'pl3.json',
    'pl4.json',
    'pop1.json',
    'pop2.json',
    'pop3.json',
    'pop4.json',
    'pop5.json',
    'pop6.json',
    'pop7.json',
    'pop8.json',
    'pop9.json',
    'rsv10pt5.json',
    'ru1.json',
    'si1.json',
    'sm1.json',
    'sm2.json',
    'sm3.json',
    'sm4.json',
    'sm5.json',
    'sm6.json',
    'sm7.json',
    'sm8.json',
    'sm9.json',
    'sm10.json',
    'sm11.json',
    'sm12.json',
    'sm35.json',
    'sm75.json',
    'sm115.json',
    'sma.json',
    'smp.json',
    'sv1.json',
    'sv2.json',
    'sv3.json',
    'sv3pt5.json',
    'sv4.json',
    'sv4pt5.json',
    'sv5.json',
    'sv6.json',
    'sv6pt5.json',
    'sv7.json',
    'sv8.json',
    'sv8pt5.json',
    'sv9.json',
    'sv10.json',
    'sve.json',
    'svp.json',
    'swsh1.json',
    'swsh2.json',
    'swsh3.json',
    'swsh4.json',
    'swsh5.json',
    'swsh6.json',
    'swsh7.json',
    'swsh8.json',
    'swsh9.json',
    'swsh9tg.json',
    'swsh10.json',
    'swsh10tg.json',
    'swsh11.json',
    'swsh11tg.json',
    'swsh12.json',
    'swsh12pt5.json',
    'swsh12pt5gg.json',
    'swsh12tg.json',
    'swsh35.json',
    'swsh45.json',
    'swsh45sv.json',
    'swshp.json',
    'tk1a.json',
    'tk1b.json',
    'tk2a.json',
    'tk2b.json',
    'xy0.json',
    'xy1.json',
    'xy2.json',
    'xy3.json',
    'xy4.json',
    'xy5.json',
    'xy6.json',
    'xy7.json',
    'xy8.json',
    'xy9.json',
    'xy10.json',
    'xy11.json',
    'xy12.json',
    'xyp.json',
    'zsv10pt5.json',
];

function normalizeRarity(raw) {
    if (!raw) return 'common';

    const r = raw.toLowerCase();

    if (r.includes('promo')) return 'promo';
    if (r.includes('secret')) return 'legendary';
    if (r.includes('legend')) return 'legendary';
    if (r.includes('ultra')) return 'ultra';
    if (r.includes('holo')) return 'epic';
    if (r.includes('rare')) return 'rare';

    return 'common';
}

function mapRarityToClass(raw) {
    if (!raw) return 'common';

    const r = raw.toLowerCase();

    if (r.includes('rainbow') || r.includes('hyper')) return 'rainbow';
    if (r.includes('shiny') || r.includes('shining')) return 'shiny';
    if (r.includes('gold')) return 'legendary';

    if (r.includes('secret')) return 'legendary';
    if (r.includes('legend')) return 'legendary';

    if (r.includes('promo')) return 'promo';
    if (r.includes('ultra')) return 'ultra';
    if (r.includes('vmax') || r.includes('vstar')) return 'holo';

    if (r.includes('holo')) return 'holo';
    if (r.includes('gx') || r.includes('ex') || r.includes('v')) return 'holo';
    if (r.includes('rare')) return 'rare';

    return 'common';
}

export async function preloadTCGCards() {
    try {
        let allCards = [];

        for (const set of cardSets) {
            const res = await fetch(`./js/cards/en/${set}`);
            const data = await res.json();
            allCards.push(...data);
        }

        console.log('Ilość kart w JSON:', allCards.length);

        cachedTCGCards = allCards
            .filter((card) => card.images && card.images.large)
            .map((card) => ({
                name: card.name,
                image: card.images.large,
                rarity: card.rarity,
                rarityClass: mapRarityToClass(card.rarity),
            }));
        console.log('Cache:', cachedTCGCards);
    } catch (err) {
        console.error('Błąd preloadowania kart:', err);
    }
}

export function getCachedTCGCard() {
    if (cachedTCGCards.length === 0) {
        console.warn('Cache pusty!');
        return null;
    }

    const index = Math.floor(Math.random() * cachedTCGCards.length);
    const card = cachedTCGCards.splice(index, 1)[0];
    console.log('Wylosowana karta:', card);
    return card;
}
