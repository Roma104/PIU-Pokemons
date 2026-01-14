import { preloadTCGCards, getCachedTCGCard } from '../api.js';
import { store } from '../store.js';
import { playSound } from '../sound/sounds.js';

const freePackBtn = document.getElementById('free-pack');
const paidPackBtn = document.getElementById('paid-pack');

const PAID_PACK_COST = 20;
const REROLL_COST = 10;

let tempDrawnCards = [];
let currentPackIsPaid = false;
let isPackAnimationInProgress = false;

const overlayHTML = `
<div id="pack-opening-overlay">
  <div id="pack-cards-area"></div>
  <button id="flip-all-btn" class="overlay-btn">↻ OBRÓĆ WSZYSTKIE</button>
  <div id="pack-buttons-container">
      <button id="collect-btn" class="overlay-btn">✓ AKCEPTUJĘ (DODAJ DO KOLEKCJI)</button>
      <button id="reroll-btn" class="overlay-btn">🎲 LOSUJ PONOWNIE (${REROLL_COST} 🪙)</button>
  </div>
</div>
`;

if (!document.getElementById('pack-opening-overlay')) {
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
}

const overlay = document.getElementById('pack-opening-overlay');
const cardsArea = document.getElementById('pack-cards-area');
const flipAllBtn = document.getElementById('flip-all-btn');
const buttonsContainer = document.getElementById('pack-buttons-container');
const collectBtn = document.getElementById('collect-btn');
const rerollBtn = document.getElementById('reroll-btn');

function updateButtonsState() {
    if (isPackAnimationInProgress) {
        freePackBtn.disabled = true;
        paidPackBtn.disabled = true;
        return;
    }

    if (store.checkFreePackAvailable()) {
        freePackBtn.disabled = false;
        freePackBtn.textContent = 'Darmowy pack (5 kart)';
    } else {
        freePackBtn.disabled = true;
        freePackBtn.textContent = 'Wróć jutro';
    }

    paidPackBtn.textContent = `Pack (${PAID_PACK_COST} 🪙)`;
    if (store.state.user && store.state.user.coins >= PAID_PACK_COST) {
        paidPackBtn.disabled = false;
    } else {
        paidPackBtn.disabled = true;
    }
}

async function initShop() {
    freePackBtn.disabled = true;
    freePackBtn.textContent = 'Ładowanie kart...';

    await preloadTCGCards();

    store.subscribe(() => updateButtonsState());
    setTimeout(updateButtonsState, 100);
}

initShop();

function checkAllRevealed(cardsCount) {
    const revealedCount = document.querySelectorAll(
        '.opening-card-container.flipped'
    ).length;

    if (revealedCount === cardsCount) {
        flipAllBtn.classList.remove('visible');

        setTimeout(() => {
            buttonsContainer.classList.add('visible');
        }, 1000);
    }
}

function flipAllCards() {
    const unflipped = document.querySelectorAll(
        '.opening-card-container:not(.flipped)'
    );
    if (unflipped.length === 0) return;

    playSound('flip');
    let rareFound = false;

    unflipped.forEach((container, index) => {
        setTimeout(() => {
            container.classList.add('flipped');
            const rarity = container.dataset.rarityClass;
            if (
                [
                    'legendary',
                    'epic',
                    'rainbow',
                    'shiny',
                    'rare-holo',
                    'rare-ultra',
                ].includes(rarity)
            ) {
                rareFound = true;
            }
            if (index === unflipped.length - 1) {
                if (rareFound) setTimeout(() => playSound('rare'), 300);
                checkAllRevealed(tempDrawnCards.length);
            }
        }, index * 100);
    });
}

