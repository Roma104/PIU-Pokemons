// js/index.js
import { registerUser } from './auth/register.js';
import { loginUser } from './auth/login.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleBtn = document.getElementById('show-register');

// Przełączanie widoków
toggleBtn.addEventListener('click', () => {
    const isLoginVisible = !loginForm.classList.contains('hidden');
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    toggleBtn.textContent = isLoginVisible
        ? 'Masz już konto? Zaloguj się'
        : 'Nie masz konta? Zarejestruj się';
});

/* OBSŁUGA REJESTRACJI */
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const birthdate = document.getElementById('register-birthdate').value;
    const pass = document.getElementById('register-password').value;

    try {
        registerUser(user, email, birthdate, pass);
        alert('Konto utworzone!');
        registerForm.reset();
        toggleBtn.click();
    } catch (err) {
        alert(err.message);
    }
});

/* OBSŁUGA LOGOWANIA */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    try {
        loginUser(user, pass);
        window.location.href = 'app.html';
    } catch (err) {
        alert(err.message);
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
