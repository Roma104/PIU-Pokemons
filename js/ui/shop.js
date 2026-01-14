// js/ui/shop.js
import { preloadTCGCards, getCachedTCGCard } from '../api.js';
import { store } from '../store.js';

const freePackBtn = document.getElementById('free-pack');
let cardLoading = false;

async function initShop() {
    freePackBtn.disabled = true;
    freePackBtn.textContent = 'Ładowanie kart...';
    await preloadTCGCards(); // preload
    freePackBtn.disabled = false;
    freePackBtn.textContent = 'Darmowy pack';
}

initShop();

freePackBtn.addEventListener('click', async () => {
    if (cardLoading) return;
    cardLoading = true;

    const card = getCachedTCGCard();

    // 1. Zawsze sprawdzaj, czy karta istnieje przed odczytem jej właściwości
    if (!card) {
        alert('Karty się jeszcze ładują, spróbuj za chwilę...');
        cardLoading = false;
        return;
    }

    const userTeam = store.state.user.team;
    let isUpgraded = false;

    // 2. Bezpieczne sprawdzenie typu (małe litery)
    const matchesTeam = card.types?.some(
        (t) => t.toLowerCase() === userTeam.toLowerCase()
    );

    // 3. Logika ulepszenia
    if (matchesTeam && Math.random() < 0.1) {
        isUpgraded = true;
    }

    // 4. Dodanie karty do magazynu
    store.addCard({
        id: Date.now(), // Unikalne ID dla każdego egzemplarza
        name: isUpgraded ? `⭐ ${card.name} ⭐` : card.name,
        image: card.image,
        rarity: isUpgraded ? 'ULTRA RARE' : card.rarity,
        rarityClass: isUpgraded ? 'shiny-boost' : card.rarityClass,
        teamBonus: isUpgraded,
    });

    if (isUpgraded) alert('MOC DRUŻYNY! Wylosowano rzadszą wersję!');

    cardLoading = false;
});