function showOpeningScene(cards) {
    tempDrawnCards = cards;
    cardsArea.innerHTML = '';

    buttonsContainer.classList.remove('visible');
    flipAllBtn.classList.remove('visible');

    overlay.classList.add('active');

    rerollBtn.innerHTML = `🎲 LOSUJ PONOWNIE (${REROLL_COST} 🪙)`;

    cards.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'opening-card-container';
        cardContainer.style.animationDelay = `${index * 0.1}s`;
        cardContainer.dataset.rarityClass = card.rarityClass;

        cardContainer.innerHTML = `
            <div class="opening-card-face opening-card-back"></div>
            <div class="opening-card-face opening-card-front modal-content ${card.rarityClass}">
                <img src="${card.image}">
                <div class="rarity ${card.rarityClass}">${card.rarity}</div>
            </div>
        `;

        const clickHandler = (e) => {
            e.stopPropagation();
            if (cardContainer.classList.contains('flipped')) return;

            cardContainer.classList.add('flipped');
            playSound('flip');

            if (
                [
                    'legendary',
                    'epic',
                    'rainbow',
                    'shiny',
                    'rare-holo',
                    'rare-ultra',
                ].includes(card.rarityClass)
            ) {
                setTimeout(() => playSound('rare'), 200);
            }
            checkAllRevealed(cards.length);
        };

        cardContainer.addEventListener('click', clickHandler);
        cardContainer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
        cardContainer.addEventListener('mousedown', (e) => e.stopPropagation());

        cardsArea.appendChild(cardContainer);
    });

    setTimeout(() => {
        flipAllBtn.classList.add('visible');
    }, 1000);
}

overlay.addEventListener('click', (e) => e.stopPropagation());
overlay.addEventListener('dblclick', (e) => e.stopPropagation());
overlay.addEventListener('mousedown', (e) => e.stopPropagation());

flipAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    flipAllCards();
});

collectBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!buttonsContainer.classList.contains('visible')) return;

    tempDrawnCards.forEach((card) => store.addCard(card));

    overlay.classList.remove('active');
    tempDrawnCards = [];

    isPackAnimationInProgress = false;
    updateButtonsState();

    window.scrollTo({ top: 0, behavior: 'smooth' });
});

rerollBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

    if (!buttonsContainer.classList.contains('visible')) return;

    if (store.state.user.coins < REROLL_COST) {
        alert(`Masz za mało monet! Potrzebujesz ${REROLL_COST} 🪙.`);
        return;
    }

    buttonsContainer.classList.remove('visible');

    store.addCoins(-REROLL_COST);
    playSound('shuffle');

    cardsArea.innerHTML = '';

    await new Promise((r) => setTimeout(r, 600));

    const newCards = generateCards(currentPackIsPaid);
    showOpeningScene(newCards);
});

function generateCards(isPaid) {
    const newCards = [];
    for (let i = 0; i < 5; i++) {
        const card = getCachedTCGCard();
        if (!card) continue;
        newCards.push({
            id: Date.now() + i,
            name: card.name,
            image: card.image,
            rarity: card.rarity,
            rarityClass: card.rarityClass,
        });
    }
    if (newCards.length === 0) {
        return [];
    }
    return newCards;
}

async function openPack(isPaid) {
    if (isPackAnimationInProgress || overlay.classList.contains('active'))
        return;

    if (isPaid) {
        if (store.state.user.coins < PAID_PACK_COST) {
            alert('Za mało monet!');
            return;
        }
    } else {
        if (!store.checkFreePackAvailable()) {
            alert('Już odebrałeś dzisiaj darmową paczkę!');
            return;
        }
    }

    isPackAnimationInProgress = true;
    updateButtonsState();

    if (isPaid) {
        store.addCoins(-PAID_PACK_COST);
    } else {
        store.claimFreePack();
    }

    playSound('packOpen');

    await new Promise((r) => setTimeout(r, 600));

    const newCards = generateCards(isPaid);
    if (newCards.length > 0) {
        playSound('shuffle');
        showOpeningScene(newCards);
    } else {
        isPackAnimationInProgress = false;
        updateButtonsState();
    }
}

freePackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPack(false);
});
paidPackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPack(true);
});
