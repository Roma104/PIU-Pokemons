export function applySeasonBackground(forcedSeason = null) {
    const authPage = document.querySelector('.auth-page');
    if (!authPage) return;

    let season;

    if (forcedSeason) {
        season = forcedSeason;
    } else {
        season = getSeasonByDate(new Date());
    }

    authPage.classList.add(season);
}

function getSeasonByDate(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();

    if ((m === 3 && d >= 20) || m === 4 || m === 5 || (m === 6 && d < 21))
        return 'spring';

    if ((m === 6 && d >= 21) || m === 7 || m === 8 || (m === 9 && d < 23))
        return 'summer';

    if ((m === 9 && d >= 23) || m === 10 || m === 11 || (m === 12 && d < 21))
        return 'autumn';

    return 'winter';
}
