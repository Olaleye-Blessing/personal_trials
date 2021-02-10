// import { NetworkError } from "../corona_update/error.js";

const ulTag = document.querySelector(".pagination ul");

const formSearch = document.querySelector(".nav__search");

const searchResultFilter = document.getElementById("search__filter");

const filterGroups = document.querySelector(".search__groups");

let filterNumberCont = document.querySelector('.search__filter-number');

const searchResultPanel = document.querySelector(".search__result");

const formSearchBtn = formSearch.querySelector('.nav__search-icon');

const openToggle = document.querySelector('[data-nav="open"]');

const closeToggle = document.querySelector('[data-nav="close"]');

const mainNav = document.querySelector(".nav__main");

const allPanels = document.querySelectorAll(".panel");


const main = document.querySelector("main");

const header = document.querySelector("header");

const popularMoviesPanel = document.querySelector(
    '[data-type="popularMovies"] .container'
);

const trendingMoviesPanel = document.querySelector(
    '[data-type="trendingMovies"] .container'
);

const trendingTvShowsPanel = document.querySelector(
    '[data-type="trendingTvshows"] .container'
);

const trendingpersonPanel = document.querySelector(
    '[data-type="trendingPerson"] .container'
);

const moviePanel = document.querySelector('[data-panel="movie"]');

const tvShowPanel = document.querySelector('[data-panel="tvShow"]');

const filterMovieForm = document.querySelector(
    '[data-panel="movie"] select#movieFilter'
);

const filterTvShowForm = document.querySelector(
    '[data-panel="tvShow"] select#tvShowFilter'
);

// let totalPages = 400;

let totalHomePage = 1;

let totalMoviePage = 1;

let totalTvShowPage = 1;

let totalSearchPage = 1;

let filterSearchArray = [];

let searchingFormClicked = 0;

let searchedWord = "";

let allGenre = [];

function removeToggle() {
    mainNav.classList.remove("show");
    openToggle.classList.remove("hide");
    setTimeout(() => {
        openToggle.style.display = "";
    }, 400);
}

openToggle.addEventListener("click", (event) => {
    mainNav.classList.add("show");
    openToggle.classList.add("hide");
    setTimeout(() => {
        openToggle.style.display = "none";
    }, 400);
});

closeToggle.addEventListener("click", (event) => {
    removeToggle();
});

class MyError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
}

class NetworkError extends MyError {}

class CreatErroMessage {
    constructor(message) {
        this.div = document.createElement('div');
        this.message = message
    }

    returnErrorCont = () => {
        this.div.classList.add('error');
        this.div.innerHTML = this.message;
        return this.div;
    }

    static removeError(div) {
        setTimeout(() => {
            div.classList.add('fade_out');
            setTimeout(() => {
                div.remove();
            }, 550);
        }, 2500);
    }
}

function loadGenre() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US")
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new NetworkError(
                    "Network error! Please reload your page!"
                );
            }
        })
        .then((genres) => {
            allGenre = genres.genres;
            return allGenre;
        })
        .catch((e) => {
            if (e instanceof NetworkError || e instanceof TypeError) {
                let errorMessage = new CreatErroMessage("Network error! Please reload your page!").returnErrorCont();
                main.prepend(errorMessage);
                CreatErroMessage.removeError(errorMessage);
            }
        });
}

async function fetchUrl(url, page) {
    let baseUrl = new URL(url);
    baseUrl.searchParams.set("page", page);
    try {
        // console.log(baseUrl);
        let popRes = await fetch(baseUrl);
        console.log(popRes);
        if (popRes.ok) {
            return await popRes.json();
        } else {
            throw new NetworkError("Network error!");
        }
    } catch (error) {
        // console.error(error);
        if (error instanceof TypeError || error instanceof NetworkError) {
            throw new NetworkError("Network error!");
        }
    }
}

