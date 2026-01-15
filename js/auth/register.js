export function registerUser(username, email, birthdate, team, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 1. Podstawowe sprawdzenia
    if (users.find((u) => u.username === username))
        throw new Error('Nazwa zajęta.');
    if (users.find((u) => u.email === email)) throw new Error('Email zajęty.');

    // 2. Walidacja daty (nie może być z przyszłości)
    const selectedDate = new Date(birthdate);
    const today = new Date();
    if (selectedDate > today) {
        throw new Error('Data urodzenia nie może być z przyszłości!');
    }

    // 3. Walidacja hasła
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error(
            'Hasło za słabe! Hasło musi zawierać conajmniej 8 znaków, co najmniej jedną literę, co najmniej jedną cyfrę i co najmniej jeden znak specjalny.'
        );
    }

    // 4. Zapis danych
    const newUser = {
        username,
        email,
        birthdate,
        team,
        password,
        stats: {
            coins: 100,
            streak: 0,
            cards: [],
            createdAt: new Date().toISOString(),
        },
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}
