# PiU Pokemons

Projekt edukacyjny – cyfrowe kolekcjonowanie kart Pokémon w przeglądarce.  
Stworzony w ramach zajęć z programowania webowego / kursu JavaScript.

---

## Cel projektu

Celem jest stworzenie interaktywnej aplikacji, w której użytkownik może:

- logować się / rejestrować,
- zbierać cyfrowe karty Pokémon,
- losować paczki darmowych kart,
- śledzić swoje monety i streak,
- oglądać powiększone karty w formacie podobnym do TCG.

Planowane funkcjonalności na przyszłość:

- poprawa wyglądu kart (obrazy TCG dopasowane do formatu),
- dodanie promocji / specjalnych kart,
- ewentualny system płatnych paczek lub osiągnięć.

---

## Struktura projektu

### Pliki HTML

- `index.html` – logowanie / rejestracja
- `app.html` – główna aplikacja z kartami

### Folder `css/`

- `main.css` – style globalne (fonty, layout)
- `auth.css` – styl logowania i rejestracji
- `app.css` – layout aplikacji
- `cards.css` – wygląd kart Pokémon
- `animations.css` – animacje (hover, flip, fade-in)

### Folder `js/`

- `app.js` – bootstrap dla `app.html`
- `index.js` – bootstrap dla `index.html`
- `store.js` – zarządzanie stanem aplikacji i localStorage
- `api.js` – komunikacja z PokeAPI oraz Pokémon TCG API
- `utils.js` – funkcje pomocnicze (losowanie, daty itp.)

**Moduły UI**

- `ui/header.js` – nagłówek (coiny, streak)
- `ui/cards.js` – renderowanie kart
- `ui/shop.js` – obsługa paczek / losowanie kart
- `ui/modal.js` – powiększone karty

**Moduły dźwięków**

- `sound/sounds.js` – odtwarzanie efektów audio

### Folder `assets/`

- `images/` – placeholdery, logo
- `sounds/` – efekty audio (kliknięcia, otwieranie paczki, monety)

---

## Jak działa losowanie kart

1. Losujemy kartę z API Pokémon TCG lub PokeAPI.
2. Każda karta ma przypisaną `rarity` (common, rare, epic, legendary).
3. Karty są przechowywane w `store` i wyświetlane w `#cards-container`.
4. Obecnie losowanie darmowych paczek jest szybkie i korzysta z cache, aby uniknąć opóźnień.

---

## Uwagi

- Obrazki TCG są pobierane z [Pokémon TCG API](https://pokemontcg.io/) i mogą mieć różne rozmiary – planowane dopasowanie do kart.
- CSS kart i rarity działa zgodnie z klasami: `.common`, `.rare`, `.epic`, `.legendary`.
- Na razie darmowe paczki losują karty w małej liczbie dziennie, żeby nie obciążać API.

---

## Plany na przyszłość

- Dopasowanie obrazków TCG do kart (bez rozciągania / zmiażdżenia).
- Dodanie kart specjalnych / promo.
- Możliwość kupowania paczek i zarządzania monetami.
- Animacje flip / hover dla kart i modal dla powiększonych kart.
- Możliwość eksportowania / dzielenia się kolekcją.

---
