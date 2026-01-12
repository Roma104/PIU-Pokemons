const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggle = document.getElementById('show-register');

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

/* LOGIN */
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

    window.location.href = 'app.html';
});
