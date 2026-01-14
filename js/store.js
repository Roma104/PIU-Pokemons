export const store = {
    state: {
        user: null,
    },

    listeners: [],

    init() {
        const data = localStorage.getItem('user');
        if (!data) {
            window.location.href = 'index.html';
            return;
        }
        this.state.user = JSON.parse(data);
        this.notify();
    },
    //zmiana teamu (ligtning, fire, water)
    changeTeam(newTeam) {
        if (this.state.user.coins < 1000) {
            alert('Potrzebujesz 1000 coinów, aby zmienić drużynę!');
            return false;
        }

        this.state.user.coins -= 1000;
        this.state.user.team = newTeam;
        this.notify();
        return true;
    },

    subscribe(fn) {
        this.listeners.push(fn);
    },

    notify() {
        localStorage.setItem('user', JSON.stringify(this.state.user));
        this.listeners.forEach((fn) => fn(this.state));
    },

    addCoins(amount) {
        this.state.user.coins += amount;
        this.notify();
    },

    addCard(card) {
        this.state.user.cards.push(card);
        this.notify();
    },

    removeCard(cardId) {
        this.state.user.cards = this.state.user.cards.filter(
            (c) => c.id !== cardId
        );
        this.notify();
    },

    clearCards() {
        this.state.user.cards = [];
        this.notify();
    },

    updateCard(cardId, newData) {
        const card = this.state.user.cards.find((c) => c.id === cardId);
        if (!card) return;

        Object.assign(card, newData);
        this.notify();
    },
};
