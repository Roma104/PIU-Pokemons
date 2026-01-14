// js/app.js

import './ui/header.js';
import './ui/cards.js';
import './ui/shop.js';
import './ui/modal.js';
import { store } from './store.js';

// inicjalizacja stanu użytkownika
store.init();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obsługa Fade-In (Płynne wejście)
    // Używamy małego opóźnienia (10ms), żeby przeglądarka na pewno zarejestrowała stan opacity: 0
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 10);

    // 2. Dźwięk powitalny (opcjonalnie)
    // Skoro użytkownik kliknął "Zaloguj" na poprzedniej stronie,
    // przeglądarka powinna pozwolić na autoplay tutaj.
    const welcomeSound = new Audio('./assets/sounds/logged-in.mp3'); // lub inny plik
    welcomeSound.volume = 0.4;

    // Próba odtworzenia dźwięku
    welcomeSound.play().catch(() => {
        console.log('Autoplay zablokowany - dźwięk ruszy po kliknięciu.');
    });

    // ... Reszta Twojego kodu (importy, obsługa kart itp.) ...
});
