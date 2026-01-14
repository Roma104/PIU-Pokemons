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
});
