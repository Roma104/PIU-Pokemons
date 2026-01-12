// js/ui/shop.js
import { preloadTCGCards, getCachedTCGCard } from '../api.js';
import { store } from '../store.js';

// Szanse na rarity
function getRandomRarity() {
    const roll = Math.random() * 100;
    if (roll < 60) return 'common';
    if (roll < 85) return 'rare';
    if (roll < 97) return 'epic';
    return 'legendary';
}

const freePackBtn = document.getElementById('free-pack');
let cardLoading = false;

// Preload kart do cache
async function initShop() {
    freePackBtn.disabled = true;
    freePackBtn.textContent = 'Ładowanie kart...';
    await preloadTCGCards(10); // pobieramy np. 10 kart
    freePackBtn.disabled = false;
    freePackBtn.textContent = 'Darmowy pack';
}

initShop();

// Obsługa kliknięcia
freePackBtn.addEventListener('click', () => {
    if (cardLoading) return;
    cardLoading = true;

    const card = getCachedTCGCard();
    if (!card) {
        alert('Brak kart w cache — odśwież stronę');
        cardLoading = false;
        return;
    }

    store.addCard({
        id: Date.now(),
        name: card.name,
        image: card.image,
        rarity: getRandomRarity(), // losowa rarity według Twoich szans
    });

    cardLoading = false;
});
