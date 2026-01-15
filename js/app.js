import './ui/header.js';
import './ui/cards.js';
import './ui/shop.js';
import './ui/modal.js';
import { store } from './store.js';

const currentUser = sessionStorage.getItem('current_user');

if (!currentUser) {
    window.location.href = 'index.html';
} else {
    store.login(currentUser);

    const initApp = () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 10);

//funkcja do kolorów dróżyny
const applyTeamTheme = (state) => {
    if (state.user && state.user.team) {
        document.body.classList.remove(
            'team-lightning',
            'team-fire',
            'team-water'
        );
        document.body.classList.add(`team-${state.user.team}`);
    }
};

// WYWOŁANIE NATYCHMIASTOWE (aby kolory były od razu po odświeżeniu)
applyTeamTheme(store.state);

// Subskrypcja na przyszłe zmiany (np. po zmianie drużyny za 1000 coinów)
store.subscribe(applyTeamTheme);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obsługa Fade-In (Płynne wejście)
    // Używamy małego opóźnienia (10ms), żeby przeglądarka na pewno zarejestrowała stan opacity: 0
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 10);
        try {
            const welcomeSound = new Audio('./assets/sounds/intro-music.mp3');
            welcomeSound.volume = 0.3;
            welcomeSound.play().catch(() => {});
        } catch (e) {}

        const bonusInfo = store.checkDailyBonus();

        if (bonusInfo.awarded) {
            setTimeout(() => {
                alert(
                    `Witaj ponownie ${currentUser}!\n` +
                        `📅 Dzień streaka: ${bonusInfo.streak}\n` +
                        `💰 Otrzymujesz: ${bonusInfo.bonus} monet!`
                );
            }, 500);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}
