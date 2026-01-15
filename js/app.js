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
        const bdayInfo = store.checkBirthdayBonus();

        // Tworzymy kolejkę bonusów
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

        // Funkcja do pokazywania bonusów jeden po drugim
        function processBonuses() {
            if (pendingBonuses.length === 0) return;

            const current = pendingBonuses.shift(); // Pobierz pierwszy bonus z kolejki
            showBonusModal(current.title, current.message, current.icon);
        }

        // Nadpisujemy zdarzenie kliknięcia przycisku w modalu, żeby sprawdzał czy są kolejne bonusy
        closeBonusBtn.onclick = () => {
            bonusOverlay.classList.add('hidden');
            // Małe opóźnienie przed kolejnym modalem dla lepszego efektu
            setTimeout(processBonuses, 300);
        };

        // Uruchom proces
        processBonuses();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}
