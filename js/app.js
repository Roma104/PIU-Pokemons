import './ui/header.js';
import './ui/cards.js';
import './ui/shop.js';
import './ui/modal.js';
import { store } from './store.js';

const currentUser = sessionStorage.getItem('current_user');

if (!currentUser) {
    window.location.href = 'index.html';
} else {
    // 1. Logowanie użytkownika w store
    store.login(currentUser);

    // 2. Obsługa motywu drużyny (Team Theme)
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

    // Wywołanie natychmiastowe (aby kolory były od razu)
    applyTeamTheme(store.state);

    // Subskrypcja na przyszłe zmiany
    store.subscribe(applyTeamTheme);

    // 3. Główna funkcja inicjalizująca aplikację
    const initApp = () => {
        // Efekt Fade-In
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 10);

        // Dźwięk powitalny
        try {
            const welcomeSound = new Audio('./assets/sounds/intro-music.mp3');
            welcomeSound.volume = 0.3;
            // Przeglądarki często blokują autoplay, więc łapiemy błąd cicho
            welcomeSound.play().catch(() => {});
        } catch (e) {}

        // Sprawdzenie Daily Bonus
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

    // 4. Uruchomienie aplikacji po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}
