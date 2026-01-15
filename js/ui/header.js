import { store } from '../store.js';

// Elementy górnego paska
const coinsEl = document.getElementById('coins');
const streakEl = document.getElementById('streak');

// Elementy sidebaru
const sbTeam = document.getElementById('sb-team');
const sbUsername = document.getElementById('sb-username');
const sbEmail = document.getElementById('sb-email');
const sbBirthdate = document.getElementById('sb-birthdate');
const sbCardCount = document.getElementById('sb-card-count');
const logoutBtn = document.getElementById('logout-btn');

store.subscribe((state) => {
    if (!state.user) return;

    // Aktualizacja nagłówka
    coinsEl.textContent = `🪙 ${state.user.coins}`;
    streakEl.textContent = `🔥 ${state.user.streak}`;

    if (sbUsername) sbUsername.textContent = state.user.username;
    if (sbEmail) sbEmail.textContent = state.user.email || 'Nie podano';
    if (sbBirthdate)
        sbBirthdate.textContent = state.user.birthdate || 'Nie podano';
    if (sbCardCount) sbCardCount.textContent = state.user.cards.length;
    if (sbTeam) {
        const teamNames = {
            lightning: '⚡', //Lightning
            fire: '🔥', //Fire
            water: '💧', //Water
        };
        // Pobieramy ładną nazwę z obiektu powyżej na podstawie klucza (np. 'fire')
        sbTeam.textContent = teamNames[state.user.team] || 'Brak drużyny';

        // Opcjonalnie: zmiana koloru tekstu drużyny w sidebarze, by pasował
        sbTeam.style.color =
            state.user.team === 'lightning'
                ? '#ffcb05'
                : state.user.team === 'fire'
                ? '#ff5f5f'
                : '#5fbaff';
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}