// async function filterPopularity(url, page) {
//     try {
//         let result = await fetchUrl(url, page);
//         // result = result.results;
//         return result;
//     } catch (error) {
//         if (error instanceof NetworkError) {
//             let errorMessage = new CreatErroMessage("Network error! Please reload your page!").returnErrorCont();
//             main.prepend(errorMessage);
//             CreatErroMessage.removeError(errorMessage);
//             console.warn(error);
//         }
//     }
// }

async function popularMoviePagePopulate(page) {
    // let results = await filterPopularity(
    //     "https://api.themoviedb.org/3/discover/movie?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true",
    //     page
    // ); // fetchUrl

    let results = await fetchUrl(
        "https://api.themoviedb.org/3/discover/movie?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true",
        page
    );

    if (!results) {
        return;
    }
    totalHomePage = results.total_pages;

    popularMoviesPanel.innerHTML = ``;

    for (let result of results.results) {
        let vid = homeCreateVid(result);
        popularMoviesPanel.append(vid);
    }
}

async function trendingMoviePagePopulate(page) {
    // let results = await filterPopularity(
    //     "https://api.themoviedb.org/3/trending/movie/day?api_key=651ef57b1ca582995fef27ff08df6717",
    //     page
    // );

    console.log('start');
    let results = await fetchUrl(
        "https://api.themoviedb.org/3/trending/movie/day?api_key=651ef57b1ca582995fef27ff08df6717",
        page
    );

    if (!results) {
        return;
    }

    trendingMoviesPanel.innerHTML = ``;
    for (let result of results.results) {
        let vid = homeCreateVid(result);
        trendingMoviesPanel.append(vid);
    }
}

async function trendingTvShowsPagePopulate(page) {
    // let results = await filterPopularity(
    //     "https://api.themoviedb.org/3/trending/tv/day?api_key=651ef57b1ca582995fef27ff08df6717",
    //     page
    // );

    let results = await fetchUrl(
        "https://api.themoviedb.org/3/trending/tv/day?api_key=651ef57b1ca582995fef27ff08df6717",
        page
    );

    if (!results) {
        return;
    }
    trendingTvShowsPanel.innerHTML = ``;
    for (let result of results.results) {
        let vid = homeCreateVid(result);
        trendingTvShowsPanel.append(vid);
    }
}

async function trendingPersonPagePopulate(page) {
    // let results = await filterPopularity(
    //     " https://api.themoviedb.org/3/trending/person/day?api_key=651ef57b1ca582995fef27ff08df6717",
    //     page
    // );

    let results = await fetchUrl(
        " https://api.themoviedb.org/3/trending/person/day?api_key=651ef57b1ca582995fef27ff08df6717",
        page
    );

    if (!results) {
        return;
    }

    trendingpersonPanel.innerHTML = ``;
    for (let result of results.results) {
        let vid = homeCreateVidTrendingPerson(result);
        trendingpersonPanel.append(vid);
    }
}

function createpag(totalPages, page) {
    let liTag = ``;
    if (totalPages <= 5) {
        let active = "";
        for (let i = 1; i <= totalPages; i++) {
            active = i == page ? "active" : "";
            liTag += `<li data-type="btn-page" class="numb ${active}"><span>${i}</span></li>`;
        }
        // ulTag.innerHTML = liTag;
        //     return;
    } else {
        // let liTag = ``;
        let beforePages = page - 1;
        let afterPages = page + 1;
        let active = "";
        if (page > 1) {
            // show the previous button
            liTag += `<li class="btn prev" data-type="btn-Prev"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
        }

        if (page > 2) {
            // show value 1
            liTag += `<li data-type="btn-page" class="numb"><span>1</span></li>`;
            if (page > 3) {
                // show ...
                liTag += `<li class="dot"><span>...</span></li>`;
            }
        }

        if (page == 1) {
            afterPages += 2;
        } else if (page == 2) {
            afterPages += 1;
        }

        if (page == totalPages) {
            beforePages -= 2;
        } else if (page == totalPages - 1) {
            beforePages -= 1;
        }

        for (let pages = beforePages; pages <= afterPages; pages++) {
            if (pages > totalPages) {
                continue;
            }
            // if (pages == 0) {
            //     pages += 1;
            // }
            if (pages == 0) {
                continue;
            }
            if (pages == page) {
                active = "active";
            } else {
                active = "";
            }
            liTag += `<li data-type="btn-page" class="numb ${active}"><span>${pages}</span></li>`;
        }

        if (page < totalPages - 1) {
            // show ...
            if (page < totalPages - 2) {
                liTag += `<li class="dot"><span>...</span></li>`;
            }

            liTag += `<li data-type="btn-page" class="numb"><span>${totalPages}</span></li>`;
        }

        if (page < totalPages) {
            // show next button
            liTag += `<li class="btn next" data-type="btn-Next"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
        }
    }

    ulTag.innerHTML = liTag;
}

