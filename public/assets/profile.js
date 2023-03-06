const IMG_URL = 'https://image.tmdb.org/t/p/w500'

$(document).ready(function() {

    window.onload = function() {
        checkUserType()
        
      };

});


var MyUrl = 'http://localhost:7000/api/search?search=';
            MyUrl += '&sort=';
            MyUrl += '&ascdesc=';
            MyUrl += '&playingNow=all';

function checkUserType(){
    fetch('http://localhost:7000/getUserData').then(res => res.json()).then(data => {
        console.log(data);   
        if(data.UserType == 'Admin'){
            getMyMovies(MyUrl);
        }
    })
}
function getMyMovies(url){
    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        showMyMovies(data.movies)
    })
}


function showMyMovies(movies){
    //get main elemet and clear it
     const main = document.getElementById('MYmovies');
     main.innerHtml = '';
     main.textContent = '';

     //show every retrieved movie
     movies.forEach(movie => {
        console.log('1');
        const {title, poster_path, rating,plot,_id} = movie;
         const movieEl = document.createElement('MYmovies');
         const html= `<hr class='solid'>
             <div class='movie-block'>
                <div class='movie-info'>
                    <img src='${IMG_URL+poster_path}' alt='${title}'>
                    <h3 class='movie-title'>${title}</h3>
                    <p class='movie-description'>${plot}</p>
                    <p style=color:${getColor(rating)} class='movie-rating'>Rating: ${rating}/10</p>
                    <div>
                        <form class="update-form" id="login-form" action="/update-movie" method='GET'>
                            <input type="hidden" name="movie_id" value="${_id}">
                            <input type="submit" class="update-button" value="Update">
                        </form>
                        <form class="delete-form" id="delete-form" action="/delete-movie" method='POST'>
                            <input type="hidden" name="movie_id" value="${_id}">
                            <input type="submit" class="delete-button" value="Delete">
                        </form>
                    </div>
                 </div>
             </div>`;

         movieEl.innerHTML += html;
         main.appendChild(movieEl);
     })
 }
 function getColor(vote){
    if(vote>=8){
        return 'green';
    
    }else if(vote>=5){
        return 'orange';

    }else{
        return 'red';
    }
}
