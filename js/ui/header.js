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
const sbFavType = document.getElementById('sb-fav-type');
const logoutBtn = document.getElementById('logout-btn');

// Wybór drużyny
const teamChangeModal = document.getElementById('team-change-modal');
const openChangeBtn = document.getElementById('open-change-team-btn');
const teamChoiceBtns = document.querySelectorAll('.team-card-big');
const cancelTeamBtn = document.getElementById('cancel-team-change');

// Wybór typu
const typeChangeModal = document.getElementById('type-change-modal');
const openTypeBtn = document.getElementById('open-change-type-btn');
const cancelTypeBtn = document.getElementById('cancel-type-change');
const typeGrid = document.querySelector('.type-grid-scrollable');

// Komunikaty
const errorOverlay = document.getElementById('error-overlay');
const confirmOverlay = document.getElementById('confirm-overlay');

function showError(msg) {
    document.getElementById('error-message').textContent = msg;
    errorOverlay.classList.remove('hidden');
}

function customConfirm() {
    confirmOverlay.classList.remove('hidden');
    return new Promise((resolve) => {
        document.getElementById('confirm-yes').onclick = () => {
            confirmOverlay.classList.add('hidden');
            resolve(true);
        };
        document.getElementById('confirm-no').onclick = () => {
            confirmOverlay.classList.add('hidden');
            resolve(false);
        };
    });
}

if (cancelTeamBtn) {
    cancelTeamBtn.onclick = () => teamChangeModal.classList.add('hidden');
}

if (cancelTypeBtn) {
    cancelTypeBtn.onclick = () => typeChangeModal.classList.add('hidden');
}

const closeErrorBtn = document.querySelector('.close-error-btn');
if (closeErrorBtn) {
    closeErrorBtn.onclick = () => errorOverlay.classList.add('hidden');
}

openChangeBtn.addEventListener('click', () => {
    if (store.state.user.coins < 1000) {
        showError(`Brakuje Ci ${1000 - store.state.user.coins} 🪙!`);
        return;
    }
    teamChangeModal.classList.remove('hidden');
});

if (openTypeBtn) {
    openTypeBtn.addEventListener('click', () => {
        if (store.state.user.coins < 1000) {
            showError(`Brakuje Ci ${1000 - store.state.user.coins} 🪙!`);
            return;
        }
        typeChangeModal.classList.remove('hidden');
    });
}

const types = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dark',
    'Dragon',
    'Steel',
    'Fairy',
];

if (typeGrid) {
    types.forEach((type) => {
        const btn = document.createElement('div');
        btn.className = 'type-item';
        btn.textContent = type;

        btn.setAttribute('data-type', type);

        btn.onclick = async () => {
            if (type === store.state.user.favoriteType) {
                showError('To już jest Twój ulubiony typ!');
                return;
            }
            typeChangeModal.classList.add('hidden');
            const confirmed = await customConfirm();
            if (confirmed) {
                store.changeFavoriteType(type);
            }
        };
        typeGrid.appendChild(btn);
    });
}

teamChoiceBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
        const selectedTeam = btn.dataset.team;
        if (selectedTeam === store.state.user.team) {
            showError('Już kroczysz tą ścieżką!');
            return;
        }
        teamChangeModal.classList.add('hidden');
        const confirmed = await customConfirm();
        if (confirmed) {
            store.changeTeam(selectedTeam);
        }
    });
});

store.subscribe((state) => {
    if (!state.user) return;

    coinsEl.textContent = `🪙 ${state.user.coins}`;
    streakEl.textContent = `🔥 ${state.user.streak}`;

    if (sbUsername) sbUsername.textContent = state.user.username;
    if (sbEmail) sbEmail.textContent = state.user.email || 'Nie podano';
    if (sbBirthdate)
        sbBirthdate.textContent = state.user.birthdate || 'Nie podano';
    if (sbCardCount) sbCardCount.textContent = state.user.cards.length;

    if (sbFavType) {
        sbFavType.textContent = state.user.favoriteType || 'Normal';
    }

    if (sbTeam) {
        const teamNames = {
            lightning: '⚡',
            fire: '🔥',
            water: '💧',
        };
        sbTeam.textContent = teamNames[state.user.team] || 'Brak drużyny';
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
