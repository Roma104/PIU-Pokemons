export const store = {
    state: {
        user: null,
        currentUserKey: null,
    },

    listeners: [],

    login(username) {
        if (!username) return;

        const key = `tcg_user_${username.trim().toLowerCase()}`;
        this.state.currentUserKey = key;

        const sessionData = localStorage.getItem(key);

        if (sessionData) {
            this.state.user = JSON.parse(sessionData);
            if (!this.state.user.favorites) {
                this.state.user.favorites = [];
            }
        } else {
            const allUsers = JSON.parse(localStorage.getItem('users')) || [];
            const foundUser = allUsers.find(
                (u) =>
                    u.username.toLowerCase() === username.trim().toLowerCase()
            );

            if (foundUser) {
                this.state.user = {
                    username: foundUser.username,
                    email: foundUser.email,
                    birthdate: foundUser.birthdate,
                    team: foundUser.team,
                    favoriteType: foundUser.favoriteType || 'Normal',
                    coins: foundUser.stats?.coins || 100,
                    cards: foundUser.stats?.cards || [],
                    favorites: foundUser.favorites || [],
                    lastLogin: null,
                    lastFreePack: null,
                    streak: foundUser.stats?.streak || 0,
                };
            } else {
                this.state.user = {
                    username: username,
                    coins: 100,
                    cards: [],
                    favorites: [],
                    lastLogin: null,
                    lastFreePack: null,
                    streak: 0,
                };
            }
        }
        this.notify();
    },

    setInitialFavoriteType(newType) {
        if (!this.state.user) return;

        this.state.user.favoriteType = newType;
        this.state.user.hasChosenInitialType = true;

        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIdx = allUsers.findIndex(
            (u) =>
                u.username.toLowerCase() ===
                this.state.user.username.toLowerCase()
        );
        if (userIdx !== -1) {
            allUsers[userIdx].favoriteType = newType;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }

        this.notify();
    },

    changeTeam(newTeam) {
        if (this.state.user.coins < 1000) {
            alert(`Brakuje Ci ${1000 - this.state.user.coins} monet!`);
            return false;
        }

        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIdx = allUsers.findIndex(
            (u) =>
                u.username.toLowerCase() ===
                this.state.user.username.toLowerCase()
        );

        if (userIdx !== -1) {
            allUsers[userIdx].team = newTeam;
            allUsers[userIdx].stats.coins -= 1000;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }

        this.state.user.team = newTeam;
        this.state.user.coins -= 1000;

        this.notify();
        alert(`Witamy w drużynie ${newTeam}! Pobrano 1000 monet.`);
        return true;
    },

    changeFavoriteType(newType) {
        if (this.state.user.coins < 1000) return false;

        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIdx = allUsers.findIndex(
            (u) =>
                u.username.toLowerCase() ===
                this.state.user.username.toLowerCase()
        );

        if (userIdx !== -1) {
            allUsers[userIdx].favoriteType = newType;
            allUsers[userIdx].stats.coins -= 1000;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }

        this.state.user.favoriteType = newType;
        this.state.user.coins -= 1000;

        this.notify();
        return true;
    },

    subscribe(fn) {
        this.listeners.push(fn);
    },

    notify() {
        if (this.state.currentUserKey && this.state.user) {
            localStorage.setItem(
                this.state.currentUserKey,
                JSON.stringify(this.state.user)
            );
        }
        this.listeners.forEach((fn) => fn(this.state));
    },

    addCoins(amount) {
        if (!this.state.user) return;

        this.state.user.coins += amount;

        try {
            let soundFile;
            if (amount > 0) {
                soundFile = './assets/sounds/coin1.mp3';
            } else if (amount < 0) {
                soundFile = './assets/sounds/coin2.mp3';
            }

            if (soundFile) {
                const audio = new Audio(soundFile);
                audio.volume = 0.8;
                audio.play().catch(() => {});
            }
        } catch (e) {}

        this.notify();
    },

    addCard(card) {
        if (!this.state.user) return;
        this.state.user.cards.unshift(card);
        this.notify();
    },

    removeCard(cardId) {
        if (!this.state.user) return;
        this.state.user.cards = this.state.user.cards.filter(
            (c) => c.id !== cardId
        );
        this.notify();
    },

    checkDailyBonus() {
        if (!this.state.user) return { awarded: false };

        const now = new Date();
        const todayStr = now.toDateString();
        const lastLoginStr = this.state.user.lastLogin;

        if (lastLoginStr === todayStr) {
            return { awarded: false };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let currentStreak = this.state.user.streak || 0;

        if (lastLoginStr === yesterdayStr) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        let bonus = 10;
        if (currentStreak % 7 === 0) {
            bonus = 50;
        }

        this.addCoins(bonus);

        this.state.user.lastLogin = todayStr;
        this.state.user.streak = currentStreak;

        this.notify();

        return {
            awarded: true,
            bonus: bonus,
            streak: currentStreak,
        };
    },

    checkBirthdayBonus() {
        if (!this.state.user || !this.state.user.birthdate)
            return { awarded: false };

        const now = new Date();
        const todayMonthDay = `${now.getMonth() + 1}-${now.getDate()}`;

        const bday = new Date(this.state.user.birthdate);
        const bdayMonthDay = `${bday.getMonth() + 1}-${bday.getDate()}`;

        const currentYear = now.getFullYear();
        if (
            todayMonthDay === bdayMonthDay &&
            this.state.user.lastBirthdayBonusYear !== currentYear
        ) {
            this.state.user.coins += 100;
            this.state.user.lastBirthdayBonusYear = currentYear;
            this.notify();
            return { awarded: true, bonus: 100 };
        }

        return { awarded: false };
    },

    checkFreePackAvailable() {
        if (!this.state.user) return false;
        const today = new Date().toDateString();
        return this.state.user.lastFreePack !== today;
    },

    claimFreePack() {
        if (!this.state.user) return;
        const today = new Date().toDateString();
        this.state.user.lastFreePack = today;
        this.notify();
    },

    toggleFavorite(cardId) {
        if (!this.state.user.favorites) {
            this.state.user.favorites = [];
        }

        const index = this.state.user.favorites.indexOf(cardId);

        if (index === -1) {
            this.state.user.favorites.push(cardId);
        } else {
            this.state.user.favorites.splice(index, 1);
        }

        this.notify();
    },
};
