import { getSevenFilms } from "./api.js";

// GET 7 best films AND BEST film
// API url for listing titles by decreasing imdb score and decreasing number of votes
const bestFilmsUrl = 'http://localhost:8000/api/v1/titles?sort_by=-votes&sort_by=-imdb_score';
const sevenBestFilms = await getSevenFilms(bestFilmsUrl);

// Transform best films list to JSON and save to local storage
const sevenBestFilmsJson = JSON.stringify(sevenBestFilms);
window.localStorage.setItem("sevenBestFilms", sevenBestFilmsJson);

// Select best film
const bestFilm = sevenBestFilms[0];
console.log(bestFilm);

// Transform best film to JSON and save to local storage
const bestFilmJson = JSON.stringify(bestFilm);
window.localStorage.setItem("bestFilm", bestFilmJson);

// GET 7 best films in 3 categories
const comedyFilmsUrl = 'http://localhost:8000/api/v1/titles?genre=comedy';
const sevenComedyFilms = await getSevenFilms(comedyFilmsUrl);
const actionFilmsUrl = 'http://localhost:8000/api/v1/titles?genre=action';
const sevenActionFilms = await getSevenFilms(actionFilmsUrl);
const animationFilmsUrl = 'http://localhost:8000/api/v1/titles?genre=animation';
const sevenAnimationFilms = await getSevenFilms(animationFilmsUrl);

// Transform best films list to JSON and save to local storage
const sevenComedyFilmsJson = JSON.stringify(sevenComedyFilms);
window.localStorage.setItem("sevenComedyFilms", sevenComedyFilmsJson);
const sevenActionFilmsJson = JSON.stringify(sevenActionFilms);
window.localStorage.setItem("sevenActionFilms", sevenActionFilmsJson);
const sevenAnimationFilmsJson = JSON.stringify(sevenAnimationFilms);
window.localStorage.setItem("sevenAnimationFilms", sevenAnimationFilmsJson);

console.log(sevenActionFilms);
console.log(sevenComedyFilms);
console.log(sevenAnimationFilms);

const allFilms = [sevenBestFilms, sevenActionFilms, sevenComedyFilms, sevenAnimationFilms];

function generateFilms(filmsLists) {
    // show 7 best films
    const bestFilms = filmsLists[0];
    const comedyFilms = filmsLists[1];
    const actionFilms = filmsLists[2];
    const animationFilms = filmsLists[3];

    function generateFilm(film, sectionName) {
            
        // Get DOM element hosting films
        const sectionFilms = document.querySelector(sectionName);
        
        // Creation of a tag per film
        const filmElement = document.createElement("article");
        filmElement.className = "film";
        
        // Creation of film tags
        const imageElement = document.createElement("img"); 
        imageElement.src = film.image_url;
        imageElement.alt = `Image du film ${film.title}`;
        
        // Create event on click -> modal
        let imageSource;
        imageElement.addEventListener("click", (e) => {
            imageSource = e.target.src;
            imgModal(imageSource);
        });

        // Create modal 
        let imgModal = (src) => {
            const modal = document.createElement("div");
            modal.setAttribute("class", "modal");
            //add the modal to the main section or the parent element
            document.querySelector("main").append(modal);
            //adding image to modal
            const newImage = document.createElement("img");
            newImage.setAttribute("src", src);
            //creating the close button
            const closeBtn = document.createElement("i");
            closeBtn.setAttribute("class", "closeBtn");
            closeBtn.innerText = "\u00D7";
            //close function
            closeBtn.onclick = () => {
                modal.remove();
            };
            modal.append(newImage, closeBtn);
        };

        // Joining all tags to parent elements
        sectionFilms.appendChild(filmElement);
        filmElement.appendChild(imageElement);

    }
    function generateCategoryFilms(filmsList, sectionName){
        
        for (let i = 0; i < filmsList.length; i++) {
            const film = filmsList[i];
            generateFilm(film, sectionName);
        }
    }
    generateFilm(bestFilms[0], ".bestFilm");
    generateCategoryFilms(bestFilms, ".bestFilms");
    generateCategoryFilms(comedyFilms, ".comedyFilms");
    generateCategoryFilms(actionFilms, ".actionFilms");
    generateCategoryFilms(animationFilms, ".animationFilms");
}

generateFilms(allFilms);

