import { store } from '../store.js';

const nameEl = document.getElementById('user-name');
const coinsEl = document.getElementById('coins');
const streakEl = document.getElementById('streak');

store.subscribe((state) => {
    nameEl.textContent = state.user.username;
    coinsEl.textContent = `🪙 ${state.user.coins}`;
    streakEl.textContent = `🔥 ${state.user.streak}`;
});
