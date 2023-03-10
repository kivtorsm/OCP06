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

const allFilms = [sevenBestFilms, sevenActionFilms, sevenComedyFilms, sevenAnimationFilms];

function generateFilms(filmsLists) {
    // show 7 best films
    const bestFilms = filmsLists[0];
    const comedyFilms = filmsLists[1];
    const actionFilms = filmsLists[2];
    const animationFilms = filmsLists[3];

    function generateFilm(film, sectionName) {
            
        // Get DOM element hosting films
        const carouselName = "." + sectionName + "Div";
        const slideContainer = document.querySelector(carouselName);
        
        // Creation of a tag per film
        const filmElement = document.createElement("article");
        filmElement.className = "film";
        
        // Creation of film tags
        const imageElement = document.createElement("img"); 
        imageElement.src = film.image_url;
        imageElement.alt = `Image du film ${film.title}`;
        imageElement.id = film.id;

                
        // Joining all tags to parent elements
        slideContainer.appendChild(filmElement);
        filmElement.appendChild(imageElement);

        // Create event on click -> modal
        let imageId;
        imageElement.addEventListener("click", (e) => {
            imageId = e.target.id;
            createModal(imageId);
        });
    };

    // Create modal 
    async function createModal(id) {
        const modal = document.createElement("div");
        modal.setAttribute("class", "modal");
        //add the modal to the main section or the parent element
        document.querySelector("main").append(modal);
        // get film data
        const film = await getFilmData(id);
        // create content div
        const content = document.createElement("div");
        content.className = "modal-container";

        // create data div (1st column)
        const firstColumn = document.createElement("div");
        firstColumn.className = "firstColumn";
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
            if (apiElementContent != null) {
                const dataElement = document.createElement(elementType);
                dataElement.className = 'modal-content';
                if (Array.isArray(apiElementContent)) {
                    const apiElementString = apiElementContent.join(", ");
                    dataElement.innerText = `${innerText} ${apiElementString}`;
                } else {
                    dataElement.innerText = `${innerText} ${apiElementContent}`;
                }
                firstColumn.appendChild(dataElement);
            };
            
        };

        addData("h1", "title", "" );
        addData("p", "genres", "Genres : " );
        addData("p", "date_published", "Date de sortie : " );
        addData("p", "rated", "Rated : " );
        addData("p", "imdb_score", "Score Imdb : " );
        addData("p", "directors", "R??alisateur : " );
        addData("p", "actors", "Acteurs : " );
        addData("p", "duration", "Dur??e (min) : " );
        addData("p", "countries", "Pays : " );
        addData("p", "worldwide_gross_income", "R??sultat Box Office : " );
        addData("p", "description", "Synoptique : " );
        
        // create image div (2nd column)
        const secondColumn = document.createElement("div");
        secondColumn.className = "secondColumn";
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

    function generateCategoryFilms(filmsList, sectionName, categoryInnerText){

        // Get DOM object
        const categorySection = document.querySelector(`.${sectionName}`);

        // create p category title
        const categoryTitleElement = document.createElement("p");
        categoryTitleElement.className = "category";
        categoryTitleElement.innerText = categoryInnerText;
        categorySection.appendChild(categoryTitleElement);

        // create carousel div
        const carousel = document.createElement("div");
        carousel.className = "carousel";
        categorySection.appendChild(carousel);

        // create slider container
        const slideContainer = document.createElement("div");
        slideContainer.className = `${sectionName}Div slides-container`;
        carousel.appendChild(slideContainer);

        for (let i = 0; i < filmsList.length; i++) {
            const film = filmsList[i];
            generateFilm(film, sectionName);
        };
        // Get film object
        const film = document.querySelector(".film");

        // create left button
        const leftButton = document.createElement("button");
        leftButton.className = "slide-arrow slide-arrow-prev";
        leftButton.innerText = "\u2039"; 
        carousel.appendChild(leftButton);

        // Add left button action
        leftButton.addEventListener("click", () => {
            const slideWidth = film.clientWidth;
            slideContainer.scrollLeft -= slideWidth;
        });

        // create right button
        const rightButton = document.createElement("button");
        rightButton.className = "slide-arrow slide-arrow-next";
        rightButton.innerText = "\u203A"; 
        carousel.appendChild(rightButton);

        // Add right button action
        rightButton.addEventListener("click", () => {
            const slideWidth = film.clientWidth;
            slideContainer.scrollLeft += slideWidth;
        });
    };

    function generateMainFilm () {
        const slideContainer = document.querySelector(".bestFilm");
        
        // Create 1st column div
        const firstColumn = document.createElement("div");
        firstColumn.className = "bestFilmFirstColumn bestFilmcolumn";
        slideContainer.appendChild(firstColumn);

        // Create 2nd column div
        const secondColumn = document.createElement("div");
        secondColumn.className = "bestFilmSecondColumn bestFilmcolumn";
        slideContainer.appendChild(secondColumn);

        // Create 1st column content
        const film = bestFilms[0];
        const title = document.createElement("h2");
        title.innerText = film.title;
        firstColumn.appendChild(title);
        
        const description = document.createElement("p");
        if (film.description != null) {
            description.innerText = film.description;
            firstColumn.appendChild(description);
        };

        const playButton = document.createElement("button");
        playButton.innerText = "\u23F5 Regarder";
        playButton.className = "playButton";
        playButton.id = film.id;
        firstColumn.appendChild(playButton);

        // Create event on click -> modal
        let filmId;
        playButton.addEventListener("click", (e) => {
            filmId = e.target.id;
            createModal(filmId);
        });
        
        // Create 2nd column content
        const image = document.createElement("img");
        image.src = film.image_url;
        image.alt = `Image du film ${film.title}`;
        image.className = 'bestFilmImage';
        secondColumn.appendChild(image);
    }

    // generateFilm(bestFilms[0], ".bestFilm");
    generateMainFilm();
    generateCategoryFilms(bestFilms, "bestFilms", "Films les mieux not??s");
    generateCategoryFilms(comedyFilms, "comedyFilms", "Com??die");
    generateCategoryFilms(actionFilms, "actionFilms", "Action");
    generateCategoryFilms(animationFilms, "animationFilms", "Animation");
}

generateFilms(allFilms);
