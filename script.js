
const API_KEY = "api_key=08d943b4426aa0e660b5bb62055f4e11";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

const movieList = document.getElementById("movieList");
const trending = document.getElementById("trending");
const showsList = document.getElementById("showsList");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tagsEl");
const topRatedM = document.getElementById("topRatedM");
const topRatedS = document.getElementById("topRatedS");
const similarMoviesList = document.getElementById("similarMoviesList");

const popup_container = document.getElementById("popup-container");


const genres =[
    {"id":28,"name":"Action"},
    {"id":12,"name":"Adventure"},
    {"id":16,"name":"Animation"},
    {"id":35,"name":"Comedy"},
    {"id":80,"name":"Crime"},
    {"id":99,"name":"Documentary"},
    {"id":18,"name":"Drama"},
    {"id":10751,"name":"Family"},
    {"id":14,"name":"Fantasy"},
    {"id":36,"name":"History"},
    {"id":27,"name":"Horror"},
    {"id":10402,"name":"Music"},
    {"id":9648,"name":"Mystery"},
    {"id":10749,"name":"Romance"},
    {"id":878,"name":"Science Fiction"},
    {"id":10770,"name":"TV Movie"},
    {"id":53,"name":"Thriller"},
    {"id":10752,"name":"War"},
    {"id":37,"name":"Western"}
    ] 
    
let selectedGenre = []
    
setGenre();
function setGenre(){
    const tagsEl = document.getElementById("tagsEl");
    if (!tagsEl) {
        return; // Exit the function if tagsEl doesn't exist
    }
    if (tagsEl) {
        tagsEl.innerHTML= "";
    }

    genres.forEach(genre => {
        const t = document.createElement("div");
        t.classList.add("tag");
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener("click", () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id)
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx)
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            fetchData(API_URL + "&with_genres="+ encodeURI(selectedGenre.join(",")), movieList)
            fetchData(API_URL1 + "&with_genres="+ encodeURI(selectedGenre.join(",")), showsList)
            highlightSelection()
        })
        tagsEl.append(t)
    })
}
    
function highlightSelection(){
    const tags = document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.classList.remove("highlight")
    })
    clearBtn()
    if(selectedGenre.length != 0 ){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add("highlight");
        })
    }
}


function clearBtn(){
    let clearBtn = document.getElementById("clear")
    
    if(clearBtn){
        clearBtn.classList.add("highlight")
    }else{
        let clear = document.createElement("div");
        clear.classList.add("tag","highlight");
        clear.id = "clear";
        clear.innerText = "clear x";
        clear.addEventListener("click", () =>{
            selectedGenre = []
            setGenre();
            fetchData(API_URL, movieList || showsList)
        })
        tagsEl.append(clear)
    }

}



function fetchData(url, displayElement) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // if (displayElement) {
            //     displayData(data.results, displayElement);
            //     console.log(data.results)
            // }
            if(data.results.length && displayData !== 0){
                displayData(data.results, displayElement);
                // console.log(data.results)
            }else{
                if(displayElement){
                    displayElement.innerHTML = `<h1 class="no-results">NO RESULTS FOUND<h1>`
                }
            }      
        })
       
        .catch(error => console.error("Error fetching data:", error));
}

