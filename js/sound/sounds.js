const sounds = {
    packOpen: new Audio('./assets/sounds/pack-open.mp3'),
    flip: new Audio('./assets/sounds/flip-card.mp3'),
    flipAll: new Audio('./assets/sounds/flip-cards.mp3'),
    coin1: new Audio('./assets/sounds/coin1.mp3'),
    coin2: new Audio('./assets/sounds/coin2.mp3'),
    cardClick: new Audio('./assets/sounds/card-click1.mp3'),
};

Object.values(sounds).forEach((sound) => {
    sound.volume = 0.8;
});

sounds['cardClick'].volume = 1.0;

export const playSound = (name) => {
    const sound = sounds[name];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch((e) => console.warn('Sound error:', e));

        if (name === 'cardClick') {
            //bo za ciche bylo
            const booster = sound.cloneNode();
            booster.volume = 1.0;
            booster.play().catch(() => {});
        }
    }
};
