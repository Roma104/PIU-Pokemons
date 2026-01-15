// js/ui/cards.js
import { store } from '../store.js';
import { playSound } from '../sound/sounds.js';

const container = document.getElementById('cards-container');
const modal = document.getElementById('card-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');
const modalContent = document.querySelector('.modal-content');
const rarityDiv = document.getElementById('modal-rarity');

store.subscribe((state) => {
    container.innerHTML = '';

    state.user.cards.forEach((card) => {
        const div = document.createElement('div');
        div.className = `card ${card.rarityClass}`;
        div.id = `card-${card.id}`;

        div.innerHTML = `
            <img src="${card.image}" loading="lazy" />
            <h3>${card.name}</h3>
            <p>${card.rarity || 'Common'}</p>
        `;

        div.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                store.removeCard(card.id);
                return;
            }

            playSound('cardClick');

            modalImage.src = card.image;

            modalContent.className = `modal-content ${card.rarityClass}`;
            modalContent.dataset.rarity = card.rarity;

            rarityDiv.textContent = card.rarity || 'Common';
            rarityDiv.className = `rarity ${card.rarityClass}`;

            modal.classList.remove('hidden');
        });

        container.appendChild(div);
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
