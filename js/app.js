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

    applyTeamTheme(store.state);

    store.subscribe(applyTeamTheme);

    const initApp = () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 10);

        try {
            const welcomeSound = new Audio('./assets/sounds/intro-music.mp3');
            welcomeSound.volume = 0.3;
            welcomeSound.play().catch(() => {});
        } catch (e) {}

        const userCards = store.state.user.cards || [];
        const userCoins = store.state.user.coins;
        const pendingBonuses = [];

        if (userCoins === 100 && userCards.length === 0) {
            pendingBonuses.push({
                title: 'Witaj w PIU-Pokemons!',
                message: '🎁 Na start otrzymujesz: 100 monet!\n👉 Odbierz swój pierwszy DARMOWY PACK powyżej!',
                icon: '👋'
            });
        } else {
            const bonusInfo = store.checkDailyBonus();
            const bdayInfo = store.checkBirthdayBonus();

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
                    message: `Dzień streaka: ${bonusInfo.streak}🔥. Otrzymujesz ${bonusInfo.bonus} 🪙!`,
                    icon: '🪙',
                });
            }
        }

        function processBonuses() {
            if (pendingBonuses.length > 0) {
                const current = pendingBonuses.shift();
                showBonusModal(current.title, current.message, current.icon);
            } else {
                if (
                    !store.state.user.favoriteType ||
                    store.state.user.favoriteType === 'Normal'
                ) {
                    const typeModal = document.getElementById('type-change-modal');
                    if (typeModal) {
                        const typeModalTitle = typeModal.querySelector('h2');
                        const typeModalSubtitle = typeModal.querySelector('.subtitle');

                        typeModalTitle.textContent = 'Witaj w PokéCards!';
                        typeModalSubtitle.textContent = 'Wybierz swój pierwszy ulubiony typ (Bonus +10%) za darmo!';

                        const typeBtns = typeModal.querySelectorAll('.type-item');
                        typeBtns.forEach((btn) => {
                            const originalClick = btn.onclick;
                            btn.onclick = () => {
                                store.setInitialFavoriteType(btn.textContent);
                                typeModal.classList.add('hidden');
                                typeBtns.forEach(
                                    (b) => (b.onclick = originalClick)
                                );
                            };
                        });

                        typeModal.classList.remove('hidden');
                    }
                }
            }
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
