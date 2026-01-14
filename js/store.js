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

        const data = localStorage.getItem(key);

        if (data) {
            this.state.user = JSON.parse(data);
        } else {
            this.state.user = {
                username: username,
                coins: 100,
                cards: [],
                lastLogin: null,
                lastFreePack: null,
                streak: 0,
            };
            this.notify();
        }

        this.notify();
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

        this.state.user.coins += bonus;
        this.state.user.lastLogin = todayStr;
        this.state.user.streak = currentStreak;

        this.notify();

        return {
            awarded: true,
            bonus: bonus,
            streak: currentStreak,
        };
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
};
