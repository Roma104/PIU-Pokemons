// js/index.js

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggle = document.getElementById('show-register');

// 1. Dźwięk sukcesu logowania
const loginSuccessSound = new Audio('./assets/sounds/logged-in.mp3');
loginSuccessSound.volume = 0.5; // Dostosuj głośność

toggle.addEventListener('click', () => {
    registerForm.classList.toggle('hidden');
});

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/* REGISTER */
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const users = getUsers();

    if (users.find((u) => u.username === username)) {
        alert('Użytkownik już istnieje');
        return;
    }

    users.push({ username, password });
    saveUsers(users);

    alert('Konto utworzone! Możesz się zalogować.');
    registerForm.reset();
});

/* LOGIN - TUTAJ ZMIANY */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        alert('Błędny login lub hasło');
        return;
    }

    // Zapisanie sesji użytkownika
    localStorage.setItem(
        'user',
        JSON.stringify({
            username,
            coins: 0,
            streak: 0,
            lastLogin: null,
            cards: [],
        })
    );

    // --- EFEKT PRZEJŚCIA I DŹWIĘK ---

    // A. Odtwórz dźwięk
    loginSuccessSound.play().catch((err) => console.log('Błąd audio:', err));

    // B. Dodaj klasę do body, która uruchomi animację ściemniania
    document.body.classList.add('fade-out');

    // C. Poczekaj 1500ms (1.5 sekundy) zanim przeniesiesz na nową stronę
    setTimeout(() => {
        window.location.href = 'app.html';
    }, 1500);
});

// --- MUZYKA W TLE (STARTUP) ---
document.addEventListener('DOMContentLoaded', () => {
    const startupMusic = new Audio('./assets/sounds/startup-music.mp3');
    startupMusic.loop = true;
    startupMusic.volume = 0.3;

    // Flaga, żeby wiedzieć, czy już gra
    let musicStarted = false;

    const tryPlayAudio = () => {
        if (musicStarted) return; // Jeśli już gra, nic nie rób

        startupMusic
            .play()
            .then(() => {
                // SUKCES: Muzyka gra
                console.log('Muzyka startupowa wystartowała!');
                musicStarted = true;

                // Dopiero teraz usuwamy nasłuchiwanie, bo mamy pewność, że działa
                document.removeEventListener('click', tryPlayAudio);
                document.removeEventListener('keydown', tryPlayAudio);
            })
            .catch((err) => {
                // BŁĄD: Przeglądarka nadal blokuje
                // NIE usuwamy listenerów – spróbujemy przy kolejnym kliknięciu
                console.log('Czekam na interakcję użytkownika...');
            });
    };

    // Nasłuchujemy na wszystko co się da
    document.addEventListener('click', tryPlayAudio);
    document.addEventListener('keydown', tryPlayAudio);
    document.addEventListener('touchstart', tryPlayAudio); // Dodatkowe dla mobile
});