window.addEventListener("load", async (event) => {
    await loadGenre();
    try {
        await popularMoviePagePopulate(1); // await to get totalHomePage
        trendingMoviePagePopulate(1);
        trendingTvShowsPagePopulate(1);
        trendingPersonPagePopulate(1);
        createpag(totalHomePage, 1);
    } catch (error) {
        if (error instanceof NetworkError) {
            let errorMessage = new CreatErroMessage(error.message).returnErrorCont();
            main.prepend(errorMessage);
        }
    }
});



filterGroups.querySelectorAll('input').forEach(input => input.addEventListener('change', createFilterArray));



function createFilterArray(event) {
    let inputTarget = event.target;
    inputTarget.checked ? filterSearchArray.push(inputTarget.value) : filterSearchArray = filterSearchArray.filter(value => value != inputTarget.value);
    // console.log(filterSearchArray);

    filterResult();
}

function filterResult() {
    let allList = searchResultPanel.querySelector('.grid').querySelectorAll('[data-search="list"]');

    if (filterSearchArray.length != 0) {
        allList.forEach(list => {
            let mediaType = list.dataset.mediaType;
            filterSearchArray.indexOf(mediaType) == -1 ? list.hidden = true : list.hidden = false;
        });
    } else {
        allList.forEach(list => {
            list.hidden = false;
        });
    }

    filterNumberCont.innerHTML = filterSearchArray.length;
}


searchResultFilter.addEventListener("click", (event) => {
    filterGroups.classList.toggle("visible");
});


formSearch.addEventListener('click', event => {
    // console.log(event.type);
    // console.log('clicked');
    if (searchingFormClicked == 0) {
        event.preventDefault();
        searchingFormClicked = 1;
        formSearchBtn.previousElementSibling.focus();
        // return false;
    }else if (searchingFormClicked == 1) {
        formRemovePanels();
    }
})

formSearch.addEventListener('submit', async event => {
    event.preventDefault();
    searchedWord = formSearch.querySelector("#search").value.trim();

    if (searchedWord == "") return;
    
    let filterHeading = searchResultPanel.querySelector(
        "#searchFilterHead span"
    );
    filterHeading.innerHTML = searchedWord;
    filterHeading.title = searchedWord;

    filterGroups.querySelectorAll('input').forEach(input => input.checked = false);
    filterSearchArray = [];
    filterNumberCont.innerHTML = 0;

    await searchingMedia(1);
    // totalSearchPage = results.total_pages;

    createpag(totalSearchPage, 1);

    ulTag.removeEventListener("click", loadingHomePages);
    ulTag.removeEventListener("click", tvShowLoadingPages);
    ulTag.removeEventListener("click", moviesLoadingPages);

    ulTag.addEventListener("click", loadingSearchPages);
    
    formSearchBtn.previousElementSibling.value = "";
})

function formRemovePanels() {
    for (let panelLink of mainNav.querySelectorAll('a[href=""]')) {
        panelLink.classList.remove("active");
        panelLink.parentElement.setAttribute("aria-selected", false);
    }

    for (let panel of allPanels) {
        panel.classList.remove("active-panel");
        panel.setAttribute("aria-hidden", true);
    }

    searchResultPanel.classList.remove("none");
}

