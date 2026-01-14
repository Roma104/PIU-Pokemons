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
    if (!card) {
        alert('Brak kart w cache — odśwież stronę');
        cardLoading = false;
        return;
    }

    store.addCard({
        id: Date.now(),
        name: card.name,
        image: card.image,
        // Używamy danych z obiektu karty (z api.js), zamiast losować
        rarity: card.rarity,
        rarityClass: card.rarityClass,
    });

    cardLoading = false;
});
