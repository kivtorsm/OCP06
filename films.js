
async function getSevenFilms (url) {
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

// API url for listing titles by decreasing imdb score and decreasing number of votes
const bestFilmsUrl = 'http://localhost:8000/api/v1/titles?sort_by=-votes&sort_by=-imdb_score';
const sevenBestFilms = await getSevenFilms(bestFilmsUrl);
console.log(sevenBestFilms)

// Transform best films list to JSON and save to local storage
const sevenBestFilmsJson = JSON.stringify(sevenBestFilms);
window.localStorage.setItem("sevenBestFilms", sevenBestFilmsJson);


// Select best film
const bestFilm = sevenBestFilms[0];
console.log(bestFilm);

// Transform best film to JSON and save to local storage
const bestFilmJson = JSON.stringify(bestFilm);
window.localStorage.setItem("bestFilm", bestFilmJson);