async function searchingMedia(page) {
    // let results = await filterPopularity(
    //     `https://api.themoviedb.org/3/search/multi?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US&query=${searchedWord}&include_adult=true`,
    //     page
    // ); // fetchUrl

    let results = await fetchUrl(
        `https://api.themoviedb.org/3/search/multi?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US&query=${searchedWord}&include_adult=true`,
        page
    ); // fetchUrl

    if (!results) {
        return;
    }

    totalSearchPage = results.total_pages;

    let grid = searchResultPanel.querySelector(".grid");
    grid.innerHTML = "";

    if (results.results.length == 0) {
        grid.innerHTML = 'No result';
        return;
    }

    for (let result of results.results) {
        let li;
        if (result.media_type == "tv" || result.media_type == "movie") {
            li = otherContainers(result);
            // grid.append(li);    
        } 
        else if (result.media_type == "person") {
            li = homeCreateVidTrendingPerson(result);
            li.classList.add('search__person');
            // grid.append(li);
        }

        li.setAttribute('data-media-type', result.media_type);
        li.setAttribute('data-search', 'list');
        grid.append(li);

        // console.log(result.media_type);
    }

    filterResult();
}

function searchingLoadPages(to) {
    
}

async function loadingSearchPages(event) {
    let targetBtn = event.target.closest("[data-type|=btn]");
    if (!targetBtn) {
        return;
    }
    let specificBtn = targetBtn.dataset.type;

    let currentNumb = +ulTag.querySelector(".active span").textContent;

    switch (specificBtn) {
        case "btn-Prev":
            createpag(totalSearchPage, currentNumb - 1);
            searchingMedia(currentNumb - 1);
            break;

        case "btn-page":
            let specificNum = +targetBtn.firstElementChild.textContent;
            if (specificNum != currentNumb) {
                createpag(totalSearchPage, specificNum);
            }
            searchingMedia(specificNum);
            break;

        case "btn-Next":
            createpag(totalSearchPage, currentNumb + 1);
            searchingMedia(currentNumb + 1);
            break;
    }
}




// console.log(filterTvShowForm);

filterMovieForm.addEventListener("input", async (event) => {
    await fetchMovie(filterMovieForm.value, 1);
    createpag(totalMoviePage, 1);
});

filterTvShowForm.addEventListener("input", async (event) => {
    await fetchtvShow(filterTvShowForm.value, 1);
    createpag(totalTvShowPage, 1);
    // console.log("yes");
});

function loadingHomePages(event) {
    let targetBtn = event.target.closest("[data-type|=btn]");
    if (!targetBtn) {
        return;
    }
    let specificBtn = targetBtn.dataset.type;

    let currentNumb = +ulTag.querySelector(".active span").textContent;

    // console.log(totalHomePage)
    switch (specificBtn) {
        case "btn-Prev":
            // createpag(totalPages, currentNumb - 1);
            createpag(totalHomePage, currentNumb - 1);
            popularMoviePagePopulate(currentNumb - 1);
            trendingMoviePagePopulate(currentNumb - 1);
            trendingTvShowsPagePopulate(currentNumb - 1);
            trendingPersonPagePopulate(currentNumb - 1);
            break;

        case "btn-page":
            let specificNum = +targetBtn.firstElementChild.textContent;
            if (specificNum != currentNumb) {
                // createpag(totalPages, specificNum);
                createpag(totalHomePage, specificNum);
                popularMoviePagePopulate(specificNum);
                trendingMoviePagePopulate(specificNum);
                trendingTvShowsPagePopulate(specificNum);
                trendingPersonPagePopulate(specificNum);
            }
            break;

        case "btn-Next":
            // createpag(totalPages, currentNumb + 1);
            createpag(totalHomePage, currentNumb + 1);
            popularMoviePagePopulate(currentNumb + 1);
            trendingMoviePagePopulate(currentNumb + 1);
            trendingTvShowsPagePopulate(currentNumb + 1);
            trendingPersonPagePopulate(currentNumb + 1);
            break;
    }
}

