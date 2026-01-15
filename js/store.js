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

        // Pobieramy dane – upewnij się, że nazwa zmiennej zgadza się z tą w IF
        const sessionData = localStorage.getItem(key);

        if (sessionData) {
            this.state.user = JSON.parse(sessionData);
        } else {
            // 2. Jeśli nie ma sesji, szukamy w "bazie rejestracji"
            const allUsers = JSON.parse(localStorage.getItem('users')) || [];
            const foundUser = allUsers.find(
                (u) =>
                    u.username.toLowerCase() === username.trim().toLowerCase()
            );

            if (foundUser) {
                // Przepisujemy dane z rejestracji do stanu aplikacji
                this.state.user = {
                    username: foundUser.username,
                    email: foundUser.email,
                    birthdate: foundUser.birthdate,
                    coins: foundUser.stats?.coins || 100,
                    cards: foundUser.stats?.cards || [],
                    lastLogin: null,
                    lastFreePack: null,
                    streak: foundUser.stats?.streak || 0,
                };
            } else {
                // Ostateczność: tworzymy nowego (awaryjnie)
                this.state.user = {
                    username: username,
                    coins: 100,
                    cards: [],
                    lastLogin: null,
                    lastFreePack: null,
                    streak: 0,
                };
            }
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
    checkBirthdayBonus() {
        if (!this.state.user || !this.state.user.birthdate)
            return { awarded: false };

        const now = new Date();
        const todayMonthDay = `${now.getMonth() + 1}-${now.getDate()}`; // Format M-D

        const bday = new Date(this.state.user.birthdate);
        const bdayMonthDay = `${bday.getMonth() + 1}-${bday.getDate()}`;

        // Sprawdzamy też, czy bonus nie został już odebrany w tym roku
        const currentYear = now.getFullYear();
        if (
            todayMonthDay === bdayMonthDay &&
            this.state.user.lastBirthdayBonusYear !== currentYear
        ) {
            this.state.user.coins += 100;
            this.state.user.lastBirthdayBonusYear = currentYear; // Zapisujemy rok odebrania
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
};
