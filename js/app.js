import './ui/header.js';
import './ui/cards.js';
import './ui/shop.js';
import './ui/modal.js';
import { store } from './store.js';

const currentUser = sessionStorage.getItem('current_user');
const bonusOverlay = document.getElementById('bonus-overlay');
const bonusTitle = document.getElementById('bonus-title');
const bonusMessage = document.getElementById('bonus-message');
const bonusIcon = document.getElementById('bonus-icon');
const closeBonusBtn = document.getElementById('close-bonus-btn');

function showBonusModal(title, message, icon) {
    bonusTitle.textContent = title;
    bonusMessage.textContent = message;
    bonusIcon.textContent = icon;
    bonusOverlay.classList.remove('hidden');
}

closeBonusBtn.addEventListener('click', () => {
    bonusOverlay.classList.add('hidden');
});

if (!currentUser) {
    window.location.href = 'index.html';
} else {
    store.login(currentUser);

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

    store.subscribe(applyTeamTheme);

    const initApp = () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 10);

        // Dźwięk powitalny
        try {
            const welcomeSound = new Audio('./assets/sounds/intro-music.mp3');
            welcomeSound.volume = 0.3;
            welcomeSound.play().catch(() => {});
        } catch (e) {}

        // Sprawdzenie Daily Bonus
        const bonusInfo = store.checkDailyBonus();
        const bdayInfo = store.checkBirthdayBonus();

        const pendingBonuses = [];

        if (bdayInfo.awarded) {
            pendingBonuses.push({
                title: 'Wszystkiego najlepszego!',
                message: `Z okazji urodzin otrzymujesz specjalny prezent: ${bdayInfo.bonus} 🪙!`,
                icon: '🎂',
            });
        }

        if (bonusInfo.awarded) {
            pendingBonuses.push({
                title: 'Daily Bonus!',
                message: `Dzień streaka: ${bonusInfo.streak}. Otrzymujesz ${bonusInfo.bonus} 🪙!`,
                icon: '🪙',
            });
        }

        function processBonuses() {
            if (pendingBonuses.length === 0) return;

            const current = pendingBonuses.shift();
            showBonusModal(current.title, current.message, current.icon);
        }

        closeBonusBtn.onclick = () => {
            bonusOverlay.classList.add('hidden');
            setTimeout(processBonuses, 300);
        };

        processBonuses();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}
