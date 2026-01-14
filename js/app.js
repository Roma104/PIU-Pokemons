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

        try {
            const welcomeSound = new Audio('./assets/sounds/logged-in.mp3');
            welcomeSound.volume = 0.4;
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
