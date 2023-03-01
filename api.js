export async function getSevenFilms (url) {
    let response = await fetch(url);
    let films = await response.json();
    let sevenFilms = films.results;

    while (sevenFilms.length < 7){
        response = await fetch(films.next);
        films = await response.json();
        let initialLength = sevenFilms.length;
        let nextBestFilms = films.results;
        for (let i = 0; i < 7 - initialLength; i++) {
            sevenFilms.push(nextBestFilms[i]);
        }
    }
    return sevenFilms;
}