ulTag.addEventListener("click", loadingHomePages);




mainNav.addEventListener("click", async (event) => {
    event.preventDefault();
    let targetPanelLink = event.target.closest('a[href=""]');
    if (!targetPanelLink) {
        return;
    }

    searchingFormClicked = 0;

    if (targetPanelLink.classList.contains("active")) {
        return;
    }

    if (mainNav.classList.contains("show")) {
        removeToggle();
    }

    searchResultPanel.classList.add("none");

    let parent = targetPanelLink.closest("li");
    let parentPosition = Number(parent.getAttribute("aria-posinset")) - 1;

    for (let panelLink of mainNav.querySelectorAll('a[href=""]')) {
        panelLink.classList.remove("active");
        panelLink.parentElement.setAttribute("aria-selected", false);
    }

    targetPanelLink.classList.add("active");
    parent.setAttribute("aria-selected", true);

    for (let panel of allPanels) {
        panel.classList.remove("active-panel");
        panel.setAttribute("aria-hidden", true);
    }

    allPanels[parentPosition].setAttribute("aria-hidden", false);

    allPanels[parentPosition].classList.add("active-panel");
    // console.log(targetPanelLink.innerHTML);

    switch (targetPanelLink.innerHTML) {
        case "movies":
            filterMovieForm.options[0].selected = true;
            await fetchMovie("popular", 1);
            createpag(totalMoviePage, 1);

            ulTag.removeEventListener("click", loadingHomePages);
            ulTag.removeEventListener("click", tvShowLoadingPages);
            ulTag.removeEventListener("click", loadingSearchPages);

            ulTag.addEventListener("click", moviesLoadingPages);
            break;

        case "tv shows":
            filterTvShowForm.options[0].selected = true;
            await fetchtvShow("popular", 1);
            createpag(totalTvShowPage, 1);
            // console.log('found');

            ulTag.removeEventListener("click", loadingHomePages);
            ulTag.removeEventListener("click", moviesLoadingPages);
            ulTag.removeEventListener("click", loadingSearchPages);

            ulTag.addEventListener("click", tvShowLoadingPages);
            // tvShowLoadingPages
            break;

        case "home":
            await popularMoviePagePopulate(1);
            trendingMoviePagePopulate(1);
            trendingTvShowsPagePopulate(1);
            trendingPersonPagePopulate(1);
            // console.log(totalHomePage);
            // console.log('Done');
            createpag(totalHomePage, 1);

            ulTag.addEventListener("click", loadingHomePages);

            ulTag.removeEventListener("click", loadingSearchPages);
            ulTag.removeEventListener("click", moviesLoadingPages);
            ulTag.removeEventListener("click", tvShowLoadingPages);

            break;
    }
});

async function fetchtvShow(value, page) {
    // let results = await filterPopularity(
    //     `https://api.themoviedb.org/3/tv/${value}?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US`,
    //     page
    // );

    let results = await fetchUrl(
        `https://api.themoviedb.org/3/tv/${value}?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US`,
        page
    );

    if (!results) {
        return;
    }

    totalTvShowPage = results.total_pages;

    let grid = tvShowPanel.querySelector(".grid");

    grid.innerHTML = ``;
    const formHead = document.getElementById("tvShowFilterHead");

    let headContent;
    switch (value) {
        case "popular":
            headContent = "POPULAR TVSHOW";
            break;

        case "top_rated":
            headContent = "TOP RATED TVSHOW";
            break;

        case "airing_today":
            headContent = "AIRING TODAY TVSHOW";
            break;

        case "on_the_air":
            headContent = "ON THE AIR TVSHOW";
            break;
    }
    formHead.innerHTML = headContent;

    // console.log(results);
    for (let result of results.results) {
        let li = otherContainers(result);
        grid.append(li);
    }
    // ulTag.removeEventListener('click', loadingHomePages);
}

