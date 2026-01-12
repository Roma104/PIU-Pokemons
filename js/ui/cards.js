// js/ui/cards.js
import { store } from '../store.js';

const container = document.getElementById('cards-container');
const modal = document.getElementById('card-modal');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalRarity = document.getElementById('modal-rarity');
const closeModal = document.getElementById('close-modal');
const modalContent = document.querySelector('.modal-content');

store.subscribe((state) => {
    container.innerHTML = '';

    state.user.cards.forEach((card) => {
        const div = document.createElement('div');
        div.id = `card-${card.id}`;
        div.className = `card ${card.rarity}`;

        div.innerHTML = `
            <img src="${card.image}" loading="lazy" />
            <h3>${card.name}</h3>
            <p>${card.rarity}</p>
        `;

        div.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                store.removeCard(card.id);
                div.remove();
                return;
            }

            div.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    store.removeCard(card.id);
                    div.remove();
                    return;
                }

                // 🔹 Pobieramy oficjalny artwork
                const artwork =
                    card.sprites?.other?.['official-artwork']?.front_default ||
                    card.image;

                modalImage.src = card.image; // bo card.image to już full artwork
                modalName.textContent = card.name;
                modalContent.setAttribute('data-rarity', card.rarity);
                modalContent.className = `modal-content ${card.rarity}`;
                modal.classList.remove('hidden');
            });
        });

        container.appendChild(div);
    });
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
});
