import { store } from '../store.js';

// Elementy górnego paska
const nameEl = document.getElementById('user-name');
const coinsEl = document.getElementById('coins');
const streakEl = document.getElementById('streak');

// Elementy sidebaru
const sbUsername = document.getElementById('sb-username');
const sbEmail = document.getElementById('sb-email');
const sbBirthdate = document.getElementById('sb-birthdate');
const sbCardCount = document.getElementById('sb-card-count');
const logoutBtn = document.getElementById('logout-btn');

store.subscribe((state) => {
    if (!state.user) return;

    // Aktualizacja nagłówka
    nameEl.textContent = state.user.username;
    coinsEl.textContent = `🪙 ${state.user.coins}`;
    streakEl.textContent = `🔥 ${state.user.streak}`;

    // Aktualizacja sidebaru (jeśli elementy istnieją w DOM)
    if (sbUsername) sbUsername.textContent = state.user.username;
    if (sbEmail) sbEmail.textContent = state.user.email || 'Nie podano';
    if (sbBirthdate)
        sbBirthdate.textContent = state.user.birthdate || 'Nie podano';
    if (sbCardCount) sbCardCount.textContent = state.user.cards.length;
});

// Obsługa przycisku wylogowania
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Czyścimy dane sesji
        localStorage.removeItem('user');
        // Przekierowujemy do strony logowania
        window.location.href = 'index.html';
    });
}