async function fetchMovie(value, page) {
    // let results = await filterPopularity(
    //     `https://api.themoviedb.org/3/movie/${value}?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US`,
    //     page
    // );

    let results = await fetchUrl(
        `https://api.themoviedb.org/3/movie/${value}?api_key=651ef57b1ca582995fef27ff08df6717&language=en-US`,
        page
    );

    if (!results) {
        return;
    }
    totalMoviePage = results.total_pages;
    let grid = moviePanel.querySelector(".grid");
    grid.innerHTML = ``;
    const formHead = document.getElementById("movieFilterHead");
    if (value == "popular") {
        formHead.innerHTML = "POPULAR MOVIES";
    } else if (value == "top_rated") {
        formHead.innerHTML = "TOP RATED MOVIES";
    }
    // console.log(results);
    for (let result of results.results) {
        let li = otherContainers(result);
        grid.append(li);
    }
    // ulTag.removeEventListener('click', loadingHomePages);
}

async function moviesLoadingPages(event) {
    let targetBtn = event.target.closest("[data-type|=btn]");
    if (!targetBtn) {
        return;
    }
    let specificBtn = targetBtn.dataset.type;

    let currentNumb = +ulTag.querySelector(".active span").textContent;

    switch (specificBtn) {
        case "btn-Prev":
            // console.log('btn-prev');
            createpag(totalMoviePage, currentNumb - 1);
            fetchMovie(filterMovieForm.value, currentNumb - 1);
            break;

        case "btn-page":
            let specificNum = +targetBtn.firstElementChild.textContent;
            if (specificNum != currentNumb) {
                createpag(totalMoviePage, specificNum);
            }
            fetchMovie(filterMovieForm.value, specificNum);
            break;

        case "btn-Next":
            createpag(totalMoviePage, currentNumb + 1);
            fetchMovie(filterMovieForm.value, currentNumb + 1);
            break;
    }
}

async function tvShowLoadingPages(event) {
    let targetBtn = event.target.closest("[data-type|=btn]");
    if (!targetBtn) {
        return;
    }
    let specificBtn = targetBtn.dataset.type;

    let currentNumb = +ulTag.querySelector(".active span").textContent;

    switch (specificBtn) {
        case "btn-Prev":
            // console.log('btn-prev');
            // createpag(totalMoviePage, currentNumb - 1);
            createpag(totalTvShowPage, currentNumb - 1);
            // fetchMovie(filterMovieForm.value, currentNumb - 1);
            fetchtvShow(filterTvShowForm.value, currentNumb - 1);
            break;

        case "btn-page":
            let specificNum = +targetBtn.firstElementChild.textContent;
            if (specificNum != currentNumb) {
                createpag(totalTvShowPage, specificNum);
            }
            // fetchMovie(filterMovieForm.value, specificNum);
            fetchtvShow(filterTvShowForm.value, specificNum);
            break;

        case "btn-Next":
            // createpag(totalMoviePage, currentNumb + 1);
            createpag(totalTvShowPage, currentNumb + 1);
            // fetchMovie(filterMovieForm.value, currentNumb + 1);
            fetchtvShow(filterTvShowForm.value, currentNumb + 1);
            break;
    }
}

