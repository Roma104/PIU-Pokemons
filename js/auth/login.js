export function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Szukamy pełnego obiektu użytkownika w "bazie"
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        throw new Error('Błędny login lub hasło!');
    }

    // Zapisujemy do sesji (klucz 'user') wszystkie dane, które podał przy rejestracji
    localStorage.setItem(
        'user',
        JSON.stringify({
            username: user.username,
            email: user.email,
            birthdate: user.birthdate,
            coins: user.stats?.coins || 0,
            streak: user.stats?.streak || 0,
            cards: user.stats?.cards || [],
            lastLogin: new Date().toISOString(),
        })
    );

    return true;
}
