import { store } from '../store.js';

const nameEl = document.getElementById('user-name');
const coinsEl = document.getElementById('coins');
const streakEl = document.getElementById('streak');

const sbUsername = document.getElementById('sb-username');
const sbEmail = document.getElementById('sb-email');
const sbBirthdate = document.getElementById('sb-birthdate');
const sbCardCount = document.getElementById('sb-card-count');
const logoutBtn = document.getElementById('logout-btn');

store.subscribe((state) => {
    if (!state.user) return;

    nameEl.textContent = state.user.username;
    coinsEl.textContent = `🪙 ${state.user.coins}`;
    streakEl.textContent = `🔥 ${state.user.streak}`;

    if (sbUsername) sbUsername.textContent = state.user.username;
    if (sbEmail) sbEmail.textContent = state.user.email || 'Nie podano';
    if (sbBirthdate)
        sbBirthdate.textContent = state.user.birthdate || 'Nie podano';
    if (sbCardCount) sbCardCount.textContent = state.user.cards.length;
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}