function otherContainers(result) {
    let resultGenre = [];
    for (let genre of allGenre) {
        for (let genres of result.genre_ids) {
            if (genre.id == genres) {
                resultGenre.push(genre.name);
            }
        }
    }

    let imgSrc = "../png/001-no-photo.png";
    if (result.poster_path) {
        imgSrc = `https://image.tmdb.org/t/p/original${result.poster_path}`;
    }
    let li = document.createElement("li");
    li.classList.add("scene");
    li.innerHTML = `<div class="card">
        <div class="card__face card__face--front">
            <button data-btn="switch-card"><i class="fas fa-info" title="${
                result.original_title
            }'s summary"></i></button></button>
            <figure><img src="${imgSrc}" alt=""></figure>
        </div>
        <div class="card__face card__face--back">
            <div class="card__overview">
                <span>Overview: </span>${
                    result.overview.length < 200
                        ? result.overview
                        : result.overview.slice(0, 200) + "....."
                }
            </div>
            <div class="card__popularity">
                <span>Popularity: </span>${result.popularity}
            </div>
            <div class="card__genre">
                <span>Genre: </span>${resultGenre.join(", ")}
            </div>
        </div>
    </div>
    <div class="card__link">
        <span>${result.original_title || result.original_name}</span>
    </div>`;
    return li;
}






function switchCard(event, parentPanel) {
    let target = event.target.closest('[data-btn="switch-card"]');
    if (!target) return;

    for (let card of parentPanel.querySelectorAll(".card")) {
        if (card == target.parentElement.closest(".card")) {
            continue;
        }
        card.classList.remove("flipped");
    }

    target.parentElement.closest(".card").classList.toggle("flipped");
}

// for (let panel of document.querySelectorAll(".panel")) {
//     panel.addEventListener("click", (event) => {
//         switchCard(event, panel);
//     });
// }

main.addEventListener('click', event => {
    switchCard(event, main);
})

function homeCreateVid(result) {
    let resultGenre = [];
    for (let genre of allGenre) {
        for (let genres of result.genre_ids) {
            if (genre.id == genres) {
                resultGenre.push(genre.name);
            }
        }
    }

    let div = document.createElement("div");
    div.classList.add("vid");
    div.innerHTML = `
    <div class="card">
        <div class="vid__img-cont card-front card-face">
        <button title="${
            result.original_title || result.original_name
        }'s detail" class="vid__detail-btn" data-btn="switch-card"><i class="fas fa-info"></i></button>
            <figure><img src="https://image.tmdb.org/t/p/original${
                result.poster_path
            }" alt=""></figure>
        </div>
        <div class="vid__detail card-back card-face">
            <div class="vid__overview"><span>Overview: </span>${
                result.overview.length < 321
                    ? result.overview
                    : result.overview.slice(0, 320) + "....."
            }</div>
            <div class="vid__popularity"><span>Popularity: </span>${
                result.popularity
            }
            </div>
            <div class="vid__genre"><span>Genre: </span> ${resultGenre.join(
                ", "
            )}</div>
        </div>
    </div>
    <div class="vid__link">
    <span>${result.original_title || result.original_name}</span>
    </div>`;
    return div;
}





function homeCreateVidTrendingPerson(result) {
    let imgSrc = "../png/001-no-photo.png";
    if (result.profile_path) {
        imgSrc = `https://image.tmdb.org/t/p/original${result.profile_path}`;
    }

    let knownFor = ["No information available"];

    if ( !(Object.keys(result.known_for).length === 0 && result.known_for.constructor === Object ) ) {
        knownFor = [];
        for (let movie of result.known_for) {
            knownFor.push(movie.original_title);
        }
    }
    knownFor = knownFor.join(", ");

    let div = document.createElement("div");
    div.classList.add("vid");
    div.innerHTML = `
    <div class="card">
        <div class="vid__img-cont card-front card-face">
        <button title="${
            result.name
        }'s detail" class="vid__detail-btn" data-btn="switch-card"><i class="fas fa-info"></i></button>
            <figure><img src="${imgSrc}" alt="${result.name}'s image"></figure>
        </div>
        <div class="vid__detail card-back card-face">
            <div class="vid__overview"><span>Known for: </span>${
                result.known_for_department || "no information available"
            }</div>
            <div class="vid__popularity"><span>Popularity: </span>${
                result.popularity || "no information available"
            }
            </div>
            <div class="vid__genre"><span>Movies Involved: </span>${knownFor}</div>
        </div>
    </div>
    <div class="vid__link">
    <span>${result.name}</span>
    </div>`;
    return div;
}










