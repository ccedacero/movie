const table = document.querySelector('table');
const detailedTable = document.querySelector('#detailed');
let currentMovies = null;
const searchQuery = document.querySelector("form");
const loader = document.querySelector('.loader');
const detailedView = document.querySelector("#detailed-view");
let sorted = false;
table.classList.add('hidden');
detailedView.classList.add('hidden');
loader.classList.add('hidden');
searchQuery.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTable();
    detailedView.classList.add('hidden');
    table.classList.remove('hidden');
    loader.classList.remove('hidden');
    const query = e.target.movieQuery.value.replace(/[" "]/, "+");
    fetchMovies(query)
})
function fetchMovies(searchQuery) {
    const fetchUrl = `https://www.omdbapi.com/?s=${searchQuery}&plot=full&apikey=afcb2055`
    fetch(fetchUrl)
        .then(r => r.json())
        .then(r => appendMovieResults(r.Search))
}

function appendMovieResults(movies) {
    clearTable();
    currentMovies = movies;
    if (!movies) {
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + "Sorry!😞No results Found. Try Again." + '</td>';
        tr.style.textAlign = 'center';
        table.appendChild(tr);
        loader.classList.add('hidden');
    }
    movies.forEach((movie) => {
        if (movie.Type === "movie") {
            let tr = document.createElement('tr');
            tr.innerHTML = '<td class="link">' + movie.Title + '</td>' +
                '<td>' + movie.Year + '</td>';
            tr.style.textAlign = 'center';
            tr.getElementsByClassName('link')[0].addEventListener('click', loadMovie);
            table.appendChild(tr);
        }
    })
    loader.classList.add('hidden');
    table.querySelector('.fa-sort').addEventListener('click', sortMovies);
}

function sortMovies() {
    let movies = null;
    if (!sorted) {
        movies = currentMovies.sort((a, b) => a.Year - b.Year)
        sorted = true;
    } else {
        movies = currentMovies.sort((a, b) => b.Year - a.Year)
        sorted = false;
    }
    appendMovieResults(movies)
}

function loadMovie(e) {
    loader.classList.remove('hidden');
    const newMovieTitle = e.target.innerText.replace(/[" "]/, "+");
    const fetchUrl = `https://www.omdbapi.com/?apikey=afcb2055&t=${newMovieTitle}&plot=full`;
    fetch(fetchUrl)
        .then(r => r.json())
        .then(r => appendOneMovie(r))
}

function clearTable() {
    let removeArr = [...table.children].slice(2);
    let removeArr2 = [...detailedTable.children].slice(2);
    removeArr.forEach(nd => {
        nd.remove();
    })
    removeArr2.forEach(nd => {
        nd.remove();
    })
}
function appendOneMovie(movie) {
    document.querySelector("table").classList.add('hidden');
    document.querySelector("#detailed-view").classList.remove('hidden');
    clearTable()
    let tr = document.createElement('tr');
    tr.innerHTML = '<td>' + movie.Title + '</td>' +
        '<td>' + movie.Director + '</td>' +
        '<td>' + movie.Year + '</td>' +
        '<td style="max-width:55em">' + movie.Plot + '</td>' +
        '<td>' + '<span><i class="fas fa-thumbs-down" style="font-size:20px;color:red; margin:.2em;"></i><span id="downLikes"></span>   <span><i class="fas fa-thumbs-up" style="font-size:20px;color:green; margin:.2em;"></i><span id="upLikes"></span>' + '</td>';
    tr.style.textAlign = 'center';
    tr.getElementsByClassName('fas fa-thumbs-down')[0].addEventListener('click', persistOpinion);
    tr.getElementsByClassName('fas fa-thumbs-up')[0].addEventListener('click', persistOpinion);
    detailedTable.appendChild(tr);
    loader.classList.add('hidden');
}


function persistOpinion(e) {
    e.preventDefault();
    const type = e.target.classList.value === 'fas fa-thumbs-down' ? 'thumbs_down' : 'thumbs_up';
    let title = null;
    if (type === 'thumbs_up') {
        title = e.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText;
    } else {
        title = e.target.parentElement.parentElement.parentElement.children[0].innerText;
    }

    const payLoad = {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            movie: {
                title: title,
                type: type
            }
        }),
    };
    fetch(`http://localhost:3000/movies`, payLoad)
        .then(r => r.json())
        .then(r => updateDomLikes(r));
}

function updateDomLikes(data) {
    console.log(data)
    debugger
    document.querySelector('#upLikes').innerHTML = `${data.thumbs_up}`;
    document.querySelector('#downLikes').innerHTML = `${data.thumbs_down}`;
}



