const sounds = {
    shuffle: new Audio('./assets/sounds/shuffle.mp3'),
    packOpen: new Audio('./assets/sounds/open.mp3'),
    flip: new Audio('./assets/sounds/flip.mp3'),
    rare: new Audio('./assets/sounds/rare.mp3'),
};

sounds.shuffle.volume = 0.5;
sounds.packOpen.volume = 0.6;

export function playSound(name) {
    const sound = sounds[name];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}
