import { store } from '../store.js';
import { playSound } from '../sound/sounds.js';

const container = document.getElementById('cards-container');
const modal = document.getElementById('card-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');
const modalContent = document.querySelector('.modal-content');
const rarityDiv = document.getElementById('modal-rarity');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');

const rarityWeights = {
    common: 1,
    uncommon: 2,
    rare: 3,
    'double rare': 4,
    'ultra rare': 4.1,
    'rare prime': 4.2,
    'hyper rare': 4.3,
    holo: 5,
    'rare holo': 5,
    'rare holo v': 5.1,
    'rare holo lv.x': 5.2,
    'rare holo star': 5.3,
    shiny: 6,
    'shiny rare': 6,
    'rare shiny': 6.1,
    'rare shiny gx': 6.2,
    promo: 7,
    ultra: 8,
    'rare ultra': 8.1,
    'rare holo vmax': 8.2,
    'rare holo vstar': 8.3,
    'rare holo gx': 8.4,
    'rare holo ex': 8.5,
    'illustration rare': 9,
    'special illustration rare': 10,
    epic: 11,
    'rare secret': 11.5,
    legendary: 12,
    rainbow: 13,
    'rare rainbow': 13,
};

function getCssClass(rarityText) {
    if (!rarityText) return 'common';
    const lower = rarityText.toLowerCase();

    if (lower.includes('rainbow')) return 'rainbow';
    if (lower.includes('gold') || lower.includes('secret')) return 'legendary';
    if (lower.includes('special illustration')) return 'legendary';
    if (lower.includes('illustration')) return 'ultra';
    if (lower.includes('vmax') || lower.includes('vstar')) return 'ultra';
    if (lower.includes('gx') || lower.includes(' ex')) return 'ultra';
    if (lower.includes('shiny') || lower.includes('shining')) return 'shiny';
    if (lower.includes('promo')) return 'promo';
    if (lower.includes('double rare')) return 'holo';
    if (lower.includes('holo')) return 'holo';
    if (lower.includes('rare')) return 'rare';
    if (lower.includes('uncommon')) return 'uncommon';

    return 'common';
}

let currentSort = 'date-new';

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCards();
    });
}

function getCardWeight(card) {
    const text = (card.rarity || 'common').toLowerCase().trim();

    if (rarityWeights[text]) return rarityWeights[text];
    if (text.includes('rainbow')) return 13;
    if (text.includes('special illustration')) return 10;
    if (text.includes('illustration')) return 9;
    if (text.includes('vmax') || text.includes('vstar') || text.includes('gx'))
        return 8;
    if (text.includes('promo')) return 7;
    if (text.includes('shiny') || text.includes('shining')) return 6;
    if (text.includes('holo') || text.includes('double')) return 5;
    if (text.includes('rare')) return 3;
    if (text.includes('uncommon')) return 2;

    return 1;
}

function getSortedCards(cards) {
    const sorted = [...cards];

    switch (currentSort) {
        case 'date-new':
            return sorted.sort((a, b) => b.id - a.id);
        case 'date-old':
            return sorted.sort((a, b) => a.id - b.id);
        case 'name-az':
            return sorted.sort((a, b) => {
                const diff = a.name.trim().localeCompare(b.name.trim());
                if (diff === 0) return getCardWeight(b) - getCardWeight(a);
                return diff;
            });
        case 'name-za':
            return sorted.sort((a, b) => {
                const diff = b.name.trim().localeCompare(a.name.trim());
                if (diff === 0) return getCardWeight(b) - getCardWeight(a);
                return diff;
            });
        case 'rarity-high':
            return sorted.sort((a, b) => {
                const wA = getCardWeight(a);
                const wB = getCardWeight(b);
                if (wA !== wB) return wB - wA;
                return a.name.trim().localeCompare(b.name.trim());
            });
        case 'rarity-low':
            return sorted.sort((a, b) => {
                const wA = getCardWeight(a);
                const wB = getCardWeight(b);
                if (wA !== wB) return wA - wB;
                return a.name.trim().localeCompare(b.name.trim());
            });
        default:
            return sorted;
    }
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        renderCards();
    });
}

function renderCards() {
    if (!store.state.user || !store.state.user.cards) return;

    container.innerHTML = '';

    let filteredCards = store.state.user.cards;

    if (currentSort === 'favorites') {
        const favorites = store.state.user.favorites || [];
        filteredCards = filteredCards.filter((card) =>
            favorites.includes(card.id)
        );
    }

    const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : '';

    if (searchTerm) {
        filteredCards = filteredCards.filter((card) =>
            card.name.toLowerCase().includes(searchTerm)
        );
    }

    const cardsToRender = getSortedCards(filteredCards);

    if (cardsToRender.length === 0) {
        container.innerHTML = searchTerm
            ? '<p style="text-align:center; width:100%; color: #334155; margin-top: 50px; font-size: 1.2rem; font-weight: bold;">Nie znaleziono kart pasujących do wyszukiwania.</p>'
            : '<p style="text-align:center; width:100%; color: #334155; margin-top: 50px; font-size: 1.2rem; font-weight: bold;">Brak kart do wyświetlenia.</p>';
        container.innerHTML = `
            <div class="empty-collection">
                <h3>Pusto tu... 🍃</h3>
                <p>Nie masz jeszcze żadnych kart w kolekcji.</p>
                <p>Kliknij <strong>"Darmowy pack"</strong> u góry, aby zacząć!</p>
            </div>
        `;
        return;
    }

    cardsToRender.forEach((card) => {
        const div = document.createElement('div');
        const cssClass = getCssClass(card.rarity);

        div.className = `card ${cssClass}`;
        div.id = `card-${card.id}`;

        const favorites = store.state.user.favorites || [];
        const isFav = favorites.includes(card.id);
        const heartClass = isFav ? 'active' : '';

        div.innerHTML = `
            <div class="fav-icon ${heartClass}" title="Ulubione">❤</div>
            <img src="${card.image}" loading="lazy" alt="${card.name}" />
            <h3>${card.name}</h3>
            <p>${card.rarity || 'Common'}</p>
        `;

        const favIcon = div.querySelector('.fav-icon');
        favIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            store.toggleFavorite(card.id);
        });

        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('fav-icon')) return;

            if (e.ctrlKey) {
                store.removeCard(card.id);
                return;
            }
            playSound('cardClick');

            modalImage.src = card.image;
            modalContent.className = `modal-content ${cssClass}`;
            modalContent.dataset.rarity = card.rarity;

            rarityDiv.textContent = card.rarity || 'Common';
            rarityDiv.className = `rarity ${cssClass}`;

            modal.classList.remove('hidden');
        });

        container.appendChild(div);
    });
}

store.subscribe(() => {
    renderCards();
});

if (store.state.user) {
    renderCards();
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
