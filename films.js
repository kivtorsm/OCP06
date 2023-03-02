import { getFilmData, getSevenFilms } from "./api.js";

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
        imageElement.id = film.id;

        
        // Create event on click -> modal
        let imageId;
        imageElement.addEventListener("click", (e) => {
            imageId = e.target.id;
            imgModal(imageId);
        });

        // Create modal 
        let imgModal = async (id) => {
            const modal = document.createElement("div");
            modal.setAttribute("class", "modal");
            //add the modal to the main section or the parent element
            document.querySelector("main").append(modal);
            // get film data
            const film = await getFilmData(id);
            // create content div
            const content = document.createElement("div");
            content.className = ".content";

            // create data div (1st column)
            const firstColumn = document.createElement("div");
            firstColumn.className = ".firstColumn";
            content.appendChild(firstColumn);


            // add data to 1st column
            // general function for adding data
            function addData(elementType, apiElement, innerText ){
                const apiElementDict = {
                    title: film.title,
                    genres: film.genres,
                    date_published: film.date_published,
                    rated: film.rated,
                    imdb_score: film.imdb_score,
                    directors: film.directors,
                    actors: film.actors,
                    duration: film.duration,
                    countries: film.countries,
                    worldwide_gross_income: film.worldwide_gross_income,
                    description: film.description
                };
                const apiElementContent = apiElementDict[apiElement];
                console.log(film.id);
                console.log(apiElement);
                console.log(typeof apiElementContent);
                console.log(apiElementContent);
                if (apiElementContent != null) {
                    const dataElement = document.createElement(elementType);
                    if (Array.isArray(apiElementContent)) {
                        const apiElementString = apiElementContent.join(", ");
                        dataElement.innerText = `${innerText} ${apiElementString}`;
                    } else {
                        dataElement.innerText = `${innerText} ${apiElementContent}`;
                    }
                    firstColumn.appendChild(dataElement);
                }
                
            }

            addData("h1", "title", "" );
            addData("p", "genres", "Genres : " );
            addData("p", "date_published", "Date de sortie : " );
            addData("p", "rated", "Rated : " );
            addData("p", "imdb_score", "Score Imdb : " );
            addData("p", "directors", "Réalisateur : " );
            addData("p", "actors", "Acteurs : " );
            addData("p", "duration", "Durée : " );
            addData("p", "countries", "Pays : " );
            addData("p", "worldwide_gross_income", "Résultat Box Office : " );
            addData("p", "description", "Synoptique : " );
            
            // create image div (2nd column)
            const secondColumn = document.createElement("div");
            secondColumn.className = ".secondColumn";
            content.appendChild(secondColumn);

            // adding image to second column
            const newImage = document.createElement("img");
            newImage.setAttribute("src", film.image_url);
            secondColumn.appendChild(newImage);

            //creating the close button
            const closeBtn = document.createElement("i");
            closeBtn.setAttribute("class", "closeBtn");
            closeBtn.innerText = "\u00D7";
            //close function
            closeBtn.onclick = () => {
                modal.remove();
            };
            modal.append(content, closeBtn);
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
    generateCategoryFilms(bestFilms, ".bestFilmsDiv");
    generateCategoryFilms(comedyFilms, ".comedyFilmsDiv");
    generateCategoryFilms(actionFilms, ".actionFilmsDiv");
    generateCategoryFilms(animationFilms, ".animationFilmsDiv");
}

generateFilms(allFilms);

const slidesContainer = document.getElementsByClassName("slides-container");
const slide = document.querySelector(".film");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
  });
  
  prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
  });