function displayData(data, displayElement) {
    if (displayElement) {
        displayElement.innerHTML = "";
    }

    data.slice(0, 18).forEach(item => {
        const { title, poster_path, vote_average, overview, id, release_date, name, first_air_date} = item;
        const element = document.createElement("div");
        element.classList.add("movie");
        element.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title || name}" srcset="">
            <div class="movie-info">
                <h3>${title || name}</h3>
                <h5>${release_date ? release_date.substring(0, 4) : (first_air_date ? first_air_date.substring(0, 4) : "N/A")}</h5>
                <span class="${getColor(vote_average)}">${vote_average ? vote_average.toFixed(1) : vote_average ? vote_average.toFixed(1) : "N/A" }</span>
            </div>
            <div class="overview">
                <i class="fa-solid fa-play" id="info"></i>
                <i class="fa-solid fa-circle-info" id="${id}"></i>
            </div>
        `;
        if (displayElement) {
            displayElement.appendChild(element);
        }
        

        if(document.getElementById(id)){
            document.getElementById(id).addEventListener("click", () =>{
                console.log("clicked" + id); 

                openNav()
                show_popup(id)
                })

        }

    });

}

async function show_popup(id) {
    popup_container.classList.add("show-popup"); // Shows modal when clicked
    document.body.style.overflow = "hidden"
    
    const movie_id = id; // Get id of movie
    console.log(movie_id);

    try {
        if(popup_container){
            popup_container.innerHTML = ""
            popup_container.style.backgroundImage = '';

        }
        const movie = await get_movie_by_id(movie_id);
        const movie_trailer = await get_movie_by_trailer(movie_id);
        console.log(movie_trailer , movie);
        popup_container.style.backgroundImage= `linear-gradient(rgba(1, 1, 1, .8), var(--primary-color)), url(${IMG_URL + movie.poster_path})`


        popup_container.innerHTML = `
        <span class="x-icon">&#10006</span>
        <div class="content">
            <div class="left">
                <div class="poster-img">
                    <img src="${IMG_URL + movie.poster_path}" alt="http://via.placeholder.com/1080x1580" >
                </div>
                <div class="single-info">
                    <span class="heart-icon"><i class="fa-regular fa-heart"></i></i></span>
                </div>
            </div>
            <div class="right">
                <h1>${movie.title}</h1>
                <h3>${movie.tagline}</h3>
                <div class="single-info-container">
                    <div class="single-info">
                        <ul>
                            <li><span><i class="fa-solid fa-language"></i></span>
                            <span>${movie.spoken_languages[0].name}</span></li>

                            <li><span><i class="fa-solid fa-clock-rotate-left"></i></span>
                            <span>${Math.floor(movie.runtime / 60)} hrs ${movie.runtime % 60} mins</span></li>

                            <li><span><i class="fa-solid fa-star"></i></span>
                            <span>${movie.vote_average.toFixed(1)}/10</span></li>

                            <li><span><i class="fa-regular fa-calendar-days"></i></span>
                            <span>${movie.release_date}</span></li>
                        </ul>
                    </div>
                </div>
                <div class="genres">
                    
                    <ul>
                    <h2>Genres:</h2>${movie.genres.map(e => `<li>${e.name}<l/>`)}
                    </ul>
                </div>
                <div class="movie-overview">
                    <h2>overview</h2>
                    <p>${movie.overview}</p>
                </div>
                
            </div>
            <div class="trailer">
            <h2>Trailer</h2>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" 
                            title="youtube" class="embed hide" frameborder="0" allow="accelerometer; autoplay; 
                            clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
                            web-share" allowfullscreen>
                    </iframe>
                </div>
        </div>        
        
        `
        const x_icon = document.querySelector(".x-icon")
        x_icon.addEventListener("click", () => {
            popup_container.classList.remove("show-popup");
            document.body.style.overflow = "auto";
        })

    } 
    catch (error) {
        console.error("Error fetching movie data:", error);
        // Handle the error accordingly, e.g., show an error message to the user
    }
}
async function get_movie_by_id(id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?${API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
async function get_tv_by_id(id) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}?${API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}



async function get_movie_by_trailer(movie_id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movie_id}/videos?${API_KEY}`);
        const data = await response.json();
        // Assuming the trailer is the first item in the results array
        const trailer_key = data.results[0].key;
        return trailer_key;
    } catch (error) {
        console.error("Error fetching movie trailer:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
// get_movie_by_trailer(848538)





function openNav(){
    document.getElementById("popup-container").style.width = "100%";
    // document.body.style.overflow = "hidden"
}

// function closeNav(){
//     document.getElementById("popup-container").style.width = "0%"
// }





/**END OF MODAL */

function searchMovie(e) {

    e.preventDefault();
    
    const searchTerm = search.value.trim();
    if (searchTerm) {
        fetchData(SEARCH_URL + "&query=" + searchTerm, movieList);
        fetchData(BASE_URL + "/search/tv?" + API_KEY + "&query=" + searchTerm, showsList);
        fetchData(BASE_URL + "/search/multi?" + API_KEY + "&query=" + searchTerm, trending);
    } else {
        fetchData(API_URL, movieList);   // Fetch original movie data
        fetchData(API_URL1, showsList); 
        fetchData(API_URL2, trending); 
    }
}
if(form){
    form.addEventListener("input", searchMovie);   
    form.addEventListener("submit", searchMovie);
}       

let id
// Initial data fetching
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const API_URL1 = BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY;
const API_URL2 = BASE_URL + "/trending/all/day?" + API_KEY;
const API_TOP_RATEDM = BASE_URL + "/movie/top_rated?" + API_KEY;
const API_TOP_RATEDS = BASE_URL + "/tv/top_rated?" + API_KEY;




fetchData(API_URL, movieList);
fetchData(API_URL1, showsList);
fetchData(API_URL2, trending);
fetchData(API_TOP_RATEDM, topRatedM);
fetchData(API_TOP_RATEDS, topRatedS);


function getColor(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}




































// const API_KEY = "api_key=08d943b4426aa0e660b5bb62055f4e11";
// const BASE_URL = "https://api.themoviedb.org/3"
// const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY
// const API_URL1 = BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY
// const API_URL2 = BASE_URL + "/trending/all/day?" + API_KEY
// const IMG_URL = "https://image.tmdb.org/t/p/w500"
// const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

// const movieList = document.getElementById("movieList");
// const trending = document.getElementById("trending")
// const showsList = document.getElementById("showsList");
// const hero = document.getElementById("hero");
// const form = document.getElementById("form");
// const search = document.getElementById("search");
// // const tagsEl = document.getElementById("tagsEl");

// getTrending(API_URL2)
// getMovies(API_URL);
// getShows(API_URL1);


// function getTrending(url){
//     //     lastUrl = url
//         fetch(url).then(res => res.json()).then(data => {
//             console.log(data)
//                 showTrending(data.results);
//         })
//     }
// function getMovies(url){
// //     lastUrl = url
//     fetch(url).then(res => res.json()).then(data => {
//         console.log(data)
//         // if(data.results.length !== 0){
//             showMovies(data.results);
            
//             // currentPage = data.page;
//             // prevPage = currentPage - 1
//             // nextPage = currentPage + 1;
//             // totalPages = data.total_pages;

//             // current.innerText = currentPage
//             // if(currentPage <= 1){
//             //     prev.classList.add("disabled");
//             //     next.classList.remove("disabled");
//             // }else if(currentPage >= totalPages){
//             //     prev.classList.remove("disabled");
//             //     next.classList.add("disabled");
//             // }else{
//             //     prev.classList.remove("disabled");
//             //     next.classList.remove("disabled");
//             // }
//             // tagsEl.scrollIntoView({behavior : "smooth"})

// //         }else{
//             // main.innerHTML = `<h1 class="no-results">NO RESULTS FOUND<h1>`
//         // }
//     })
// }
// function getShows(url){
//     fetch(url).then(res => res.json()).then(data => {
//         console.log(data)
//         showShows(data.results);
//     })
// }

// function showTrending(data){
//     if(trending){
//         trending.innerHTML = "";
//     }

//     data.slice(0,18).forEach(movie => {
//         const {title, poster_path, vote_average,overview, id, release_date } = movie
//         const movieEl = document.createElement("div");
//         movieEl.classList.add("movie");
//         movieEl.innerHTML = `
//         <img src="${poster_path? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}" srcset="">
//         <div class="movie-info">
//             <h3>${title}</h3>
//             <h5>${release_date}<h5>
//             <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
//         </div>

//         <div class="overview">
//             <i class="fa-solid fa-play"></i>
//             <i class="fa-solid fa-circle-info"></i>
//         </div>

//         `
//         if(trending){
//             trending.appendChild(movieEl);
//         }
        
  
//         // document.getElementById(id).addEventListener("click", () =>{
//         //     console.log(id) "/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg"
//         //     openNav(movie)
//         // })
//     })
// }
// function showMovies(data){
//     if(movieList){
//         movieList.innerHTML = "";
//     }

//     data.slice(0,18).forEach(movie => {
//         const {title, poster_path, vote_average,overview, id, release_date } = movie
//         const movieEl = document.createElement("div");
//         movieEl.classList.add("movie");
//         movieEl.innerHTML = `
//         <img src="${poster_path? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}" srcset="">
//         <div class="movie-info">
//             <h3>${title}</h3>
//             <h5>${release_date}<h5>
//             <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
//         </div>

//         <div class="overview">
//             <i class="fa-solid fa-play"></i>
//             <i class="fa-solid fa-circle-info"></i>
//         </div>

//         `
//         if(movieList){
//             movieList.appendChild(movieEl);
//         }
        
  
//         // document.getElementById(id).addEventListener("click", () =>{
//         //     console.log(id) "/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg"
//         //     openNav(movie)
//         // })
//     })
// }
// function showShows(data){
//     if(showsList){
//         showsList.innerHTML = "";
//     }

//     data.slice(0,18).forEach(movie => {
//         const {poster_path, vote_average,overview, id,name, first_air_date } = movie
//         const movieEl = document.createElement("div");
//         movieEl.classList.add("movie");
//         movieEl.innerHTML = `
//         <img src="${poster_path? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580"}" alt="${name}" srcset="">
//         <div class="movie-info">
//             <h3>${name}</h3>
//             <h5>${first_air_date.substring(0,4)}<h5>
//             <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
//         </div>
//         <div class="overview">
//             <i class="fa-solid fa-play"></i>
//             <i class="fa-solid fa-circle-info"></i>
//         </div>

       
//         `

//         if (showsList) { // Check again before appending
//             showsList.appendChild(movieEl);
//         }

//         // document.getElementById(id).addEventListener("click", () =>{
//         //     console.log(id) "/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg"
//         //     openNav(movie)
//         // })
//     })
// }


// function searchMovie(e){
//     e.preventDefault();

//     const searchTerm = search.value.trim()

//     if(searchTerm){
//         getMovies(SEARCH_URL + "&query=" + searchTerm) ||
// getShows( BASE_URL + "/search/tv?" + API_KEY + "&query=" + searchTerm)
//     }else{
//         getMovies(API_URL) || getShows(API_URL1)
//     }
    
// }
// form.addEventListener("input", searchMovie)

// function getColor(vote){
//     if(vote >= 8){
//         return "green"
//     }else if(vote >= 5){
//         return "orange"
//     }else{
//         return "red"
//     }
// }