
const API_KEY = "api_key=08d943b4426aa0e660b5bb62055f4e11";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

const movieList = document.getElementById("movieList");
const trending = document.getElementById("trending");
const showsList = document.getElementById("showsList");
const form = document.getElementById("form");
const search = document.getElementById("search");

function fetchData(url, displayElement) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (displayElement) {
                displayData(data.results, displayElement);
                console.log(data.results)
            }       
        })
       
        .catch(error => console.error("Error fetching data:", error));
}

function displayData(data, displayElement) {
    if (displayElement) {
        displayElement.innerHTML = "";
    }

    data.slice(0, 18).forEach(item => {
        const { title, poster_path, vote_average, overview, id, release_date, name, first_air_date } = item;
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
                <i class="fa-solid fa-play"></i>
                <i class="fa-solid fa-circle-info"></i>
            </div>
        `;

        if (displayElement) {
            displayElement.appendChild(element);
        }
    });
}

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

form.addEventListener("input", searchMovie);

function getColor(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

// Initial data fetching
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const API_URL1 = BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY;
const API_URL2 = BASE_URL + "/trending/all/day?" + API_KEY;


fetchData(API_URL, movieList);
fetchData(API_URL1, showsList);
fetchData(API_URL2, trending);





































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